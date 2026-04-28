import prisma from "./src/prisma/client.js";

console.log("Prisma Models:");
Object.keys(prisma).forEach(key => {
  if (!key.startsWith("$") && !key.startsWith("_")) {
    console.log(`- ${key}`);
  }
});

try {
  await prisma.$connect();
  console.log("Database connection successful");
} catch (e) {
  console.error("Database connection failed:", e.message);
} finally {
  await prisma.$disconnect();
}
