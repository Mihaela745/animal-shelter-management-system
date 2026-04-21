import {
  extractCriteriaFromDescription,
  rankAnimalsWithAI,
} from "../services/aiCriteria.services.js";
import { Animals, Species, Breed_Metadata } from "../models/index.js";

function calculateAnimalScore(criteria, animal, breedMap) {
  let score = 0;

  if (criteria.species && animal.Species?.name === criteria.species) {
    score += 3;
  }

  if (criteria.age_preference && animal.age != null) {
    if (criteria.age_preference === "Puppy/Kitten" && animal.age <= 1) score += 2;
    if (criteria.age_preference === "Young" && animal.age > 1 && animal.age <= 3) {
      score += 2;
    }
    if (criteria.age_preference === "Adult" && animal.age > 3 && animal.age <= 8) {
      score += 2;
    }
    if (criteria.age_preference === "Senior" && animal.age > 8) score += 2;
  }

  if (criteria.gender_preference && animal.gender === criteria.gender_preference) {
    score += 1;
  }

  const breedData =
    animal.breed && animal.breed.toLowerCase() !== "maidanez"
      ? breedMap[animal.breed]
      : null;

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
      criteria.good_with_other_pets != null &&
      breedData.good_with_other_pets === criteria.good_with_other_pets
    ) {
      score += 2;
    }
    if (
      criteria.housing === "Apartment" &&
      breedData.apartment_friendly === true
    ) {
      score += 2;
    }
  }

  if (
    criteria.breed_preference &&
    animal.breed &&
    animal.breed.toLowerCase().includes(criteria.breed_preference.toLowerCase())
  ) {
    score += 3;
  }

  return score;
}

function buildAiInput(animal, score, breedMap) {
  const breedData =
    animal.breed && animal.breed.toLowerCase() !== "maidanez"
      ? breedMap[animal.breed]
      : null;

  return {
    id: animal.id,
    name: animal.name,
    species: animal.Species?.name,
    breed: animal.breed,
    age: animal.age,
    gender: animal.gender,
    energy_level: breedData?.energy_level || null,
    good_with_kids: breedData?.good_with_kids || null,
    good_with_other_pets: breedData?.good_with_other_pets || null,
    apartment_friendly: breedData?.apartment_friendly || null,
    score,
  };
}

function buildResultPayload(animal, rank, explanation) {
  return {
    id: animal.id,
    name: animal.name,
    age: animal.age,
    gender: animal.gender,
    breed: animal.breed,
    image_url: animal.image_url,
    status: animal.status,
    species: animal.Species?.name,
    rank,
    explanation,
  };
}

function buildFallbackRanking(topResults) {
  return topResults.map((item, index) =>
    buildResultPayload(
      item.animal,
      index + 1,
      "Rezultatul a fost ordonat pe baza potrivirii criteriilor extrase.",
    ),
  );
}

export const controller = {
  searchAnimal: async (req, res) => {
    try {
      const { description } = req.body;
      if (!description) {
        return res.status(400).json({ message: "Description is required." });
      }

      const criteria = await extractCriteriaFromDescription(description);

      const speciesInclude = {
        model: Species,
        ...(criteria.species && criteria.species !== "Other"
          ? { where: { name: criteria.species }, required: true }
          : {}),
      };

      const [animals, breeds] = await Promise.all([
        Animals.findAll({
          where: { status: "Available" },
          include: [speciesInclude],
        }),
        Breed_Metadata.findAll(),
      ]);

      if (!animals.length) {
        return res.status(200).json({
          criteria,
          results: [],
        });
      }

      const breedMap = {};
      breeds.forEach((breed) => {
        breedMap[breed.breed_name] = breed;
      });

      const scoredAnimals = animals.map((animal) => {
        const score = calculateAnimalScore(criteria, animal, breedMap);
        return { animal, score };
      });

      scoredAnimals.sort((a, b) => b.score - a.score);
      const topResults = scoredAnimals.slice(0, 5);

      if (!topResults.length) {
        return res.status(200).json({
          criteria,
          results: [],
        });
      }

      const aiInput = topResults.map((item) =>
        buildAiInput(item.animal, item.score, breedMap),
      );

      const topAnimalMap = {};
      topResults.forEach((item) => {
        topAnimalMap[String(item.animal.id)] = item.animal;
      });

      let results;
      try {
        const aiRanking = await rankAnimalsWithAI(criteria, aiInput);
        results = aiRanking.ranked_results
          .map((rankedItem, index) => {
            const rankedId = String(rankedItem?.animal?.id ?? rankedItem?.id ?? "");
            const fullAnimal = topAnimalMap[rankedId];
            if (!fullAnimal) return null;

            return buildResultPayload(
              fullAnimal,
              rankedItem.rank ?? index + 1,
              rankedItem.explanation ||
                "Rezultatul a fost generat de motorul AI.",
            );
          })
          .filter(Boolean);
      } catch (rankingError) {
        results = buildFallbackRanking(topResults);
      }

      if (!results.length) {
        results = buildFallbackRanking(topResults);
      }

      return res.status(200).json({
        criteria,
        results,
      });
    } catch (err) {
      if (err.code === "NOT_ADOPTION_RELATED") {
        return res.status(400).json({
          message:
            "Hmm, se pare ca descrierea ta nu este legata de adoptia unui animal. Incearca sa descrii ce fel de companion cauti!",
        });
      }

      if (err.code === "INVALID_PROMPT") {
        return res.status(400).json({
          message:
            "Promptul oferit nu este valid pentru cautarea AI. Incearca sa descrii mai clar ce fel de animal doresti sa adopti.",
        });
      }

      if (err.code === "AI_TEMPORARILY_UNAVAILABLE") {
        return res.status(503).json({
          message:
            "Serviciul AI este temporar supraincarcat. Incearca din nou peste cateva secunde.",
        });
      }

      return res.status(500).send(err.message || "AI search failed.");
    }
  },
};
