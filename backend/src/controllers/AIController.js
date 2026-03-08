import { extractCriteriaFromDescription } from "../services/aiCriteria.services.js";
import { Animals, Species, Breed_Metadata } from "../models/index.js";
import { rankAnimalsWithAI } from "../services/aiCriteria.services.js";
export const controller = {
  searchAnimal: async (req, res) => {
    try {
      const { description } = req.body;
      if (!description) {
        return res.status(400).json({ message: "Description is required." });
      }

      const criteria = await extractCriteriaFromDescription(description);
      const whereClause = { status: "Available" };

      if (criteria.species) {
        whereClause["$Species.name$"] = criteria.species;
      }

      const animals = await Animals.findAll({
        where: whereClause,
        include: [{ model: Species }],
      });
      const scoredAnimals = [];
      const breeds = await Breed_Metadata.findAll();
      const breedMap = {};
      breeds.forEach((b) => (breedMap[b.breed_name] = b));
      for (const animal of animals) {
        let score = 0;
        if (criteria.species && animal.Species?.name == criteria.species) {
          score += 3;
        }
        if (criteria.age_preference && animal.age != null) {
          if (criteria.age_preference === "Puppy/Kitten" && animal.age <= 1)
            score += 2;
          if (
            criteria.age_preference === "Young" &&
            animal.age > 1 &&
            animal.age <= 3
          )
            score += 2;
          if (
            criteria.age_preference === "Adult" &&
            animal.age > 3 &&
            animal.age <= 8
          )
            score += 2;
          if (criteria.age_preference === "Senior" && animal.age > 8)
            score += 2;
        }
        if (
          criteria.gender_preference &&
          animal.gender === criteria.gender_preference
        ) {
          score += 1;
        }
        const breedData =
          animal.breed && animal.breed.toLowerCase() !== "maidanez"
            ? breedMap[animal.breed]
            : null;
        if (breedData != null) {
          const breeds = await Breed_Metadata.findAll();
          const breedMap = {};
          breeds.forEach((b) => (breedMap[b.breed_name] = b));
          const breedData = breedMap[animal.breed];
          if (breedData) {
            if (
              criteria.activity_level &&
              breedData.energy_level === criteria.activity_level
            ) {
              score += 2;
            }

            if (
              criteria.good_with_kids != null &&
              breedData.good_with_kids === criteria.good_with_kids
            ) {
              score += 3;
            }

            if (
              criteria.housing === "Apartment" &&
              breedData.apartment_friendly === true
            ) {
              score += 2;
            }
          }
        }

        scoredAnimals.push({
          animal,
          score,
        });
      }
      scoredAnimals.sort((a, b) => b.score - a.score);
      const topResults = scoredAnimals.slice(0, 5);
      const aiInput = topResults.map((item) => {
        const breedData =
          item.animal.breed && item.animal.breed.toLowerCase() !== "maidanez"
            ? breedMap[item.animal.breed]
            : null;

        return {
          id: item.animal.id,
          name: item.animal.name,
          species: item.animal.Species?.name,
          breed: item.animal.breed,
          age: item.animal.age,
          gender: item.animal.gender,
          energy_level: breedData?.energy_level || null,
          good_with_kids: breedData?.good_with_kids || null,
          apartment_friendly: breedData?.apartment_friendly || null,
          score: item.score,
        };
      });

      const aiRanking = await rankAnimalsWithAI(criteria, aiInput);
      const animalMap = {};
      animals.forEach((a) => {
        animalMap[String(a.id)] = a;
      });

      const fullResults = aiRanking.ranked_results
        .map((r) => {
          const rankedId = String(r.animal?.id ?? r.id);
          const fullAnimal = animalMap[rankedId];
          if (!fullAnimal) return null;
          return {
            id: fullAnimal.id,
            name: fullAnimal.name,
            age: fullAnimal.age,
            gender: fullAnimal.gender,
            breed: fullAnimal.breed,
            image_url: fullAnimal.image_url,
            status: fullAnimal.status,
            species: fullAnimal.Species?.name,
            rank: r.rank,
            explanation: r.explanation,
          };
        })
        .filter(Boolean);

      return res.status(200).json({
        criteria,
        results: fullResults,
      });
    } catch (err) {
      return res.status(500).send(`${err.message}`);
    }
  },
};
