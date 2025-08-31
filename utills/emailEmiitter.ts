import EventEmitter from "stream";
import User from "@/models/User";
import { connectToDataBase } from "@/utills/connectDB";
import nodemailer from "nodemailer";
const transPorter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASS,
  },
});
export const emailEvent = (globalThis as any).emailEvent ?? new EventEmitter();
if (!(globalThis as any).emailEvent) {
  (globalThis as any).emailEvent = emailEvent;
}
emailEvent.on("emitOTP", async (email: string, otp: number) => {
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
});
