import { transporter } from "../config/mail.js"; 
export const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Animal Shelter" <${process.env.EMAIL_SEND}>`,
    to,
    subject,
    html,
  });
};