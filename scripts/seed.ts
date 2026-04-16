import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI!;

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI, { dbName: "ecommerce-dashboard" });
  console.log("Connected!");

  const db = mongoose.connection.db!;

  // Seed admin user
  const usersCollection = db.collection("users");
  const existingUser = await usersCollection.findOne({ email: "admin@admin.com" });

  if (!existingUser) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    await usersCollection.insertOne({
      email: "admin@admin.com",
      password: hashedPassword,
      name: "Admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("Admin user created: admin@admin.com / admin123");
  } else {
    console.log("Admin user already exists");
  }

  // Seed categories
  const categoriesCollection = db.collection("categories");
  const existingCategories = await categoriesCollection.countDocuments();

  const categoryDocs: { name: string; slug: string; _id?: mongoose.Types.ObjectId; createdAt: Date; updatedAt: Date }[] = [];

  if (existingCategories === 0) {
    const categories = [
      { name: "Electronics", slug: "electronics" },
      { name: "Clothing", slug: "clothing" },
      { name: "Sports", slug: "sports" },
      { name: "Home & Garden", slug: "home-garden" },
      { name: "Books", slug: "books" },
      { name: "Food", slug: "food" },
      { name: "Toys", slug: "toys" },
      { name: "Automotive", slug: "automotive" },
      { name: "Other", slug: "other" },
    ];

    for (const cat of categories) {
      const doc = {
        ...cat,
        _id: new mongoose.Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      categoryDocs.push(doc);
    }

    await categoriesCollection.insertMany(categoryDocs);
    console.log(`${categories.length} categories created`);
  } else {
    console.log(`${existingCategories} categories already exist`);
    const docs = await categoriesCollection.find({}).toArray();
    for (const doc of docs) {
      categoryDocs.push(doc as unknown as typeof categoryDocs[0]);
    }
  }

  // Seed sample products
  const productsCollection = db.collection("products");
  const existingProducts = await productsCollection.countDocuments();

  if (existingProducts === 0 && categoryDocs.length > 0) {
    const getCategoryId = (name: string) =>
      categoryDocs.find((c) => c.name === name)?._id;

    const products = [
      { name: "Wireless Headphones", description: "Over-ear noise-cancelling headphones with 30h battery life.", price: 89.99, discount: "10%", stock: 34, category: getCategoryId("Electronics") },
      { name: "Running Shoes", description: "Lightweight running shoes with cushioned sole.", price: 119.00, discount: "$15", stock: 0, category: getCategoryId("Sports") },
      { name: "Linen Throw Pillow", description: "Soft linen decorative pillow for living room.", price: 34.50, discount: "", stock: 5, category: getCategoryId("Home & Garden") },
      { name: "Cookbook: Fast Meals", description: "200 quick and easy recipes for busy people.", price: 22.00, discount: "5%", stock: 88, category: getCategoryId("Books") },
      { name: "Bluetooth Speaker", description: "Portable waterproof Bluetooth speaker.", price: 45.99, discount: "15%", stock: 60, category: getCategoryId("Electronics") },
      { name: "Yoga Mat", description: "Non-slip yoga mat with carrying strap.", price: 29.99, discount: "", stock: 25, category: getCategoryId("Sports") },
      { name: "Cotton T-Shirt", description: "100% cotton casual t-shirt, various colors.", price: 19.99, discount: "$3", stock: 150, category: getCategoryId("Clothing") },
      { name: "Garden Hose", description: "50ft expandable garden hose with spray nozzle.", price: 35.00, discount: "10%", stock: 0, category: getCategoryId("Home & Garden") },
      { name: "Laptop Stand", description: "Adjustable aluminum laptop stand for ergonomic use.", price: 49.99, discount: "", stock: 42, category: getCategoryId("Electronics") },
      { name: "Board Game Set", description: "Classic family board game collection.", price: 39.99, discount: "20%", stock: 18, category: getCategoryId("Toys") },
    ];

    const productDocs = products.map((p) => ({
      ...p,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await productsCollection.insertMany(productDocs);
    console.log(`${products.length} sample products created`);
  } else {
    console.log(`${existingProducts} products already exist`);
  }

  await mongoose.disconnect();
  console.log("Seed completed successfully!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
