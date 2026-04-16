"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function addProduct(formData: FormData) {
  try {
    await connectDB();
    
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const discount = formData.get("discount") as string;
    const stock = Number(formData.get("stock"));
    const category = formData.get("category") as string;
    
    if (!name || !description || isNaN(price) || isNaN(stock) || !category) {
      return { success: false, error: "Missing required fields or invalid data type" };
    }
    
    await Product.create({
      name,
      description,
      price,
      discount: discount || "",
      stock,
      category,
    });
    
    revalidatePath("/products");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to add product" };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    await connectDB();
    
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const discount = formData.get("discount") as string;
    const stock = Number(formData.get("stock"));
    const category = formData.get("category") as string;
    
    if (!name || !description || isNaN(price) || isNaN(stock) || !category) {
      return { success: false, error: "Missing required fields or invalid data type" };
    }
    
    await Product.findByIdAndUpdate(id, {
      name,
      description,
      price,
      discount: discount || "",
      stock,
      category,
    });
    
    revalidatePath("/products");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await connectDB();
    await Product.findByIdAndDelete(id);
    revalidatePath("/products");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete product" };
  }
}
