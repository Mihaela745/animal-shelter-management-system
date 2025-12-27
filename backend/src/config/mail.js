import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_SEND,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
