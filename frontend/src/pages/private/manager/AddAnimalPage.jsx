import {
  Alert,
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAnimal } from "../../../features/animals/animalsSlice";
import {
  clearBreedMetadata,
  fetchBreedsBySpecies,
} from "../../../features/breedMetadata/breedMetadata";
import { fetchBoxes } from "../../../features/boxes/boxesSlice";
import { fetchSpecies } from "../../../features/species/speciesSlice";
import CameraCaptureDialog from "../../../components/animals/CameraCaptureDialog";
import { formatGender, formatSpecies } from "../../../utils/labels";
import { useNotification } from "../../../context/NotificationContext";

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
  const { notifySuccess, notifyError } = useNotification();

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
  const [openCamera, setOpenCamera] = useState(false);
  const uploadInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchBoxes());
    dispatch(fetchSpecies());
  }, [dispatch]);

  useEffect(() => {
    const selectedSpecies = species.find(
      (item) => Number(item.id) === Number(formData.species_id),
    );

    if (selectedSpecies) {
      dispatch(fetchBreedsBySpecies(selectedSpecies.name));
    }

    return () => {
      dispatch(clearBreedMetadata());
    };
  }, [dispatch, formData.species_id, species]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "species_id" || name === "box_id" ? Number(value) : value,
      ...(name === "species_id" ? { breed: "", box_id: "" } : {}),
    }));
  };

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleCameraCapture = (file) => {
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const result = await dispatch(createAnimal(formData));

    if (result.payload?.id) {
      notifySuccess("Animalul a fost creat cu succes.");
      navigate(`/manager/animals/${result.payload.id}`);
    } else {
      const message =
        typeof result.payload === "string"
          ? result.payload
          : "A apărut o eroare la crearea animalului. Încearcă din nou.";
      setError(message);
      notifyError(message);
    }
  };

  const filteredBoxes = formData.species_id
    ? boxes.filter((box) => Number(box.species_id) === Number(formData.species_id))
    : [];

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
              <Typography sx={{ fontSize: "1rem", color: "white", fontWeight: 800 }}>
                A
              </Typography>
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
            Completează informațiile pentru a adăuga un animal în adăpost.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mb: 4 }}>
          {steps.map((label, index) => (
            <Box
              key={label}
              onClick={() => setStep(index)}
              sx={{
                flex: 1,
                py: 1,
                px: 1.5,
                borderRadius: "10px",
                cursor: "pointer",
                border: "1.5px solid",
                borderColor: step === index ? RED : "#ebebeb",
                backgroundColor: step === index ? RED_LIGHT : "white",
                transition: "all 0.2s",
                "&:hover": { borderColor: step === index ? RED : "#ccc" },
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: step === index ? RED : "#bbb",
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              >
                {index + 1}. {label}
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
                    placeholder="ex: Rex, Mia..."
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
                    {species.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {formatSpecies(item.name)}
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
                    <MenuItem value="Maidanez">Maidanez</MenuItem>
                    {breeds.map((breed) => (
                      <MenuItem key={breed} value={breed}>
                        {breed}
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
                    <MenuItem value="Male">Mascul</MenuItem>
                    <MenuItem value="Female">Femelă</MenuItem>
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

                <Field label="Data adăugării">
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
                  <Stack spacing={1.2}>
                    <Button
                      variant="outlined"
                      startIcon={<UploadOutlinedIcon />}
                      onClick={() => uploadInputRef.current?.click()}
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
                        ? `Fișier selectat: ${formData.image.name}`
                        : "Alege fotografie din dispozitiv"}
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<PhotoCameraOutlinedIcon />}
                      onClick={() => setOpenCamera(true)}
                      sx={{
                        borderRadius: "10px",
                        borderColor: "#f0c9c9",
                        backgroundColor: "#fff8f8",
                        color: RED,
                        textTransform: "none",
                        fontWeight: 700,
                        py: 1.2,
                        "&:hover": {
                          borderColor: RED,
                          backgroundColor: RED_LIGHT,
                        },
                      }}
                    >
                      Fă poză pe loc
                    </Button>

                    <input
                      ref={uploadInputRef}
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                    />
                  </Stack>
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
                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        color: "#bbb",
                        fontWeight: 600,
                      }}
                    >
                      Selectează mai întâi o specie.
                    </Typography>
                  </Box>
                ) : (
                  <Field label={`Boxă disponibilă (${filteredBoxes.length} opțiuni)`}>
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
                              {box.current_occupancy >= box.capacity ? " plină" : " locuri"}
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
              onClick={() => setStep((current) => Math.max(0, current - 1))}
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
              Înapoi
            </Button>

            {step < 2 ? (
              <Button
                onClick={() => setStep((current) => Math.min(2, current + 1))}
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
                Continuă
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
                {loading ? "Se salvează..." : "Creează animal"}
              </Button>
            )}
          </Box>
        </Box>

        <Box sx={{ mt: 2, px: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
          {[
            formData.name && { label: formData.name },
            formData.species_id && {
              label: formatSpecies(
                species.find((item) => item.id === formData.species_id)?.name,
              ),
            },
            formData.breed && { label: formData.breed },
            formData.gender && {
              label: formatGender(formData.gender),
            },
            formData.age && { label: `${formData.age} ani` },
            formData.date_added && {
              label: `Adăugat pe ${new Date(
                `${formData.date_added}T00:00:00`,
              ).toLocaleDateString("ro-RO")}`,
            },
            formData.box_id && {
              label: boxes.find((box) => box.id === formData.box_id)?.box_number,
            },
          ]
            .filter(Boolean)
            .map((tag, index) => (
              <Box
                key={index}
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

        <CameraCaptureDialog
          open={openCamera}
          onClose={() => setOpenCamera(false)}
          onCapture={handleCameraCapture}
        />
      </Box>
    </Box>
  );
}
