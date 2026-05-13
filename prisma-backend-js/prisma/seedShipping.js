import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const districts = [
  "Colombo","Gampaha","Kalutara","Kandy","Matale","Nuwara Eliya",
  "Galle","Matara","Hambantota","Jaffna","Kilinochchi","Mannar",
  "Vavuniya","Mullaitivu","Batticaloa","Ampara","Trincomalee",
  "Kurunegala","Puttalam","Anuradhapura","Polonnaruwa",
  "Badulla","Monaragala","Ratnapura","Kegalle",
];

const methods = [
  { method: "standard", price: 400 },
  { method: "express", price: 700 },
  { method: "nextday", price: 1000 },
];

async function seed() {
  for (const district of districts) {
    for (const m of methods) {
      await prisma.shippingZone.upsert({
        where: {
          district_method: {
            district,
            method: m.method,
          },
        },
        update: {
          price: m.price,
        },
        create: {
          district,
          method: m.method,
          price: m.price,
        },
      });
    }
  }

  console.log("Shipping zones seeded successfully");
}

seed()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());