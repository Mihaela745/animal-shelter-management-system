const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
export async function extractCriteriaFromDescription(description) {
  if (!description || typeof description !== "string") {
    throw new Error("Description is required and must be a string.");
  }
  const prompt = `
Return ONLY valid JSON (no markdown).

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

User description:
${description}
`;

  const resp = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Gemini API error: ${errText}`);
  }

  const data = await resp.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

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

  return parsed;
}

export async function rankAnimalsWithAI(criteria, animals) {
  const prompt = `
You are an adoption advisor.

User criteria:
${JSON.stringify(criteria)}

Candidate animals:
${JSON.stringify(animals, null, 2)}

Rules:
- Rank animals from BEST (1) to WORST (N).
- Each rank MUST be unique.
- Do NOT assign the same rank to multiple animals.
- Consider activity_level, housing, good_with_kids and temperament carefully.
- Use EXACTLY the animal objects provided.
- Do NOT modify their structure.
- Return ONLY raw JSON.
- Do NOT use markdown.
- Do NOT use \`\`\`json.

Return in this format:

{
  "ranked_results": [
    {
      "animal": { exact object from Candidate animals },
      "rank": number,
      "explanation": "short explanation"
    }
  ]
}
`;

  const resp = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
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
