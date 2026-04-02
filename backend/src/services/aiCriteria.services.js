const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

function createInvalidPromptError(message = "INVALID_PROMPT") {
  const err = new Error(message);
  err.code = "INVALID_PROMPT";
  return err;
}

function isAllowedValue(value, allowedValues) {
  return value == null || allowedValues.includes(value);
}

function validateExtractedCriteria(criteria) {
  if (!criteria || typeof criteria !== "object" || Array.isArray(criteria)) {
    throw createInvalidPromptError();
  }

  if (
    !isAllowedValue(criteria.species, ["Dog", "Cat", "Other"]) ||
    !isAllowedValue(criteria.age_preference, [
      "Puppy/Kitten",
      "Young",
      "Adult",
      "Senior",
    ]) ||
    !isAllowedValue(criteria.gender_preference, ["Male", "Female"]) ||
    !isAllowedValue(criteria.activity_level, ["Low", "Medium", "High"]) ||
    !isAllowedValue(criteria.housing, [
      "Apartment",
      "House",
      "Yard",
      "NoPreference",
    ])
  ) {
    throw createInvalidPromptError();
  }
}

export async function extractCriteriaFromDescription(description) {
  if (!description || typeof description !== "string") {
    throw new Error("Description is required and must be a string.");
  }

  const prompt = `
Ești un asistent pentru o platformă de adopție animale.

Dacă descrierea utilizatorului NU este legată de adopția unui animal, returnează DOAR:
{"error": "NOT_ADOPTION_RELATED"}

Dacă este relevantă, extrage criteriile și returnează DOAR JSON valid cu schema de mai jos:
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

Returnează DOAR JSON, fără markdown, fără explicații.

Descriere utilizator: "${description}"
`;

  const resp = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Gemini API error: ${errText}`);
  }

  const data = await resp.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!raw) throw new Error("Gemini returned empty response.");

  const cleaned = raw
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error("RAW AI RESPONSE:", raw);
    throw new Error("Gemini returned invalid JSON");
  }

  if (parsed.error === "NOT_ADOPTION_RELATED") {
    const err = new Error("NOT_ADOPTION_RELATED");
    err.code = "NOT_ADOPTION_RELATED";
    throw err;
  }

  validateExtractedCriteria(parsed);

  return parsed;
}

export async function rankAnimalsWithAI(criteria, animals) {
  const prompt = `
Ești un consilier de adopție animale.

Criteriile utilizatorului:
${JSON.stringify(criteria)}

Animale candidate:
${JSON.stringify(animals, null, 2)}

Reguli:
- Rankuiește animalele de la CEL MAI POTRIVIT (1) la CEL MAI PUȚIN POTRIVIT (N).
- Fiecare rank TREBUIE să fie unic.
- NU atribui același rank la mai multe animale.
- Ia în considerare activity_level, housing, good_with_kids și temperament.
- Folosește EXACT obiectele din lista de candidate.
- NU modifica structura lor.
- Returnează DOAR JSON valid.
- NU folosi markdown.
- NU folosi \`\`\`json.
- Explicațiile trebuie scrise în limba română.

Returnează în acest format:

{
  "ranked_results": [
    {
      "animal": { obiectul exact din lista de candidate },
      "rank": număr,
      "explanation": "explicație scurtă în română"
    }
  ]
}
`;

  const resp = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Gemini ranking error: ${errText}`);
  }

  const data = await resp.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!raw) throw new Error("Gemini returned empty ranking.");

  const cleaned = raw
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error("RAW AI RANK RESPONSE:", raw);
    throw new Error("Gemini ranking returned invalid JSON");
  }

  return parsed;
}
