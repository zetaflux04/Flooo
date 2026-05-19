import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Shipped"
  | "Delivered"
  | "Completed"
  | "Cancelled";

export interface IOrder extends Document {
  orderId: string;
  user: Types.ObjectId;
  items: {
    product: Types.ObjectId;
    name: string;
    size: string;
    qty: number;
    price: number;
  }[];
  total: number;
  deliveryAddress: {
    name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  deliveryInstructions?: string;
  status: OrderStatus;
  createdAt: Date;
}

const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Completed",
  "Cancelled",
];

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        name: String,
        size: String,
        qty: Number,
        price: Number,
      },
    ],
    total: { type: Number, required: true },
    deliveryAddress: {
      name: String,
      phone: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
    },
    deliveryInstructions: String,
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "Pending",
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export { ORDER_STATUSES };

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
