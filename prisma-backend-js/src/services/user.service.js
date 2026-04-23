import bcrypt from "bcrypt";
import prisma from "../prisma/client.js";

export const createUser = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
};