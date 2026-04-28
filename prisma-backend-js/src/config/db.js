import prisma from '../prisma/client.js';

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database Connected');
  } catch (err) {
    console.error('❌ DB Connection Failed', err);
    process.exit(1);
  }
};
