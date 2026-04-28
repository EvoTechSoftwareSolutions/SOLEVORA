import prisma from "./src/prisma/client.js";

async function test() {
  try {
    console.log("Testing blacklistedtoken...");
    const count = await prisma.blacklistedtoken.count();
    console.log("Count:", count);
  } catch (err) {
    console.error("TEST_ERROR:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
