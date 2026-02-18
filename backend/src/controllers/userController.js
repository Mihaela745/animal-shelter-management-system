import { Users, Staff } from "../models/index.js";
import { Appointments } from "../models/Appointments.js";
import { Adoption_history } from "../models/Adoption_history.js";
import bcrypt from "bcrypt";

export const seedManager = async () => {
  const existingManager = await Users.findOne({ where: { role: "Manager" } });
  if (!existingManager) {
    const hashedPassword = await bcrypt.hash("Admin123!", 10);
    const newUser=await Users.create({
      username: "Manager_Shelter",
      email: "mihaelaneacsu745@gmail.com",
      password: hashedPassword,
      phonenumber: "0700000000",
      role: "Manager",
    });
    await Staff.create({
      name: "Manager_Shelter",
      email: newUser.email,
      phonenumber: newUser.phonenumber,
      position_id: managerPosition.id,
      user_id: newUser.id,
    });

    console.log("Manager seeded successfully!");
  }
};

export const controller = {
  getAllUsers: async (req, res) => {
    try {
      const users = await Users.findAll();
      if (users.length === 0)
        return res.status(404).send("No data found for users!");
      else return res.status(200).send(users);
    } catch (err) {
      return res.status(500).send(`Couldn't fetch users: ${err}`);
    }
  },
  getUserById: async (req, res) => {
    try {
     const requestedId = parseInt(req.params.id);
     const loggedUserId = req.user.id;
     const role = req.user.role;

     if (role !== "Manager" && requestedId !== loggedUserId) {
       return res.status(403).send("Access denied");
     }

     const user = await Users.findByPk(requestedId);

     if (!user) {
       return res.status(404).send("User not found");
     }

     return res.status(200).json(user);
    } catch (err) {
      return res.status(500).send(`Couldn't fetch user: ${err}`);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const user = req.params.id;
      await Appointments.destroy({ where: { user_id: user } });
      await Adoption_history.destroy({ where: { adopter_id: user } });
      const deletedUsers = await Users.destroy({ where: { id: user } });
      if (deletedUsers === 0)
        return res.status(404).send(`User not found to be deleted!`);
      return res.status(200).send(`User has been deleted!`);
    } catch (err) {
      return res.status(500).send(`Error at deletion: ${err}`);
    }
  },
};
