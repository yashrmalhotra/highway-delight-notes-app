import { z } from "zod";
import mongoose, { Document } from "mongoose";
import React, { SetStateAction } from "react";
export const SignUpschema = z.object({
  name: z.string().min(2, "Name is required"),
  dob: z
    .date({
      error: "Enter a valid DOB",
    })
    .refine((date) => date <= new Date(), {
      message: "DOB cannot be in the future",
    }),
  email: z.email("Enter a valid email"),
  otp: z.string().length(4, "OTP must be 4 digits").optional(),
});
export const SignInSchema = z.object({
  email: z.email("Enter a valid email"),
  otp: z.string().length(4, "OTP must be 4 digits").optional(),
});

export interface IUser extends Document {
  name: string;
  email: string;
  dob: Date;
  otp?: number;
  isVerified: boolean;
}
export interface INote extends Document {
  note: string;
  createdBy: string;
}
export interface UserSchema {
  name: string;
  email: string;
  dob: Date;
}
export interface Note {
  _id: string;
  note: string;
  createdBy: string;
}
export interface ContextValueTypes {
  email: string | null | undefined;
  name: string | null | undefined;
  status: string;
}
