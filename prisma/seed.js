import { PrismaClient } from "@prisma/client";
import { readFile } from "fs/promises";

const prisma = new PrismaClient();

async function seed() {
  console.log("📚 Start Seeding...");

  try {
    const file = await readFile("prisma/dummy.json", "utf8");
    const json = JSON.parse(file);

    const categoryMap = new Map();
    for (const cat of json.categories) {
      const dbCategory = await prisma.category.upsert({
        where: { name: cat.name },
        update: {},
        create: { name: cat.name },
      });
      categoryMap.set(cat.id, dbCategory.id);
    }

    for (const book of json.books) {
      const dbCategoryId = categoryMap.get(book.categoryId);
      if (!dbCategoryId) continue;

      await prisma.book.create({
        data: {
          title: book.title,
          author: book.author,
          publisher: book.publisher,
          publicationDate: new Date(book.publicationDate),
          categoryId: dbCategoryId,
        },
      });
    }

    console.log("Seeding books completed.");
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((e) => {
  console.error("Failed to seed database:", e);
  process.exit(1);
});
