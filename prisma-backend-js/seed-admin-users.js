import bcrypt from "bcrypt";
import prisma from "./src/prisma/client.js";

async function seedAdminUsers() {
    try {
        console.log("Seeding admin and store manager users...");

        // Check if admin user already exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email: "admin@solevora.com" }
        });

        if (!existingAdmin) {
            const hashedAdminPassword = await bcrypt.hash("admin123", 10);
            await prisma.user.create({
                data: {
                    name: "System Administrator",
                    email: "admin@solevora.com",
                    password: hashedAdminPassword,
                    role: "admin",
                    status: 1
                }
            });
            console.log("✅ Admin user created: admin@solevora.com / admin123");
        } else {
            console.log("ℹ️ Admin user already exists: admin@solevora.com");
        }

        // Check if store manager user already exists
        const existingManager = await prisma.user.findUnique({
            where: { email: "manager@solevora.com" }
        });

        if (!existingManager) {
            const hashedManagerPassword = await bcrypt.hash("manager123", 10);
            await prisma.user.create({
                data: {
                    name: "Store Manager",
                    email: "manager@solevora.com",
                    password: hashedManagerPassword,
                    role: "store_manager",
                    status: 1
                }
            });
            console.log("✅ Store manager user created: manager@solevora.com / manager123");
        } else {
            console.log("ℹ️ Store manager user already exists: manager@solevora.com");
        }

        // Display all users for verification
        const allUsers = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true
            }
        });

        console.log("\n📋 Current users in database:");
        console.table(allUsers);

    } catch (error) {
        console.error("❌ Error seeding admin users:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedAdminUsers();
