import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductManager from "./ProductManager";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  await connectDB();
  
  const [categoriesRaw, productsRaw] = await Promise.all([
    Category.find({}).sort({ name: 1 }).lean(),
    Product.find({}).populate("category", "name _id").sort({ createdAt: -1 }).lean()
  ]);
  
  // Transform MongoDB ObjectId to string for client component
  const categories = categoriesRaw.map(cat => ({
    id: (cat._id as any).toString(),
    name: cat.name
  }));

  const products = productsRaw.map(prod => ({
    id: (prod._id as any).toString(),
    name: prod.name,
    description: prod.description,
    price: prod.price,
    discount: prod.discount || "",
    stock: prod.stock,
    category: {
      id: ((prod.category as any)._id || prod.category).toString(),
      name: (prod.category as any).name || "Unknown"
    }
  }));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-neutral-100">Products</h1>
        <p className="mt-2 text-gray-600 dark:text-neutral-400">Manage your product inventory and details.</p>
      </div>
      
      <ProductManager products={products} categories={categories} />
    </div>
  );
}
