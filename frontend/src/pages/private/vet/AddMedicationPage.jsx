import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import MedicationIcon from "@mui/icons-material/Medication";
import PetsIcon from "@mui/icons-material/Pets";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { useDispatch } from "react-redux";
import axiosInstance from "../../../sercives/axiosInstance";
import { createMedication } from "../../../features/medications/medicationsSlice";

const RED = "#a91111";
const RED_DARK = "#8a0d0d";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#fafafa",
    fontSize: "0.88rem",
    "& fieldset": { borderColor: "#ebebeb" },
    "&:hover fieldset": { borderColor: "#ccc" },
    "&.Mui-focused fieldset": { borderColor: RED, borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root": { fontSize: "0.88rem" },
  "& label.Mui-focused": { color: RED },
};

const emptyMedication = {
  name: "",
  description: "",
  dosage: "",
  frequency: "",
  start_date: "",
  end_date: "",
};

export default function AddMedicationPage() {
  const dispatch = useDispatch();

  const [targetMode, setTargetMode] = useState("box");
  const [boxes, setBoxes] = useState([]);
  const [allAnimals, setAllAnimals] = useState([]);
  const [boxAnimals, setBoxAnimals] = useState([]);
  const [selectedBoxId, setSelectedBoxId] = useState("");
  const [selectedAnimalIds, setSelectedAnimalIds] = useState([]);
  const [selectionLoading, setSelectionLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState(emptyMedication);
  const latestBoxRequestId = useRef(0);

  useEffect(() => {
    const loadInitialData = async () => {
      setSelectionLoading(true);
      setError(null);

      try {
        const [boxesResponse, animalsResponse] = await Promise.all([
          axiosInstance.get("/boxes"),
          axiosInstance.get("/animals", { params: { limit: 9999, page: 1 } }),
        ]);

        setBoxes(Array.isArray(boxesResponse.data) ? boxesResponse.data : []);
        setAllAnimals(
          Array.isArray(animalsResponse.data?.animals)
            ? animalsResponse.data.animals
            : [],
        );
      } catch (loadError) {
        setError(
          loadError.response?.data ||
            "Nu am putut încărca boxele și animalele.",
        );
      } finally {
        setSelectionLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const selectedAnimalsPreview = useMemo(() => {
    if (targetMode === "box") {
      return boxAnimals;
    }

    return allAnimals.filter((animal) =>
      selectedAnimalIds.includes(String(animal.id)),
    );
  }, [allAnimals, boxAnimals, selectedAnimalIds, targetMode]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBoxChange = async (event) => {
    const nextBoxId = event.target.value;
    const requestId = ++latestBoxRequestId.current;
    setSelectedBoxId(nextBoxId);
    setSelectedAnimalIds([]);
    setSuccessMessage("");
    setError(null);
    setSelectionLoading(true);

    try {
      const response = await axiosInstance.get("/animals", {
        params: { box_id: nextBoxId, limit: 9999, page: 1 },
      });

      if (requestId !== latestBoxRequestId.current) {
        return;
      }

      setBoxAnimals(
        Array.isArray(response.data?.animals) ? response.data.animals : [],
      );
    } catch (loadError) {
      if (requestId !== latestBoxRequestId.current) {
        return;
      }

      setError(
        loadError.response?.data || "Nu am putut încărca animalele din boxă.",
      );
      setBoxAnimals([]);
    } finally {
      if (requestId === latestBoxRequestId.current) {
        setSelectionLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData(emptyMedication);
    setSelectedAnimalIds([]);
    setSelectedBoxId("");
    setBoxAnimals([]);
    setTargetMode("box");
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    setSuccessMessage("");

    const payload = {
      ...formData,
      description: formData.description.trim(),
      end_date: formData.end_date || null,
    };

    const targetMedicalFileIds = [
      ...new Set(
        selectedAnimalsPreview
          .map((animal) => animal.medical_file_id)
          .filter(Boolean),
      ),
    ];

    if (targetMedicalFileIds.length === 0) {
      setSubmitting(false);
      setError("Alege o boxă sau cel puțin un animal.");
      return;
    }

    const results = await Promise.all(
      targetMedicalFileIds.map((medicalFileId) =>
        dispatch(
          createMedication({
            medicalFileId,
            data: payload,
          }),
        ),
      ),
    );

    setSubmitting(false);

    const failedResult = results.find(
      (result) => result.meta?.requestStatus !== "fulfilled",
    );

    if (failedResult) {
      setError(
        typeof failedResult.payload === "string"
          ? failedResult.payload
          : "Nu am putut salva medicația pentru toate animalele selectate.",
      );
      return;
    }

    setSuccessMessage(
      `Medicația a fost adăugată pentru ${targetMedicalFileIds.length} animale.`,
    );
    resetForm();
  };

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2, md: 4 },
        pb: { xs: 10, sm: 4 },
        maxWidth: 900,
        mx: "auto",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "12px",
            backgroundColor: RED,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MedicationIcon sx={{ color: "white", fontSize: "1.2rem" }} />
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: "1.3rem",
              fontWeight: 800,
              color: "#1a1a1a",
              letterSpacing: "-0.5px",
            }}
          >
            Adaugă medicament
          </Typography>
          <Typography sx={{ fontSize: "0.82rem", color: "#999" }}>
            Prescriere individuală sau simultană pe boxă / selecție manuală
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "20px",
          border: "1.5px solid #f0f0f0",
          boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
          p: { xs: 3, md: 4 },
        }}
      >
        {error ? (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "12px" }}>
            {error}
          </Alert>
        ) : null}

        {successMessage ? (
          <Alert severity="success" sx={{ mb: 2, borderRadius: "12px" }}>
            {successMessage}
          </Alert>
        ) : null}

        <Stack spacing={2}>
          <FormControl>
            <FormLabel sx={{ mb: 1, color: "#666", fontWeight: 700 }}>
              Prescrie pentru
            </FormLabel>
            <RadioGroup
              value={targetMode}
              onChange={(event) => {
                setTargetMode(event.target.value);
                setSelectedAnimalIds([]);
                setSelectedBoxId("");
                setBoxAnimals([]);
                setSuccessMessage("");
              }}
            >
              <FormControlLabel
                value="box"
                control={<Radio sx={{ color: RED, "&.Mui-checked": { color: RED } }} />}
                label="Toate animalele dintr-o boxă"
              />
              <FormControlLabel
                value="custom"
                control={<Radio sx={{ color: RED, "&.Mui-checked": { color: RED } }} />}
                label="Animale selectate manual"
              />
            </RadioGroup>
          </FormControl>

          {targetMode === "box" ? (
            <TextField
              select
              label="Boxă"
              value={selectedBoxId}
              onChange={handleBoxChange}
              fullWidth
              sx={fieldSx}
              InputProps={{
                startAdornment: <Inventory2Icon sx={{ color: "#bbb", mr: 1 }} />,
              }}
              helperText={
                selectedBoxId && !selectionLoading
                  ? `${boxAnimals.length} animale selectate automat`
                  : "Alege boxa pe care vrei să prescrii"
              }
            >
              {boxes.map((box) => (
                <MenuItem key={box.id} value={box.id}>
                  {box.box_number} ({box.current_occupancy}/{box.capacity})
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              select
              label="Animale"
              value={selectedAnimalIds}
              onChange={(event) => {
                setSelectedAnimalIds(event.target.value);
                setSuccessMessage("");
              }}
              fullWidth
              sx={fieldSx}
              SelectProps={{
                multiple: true,
                renderValue: (selected) =>
                  allAnimals
                    .filter((animal) => selected.includes(String(animal.id)))
                    .map((animal) => animal.name)
                    .join(", "),
              }}
              helperText="Selectează unul sau mai multe animale"
            >
              {allAnimals.map((animal) => (
                <MenuItem key={animal.id} value={String(animal.id)}>
                  <Checkbox checked={selectedAnimalIds.includes(String(animal.id))} />
                  <ListItemText
                    primary={animal.name}
                    secondary={animal.Boxes?.box_number || ""}
                  />
                </MenuItem>
              ))}
            </TextField>
          )}

          <TextField
            label="Nume medicament"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            sx={fieldSx}
            InputProps={{
              startAdornment: <MedicationIcon sx={{ color: "#bbb", mr: 1 }} />,
            }}
          />

          <TextField
            label="Descriere"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={3}
            sx={fieldSx}
          />

          <TextField
            label="Dozaj"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            fullWidth
            sx={fieldSx}
          />

          <TextField
            label="Frecvență"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            fullWidth
            sx={fieldSx}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <TextField
              label="Data început"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
            />

            <TextField
              label="Data sfârșit"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
            />
          </Box>

          <Box
            sx={{
              mt: 1,
              p: 2,
              borderRadius: "14px",
              backgroundColor: "#fafafa",
              border: "1px solid #f0f0f0",
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: "0.86rem", mb: 1 }}>
              Animale vizate
            </Typography>

            {selectionLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <CircularProgress size={22} sx={{ color: RED }} />
              </Box>
            ) : selectedAnimalsPreview.length === 0 ? (
              <Typography sx={{ fontSize: "0.82rem", color: "#999" }}>
                Nu există animale selectate încă.
              </Typography>
            ) : (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {selectedAnimalsPreview.map((animal) => (
                  <Box
                    key={animal.id}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.8,
                      px: 1.2,
                      py: 0.7,
                      borderRadius: "999px",
                      backgroundColor: "#fff",
                      border: "1px solid #ececec",
                    }}
                  >
                    <PetsIcon sx={{ fontSize: 16, color: RED }} />
                    <Typography sx={{ fontSize: "0.8rem", fontWeight: 600 }}>
                      {animal.name}
                    </Typography>
                    {animal.Boxes?.box_number ? (
                      <Typography sx={{ fontSize: "0.74rem", color: "#999" }}>
                        {animal.Boxes.box_number}
                      </Typography>
                    ) : null}
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              submitting ||
              selectionLoading ||
              !formData.name ||
              !formData.dosage ||
              !formData.frequency ||
              !formData.start_date ||
              selectedAnimalsPreview.length === 0
            }
            sx={{
              mt: 1,
              backgroundColor: RED,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              py: 1.3,
              "&:hover": { backgroundColor: RED_DARK },
              "&.Mui-disabled": { backgroundColor: "#f5f5f5", color: "#ccc" },
            }}
          >
            {submitting ? (
              <CircularProgress size={18} sx={{ color: "white" }} />
            ) : (
              "Adaugă medicația"
            )}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
