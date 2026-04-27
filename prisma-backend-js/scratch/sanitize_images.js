import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function sanitizeImagePaths() {
  console.log('Starting image path sanitization...');

  // 1. Update Products
  const products = await prisma.product.findMany();
  let productUpdates = 0;

  for (const p of products) {
    const fields = ['image_url', 'image_url_2', 'image_url_3', 'image_url_4'];
    const updateData = {};
    let changed = false;

    fields.forEach(field => {
      let val = p[field];
      if (val) {
        let newVal = val;
        // Remove absolute localhost URLs
        newVal = newVal.replace(/http:\/\/localhost:500[01]/g, '');
        
        // Handle /src/assets paths - map them to /uploads if we move them, 
        // but for now let's just make sure they don't have double slashes
        newVal = newVal.replace(/\/+/g, '/');
        
        // If it starts with uploads but not /uploads, add /
        if (newVal.startsWith('uploads') && !newVal.startsWith('/')) {
            newVal = '/' + newVal;
        }

        if (newVal !== val) {
          updateData[field] = newVal;
          changed = true;
        }
      }
    });

    if (changed) {
      await prisma.product.update({
        where: { id: p.id },
        data: updateData
      });
      productUpdates++;
    }
  }

  console.log(`Updated ${productUpdates} products.`);

  // 2. Update Categories
  const categories = await prisma.category.findMany();
  let categoryUpdates = 0;

  for (const c of categories) {
    if (c.image_url) {
      let newVal = c.image_url.replace(/http:\/\/localhost:500[01]/g, '').replace(/\/+/g, '/');
      if (newVal.startsWith('uploads') && !newVal.startsWith('/')) {
          newVal = '/' + newVal;
      }

      if (newVal !== c.image_url) {
        await prisma.category.update({
          where: { id: c.id },
          data: { image_url: newVal }
        });
        categoryUpdates++;
      }
    }
  }

  console.log(`Updated ${categoryUpdates} categories.`);

  // 3. Update Product Batches (if they have images, though schema doesn't show them)
  
  await prisma.$disconnect();
  console.log('Sanitization complete.');
}

sanitizeImagePaths().catch(e => {
  console.error(e);
  process.exit(1);
});
