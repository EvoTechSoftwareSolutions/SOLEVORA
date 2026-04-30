import prisma from "../prisma/client.js";
import bcrypt from "bcrypt";


export const getAdminStats = async (req, res) => {
  try {
    let stats = {
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      lowStockItems: 0,
      recentOrders: [],
      monthlySales: [],
      averageOrderValue: 0,
      topProducts: [],
      salesByCategory: [],
      activePromos: []
    };

    // 1. Total Revenue & Orders
    try {
      const revenueResult = await prisma.order.aggregate({
        _sum: { totalAmount: true },
        _count: { id: true }
      });
      stats.totalRevenue = Number(revenueResult._sum?.totalAmount || 0);
      stats.totalOrders = revenueResult._count?.id || 0;
      stats.averageOrderValue = stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders) : 0;
    } catch (e) { console.error("Stats Error (Revenue):", e.message); }

    // 2. Catalog Size
    try {
      stats.totalProducts = await prisma.product.count({ where: { isActive: true } });
    } catch (e) { console.error("Stats Error (Products):", e.message); }

    // 3. Low Stock
    try {
      stats.lowStockItems = await prisma.productstock.count({
        where: { quantity: { lt: 5 } }
      });
    } catch (e) { console.error("Stats Error (LowStock):", e.message); }

    // 4. Recent Orders
    try {
      stats.recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, totalAmount: true, status: true, createdAt: true }
      });
    } catch (e) { console.error("Stats Error (RecentOrders):", e.message); }

    // 5. Monthly Sales (Simplified findMany for now to avoid raw SQL 500s)
    try {
      const allOrders = await prisma.order.findMany({
        select: { totalAmount: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 100 // just enough for a mini chart
      });
      // Group by month in JS for safety
      const groups = allOrders.reduce((acc, order) => {
        const m = order.createdAt.toISOString().slice(0, 7); // YYYY-MM
        acc[m] = (acc[m] || 0) + Number(order.totalAmount);
        return acc;
      }, {});
      stats.monthlySales = Object.entries(groups).map(([month, total]) => ({ month, total })).reverse();
    } catch (e) { console.error("Stats Error (MonthlySales):", e.message); }

    // 6. Top Products
    try {
      const grouped = await prisma.orderitem.groupBy({
        by: ['productId', 'productName'],
        _sum: { sellingPrice: true, quantity: true },
        orderBy: { _sum: { sellingPrice: 'desc' } },
        take: 5
      });

      // Fetch images for these products
      const productIds = grouped.map(g => g.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        include: { productimage: { take: 1 } }
      });

      stats.topProducts = grouped.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
          name: item.productName,
          sales: item._sum.quantity || 0,
          value: Number(item._sum.sellingPrice || 0),
          img: product?.productimage[0]?.url || ''
        };
      });
    } catch (e) { console.error("Stats Error (TopProducts):", e.message); }

    // 7. Active Promos
    try {
      stats.activePromos = await prisma.promocode.findMany({
        where: {
          isActive: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
          ]
        },
        orderBy: { createdAt: 'desc' },
        take: 3
      });
    } catch (e) { console.error("Stats Error (Promos):", e.message); }

    res.json(stats);

  } catch (error) {
    console.error("CRITICAL_ADMIN_STATS_ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getNewsletterSubscribers = async (req, res) => {
  try {
    const subscribers = await prisma.user.findMany({
      where: { newsletter: true },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'customer' },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id: Number(id) }
    });
    res.json({ success: true, message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- PUBLIC PROMO VALIDATION ---

export const validatePromo = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Promo code is required.' });
    }

    const promo = await prisma.promocode.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!promo) {
      return res.status(404).json({ success: false, message: 'Promo code not found.' });
    }

    if (!promo.isActive) {
      return res.status(400).json({ success: false, message: 'This promo code is no longer active.' });
    }

    if (promo.expiresAt && new Date() > new Date(promo.expiresAt)) {
      return res.status(400).json({ success: false, message: 'This promo code has expired.' });
    }

    if (promo.maxUses && promo.usedCount >= promo.maxUses) {
      return res.status(400).json({ success: false, message: 'This promo code has reached its usage limit.' });
    }

    const order = Number(orderAmount) || 0;
    const minOrder = Number(promo.minOrderAmount) || 0;

    if (order < minOrder) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of Rs. ${minOrder.toLocaleString()} required to use this code.`
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (promo.discountType === 'percentage') {
      discountAmount = Math.round((order * Number(promo.discountValue)) / 100);
    } else {
      discountAmount = Number(promo.discountValue);
    }

    // Cap discount to order amount
    discountAmount = Math.min(discountAmount, order);

    return res.json({
      success: true,
      code: promo.code,
      discountAmount,
      discountType: promo.discountType,
      discountValue: Number(promo.discountValue),
      message: promo.discountType === 'percentage'
        ? `${promo.discountValue}% off applied! You save Rs. ${discountAmount.toLocaleString()}.`
        : `Rs. ${discountAmount.toLocaleString()} off applied!`
    });

  } catch (error) {
    console.error('PROMO_VALIDATE_ERROR:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- PROMO CODES ---


export const getAllPromos = async (req, res) => {
  try {
    const promos = await prisma.promocode.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: promos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPromo = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, maxUses, expiresAt, isActive } = req.body;
    
    const existing = await prisma.promocode.findUnique({ where: { code: code.toUpperCase() } });
    if (existing) return res.status(400).json({ success: false, message: "Promo code already exists" });

    const promo = await prisma.promocode.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue,
        minOrderAmount: minOrderAmount || 0,
        maxUses: maxUses || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: isActive !== undefined ? isActive : true
      }
    });
    res.status(201).json({ success: true, data: promo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePromo = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discountType, discountValue, minOrderAmount, maxUses, expiresAt, isActive } = req.body;
    
    const promo = await prisma.promocode.update({
      where: { id: Number(id) },
      data: {
        code: code ? code.toUpperCase() : undefined,
        discountType,
        discountValue,
        minOrderAmount,
        maxUses,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive
      }
    });
    res.json({ success: true, data: promo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPublicPromos = async (req, res) => {
  try {
    const promos = await prisma.promocode.findMany({
      where: {
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    res.json({ success: true, data: promos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePromo = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.promocode.delete({
      where: { id: Number(id) }
    });
    res.json({ success: true, message: "Promo code deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- INVENTORY REPORT ---

export const getInventoryReport = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: { name: true }
        },
        productimage: {
          take: 1,
          select: { url: true }
        },
        productstock: {
          select: { quantity: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Map data to match frontend expectations
    const reportData = products.map(p => {
      const totalStock = p.productstock.reduce((sum, s) => sum + s.quantity, 0);
      return {
        id: p.id,
        name: p.name,
        price: Number(p.price),
        category: p.category,
        image_url: p.productimage[0]?.url || '',
        stock_quantity: totalStock
      };
    });

    res.json(reportData);
  } catch (error) {
    console.error("INVENTORY_REPORT_ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- SYSTEM SETTINGS ---

export const getSettings = async (req, res) => {
  try {
    let setting = await prisma.settings.findFirst({
      where: { id: 1 }
    });
    
    if (!setting) {
      setting = await prisma.settings.create({
        data: { id: 1 }
      });
    }
    
    res.json(setting);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const data = req.body;
    const setting = await prisma.settings.update({
      where: { id: 1 },
      data: {
        storeName: data.storeName,
        storeEmail: data.storeEmail,
        storePhone: data.storePhone,
        storeCurrency: data.storeCurrency,
        lowStockThreshold: Number(data.lowStockThreshold),
        maintenanceMode: Boolean(data.maintenanceMode),
        allowGuestCheckout: Boolean(data.allowGuestCheckout),
        shippingFee: Number(data.shippingFee),
        freeShippingThreshold: Number(data.freeShippingThreshold),
        maxOrdersPerDay: Number(data.maxOrdersPerDay)
      }
    });
    res.json(setting);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- STAFF MANAGEMENT ---

export const getAdminUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: { in: ['admin', 'store_manager'] }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const createAdminUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      }
    });
    
    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    
    const data = { name, email, role };
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data
    });
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Don't allow deleting the last admin or yourself if needed, 
    // but for now simple delete:
    await prisma.user.delete({
      where: { id: Number(id) }
    });
    
    res.json({ success: true, message: "Staff removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
