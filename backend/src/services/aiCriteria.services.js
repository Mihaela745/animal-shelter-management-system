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
}

function extractJsonPayload(rawText) {
  if (!rawText || typeof rawText !== "string") {
    throw createError(
      "AI_TEMPORARILY_UNAVAILABLE",
      "Gemini a returnat un răspuns gol.",
    );
  }

  const cleaned = rawText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    throw createError("AI_TEMPORARILY_UNAVAILABLE", "Gemini a returnat un JSON invalid");
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
}

const RETRYABLE_STATUS_CODES = new Set([429, 503]);
const MAX_GEMINI_ATTEMPTS = 3;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function callGemini(prompt, errorPrefix, attempt = 1) {
  let resp;
  try {
    resp = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });
  } catch (networkError) {
    if (attempt < MAX_GEMINI_ATTEMPTS) {
      await sleep(400 * attempt);
      return callGemini(prompt, errorPrefix, attempt + 1);
    }
    throw createError(
      "AI_TEMPORARILY_UNAVAILABLE",
      `${errorPrefix}: ${networkError.message}`,
    );
  }

  if (!resp.ok) {
    const errText = await resp.text();

    if (RETRYABLE_STATUS_CODES.has(resp.status) && attempt < MAX_GEMINI_ATTEMPTS) {
      await sleep(400 * attempt);
      return callGemini(prompt, errorPrefix, attempt + 1);
    }

    throw createError("AI_TEMPORARILY_UNAVAILABLE", `${errorPrefix}: ${errText}`);
  }

  const data = await resp.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  try {
    return JSON.parse(extractJsonPayload(raw));
  } catch (parseError) {
    if (parseError.code) {
      throw parseError;
    }
    throw createError(
      "AI_TEMPORARILY_UNAVAILABLE",
      `Nu am putut interpreta răspunsul de la Gemini: ${parseError.message}`,
    );
  }
}

export async function extractCriteriaFromDescription(description) {
  if (!description || typeof description !== "string") {
    throw new Error("Descrierea este obligatorie și trebuie să fie un text.");
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
    throw error.code ? error : createError("AI_TEMPORARILY_UNAVAILABLE", error.message);
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
    throw new Error("Clasificarea Gemini a returnat un JSON invalid");
  }

  return payload;
}

export async function rankAnimalsWithAI(criteria, animals, description) {
  const prompt = `
Esti un consilier de adoptie animale.

Descrierea originala a utilizatorului (foloseste-o ca sursa principala de adevar):
"${description || ""}"

Criteriile structurate extrase din descriere (pot fi incomplete - unele trasaturi mentionate
de utilizator, cum ar fi "inteligent", "loial", "curajos" etc., nu se incadreaza in schema fixa
de mai jos si NU apar aici, desi utilizatorul le-a cerut explicit):
${JSON.stringify(criteria)}

Animale candidate (fiecare are campul "temperament" cu descrierea libera a rasei):
${JSON.stringify(animals, null, 2)}

Reguli:
- Rankuieste animalele de la CEL MAI POTRIVIT (1) la CEL MAI PUTIN POTRIVIT (N).
- Fiecare rank trebuie sa fie unic.
- Nu atribui acelasi rank la mai multe animale.
- Ia in considerare activity_level, housing, good_with_kids si temperament.
- IMPORTANT: compara si cuvintele/trasaturile EXACTE din descrierea originala a utilizatorului
  (ex: inteligent, loial, curajos, bland) cu campul "temperament" al fiecarui animal, chiar daca
  acele trasaturi nu apar in criteriile structurate de mai sus.
- Foloseste EXACT obiectele din lista de candidate.
- Nu modifica structura lor.
- Returneaza DOAR JSON valid.
- Nu folosi markdown.
- Explicatiile trebuie sa mentioneze concret trasaturile din descrierea utilizatorului care se
  regasesc (sau nu) in temperamentul animalului, scrise in limba romana.

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
