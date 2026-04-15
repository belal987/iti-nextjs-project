"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";

export async function addCategory(formData: FormData) {
  try {
    await connectDB();
    const name = formData.get("name") as string;
    
    if (!name) {
      return { success: false, error: "Category name is required" };
    }
    
    await Category.create({ name });
    revalidatePath("/categories");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to add category" };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  try {
    await connectDB();
    const name = formData.get("name") as string;
    
    if (!name) {
      return { success: false, error: "Category name is required" };
    }
    
    await Category.findByIdAndUpdate(id, { name });
    revalidatePath("/categories");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await connectDB();
    await Category.findByIdAndDelete(id);
    revalidatePath("/categories");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete category" };
  }
}
