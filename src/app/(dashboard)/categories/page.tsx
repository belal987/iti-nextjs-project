import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import CategoryManager from "./CategoryManager";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  await connectDB();
  const categoriesRaw = await Category.find({}).sort({ name: 1 }).lean();
  
  // Transform MongoDB ObjectId to string for client component
  const categories = categoriesRaw.map(cat => ({
    id: (cat._id as any).toString(),
    name: cat.name
  }));

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <p className="mt-2 text-gray-600">Manage categories for your products across the application.</p>
      </div>
      
      <CategoryManager categories={categories} />
    </div>
  );
}
