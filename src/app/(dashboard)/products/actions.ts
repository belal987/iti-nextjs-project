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
    const sold = Number(formData.get("sold") || 0);
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
      sold: isNaN(sold) ? 0 : sold,
      category,
    });
    
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to add product";
    return { success: false, error: message };
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
    const sold = Number(formData.get("sold") || 0);
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
      sold: isNaN(sold) ? 0 : sold,
      category,
    });
    
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update product";
    return { success: false, error: message };
  }
}

export async function deleteProduct(id: string) {
  try {
    await connectDB();
    await Product.findByIdAndDelete(id);
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete product";
    return { success: false, error: message };
  }
}
