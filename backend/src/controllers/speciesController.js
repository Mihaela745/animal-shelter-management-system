import { Species } from "../models/Species.js";

export const seedSpecies=async()=>{
   const speciesData = [{ name: "Dog" }, { name: "Cat" }];
   await Promise.all(
     speciesData.map((data) =>
       Species.findOrCreate({
         where: { name: data.name },
         default: data,
       })
     )
   );
}
export const controller = {
  getSpecies: async (req, res) => {
    try {
      const species = await Species.findAll();
      return res.status(200).send(species);
    } catch (error) {
      console.error("Error fetching species: ", error);
      return res.status(500).send(`Failed to get species: ${error}`);
    }
  },
};
