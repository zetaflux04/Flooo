import mongoose, { Schema, Document, Model } from "mongoose";

export type ProductCategory = "bottle" | "apparel" | "others";

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: ProductCategory;
  size: string;
  packQty: number;
  price: number;
  description: string;
  image: string;
  images?: string[];
  stock: number;
  isActive: boolean;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, enum: ["bottle", "apparel", "others"], default: "bottle" },
  size: { type: String, required: true, trim: true },
  packQty: { type: Number, default: 1 },
  price: { type: Number, required: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" },
  images: [{ type: String }],
  stock: { type: Number, default: 100 },
  isActive: { type: Boolean, default: true },
});

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
