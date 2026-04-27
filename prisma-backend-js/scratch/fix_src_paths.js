import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixSrcPaths() {
  console.log('Fixing /src/assets paths...');

  const products = await prisma.product.findMany();
  let updates = 0;

  for (const p of products) {
    const fields = ['image_url', 'image_url_2', 'image_url_3', 'image_url_4'];
    const updateData = {};
    let changed = false;

    fields.forEach(field => {
      let val = p[field];
      if (val && val.includes('/src/assets/category/')) {
        let filename = val.split('/').pop();
        let newVal = `/uploads/products/${filename}`;
        
        updateData[field] = newVal;
        changed = true;
      }
    });

    if (changed) {
      await prisma.product.update({
        where: { id: p.id },
        data: updateData
      });
      updates++;
    }
  }

  console.log(`Updated ${updates} products.`);
  await prisma.$disconnect();
}

fixSrcPaths().catch(e => {
  console.error(e);
  process.exit(1);
});
