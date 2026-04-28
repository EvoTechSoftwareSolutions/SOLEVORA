import prisma from "./src/prisma/client.js";

async function checkUsers() {
    try {
        const users = await prisma.user.findMany({
            take: 10,
            select: { id: true, email: true, role: true }
        });
        console.log("Users sample:", JSON.stringify(users, null, 2));
        
        const customerCount = await prisma.user.count({
            where: { role: 'customer' }
        });
        console.log("Customer count (where role: 'customer'):", customerCount);

        const promoCount = await prisma.promocode.count();
        console.log("Promo count:", promoCount);

    } catch (err) {
        console.error("ERROR:", err);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();
