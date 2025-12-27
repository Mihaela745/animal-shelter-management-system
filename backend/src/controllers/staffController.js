import { Staff } from "../models/Staff.js";
import bcrypt from "bcrypt"
import crypto from "crypto"
import { transporter } from "../config/mail.js";
import { Position } from "../models/Position.js";
import { sequelize } from "../config/db.js";
import { Users } from "../models/Users.js";

export const controller = {
  createStaff: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { name, email, position_id, phonenumber } = req.body;

      if (!name || !email || !position_id || !phonenumber) {
        // Dacă returnăm aici, tranzacția trebuie închisă
        await t.rollback();
        return res.status(400).send(`All fields must be completed`);
      }

      const positionExists = await Position.findByPk(position_id);
      if (!positionExists) {
        await t.rollback();
        return res.status(404).send(`Position doesn't exist!`);
      }

      const existingUser = await Users.findOne({ where: { email } });
      if (existingUser) {
        await t.rollback();
        return res
          .status(409)
          .send("This mail is already associated with another account!");
      }

      const tempPassword = crypto.randomBytes(4).toString("hex");
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      const newUser = await Users.create(
        {
          username: name,
          email: email,
          password: hashedPassword,
          phonenumber: phonenumber,
          role: positionExists.title,
        },
        { transaction: t }
      );

      const newStaff = await Staff.create(
        {
          name,
          email,
          position_id,
          phonenumber: phonenumber,
          user_id: newUser.id,
        },
        { transaction: t }
      );

      // Aici salvăm definitiv în baza de date
      await t.commit();

      // Trimitem email-ul DUPĂ commit.
      // Dacă email-ul eșuează, datele rămân în baza de date, dar primim eroare.
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
          "Email failed to send, but staff was created:",
          mailError
        );
        // Putem returna 201 oricum, specificând că mail-ul a eșuat
        return res.status(201).json({
          message: "Staff created, but welcome email could not be sent.",
          staff: newStaff,
          temporaryPassword: tempPassword, // O returnăm aici ca backup
        });
      }

      return res.status(201).json({
        message: "Staff and account created with success!",
        staff: newStaff,
      });
    } catch (error) {
      // VERIFICARE CRITICĂ: Facem rollback doar dacă tranzacția nu a apucat să dea commit
      if (t && !t.finished) {
        await t.rollback();
      }
      console.error("Error creating staff:", error);
      return res
        .status(500)
        .send(`Failed while creating staff: ${error.message}`);
    }
  },
  getAllStaf: async (req, res) => {
    try {
      const staffMembers = await Staff.findAll();
      return res.status(200).send(staffMembers);
    } catch (error) {
      return res.status(500).send(`Failed to fetch staff : ${error}`);
    }
  },
  getStaffById: async (req, res) => {
    try {
      const staff = await Staff.findByPk(req.params.id);
      if (!staff) {
        return res.status(404).send("Staff doesnt exist");
      } else return res.status(200).send(staff);
    } catch (error) {
      return res.status(500).send(`Failed to fetch staff : ${error}`);
    }
  },
  updateStaff: async (req, res) => {
    try {
      const staffId = req.params.id;
      const updateData = req.body;

      if (updateData.position_id) {
        const positionExists = await Position.findByPk(updateData.position_id);
        if (!positionExists) {
          return res
            .status(404)
            .send("Position not found or no changes applied.");
        }
      }
      const [updatedRows] = await Staff.update(updateData, {
        where: { id: req.params.id },
      });
      if (updatedRows === 0) {
        return res
          .status(404)
          .send("Position not found or no changes applied.");
      }
      const updatedStaff = await Staff.findByPk(staffId);

      return res.status(200).send(updatedStaff);
    } catch (error) {
      console.log("Failed to modify staff member!");
      return res.status(500).send(`Couldn't update staff:${error}`);
    }
  },
  deleteStaff: async (req, res) => {
    try {
      const deletedRows = await Staff.destroy({
        where: {
          id: req.params.id,
        },
      });
      if (deletedRows === 0)
        return res.status(404).send("Staff member not found.");
      return res.status(200).send(`Deletion succesfull!`);
    } catch (error) {
      console.error("Error deleting staff member:", error);
      return res.status(500).send(`Couldn't delete staffMember:${error}`);
    }
  },
};
