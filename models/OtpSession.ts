import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOtpSession extends Document {
  phone: string;
  otp: string;
  expiresAt: Date;
}

const OtpSessionSchema = new Schema<IOtpSession>({
  phone: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

OtpSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpSession: Model<IOtpSession> =
  mongoose.models.OtpSession ||
  mongoose.model<IOtpSession>("OtpSession", OtpSessionSchema);
