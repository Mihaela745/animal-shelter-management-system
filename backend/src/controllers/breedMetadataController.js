import axios from "axios";
import { Breed_Metadata } from "../models/index.js";

const DOG_API_URL = process.env.DOG_BREED_API_URL;
const CAT_API_URL = process.env.CAT_BREED_API_URL;

export const seedBreddMetadata = async () => {
  try {
    const [dogResponse, catResponse] = await Promise.all([
      axios.get(DOG_API_URL, {
        headers: { "x-api-key": process.env.DOG_API_KEY },
      }),
      axios.get(CAT_API_URL, {
        headers: { "x-api-key": process.env.CAT_API_KEY },
      }),
    ]);
    const dogBreeds = dogResponse.data;
    const catBreeds = catResponse.data;

    const normalizeEnergy = (level) => {
      if (!level) return null;
      if (level <= 2) return "Low";
      if (level <= 4) return "Medium";
      return "High";
    };
    const normalizeSize = (weight) => {
      if (!weight) return null;
      const avg = parseInt(weight.metric?.split(" - ")[1] || weight.metric);
      if (avg < 10) return "Small";
      if (avg < 25) return "Medium";
      return "Large";
    };
    const allBreeds = [
      ...dogBreeds.map((breed) => ({
        species: "Dog",
        breed_name: breed.name,
        temperament: breed.temperament || null,
        energy_level: normalizeEnergy(breed.energy_level),
        size: normalizeSize(breed.weight),
        good_with_kids: breed.good_with_children ?? null,
        good_with_other_pets: breed.good_with_other_dogs ?? null,
        apartment_friendly: breed.adaptability >= 4 ? true : false,
        grooming_needs: normalizeEnergy(breed.grooming),
        life_expectancy: breed.life_span,
        description: breed.bred_for || breed.temperament || null,
      })),

      ...catBreeds.map((breed) => ({
        species: "Cat",
        breed_name: breed.name,
        temperament: breed.temperament || null,
        energy_level: normalizeEnergy(breed.energy_level),
        size: null,
        good_with_kids: breed.child_friendly ?? null,
        good_with_other_pets: breed.dog_friendly ?? null,
        apartment_friendly: breed.adaptability >= 4 ? true : false,
        grooming_needs: normalizeEnergy(breed.grooming),
        life_expectancy: breed.life_span,
        description: breed.description || null,
      })),
    ];
    for (const breed of allBreeds) {
      const exists = await Breed_Metadata.findOne({
        where: { breed_name: breed.breed_name },
      });

      if (!exists) {
        await Breed_Metadata.create(breed);
        console.log(` Seeded: ${breed.breed_name}`);
      }
    }
    console.log("Breed metadata seeding completed successfully.");
  } catch (err) {
    console.error("Full error:", err.response?.data || err);
  }
};
export const controller = {
  getBreedMetadataByName: async (req, res) => {
    try {
      const breed = decodeURIComponent(req.params.breed).trim();

      const metadata = await Breed_Metadata.findOne({
        where: { breed_name: breed },
      });

      if (!metadata) {
        return res.status(404).send("Datele despre rasă nu au fost găsite");
      }

      return res.status(200).json(metadata);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
  getBreedsBySpecies: async (req, res) => {
    try {
      const species = req.params.species;
      const breeds = await Breed_Metadata.findAll({
        where: { species },
        attributes: ["breed_name"],
        order: [["breed_name", "ASC"]],
      });
      return res.status(200).json(breeds.map((b) => b.breed_name));
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
};
