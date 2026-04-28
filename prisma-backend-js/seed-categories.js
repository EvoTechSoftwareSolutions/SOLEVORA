import prisma from './src/prisma/client.js';

const categories = [
  { name: 'All', slug: 'all', description: 'All products', sortOrder: 0 },
  { name: 'Sneakers', slug: 'sneakers', description: 'Casual and fashion sneakers', sortOrder: 1 },
  { name: 'Running', slug: 'running', description: 'Running and athletic shoes', sortOrder: 2 },
  { name: 'Formal', slug: 'formal', description: 'Formal and dress shoes', sortOrder: 3 },
  { name: 'Boots', slug: 'boots', description: 'Boots for all occasions', sortOrder: 4 },
  { name: 'Sandals', slug: 'sandals', description: 'Comfortable sandals', sortOrder: 5 },
  { name: 'Heels', slug: 'heels', description: 'Fashion heels and pumps', sortOrder: 6 },
  { name: 'Loafers', slug: 'loafers', description: 'Classic loafers', sortOrder: 7 },
  { name: 'Athletic', slug: 'athletic', description: 'Athletic and sports footwear', sortOrder: 8 }
];

async function seedCategories() {
  try {
    console.log('Starting to seed categories...');
    
    for (const category of categories) {
      const existingCategory = await prisma.category.findUnique({
        where: { slug: category.slug }
      });

      if (existingCategory) {
        console.log(`Category '${category.name}' already exists (slug: ${category.slug})`);
      } else {
        await prisma.category.create({
          data: {
            name: category.name,
            slug: category.slug,
            description: category.description,
            sortOrder: category.sortOrder,
            isActive: true,
            updatedAt: new Date()
          }
        });
        console.log(`Created category: ${category.name} (slug: ${category.slug})`);
      }
    }

    console.log('Category seeding completed!');
    
    // Verify the seeded categories
    const allCategories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    
    console.log('\nAll categories in database:');
    allCategories.forEach(cat => {
      console.log(`- ${cat.name} (slug: ${cat.slug}, order: ${cat.sortOrder})`);
    });

  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCategories();
