import { Staff } from "../models/Staff.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { transporter } from "../config/mail.js";
import { Position, Users } from "../models/index.js";
import { sequelize } from "../config/db.js";
import { isValidFullName, normalizeFullName } from "../utils/nameValidation.js";

export const controller = {
  createStaff: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { name, email, position_id, phonenumber } = req.body;

      if (!name || !email || !position_id || !phonenumber) {
        await t.rollback();
        return res.status(400).send(`Toate câmpurile sunt obligatorii`);
      }

      if (!isValidFullName(name)) {
        await t.rollback();
        return res.status(400).send("Numele trebuie sa fie de forma Nume Prenume");
      }

      const positionExists = await Position.findByPk(position_id);
      if (!positionExists) {
        await t.rollback();
        return res.status(404).send(`Poziția nu există!`);
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
        return res.status(400).send("Email invalid");
      const existingUser = await Users.findOne({ where: { email } });
      if (existingUser) {
        await t.rollback();
        return res
          .status(409)
          .send("Acest email are deja un cont asociat!");
      }

      const tempPassword = crypto.randomBytes(4).toString("hex");
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      const newUser = await Users.create(
        {
          username: normalizeFullName(name),
          email: email,
          password: hashedPassword,
          phonenumber: phonenumber,
          role: positionExists.title,
        },
        { transaction: t },
      );

      const newStaff = await Staff.create(
        {
          name: normalizeFullName(name),
          email,
          position_id,
          phonenumber: phonenumber,
          user_id: newUser.id,
        },
        { transaction: t },
      );

      await t.commit();

      try {
        await transporter.sendMail({
          to: email,
          subject: "Cont Staff Nou - Shelter Management",
          html: `<h3>Salut, ${name}!</h3>
                 <p>Datele tale de logare sunt:</p>
                 <ul>
                   <li><strong>Email:</strong> ${email}</li>
                   <li><strong>Parolă temporară:</strong> ${tempPassword}</li>
                 </ul>`,
        });
      } catch (mailError) {
        console.error(
          "Eroarea în transmiterea emailului, dar personalul a fost creat!",
          mailError,
        );
        return res.status(201).json({
          message:
            "Eroarea în transmiterea emailului, dar personalul a fost creat!",
          staff: newStaff,
          temporaryPassword: tempPassword,
        });
      }

      return res.status(201).json({
        message: "Angajatul și contul au fost create cu succes!",
        staff: newStaff,
      });
    } catch (error) {
      if (t && !t.finished) {
        await t.rollback();
      }
      console.error("Error creating staff:", error);
      return res
        .status(500)
        .send(`Crearea angajatului a eșuat: ${error.message}`);
    }
  },
  getAllStaff: async (req, res) => {
    try {
      const staffMembers = await Staff.findAll({
        include: [
          {
            model: Position,
            attributes: ["id", "title"],
          },
        ],
      });
      return res.status(200).send(staffMembers);
    } catch (error) {
      return res.status(500).send(`Nu am putut încărca angajații : ${error}`);
    }
  },
  getStaffById: async (req, res) => {
    try {
      const staff = await Staff.findByPk(req.params.id);
      if (!staff) {
        return res.status(404).send("Angajatul nu există");
      } else return res.status(200).send(staff);
    } catch (error) {
      return res.status(500).send(`Nu am putut încărca angajatul : ${error}`);
    }
  },
  updateStaff: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const staffId = req.params.id;
      const updateData = req.body;
      const userUpdateData = {};

      const staff = await Staff.findByPk(staffId);
      if (!staff) {
        await t.rollback();
        return res.status(404).send("Angajatul nu a fost găsit!");
      }
      const user = await Users.findByPk(staff.user_id);
      if (!user) {
        await t.rollback();
        return res.status(404).send("Utilizatorul asociat nu a fost găsit!");
      }
      if (updateData.email) {
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(updateData.email)) {
          await t.rollback();
          return res.status(400).send("Format de email invalid!");
        }

        const existingUser = await Users.findOne({
          where: { email: updateData.email },
        });

        if (existingUser && existingUser.id !== user.id) {
          await t.rollback();
          return res.status(409).send("Emailul este deja folosit de alt cont!");
        }

        userUpdateData.email = updateData.email;
      }

      if (updateData.position_id) {
        const position = await Position.findByPk(updateData.position_id);
        if (!position) {
          await t.rollback();
          return res.status(404).send("Poziția nu a fost găsită!");
        }

        userUpdateData.role = position.title;
      }

      if (updateData.name) {
        if (!isValidFullName(updateData.name)) {
          await t.rollback();
          return res.status(400).send("Numele trebuie sa fie de forma Nume Prenume");
        }

        updateData.name = normalizeFullName(updateData.name);
        userUpdateData.username = updateData.name;
      }

      if (updateData.phonenumber) {
        userUpdateData.phonenumber = updateData.phonenumber;
      }

      if (Object.keys(userUpdateData).length > 0) {
        await user.update(userUpdateData, { transaction: t });
      }

      await staff.update(updateData, { transaction: t });

      await t.commit();

      const updatedStaff = await Staff.findByPk(staffId, {
        include: [{ model: Position, attributes: ["id", "title"] }],
      });

      return res.status(200).json(updatedStaff);
    } catch (error) {
      if (t) await t.rollback();
      return res.status(500).send(`Nu am putut actualiza angajatul: ${error.message}`);
    }
  },

  deleteStaff: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const staffId = req.params.id;

      const staff = await Staff.findByPk(staffId);
      if (!staff) {
        await t.rollback();
        return res.status(404).send("Angajatul nu a fost găsit.");
      }

      await Staff.destroy({
        where: { id: staffId },
        transaction: t,
      });

      await Users.destroy({
        where: { id: staff.user_id },
        transaction: t,
      });

      await t.commit();
      return res.status(200).send("Angajatul și utilizatorul au fost șterși cu succes!");
    } catch (error) {
      if (t) await t.rollback();
      return res.status(500).send(`Nu am putut șterge angajatul: ${error.message}`);
    }
  },
  updateMyProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, phonenumber } = req.body;
      const staff = await Staff.findOne({
        where: { user_id: userId },
      });
      if (!staff) {
        return res.status(404).send("Profilul angajatului nu a fost găsit!");
      }

      if (name && !isValidFullName(name)) {
        return res.status(400).send("Numele trebuie sa fie de forma Nume Prenume");
      }

      const normalizedName = name ? normalizeFullName(name) : null;

      await staff.update({
        name: normalizedName ?? staff.name,
        phonenumber: phonenumber ?? staff.phonenumber,
      });

      await Users.update(
        {
          username: normalizedName ?? staff.name,
          phonenumber: phonenumber ?? staff.phonenumber,
        },
        { where: { id: userId } },
      );
      return res.status(200).json(staff);
    } catch (err) {
      return res.status(500).send(`Eroare la actualizare:${err.message}`);
    }
  },
  getMyProfile: async (req, res) => {
    try {
      const userId = req.user.id;

      const staff = await Staff.findOne({
        where: { user_id: userId },
        include: [
          {
            model: Position,
            attributes: ["title"],
          },
        ],
      });

      if (!staff) {
        return res.status(404).send("Profilul angajatului nu a fost găsit!");
      }

      return res.status(200).json(staff);
    } catch (error) {
      return res.status(500).send(`Eroare la încărcarea profilului: ${error.message}`);
    }
  },
};
