const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`;

const ALLOWED_VALUES = {
  species: ["Dog", "Cat", "Other"],
  age_preference: ["Puppy/Kitten", "Young", "Adult", "Senior"],
  gender_preference: ["Male", "Female"],
  activity_level: ["Low", "Medium", "High"],
  housing: ["Apartment", "House", "Yard", "NoPreference"],
};

function createError(code, message = code) {
  const err = new Error(message);
  err.code = code;
  return err;
}

function isAllowedValue(value, allowedValues) {
  return value == null || allowedValues.includes(value);
}

function sanitizeCriteria(criteria = {}) {
  const sanitized = {
    species: null,
    age_preference: null,
    gender_preference: null,
    breed_preference: null,
    temperament: [],
    good_with_kids: null,
    good_with_other_pets: null,
    activity_level: null,
    housing: null,
    special_needs_ok: null,
  };

  for (const [key, values] of Object.entries(ALLOWED_VALUES)) {
    sanitized[key] = values.includes(criteria[key]) ? criteria[key] : null;
  }

  sanitized.breed_preference =
    typeof criteria.breed_preference === "string" &&
    criteria.breed_preference.trim()
      ? criteria.breed_preference.trim()
      : null;

  sanitized.temperament = Array.isArray(criteria.temperament)
    ? criteria.temperament.filter((value) =>
        [
          "Calm",
          "Playful",
          "Protective",
          "Independent",
          "Friendly",
          "Shy",
        ].includes(value),
      )
    : [];

  for (const key of [
    "good_with_kids",
    "good_with_other_pets",
    "special_needs_ok",
  ]) {
    sanitized[key] =
      criteria[key] === true || criteria[key] === false ? criteria[key] : null;
  }

  return sanitized;
}

function validateExtractedCriteria(criteria) {
  if (!criteria || typeof criteria !== "object" || Array.isArray(criteria)) {
    throw createError("INVALID_PROMPT");
  }

  if (
    !isAllowedValue(criteria.species, ALLOWED_VALUES.species) ||
    !isAllowedValue(criteria.age_preference, ALLOWED_VALUES.age_preference) ||
    !isAllowedValue(
      criteria.gender_preference,
      ALLOWED_VALUES.gender_preference,
    ) ||
    !isAllowedValue(criteria.activity_level, ALLOWED_VALUES.activity_level) ||
    !isAllowedValue(criteria.housing, ALLOWED_VALUES.housing)
  ) {
    throw createError("INVALID_PROMPT");
  }
}

function extractJsonPayload(rawText) {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Gemini returned empty response.");
  }

  const cleaned = rawText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    throw new Error("Gemini returned invalid JSON");
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
}

async function callGemini(prompt, errorPrefix) {
  const resp = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`${errorPrefix}: ${errText}`);
  }

  const data = await resp.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  return JSON.parse(extractJsonPayload(raw));
}

export async function extractCriteriaFromDescription(description) {
  if (!description || typeof description !== "string") {
    throw new Error("Description is required and must be a string.");
  }

  const prompt = `
Esti un asistent pentru o platforma de adoptie animale.

Daca descrierea utilizatorului NU este legata de adoptia unui animal, returneaza DOAR:
{"error": "NOT_ADOPTION_RELATED"}

Daca este relevanta, extrage criteriile si returneaza DOAR JSON valid cu schema de mai jos:
{
  "species": "Dog|Cat|Other|null",
  "age_preference": "Puppy/Kitten|Young|Adult|Senior|null",
  "gender_preference": "Male|Female|null",
  "breed_preference": "string|null",
  "temperament": ["Calm","Playful","Protective","Independent","Friendly","Shy"],
  "good_with_kids": true|false|null,
  "good_with_other_pets": true|false|null,
  "activity_level": "Low|Medium|High|null",
  "housing": "Apartment|House|Yard|NoPreference|null",
  "special_needs_ok": true|false|null
}

Returneaza DOAR JSON, fara markdown si fara explicatii.

Descriere utilizator: "${description}"
`;

  let parsed;
  try {
    parsed = await callGemini(prompt, "Gemini API error");
  } catch (error) {
    console.error("AI criteria extraction failed:", error.message);
    throw createError("INVALID_PROMPT", error.message);
  }

  if (parsed?.error === "NOT_ADOPTION_RELATED") {
    throw createError("NOT_ADOPTION_RELATED");
  }

  validateExtractedCriteria(parsed);
  return sanitizeCriteria(parsed);
}

function validateRankedResultsPayload(payload) {
  if (
    !payload ||
    typeof payload !== "object" ||
    !Array.isArray(payload.ranked_results)
  ) {
    throw new Error("Gemini ranking returned invalid JSON");
  }

  return payload;
}

export async function rankAnimalsWithAI(criteria, animals) {
  const prompt = `
Esti un consilier de adoptie animale.

Criteriile utilizatorului:
${JSON.stringify(criteria)}

Animale candidate:
${JSON.stringify(animals, null, 2)}

Reguli:
- Rankuieste animalele de la CEL MAI POTRIVIT (1) la CEL MAI PUTIN POTRIVIT (N).
- Fiecare rank trebuie sa fie unic.
- Nu atribui acelasi rank la mai multe animale.
- Ia in considerare activity_level, housing, good_with_kids si temperament.
- Foloseste EXACT obiectele din lista de candidate.
- Nu modifica structura lor.
- Returneaza DOAR JSON valid.
- Nu folosi markdown.
- Explicatiile trebuie scrise in limba romana.

Returneaza in acest format:
{
  "ranked_results": [
    {
      "animal": { obiectul exact din lista de candidate },
      "rank": numar,
      "explanation": "explicatie scurta in romana"
    }
  ]
}
`;

  try {
    const parsed = await callGemini(prompt, "Gemini ranking error");
    return validateRankedResultsPayload(parsed);
  } catch (error) {
    console.error("AI ranking failed:", error.message);
    throw error;
  }
}
