import User from "@/models/User";
import { UserSchema } from "@/types/types";
import nodemailer from "nodemailer";
import { connectToDataBase } from "./connectDB";
const generateOTP = (): number => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp;
};
const transPorter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASS,
  },
});
export const sendEmail = async (email: string, otp: number) => {
  try {
    await transPorter.sendMail({
      from: `Highway Delite ${process.env.EMAIL}`,
      to: email,
      subject: "Verification Email",
      html: `
  <p style="font-size:15px; color:black;">OTP for verfication is <span style="font-weight:1000;">${otp}</span></p>
  `,
    });
  } catch (error) {
    console.log("error", error);
  }
};

export const createUser = async (data: UserSchema) => {
  const { name, email, dob } = data;
  const otp = generateOTP();
  await connectToDataBase();
  try {
    await User.create({
      name,
      email,
      dob,
      otp,
    });
    sendEmail(email, otp);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export const verifyOTP = async (data: { email: string; otp: string }): Promise<boolean> => {
  const { otp, email } = data;
  const stringTonumberOTP = Number(otp);
  await connectToDataBase();
  try {
    const savedOTP = await User.findOne({ email }).select("otp")!;
    if (savedOTP?.otp === stringTonumberOTP) {
      await User.updateOne({ email }, { $set: { isVerified: true } });
      return true;
    }
    throw new Error("Invalid OTP");
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export const generateLoginOTP = async (data: Record<string, any>): Promise<void> => {
  const otp = generateOTP();
  const { email } = data;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    await User.updateOne({ email }, { $set: { otp } });
    sendEmail(email, otp);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
