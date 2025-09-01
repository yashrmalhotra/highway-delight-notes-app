import { EventEmitter } from "events";
import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASS, // Gmail App Password
      },
    });
  }
  return transporter;
}

export const emailEvent = (globalThis as any).emailEvent ?? new EventEmitter();

if (!(globalThis as any).emailEvent) {
  (globalThis as any).emailEvent = emailEvent;
}

emailEvent.on("emitOTP", async (email: string, otp: number) => {
  try {
    console.log("cache email function emit");
    const trans = getTransporter(); // ✅ reuse cached transporter

    await trans.verify();
    const info = await trans.sendMail({
      from: `Highway Delite <${process.env.EMAIL}>`,
      to: email,
      subject: "Verification Email",
      html: `<p style="font-size:15px; color:black;">OTP is <b>${otp}</b></p>`,
    });

    console.log("Mail sent:", info.response);
  } catch (error) {
    console.error("Mailer error:", error);
  }
});
