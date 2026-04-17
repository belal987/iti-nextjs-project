import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import CategoryManager from "./CategoryManager";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  await connectDB();

  // Aggregate categories with product count
  const categoriesRaw = await Category.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "category",
        as: "products",
      },
    },
    {
      $addFields: {
        productCount: { $size: "$products" },
      },
    },
    {
      $project: { products: 0 },
    },
    { $sort: { name: 1 } },
  ]);

  const categories = categoriesRaw.map((cat) => ({
    id: cat._id.toString(),
    name: cat.name as string,
    productCount: (cat.productCount as number) ?? 0,
  }));

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 tracking-tight">
          Categories
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
          Manage categories and view the number of products in each.
        </p>
      </div>

      <CategoryManager categories={categories} />
    </div>
  );
}
