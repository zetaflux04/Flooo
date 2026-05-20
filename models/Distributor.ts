import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IDistributorProduct {
  productId: Types.ObjectId;
  stock: number;
  isAvailable: boolean;
}

export interface IDistributor extends Document {
  name: string;
  code: string;
  area?: string;
  address: string;
  city: string;
  state: string;
  pincode?: string;
  capacity?: number;
  about?: string;
  mobileNumber: string;
  availableProducts?: IDistributorProduct[];
  isActive: boolean;
  createdAt: Date;
}

const DistributorProductSchema = new Schema<IDistributorProduct>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    stock: { type: Number, default: 100 },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: false }
);

const DistributorSchema = new Schema<IDistributor>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    area: { type: String, default: "" },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, default: "" },
    capacity: { type: Number, default: 0 },
    about: { type: String, default: "" },
    mobileNumber: { type: String, required: true },
    availableProducts: { type: [DistributorProductSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

// Re-register schema so new fields apply after hot reload in development
if (mongoose.models.Distributor) {
  delete mongoose.models.Distributor;
}

export const Distributor: Model<IDistributor> = mongoose.model<IDistributor>(
  "Distributor",
  DistributorSchema
);
