import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductManager from "./ProductManager";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  await connectDB();

  const [categoriesRaw, productsRaw] = await Promise.all([
    Category.find({}).sort({ name: 1 }).lean(),
    Product.find({}).populate("category", "name _id").sort({ createdAt: -1 }).lean(),
  ]);

  const categories = categoriesRaw.map((cat) => ({
    id: (cat._id as { toString(): string }).toString(),
    name: cat.name,
  }));

  const products = productsRaw.map((prod) => ({
    id: (prod._id as { toString(): string }).toString(),
    name: prod.name,
    description: prod.description,
    price: prod.price,
    discount: prod.discount || "",
    stock: prod.stock,
    sold: (prod as { sold?: number }).sold ?? 0,
    category: {
      id: ((prod.category as { _id?: unknown })._id || prod.category)
        ?.toString() ?? "",
      name: (prod.category as { name?: string }).name || "Unknown",
    },
  }));

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 tracking-tight">
          Products
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
          Manage your product inventory, pricing, and stock levels.
        </p>
      </div>

      <ProductManager products={products} categories={categories} />
    </div>
  );
}
