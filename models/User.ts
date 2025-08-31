import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "@/types/types";
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    otp: { type: Number },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);
UserSchema.index({ email: 1 });
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
