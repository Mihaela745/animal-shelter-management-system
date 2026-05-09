import { Users, Staff } from "../models/index.js";
import { Appointments } from "../models/index.js";
import { Adoption_history } from "../models/index.js";
import { Position } from "../models/index.js";
import bcrypt from "bcrypt";
import { isValidFullName, normalizeFullName } from "../utils/nameValidation.js";

export const seedManager = async () => {
  const existingManager = await Users.findOne({ where: { role: "Manager" } });
  if (!existingManager) {
    const hashedPassword = await bcrypt.hash("Admin123!", 10);
      const managerPosition = await Position.findOne({
        where: { title: "Manager" },
      });
    const newUser=await Users.create({
      username: "Manager Shelter",
      email: "mihaelaneacsu745@gmail.com",
      password: hashedPassword,
      phonenumber: "0700000000",
      role: "Manager",
    });
    await Staff.create({
      name: "Manager Shelter",
      email: newUser.email,
      phonenumber: newUser.phonenumber,
      position_id: managerPosition.id,
      user_id: newUser.id,
    });

    console.log("Manager seeded successfully!");
  }
};

export const controller = {
  getMyProfile: async (req, res) => {
    try {
      const user = await Users.findByPk(req.user.id, {
        attributes: ["id", "username", "email", "phonenumber", "address", "role"],
      });

      if (!user) {
        return res.status(404).send("Utilizatorul nu a fost găsit.");
      }

      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).send(`Nu am putut încărca profilul: ${err.message}`);
    }
  },
  updateMyProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const { username, phonenumber, address } = req.body;

      const user = await Users.findByPk(userId);
      if (!user) {
        return res.status(404).send("Utilizatorul nu a fost găsit.");
      }

      if (username && !isValidFullName(username)) {
        return res.status(400).send("Numele trebuie să fie de forma Nume Prenume.");
      }

      await user.update({
        username: username ? normalizeFullName(username) : user.username,
        phonenumber: phonenumber ?? user.phonenumber,
        address: address ?? user.address,
      });

      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).send(`Nu am putut actualiza profilul: ${err.message}`);
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await Users.findAll();
      if (users.length === 0)
        return res.status(404).send("Nu au fost găsite date pentru utilizatori.");
      else return res.status(200).send(users);
    } catch (err) {
      return res.status(500).send(`Nu am putut încărca utilizatorii: ${err}`);
    }
  },
  getUserById: async (req, res) => {
    try {
     const requestedId = parseInt(req.params.id);
     const loggedUserId = req.user.id;
     const role = req.user.role;

     if (role !== "Manager" && requestedId !== loggedUserId) {
       return res.status(403).send("Acces interzis.");
     }

     const user = await Users.findByPk(requestedId);

     if (!user) {
       return res.status(404).send("Utilizatorul nu a fost găsit.");
     }

     return res.status(200).json(user);
    } catch (err) {
      return res.status(500).send(`Nu am putut încărca utilizatorul: ${err}`);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const user = req.params.id;
      await Appointments.destroy({ where: { user_id: user } });
      await Adoption_history.destroy({ where: { adopter_id: user } });
      const deletedUsers = await Users.destroy({ where: { id: user } });
      if (deletedUsers === 0)
        return res.status(404).send("Utilizatorul pentru ștergere nu a fost găsit.");
      return res.status(200).send("Utilizatorul a fost șters.");
    } catch (err) {
      return res.status(500).send(`A apărut o eroare la ștergere: ${err}`);
    }
  },
};
