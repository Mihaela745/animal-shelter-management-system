import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
  alpha,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAnimal } from "../../../features/animals/animalsSlice";
import { useNavigate } from "react-router-dom";
import {
  fetchBreedsBySpecies,
  clearBreedMetadata,
} from "../../../features/breedMetadata/breedMetadata";
import { fetchBoxes } from "../../../features/boxes/boxesSlice";
import { fetchSpecies } from "../../../features/species/speciesSlice";

const RED = "#a91111";
const RED_DARK = "#8a0d0d";
const RED_LIGHT = "#fff0f0";

const Field = ({ label, children, sx = {} }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, ...sx }}>
    <Typography
      sx={{
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "0.1em",
        color: "#999",
        textTransform: "uppercase",
      }}
    >
      {label}
    </Typography>
    {children}
  </Box>
);

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#fafafa",
    fontSize: "0.92rem",
    "& fieldset": { borderColor: "#ebebeb" },
    "&:hover fieldset": { borderColor: "#ccc" },
    "&.Mui-focused fieldset": { borderColor: RED, borderWidth: "1.5px" },
    "&.Mui-disabled": { backgroundColor: "#f5f5f5" },
  },
  "& .MuiInputLabel-root": { display: "none" },
  "& .MuiInputBase-input": { py: "10px", px: "14px" },
};

export default function AddAnimalPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { breeds, breedsLoading } = useSelector((s) => s.breedMetadata);
  const { boxes } = useSelector((s) => s.boxes);
  const { species } = useSelector((s) => s.species);
  const { loading } = useSelector((s) => s.animals);

  const [formData, setFormData] = useState({
    name: "",
    species_id: "",
    breed: "",
    age: "",
    date_added: new Date().toISOString().split("T")[0],
    gender: "",
    weight: "",
    box_id: "",
    image: null,
  });
  const [step, setStep] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchBoxes());
    dispatch(fetchSpecies());
  }, [dispatch]);

  useEffect(() => {
    const sel = species.find(
      (s) => Number(s.id) === Number(formData.species_id),
    );
    if (sel) dispatch(fetchBreedsBySpecies(sel.name));
    return () => {
      dispatch(clearBreedMetadata());
    };
  }, [dispatch, formData.species_id, species]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "species_id" || name === "box_id" ? Number(value) : value,
      ...(name === "species_id" ? { breed: "", box_id: "" } : {}),
    }));
  };

  const handleImage = (e) =>
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const result = await dispatch(createAnimal(formData));

    if (result.payload?.id) {
      navigate(`/manager/animals/${result.payload.id}`);
    } else {
      setError(
        typeof result.payload === "string"
          ? result.payload
          : "A apărut o eroare la crearea animalului. Încearcă din nou.",
      );
    }
  };

  const filteredBoxes = formData.species_id
    ? boxes.filter((b) => Number(b.species_id) === Number(formData.species_id))
    : [];

  const speciesEmoji = { Dog: "🐶", Cat: "🐱" };

  const steps = ["Identitate", "Detalii", "Plasament"];

  return (
    <Box
      sx={{
        minHeight: "100%",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        p: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 560 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                backgroundColor: RED,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ fontSize: "1.1rem" }}>🐾</Typography>
            </Box>
            <Typography
              sx={{
                fontSize: "1.4rem",
                fontWeight: 800,
                color: "#1a1a1a",
                letterSpacing: "-0.5px",
              }}
            >
              Animal nou
            </Typography>
          </Box>
          <Typography sx={{ fontSize: "0.85rem", color: "#aaa", ml: "52px" }}>
            Completează informațiile pentru a adăuga un animal în adăpost
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mb: 4 }}>
          {steps.map((s, i) => (
            <Box
              key={s}
              onClick={() => setStep(i)}
              sx={{
                flex: 1,
                py: 1,
                px: 1.5,
                borderRadius: "10px",
                cursor: "pointer",
                border: "1.5px solid",
                borderColor: step === i ? RED : "#ebebeb",
                backgroundColor: step === i ? RED_LIGHT : "white",
                transition: "all 0.2s",
                "&:hover": { borderColor: step === i ? RED : "#ccc" },
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: step === i ? RED : "#bbb",
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              >
                {i + 1}. {s}
              </Typography>
            </Box>
          ))}
        </Box>

        {error && (
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{ mb: 2, borderRadius: "10px" }}
          >
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            backgroundColor: "white",
            borderRadius: "20px",
            border: "1.5px solid #ebebeb",
            boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          {step === 0 && (
            <Box sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                <Field label="Nume animal">
                  <TextField
                    placeholder="ex: Rex, Miau..."
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    sx={fieldSx}
                  />
                </Field>

                <Field label="Specie">
                  <TextField
                    select
                    name="species_id"
                    value={formData.species_id}
                    onChange={handleChange}
                    required
                    sx={fieldSx}
                  >
                    <MenuItem value="" disabled>
                      <em style={{ color: "#bbb" }}>Alege specia</em>
                    </MenuItem>
                    {species.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {speciesEmoji[s.name] || "🐾"}&nbsp;&nbsp;{s.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Field>

                <Field label="Rasă">
                  <TextField
                    select
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    disabled={!formData.species_id || breedsLoading}
                    sx={fieldSx}
                  >
                    <MenuItem value="" disabled>
                      <em style={{ color: "#bbb" }}>
                        {breedsLoading ? "Se încarcă..." : "Alege rasa"}
                      </em>
                    </MenuItem>
                    <MenuItem value="Maidanez">🐕 Maidanez</MenuItem>
                    {breeds.map((b) => (
                      <MenuItem key={b} value={b}>
                        {b}
                      </MenuItem>
                    ))}
                  </TextField>
                </Field>

                <Field label="Gen">
                  <TextField
                    select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    sx={fieldSx}
                  >
                    <MenuItem value="" disabled>
                      <em style={{ color: "#bbb" }}>Alege genul</em>
                    </MenuItem>
                    <MenuItem value="Male">♂ Mascul</MenuItem>
                    <MenuItem value="Female">♀ Femelă</MenuItem>
                  </TextField>
                </Field>
              </Stack>
            </Box>
          )}

          {step === 1 && (
            <Box sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  <Field label="Vârstă (ani)">
                    <TextField
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="0"
                      sx={fieldSx}
                      inputProps={{ min: 0 }}
                    />
                  </Field>
                  <Field label="Greutate (kg)">
                    <TextField
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="0"
                      sx={fieldSx}
                      inputProps={{ min: 0 }}
                    />
                  </Field>
                </Box>

                <Field label="Data adaugarii">
                  <TextField
                    type="date"
                    name="date_added"
                    value={formData.date_added}
                    onChange={handleChange}
                    sx={fieldSx}
                    InputLabelProps={{ shrink: true }}
                  />
                </Field>

                <Field label="Fotografie">
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{
                      border: "2px dashed",
                      borderColor: formData.image ? RED : "#e0e0e0",
                      borderRadius: "10px",
                      backgroundColor: formData.image ? RED_LIGHT : "#fafafa",
                      color: formData.image ? RED : "#aaa",
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      py: 1.5,
                      "&:hover": {
                        border: "2px dashed",
                        borderColor: RED,
                        backgroundColor: RED_LIGHT,
                        color: RED,
                      },
                    }}
                  >
                    {formData.image
                      ? `📎 ${formData.image.name}`
                      : "📷  Alege fotografie"}
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                    />
                  </Button>
                </Field>
              </Stack>
            </Box>
          )}

          {step === 2 && (
            <Box sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                {!formData.species_id ? (
                  <Box
                    sx={{
                      py: 4,
                      textAlign: "center",
                      backgroundColor: "#fafafa",
                      borderRadius: "12px",
                      border: "1.5px dashed #e0e0e0",
                    }}
                  >
                    <Typography sx={{ fontSize: "1.8rem", mb: 1 }}>
                      🐾
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        color: "#bbb",
                        fontWeight: 600,
                      }}
                    >
                      Selectează mai întâi o specie
                    </Typography>
                  </Box>
                ) : (
                  <Field
                    label={`Boxă disponibilă (${filteredBoxes.length} opțiuni)`}
                  >
                    <TextField
                      select
                      name="box_id"
                      value={formData.box_id}
                      onChange={handleChange}
                      required
                      sx={fieldSx}
                    >
                      <MenuItem value="" disabled>
                        <em style={{ color: "#bbb" }}>Alege boxa</em>
                      </MenuItem>
                      {filteredBoxes.map((box) => (
                        <MenuItem
                          key={box.id}
                          value={box.id}
                          disabled={box.current_occupancy >= box.capacity}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Typography fontWeight={600} fontSize="0.88rem">
                              {box.box_number}
                            </Typography>
                            <Box
                              sx={{
                                px: 1,
                                py: 0.2,
                                borderRadius: "6px",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                backgroundColor:
                                  box.current_occupancy >= box.capacity
                                    ? "#ffebee"
                                    : "#e8f5e9",
                                color:
                                  box.current_occupancy >= box.capacity
                                    ? "#c62828"
                                    : "#2e7d32",
                              }}
                            >
                              {box.current_occupancy}/{box.capacity}
                              {box.current_occupancy >= box.capacity
                                ? " plin"
                                : " locuri"}
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Field>
                )}
              </Stack>
            </Box>
          )}

          <Box
            sx={{
              px: 3,
              py: 2,
              borderTop: "1.5px solid #f5f5f5",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#fafafa",
            }}
          >
            <Button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              sx={{
                color: "#999",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                "&:hover": { color: "#555", backgroundColor: "transparent" },
                visibility: step === 0 ? "hidden" : "visible",
              }}
            >
              ← Înapoi
            </Button>

            {step < 2 ? (
              <Button
                onClick={() => setStep((s) => Math.min(2, s + 1))}
                sx={{
                  backgroundColor: RED,
                  color: "white",
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 700,
                  px: 3,
                  py: 1,
                  fontSize: "0.85rem",
                  "&:hover": { backgroundColor: RED_DARK },
                }}
              >
                Continuă →
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!formData.box_id || loading}
                sx={{
                  backgroundColor: RED,
                  color: "white",
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 700,
                  px: 3,
                  py: 1,
                  fontSize: "0.85rem",
                  "&:hover": {
                    backgroundColor: RED_DARK,
                    boxShadow: "0 4px 16px rgba(169,17,17,0.3)",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#f5f5f5",
                    color: "#ccc",
                  },
                }}
              >
                {loading ? "Se salvează..." : "Creează animal ✓"}
              </Button>
            )}
          </Box>
        </Box>
        <Box sx={{ mt: 2, px: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
          {[
            formData.name && { label: formData.name },
            formData.species_id && {
              label: species.find((s) => s.id === formData.species_id)?.name,
            },
            formData.breed && { label: formData.breed },
            formData.gender && {
              label: formData.gender === "Male" ? "Mascul" : "Femelă",
            },
            formData.age && { label: `${formData.age} ani` },
            formData.date_added && {
              label: `Adaugat pe ${new Date(`${formData.date_added}T00:00:00`).toLocaleDateString("ro-RO")}`,
            },
            formData.box_id && {
              label: boxes.find((b) => b.id === formData.box_id)?.box_number,
            },
          ]
            .filter(Boolean)
            .map((tag, i) => (
              <Box
                key={i}
                sx={{
                  px: 1.5,
                  py: 0.4,
                  borderRadius: "20px",
                  backgroundColor: RED_LIGHT,
                  border: `1px solid ${alpha(RED, 0.2)}`,
                }}
              >
                <Typography
                  sx={{ fontSize: "0.72rem", fontWeight: 700, color: RED }}
                >
                  {tag.label}
                </Typography>
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
}
