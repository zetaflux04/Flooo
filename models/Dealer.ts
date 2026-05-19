import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IDealerProduct {
  productId: Types.ObjectId;
  stock: number;
  isAvailable: boolean;
}

export interface IDealer extends Document {
  name: string;
  code: string;
  type: "Wholesale" | "Retail" | "Distribution";
  city: string;
  state: string;
  address: string;
  phone: string;
  manager: string;
  managerPhone?: string;
  email?: string;
  about?: string;
  pincode?: string;
  timings?: string;
  capacity?: number;
  availableProducts?: IDealerProduct[];
  isActive: boolean;
  createdAt: Date;
}

const DealerProductSchema = new Schema<IDealerProduct>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    stock: { type: Number, default: 100 },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: false }
);

const DealerSchema = new Schema<IDealer>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ["Wholesale", "Retail", "Distribution"],
      required: true,
    },
    city: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    manager: { type: String, required: true },
    managerPhone: String,
    email: String,
    about: String,
    pincode: String,
    timings: String,
    capacity: Number,
    availableProducts: { type: [DealerProductSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const Dealer: Model<IDealer> =
  mongoose.models.Dealer || mongoose.model<IDealer>("Dealer", DealerSchema);
