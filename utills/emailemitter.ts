import EventEmitter from "stream";
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
    console.log("email function emit"); // added debug console.log for production log
    const info = await transPorter.sendMail({
      from: `Highway Delite ${process.env.EMAIL}`,
      to: email,
      subject: "Verification Email",
      html: `
  <p style="font-size:15px; color:black;">OTP for verfication is <span style="font-weight:1000;">${otp}</span></p>
  `,
    });
    console.log("info: ", info.response);
  } catch (error) {
    console.log("error", error);
  }
});
