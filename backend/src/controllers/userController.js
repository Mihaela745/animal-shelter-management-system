import { Users } from "../models/Users.js";

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
      const userId = req.params.id;
      const user = await Users.findByPk(userId);
      if (!user) return res.status(404).send(`Couldn't find the user`);
      return res.status(200).send(user);
    } catch (err) {
      return res.status(500).send(`Couldn't fetch user: ${err}`);
    }
  },
  updateUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const updateData = req.body;
      const [updatedRows] = await Users.update(updateData, {
        where: {
          id: userId,
        },
      });
      if (updatedRows === 0) return res.status(400).send(`No rows updated!`);
      const updatedUser = await Users.findByPk({ where: { id: userId } });
      return res.status(200).send(updatedUser);
    } catch (err) {
      return res.status(500).send(`Could'n change no data: ${err}`);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const user = req.params.id;
      const deletedUsers = await Users.destroy({ where: { id: user } });
      if (deletedUsers === 0)
        return res.status(404).send(`User not found to be deleted!`);
      return res.status(200).send(`User has been deleted!`);
    } catch (err) {
      return res.status(500).send(`Error at deletion: ${err}`);
    }
  },
};
