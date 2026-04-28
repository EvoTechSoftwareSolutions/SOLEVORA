import prisma from "./src/prisma/client.js";

async function test() {
  try {
    console.log("Testing connection...");
    const userCount = await prisma.user.count();
    console.log("User count:", userCount);
    
    console.log("Testing stats query part 1...");
    const revenueResult = await prisma.order.aggregate({
        _sum: { totalAmount: true },
        _count: { id: true }
    });
    console.log("Revenue Result:", revenueResult);

    console.log("Testing order items group by...");
    const grouped = await prisma.orderitem.groupBy({
        by: ['productId', 'productName'],
        _sum: { sellingPrice: true, quantity: true },
        orderBy: { _sum: { sellingPrice: 'desc' } },
        take: 5
    });
    console.log("Grouped Items:", grouped);

  } catch (err) {
    console.error("TEST_ERROR:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
