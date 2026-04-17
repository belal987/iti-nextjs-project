import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function GET() {
  try {
    await dbConnect();

    const [
      totalProducts,
      inStockProducts,
      lowStockProducts,
      outOfStockProducts,
      totalCategories,
      categoryStats,
      topSellingProducts,
      stockVsSales,
    ] = await Promise.all([
      // Total counts
      Product.countDocuments({}),
      Product.countDocuments({ stock: { $gt: 10 } }),
      Product.countDocuments({ stock: { $gt: 0, $lte: 10 } }),
      Product.countDocuments({ stock: 0 }),
      Category.countDocuments({}),

      // Products per category (for bar chart)
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
            inStock: { $sum: { $cond: [{ $gt: ["$stock", 10] }, 1, 0] } },
            lowStock: {
              $sum: {
                $cond: [
                  { $and: [{ $gt: ["$stock", 0] }, { $lte: ["$stock", 10] }] },
                  1,
                  0,
                ],
              },
            },
            outOfStock: { $sum: { $cond: [{ $eq: ["$stock", 0] }, 1, 0] } },
          },
        },
        { $sort: { categoryName: 1 } },
      ]),

      // Top 5 best-selling products
      Product.aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },
        { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
        { $sort: { sold: -1 } },
        { $limit: 5 },
        {
          $project: {
            name: 1,
            sold: 1,
            stock: 1,
            price: 1,
            categoryName: "$categoryInfo.name",
          },
        },
      ]),

      // Stock vs Sales per category
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
            totalStock: { $sum: "$stock" },
            totalSold: { $sum: "$sold" },
          },
        },
        { $sort: { categoryName: 1 } },
      ]),
    ]);

    return NextResponse.json(
      {
        totalProducts,
        inStockProducts,
        lowStockProducts,
        outOfStockProducts,
        totalCategories,
        categoryStats,
        topSellingProducts,
        stockVsSales,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch dashboard stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}