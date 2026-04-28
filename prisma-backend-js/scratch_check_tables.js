import prisma from "./src/prisma/client.js";

async function checkTables() {
  try {
    const tables = await prisma.$queryRaw`SHOW TABLES`;
    console.log("Tables in database:", JSON.stringify(tables, null, 2));
  } catch (e) {
    console.error("Failed to fetch tables:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();
