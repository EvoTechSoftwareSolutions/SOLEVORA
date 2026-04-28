import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Keys on prisma client:', Object.keys(prisma).filter(k => !k.startsWith('$')));
    await prisma.$connect();
    console.log('Successfully connected to DB');
  } catch (e) {
    console.error('Failed to connect:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
