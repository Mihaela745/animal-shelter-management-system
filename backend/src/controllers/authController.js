import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Users } from "../models/Users.js";
import { transporter } from "../config/mail.js";
import { ResetTokens } from "../models/ResetTokens.js";
import { isValidFullName, normalizeFullName } from "../utils/nameValidation.js";
const JWT_SECRET = process.env.JWT_SECRET;

export const controller = {
  addUser: async (req, res) => {
    try {
      const { username, email, password, phonenumber, address } = req.body;

      if (!username || !email || !password)
        return res.status(400).send("Lipsesc câmpuri obligatorii.");

      const existingUser = await Users.findOne({ where: { email } });
      if (existingUser) return res.status(409).send("Email deja folosit");

      if (!isValidFullName(username))
        return res.status(400).send("Numele trebuie să fie de forma Nume Prenume.");

      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
        return res.status(400).send("Email invalid");

      const hasUpperCase = /[A-Z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecial = /[^a-zA-Z0-9]/.test(password);
      if (password.length < 8 || !hasUpperCase || !hasNumber || !hasSpecial)
        return res.status(400).send("Parola este prea slabă.");

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await Users.create({
        username: normalizeFullName(username),
        email,
        password: hashedPassword,
        phonenumber,
        address,
        role: "user",
      });

      return res.status(201).json(user);
    } catch (err) {
      return res.status(500).send(`Eroare de server: ${err}`);
    }
  },
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).send("Emailul și parola sunt obligatorii.");

      const user = await Users.findOne({ where: { email } });
      if (!user) return res.status(401).send("Email sau parola incorecte");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).send("Parolă greșită.");

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "2h" },
      );

      return res.status(200).json({ user, token });
    } catch (err) {
      return res.status(500).send(`Eroare de server: ${err}`);
    }
  },
  updatePassword: async (req, res) => {
    try {
      const { email, oldPassword, newPassword } = req.body;

      const user = await Users.findOne({ where: { email } });
      if (!user) return res.status(404).send("Utilizator inexistent.");

      const validOld = await bcrypt.compare(oldPassword, user.password);
      if (!validOld) return res.status(401).send("Parola veche este greșită.");

      const samePassword = await bcrypt.compare(newPassword, user.password);
      if (samePassword)
        return res.status(400).send("Noua parolă trebuie să fie diferită.");

      const hasUpperCase = /[A-Z]/.test(newPassword);
      const hasNumber = /\d/.test(newPassword);
      const hasSpecial = /[^a-zA-Z0-9]/.test(newPassword);
      if (newPassword.length < 8 || !hasUpperCase || !hasNumber || !hasSpecial)
        return res.status(400).send("Parola este invalidă.");

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      return res.status(200).send("Parola a fost actualizată.");
    } catch (err) {
      return res.status(500).send(`Eroare de server: ${err}`);
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await Users.findOne({ where: { email } });
      if (!user) return res.status(404).send("Email inexistent.");

      const token = crypto.randomBytes(32).toString("hex");
      const tokenHash = await bcrypt.hash(token, 10);

      await ResetTokens.update(
        { used: true },
        { where: { userId: user.id, used: false } },
      );

      await ResetTokens.create({
        userId: user.id,
        token_hash: tokenHash,
        expires_at: new Date(Date.now() + 15 * 60 * 1000),
      });

      const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}&id=${user.id}`;

      await transporter.sendMail({
        to: user.email,
        subject: "Resetare parola",
        html: `
          <p>Salut ${user.username},</p>
          <p>Apasă pe link pentru resetare:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>Expiră în 15 minute.</p>
        `,
      });

      return res.status(200).send("Emailul de resetare a fost trimis.");
    } catch (err) {
      return res.status(500).send("Eroare server");
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { id, token, newPassword } = req.body;

      const user = await Users.findByPk(id);
      if (!user) return res.status(404).send("Utilizator invalid.");

      const resetToken = await ResetTokens.findOne({
        where: { userId: id, used: false },
      });
      if (!resetToken) return res.status(400).send("Token invalid sau deja folosit.");

      if (new Date(resetToken.expires_at) < new Date())
        return res.status(400).send("Token expirat.");

      const validToken = await bcrypt.compare(token, resetToken.token_hash);
      if (!validToken) return res.status(400).send("Token invalid.");

      const samePassword = await bcrypt.compare(newPassword, user.password);
      if (samePassword)
        return res.status(400).send("Noua parolă trebuie să fie diferită.");

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      resetToken.used = true;
      await resetToken.save();

      return res.status(200).send("Parola a fost resetată cu succes.");
    } catch (err) {
      return res.status(500).send("Eroare server");
    }
  },
};
