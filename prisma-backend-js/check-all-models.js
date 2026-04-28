import prisma from "./src/prisma/client.js";

async function checkModels() {
    const models = [
        'order', 'product', 'productstock', 'orderitem', 'user', 'promocode', 'settings'
    ];
    for (const model of models) {
        try {
            console.log(`Checking prisma.${model}...`);
            if (prisma[model] === undefined) {
                console.error(`❌ prisma.${model} is UNDEFINED`);
            } else {
                console.log(`✅ prisma.${model} is OK`);
            }
        } catch (err) {
            console.error(`❌ Error checking ${model}:`, err.message);
        }
    }
    await prisma.$disconnect();
}

checkModels();
