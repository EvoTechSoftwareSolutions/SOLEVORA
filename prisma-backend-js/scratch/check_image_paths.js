import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPaths() {
  const products = await prisma.product.findMany({
    take: 10,
    select: {
      id: true,
      name: true,
      image_url: true,
      image_url_2: true
    }
  });

  console.log('--- Product Image Paths ---');
  products.forEach(p => {
    console.log(`ID: ${p.id} | Name: ${p.name}`);
    console.log(`  image_url:   ${p.image_url}`);
    console.log(`  image_url_2: ${p.image_url_2}`);
  });

  const categories = await prisma.category.findMany({
    take: 5,
    select: {
        id: true,
        name: true,
        image_url: true
    }
  });

  console.log('\n--- Category Image Paths ---');
  categories.forEach(c => {
    console.log(`ID: ${c.id} | Name: ${c.name}`);
    console.log(`  image_url: ${c.image_url}`);
  });

  await prisma.$disconnect();
}

checkPaths().catch(e => {
  console.error(e);
  process.exit(1);
});
