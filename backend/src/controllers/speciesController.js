import { Species } from "../models/index.js";

export const seedSpecies=async()=>{
   const speciesData = [{ name: "Dog" }, { name: "Cat" }];
   await Promise.all(
     speciesData.map((data) =>
       Species.findOrCreate({
         where: { name: data.name },
         defaults: data,
       })
     )
   );
}
export const controller = {
  getSpecies: async (req, res) => {
    try {
      const species = await Species.findAll();
      return res.status(200).json(species);
    } catch (error) {
      console.error("Error fetching species:", error);
      return res.status(500).send(`Nu am putut încărca speciile: ${error}`);
    }
  },
};
