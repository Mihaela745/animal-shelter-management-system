import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Users } from "../models/Users.js";

export const controller = {
  addUser: async (req, res) => {
    const { username, email, password, phonenumber, address, role } = req.body;
    try {
      const result = await Users.findOne({
        where: { email: email },
      });
      if (result)
        return res.status(400).json(`Email :${email} is aleready taken!`);
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await Users.create({
        username: username,
        email: email,
        password: hashedPassword,
        phonenumber: phonenumber,
        address: address,
        role: role,
      });
      return res.status(201).json(user);
    } catch (err) {
      res.status(500).send(`Server error: ${err}`);
    }
  },
  loginUser: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("User not found!");
    }
    try {
      const user = await Users.findOne({ where: { email: email } });
      if (!user) return res.status(404).send("User not found!");
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(404).send("Wrong password!");

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "2h",
      });
      return res.status(200).send({ user, token });
    } catch (err) {
      res.status(500).send(`Server error: ${err}`);
    }
  },
  logoutUser: async (req, res) => {
    res.status(200).send("Disconected");
  },
  updatePassword: async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword || oldPassword === newPassword) {
      return res.status(400).json({ error: "Invalid password data." });
    }

    try {
      const user = await Users.findOne({ where: { email } });
      if (!user) return res.status(404).json({ error: "User not found." });

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid old password." });
      }

      const newHashedPass = await bcrypt.hash(newPassword, 10);

      user.password = newHashedPass;
      await user.save();

      return res.status(200).json({ message: "Password was updated!" });
    } catch (err) {
      console.error("Error updating password:", err);

      return res.status(500).json({ error: `Server error: ${err.message}` });
    }
  },
};
