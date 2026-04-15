import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET() {
  try {
    await dbConnect();

    const [totalProducts, outOfStockProducts, totalCategories, categoryStats] =
      await Promise.all([
        Product.countDocuments({}),
        Product.countDocuments({ stock: 0 }),
        Category.countDocuments({}),
        Product.aggregate([
          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "categoryInfo",
            },
          },
          { $unwind: "$categoryInfo" },
          {
            $group: {
              _id: "$category",
              categoryName: { $first: "$categoryInfo.name" },
              total: { $sum: 1 },
              inStock: {
                $sum: { $cond: [{ $gt: ["$stock", 0] }, 1, 0] },
              },
              outOfStock: {
                $sum: { $cond: [{ $eq: ["$stock", 0] }, 1, 0] },
              },
            },
          },
          { $sort: { categoryName: 1 } },
        ]),
      ]);

    return NextResponse.json(
      {
        totalProducts,
        outOfStockProducts,
        totalCategories,
        categoryStats,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch dashboard stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
