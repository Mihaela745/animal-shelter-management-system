import { Position } from "../models/Position.js";

export const seedPositions=async()=>{
   const positionsData = [
     {
       title: "Vet",
       description:
         "Responsible for animal healthcare, treatments, and check-ups.",
     },
     {
       title: "Manager",
       description:
         "Oversees the entire shelter; manages staff and the adoption process.",
     },
     {
       title: "Caretaker",
       description: "Feeds, cleans, and provides daily care for the animals.",
     },
   ];
   await Promise.all(
    positionsData.map(data=>{
      return Position.findOrCreate({
        where:{title:data.title},
        defaults:data
      })
    })
   );
};

export const controller = {
  getAllPositions: async (req, res) => {
    try {
      const positions = await Position.findAll();
      res
        .status(200)
        .send(positions);
    } catch (error) {
      return res.status(500).send(`Error while fetching positions:${error}`);
    }
  },
};
