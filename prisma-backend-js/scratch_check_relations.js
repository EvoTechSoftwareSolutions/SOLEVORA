import prisma from "./src/prisma/client.js";

async function checkRelations() {
  try {
    console.log("Checking relations for 'order' model...");
    const order = await prisma.order.findFirst({
      include: {
        orderitem: true
      }
    });
    console.log("Successfully included 'orderitem'");
  } catch (e) {
    console.error("Failed to include 'orderitem':", e.message);
  }

  try {
    console.log("Checking relations for 'product' model...");
    const product = await prisma.product.findFirst({
      include: {
        productstock: true,
        productimage: true
      }
    });
    console.log("Successfully included 'productstock' and 'productimage'");
  } catch (e) {
    console.error("Failed to include relations for 'product':", e.message);
  }
  
  await prisma.$disconnect();
}

checkRelations();
