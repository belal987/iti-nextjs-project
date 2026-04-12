import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: Number,
  discount: Number,
  stock: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
