// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Computer Science" },
        { name: "Data Science" },
        { name: "Web Development" },
        { name: "Mobile Development" },
        { name: "Game Development" },
        { name: "Artificial Intelligence" },
      ],
    });
    console.log("Database seeded successfully with categories.");
  } catch (error) {
    console.error("Error seeding the database category:", error);
  } finally {
    await database.$disconnect();
  }
}

main();