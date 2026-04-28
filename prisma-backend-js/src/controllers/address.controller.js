import prisma from "../prisma/client.js";

const prismaErrorToHttp = (error) => {
  // https://www.prisma.io/docs/orm/reference/error-reference
  const code = error?.code;
  if (code === "P2003") return { status: 400, message: "Invalid reference (user not found)" }; // FK constraint
  if (code === "P2025") return { status: 404, message: "Record not found" }; // record doesn't exist
  return null;
};

const requiredString = (value) => (typeof value === "string" ? value.trim() : "");

export const getAddressesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const requestedUserId = Number(userId);
    if (!Number.isFinite(requestedUserId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    if (req.user.role === "customer" && req.user.id !== requestedUserId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const addresses = await prisma.addresses.findMany({
      where: { userId: requestedUserId },
      orderBy: { createdAt: "desc" }
    });
    res.json({ success: true, data: addresses });
  } catch (error) {
    const mapped = prismaErrorToHttp(error);
    if (mapped) return res.status(mapped.status).json({ message: mapped.message });
    res.status(500).json({ message: "Failed to fetch addresses", error: error.message });
  }
};

export const getAddressDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const address = await prisma.addresses.findUnique({
      where: { id: Number(id) }
    });
    if (!address) return res.status(404).json({ message: "Address not found" });

    if (req.user.role === "customer" && address.userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ success: true, data: address });
  } catch (error) {
    const mapped = prismaErrorToHttp(error);
    if (mapped) return res.status(mapped.status).json({ message: mapped.message });
    res.status(500).json({ message: "Failed to fetch address details", error: error.message });
  }
};

export const createAddress = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Always bind address to the authenticated user.
    // (If the client sends a different userId, customers are forbidden.)
    const bodyUserId = req.body?.userId;
    if (
      req.user.role === "customer" &&
      bodyUserId !== undefined &&
      Number(bodyUserId) !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const userId = req.user.id;
    console.log("Creating address for user ID:", userId);
    
    // Check if user exists before proceeding
    const userExists = await prisma.user.findUnique({
      where: { id: Number(userId) }
    });
    
    if (!userExists) {
      console.log("User not found with ID:", userId);
      return res.status(400).json({ message: "User not found. Please login again." });
    }
    
    const title = requiredString(req.body?.title);
    const name = requiredString(req.body?.name);
    const street = requiredString(req.body?.street);
    const city = requiredString(req.body?.city);
    const postalCode = requiredString(req.body?.postalCode);
    const country = requiredString(req.body?.country);
    const phone = requiredString(req.body?.phone);
    const isDefault = Boolean(req.body?.isDefault);

    if (!title || !name || !street || !city || !postalCode || !country || !phone) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["title", "name", "street", "city", "postalCode", "country", "phone"],
      });
    }
    
    if (isDefault) {
      await prisma.addresses.updateMany({
        where: { userId: Number(userId) },
        data: { isDefault: false }
      });
    }

    const address = await prisma.addresses.create({
      data: {
        userId: Number(userId),
        title,
        name,
        street,
        city,
        postalCode,
        country,
        phone,
        isDefault
      }
    });
    res.status(201).json({ success: true, data: address });
  } catch (error) {
    const mapped = prismaErrorToHttp(error);
    if (mapped) return res.status(mapped.status).json({ message: mapped.message });
    res.status(500).json({ message: "Failed to create address", error: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const { title, name, street, city, postalCode, country, phone, isDefault } = req.body;

    const existingAddress = await prisma.addresses.findUnique({ where: { id: Number(id) } });
    if (!existingAddress) return res.status(404).json({ message: "Address not found" });

    if (req.user.role === "customer" && existingAddress.userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (isDefault && !existingAddress.isDefault) {
      await prisma.addresses.updateMany({
        where: { userId: existingAddress.userId },
        data: { isDefault: false }
      });
    }

    const address = await prisma.addresses.update({
      where: { id: Number(id) },
      data: {
        ...(title !== undefined ? { title: requiredString(title) } : {}),
        ...(name !== undefined ? { name: requiredString(name) } : {}),
        ...(street !== undefined ? { street: requiredString(street) } : {}),
        ...(city !== undefined ? { city: requiredString(city) } : {}),
        ...(postalCode !== undefined ? { postalCode: requiredString(postalCode) } : {}),
        ...(country !== undefined ? { country: requiredString(country) } : {}),
        ...(phone !== undefined ? { phone: requiredString(phone) } : {}),
        isDefault: Boolean(isDefault)
      }
    });
    res.json({ success: true, data: address });
  } catch (error) {
    const mapped = prismaErrorToHttp(error);
    if (mapped) return res.status(mapped.status).json({ message: mapped.message });
    res.status(500).json({ message: "Failed to update address", error: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const existingAddress = await prisma.addresses.findUnique({ where: { id: Number(id) } });
    if (!existingAddress) return res.status(404).json({ message: "Address not found" });

    if (req.user.role === "customer" && existingAddress.userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await prisma.addresses.delete({
      where: { id: Number(id) }
    });
    res.json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    const mapped = prismaErrorToHttp(error);
    if (mapped) return res.status(mapped.status).json({ message: mapped.message });
    res.status(500).json({ message: "Failed to delete address", error: error.message });
  }
};
