import { PrismaClient } from '@prisma/client';

// Add BigInt support for JSON.stringify (prevents crashes with BigInt IDs)
BigInt.prototype.toJSON = function() {
  return this.toString();
};

const prisma = new PrismaClient({ log: ['query'] });
export default prisma;
