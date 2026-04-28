import prisma from "../prisma/client.js";

export const getAddressesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const addresses = await prisma.addresses.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: "desc" }
    });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch addresses" });
  }
};

export const getAddressDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await prisma.addresses.findUnique({
      where: { id: Number(id) }
    });
    if (!address) return res.status(404).json({ message: "Address not found" });
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch address details" });
  }
};

export const createAddress = async (req, res) => {
  try {
    const { userId, title, name, street, city, postalCode, country, phone, isDefault } = req.body;
    
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
        isDefault: Boolean(isDefault),
        updatedAt: new Date()
      }
    });
    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ message: "Failed to create address", error: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, name, street, city, postalCode, country, phone, isDefault } = req.body;

    const existingAddress = await prisma.addresses.findUnique({ where: { id: Number(id) } });
    if (!existingAddress) return res.status(404).json({ message: "Address not found" });

    if (isDefault && !existingAddress.isDefault) {
      await prisma.addresses.updateMany({
        where: { userId: existingAddress.userId },
        data: { isDefault: false }
      });
    }

    const address = await prisma.addresses.update({
      where: { id: Number(id) },
      data: {
        title,
        name,
        street,
        city,
        postalCode,
        country,
        phone,
        isDefault: Boolean(isDefault),
        updatedAt: new Date()
      }
    });
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: "Failed to update address" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.addresses.delete({
      where: { id: Number(id) }
    });
    res.json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete address" });
  }
};
