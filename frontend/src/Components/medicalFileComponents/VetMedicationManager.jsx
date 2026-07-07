import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ScaleOutlinedIcon from "@mui/icons-material/ScaleOutlined";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../sercives/axiosInstance";
import {
  createMedication,
  deleteMedication,
  fetchMedicationsByFile,
  updateMedication,
} from "../../features/medications/medicationsSlice";
import { useNotification } from "../../context/NotificationContext";

const RED = "#a91111";
const RED_LIGHT = "#fff0f0";
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

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateValue(dateValue) {
  if (!dateValue) {
    return null;
  }

  if (typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return new Date(`${dateValue}T00:00:00`);
  }

  const parsed = new Date(dateValue);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDate(dateValue) {
  const parsed = parseDateValue(dateValue);
  return parsed ? parsed.toLocaleDateString("ro-RO") : "-";
}

function MedicationCard({ medication, onEdit, onDelete }) {
  const endDate = parseDateValue(medication.end_date);
  const isActive = !endDate || endDate >= new Date();

  return (
    <Box
      sx={{
        border: "1.5px solid",
        borderColor: isActive ? "#ffd6d6" : "#f0f0f0",
        borderRadius: "16px",
        p: 2.5,
        backgroundColor: isActive ? RED_LIGHT : "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          backgroundColor: isActive ? RED : "#e0e0e0",
          borderRadius: "4px 0 0 4px",
        }}
      />

      <Box sx={{ pl: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1.5,
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MedicationOutlinedIcon
              sx={{ fontSize: "1rem", color: isActive ? RED : "#bbb" }}
            />
            <Typography
              sx={{ fontWeight: 800, fontSize: "0.95rem", color: "#1a1a1a" }}
            >
              {medication.name}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 0.8, flexShrink: 0 }}>
            <Chip
              label={isActive ? "Activ" : "Încheiat"}
              size="small"
              sx={{
                fontSize: "0.65rem",
                fontWeight: 700,
                borderRadius: "6px",
                height: 20,
                backgroundColor: isActive ? RED : "#f5f5f5",
                color: isActive ? "white" : "#aaa",
              }}
            />
            <Button
              size="small"
              onClick={() => onEdit(medication)}
              sx={{
                minWidth: 0,
                p: 0.6,
                color: "#666",
                borderRadius: "8px",
              }}
            >
              <EditOutlinedIcon sx={{ fontSize: 18 }} />
            </Button>
            <Button
              size="small"
              onClick={() => onDelete(medication)}
              sx={{
                minWidth: 0,
                p: 0.6,
                color: "#d32f2f",
                borderRadius: "8px",
              }}
            >
              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
            </Button>
          </Box>
        </Box>

        {medication.description ? (
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: "#888",
              mb: 1.5,
              fontStyle: "italic",
              lineHeight: 1.4,
            }}
          >
            {medication.description}
          </Typography>
        ) : null}

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              backgroundColor: isActive ? "rgba(169,17,17,0.07)" : "#f5f5f5",
              borderRadius: "8px",
              px: 1.2,
              py: 0.4,
            }}
          >
            <ScaleOutlinedIcon
              sx={{ fontSize: "0.75rem", color: isActive ? RED : "#999" }}
            />
            <Typography
              sx={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: isActive ? RED : "#666",
              }}
            >
              {medication.dosage}
            </Typography>
          </Box>

          {medication.frequency ? (
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                backgroundColor: "#f0f0f0",
                borderRadius: "8px",
                px: 1.2,
                py: 0.4,
              }}
            >
              <Typography
                sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#666" }}
              >
                {medication.frequency}
              </Typography>
            </Box>
          ) : null}
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CalendarTodayOutlinedIcon
              sx={{ fontSize: "0.75rem", color: "#bbb" }}
            />
            <Typography
              sx={{ fontSize: "0.75rem", color: "#888", fontWeight: 600 }}
            >
              {formatDate(medication.start_date)}
              {medication.end_date ? ` -> ${formatDate(medication.end_date)}` : ""}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <PersonOutlineIcon sx={{ fontSize: "0.75rem", color: "#bbb" }} />
            <Typography
              sx={{ fontSize: "0.75rem", color: "#888", fontWeight: 600 }}
            >
              Dr. {medication.Staff?.name || "Necunoscut"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function VetMedicationManager({ medicalFileId }) {
  const dispatch = useDispatch();
  const { notifySuccess, notifyError } = useNotification();
  const { medications, loading, error } = useSelector((state) => state.medications);
  const sortedMedications = useMemo(
    () =>
      [...(Array.isArray(medications) ? medications : [])].sort((a, b) => {
        const firstDate = parseDateValue(a.start_date);
        const secondDate = parseDateValue(b.start_date);
        return (secondDate?.getTime() || 0) - (firstDate?.getTime() || 0);
      }),
    [medications],
  );

  const [openForm, setOpenForm] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [formData, setFormData] = useState(emptyMedication);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [deleteState, setDeleteState] = useState({ open: false, medication: null });
  const [targetMode, setTargetMode] = useState("current");
  const [boxes, setBoxes] = useState([]);
  const [allAnimals, setAllAnimals] = useState([]);
  const [boxAnimals, setBoxAnimals] = useState([]);
  const [selectedBoxId, setSelectedBoxId] = useState("");
  const [selectedAnimalIds, setSelectedAnimalIds] = useState([]);
  const [selectionLoading, setSelectionLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchMedicationsByFile(medicalFileId));
  }, [dispatch, medicalFileId]);

  const resetForm = () => {
    setEditingMedication(null);
    setFormData(emptyMedication);
    setSubmitError(null);
    setTargetMode("current");
    setSelectedBoxId("");
    setSelectedAnimalIds([]);
    setBoxAnimals([]);
  };

  const handleOpenCreate = async () => {
    resetForm();
    setSelectionLoading(true);
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
      setSubmitError(
        loadError.response?.data || "Nu am putut încărca boxele și animalele.",
      );
    } finally {
      setSelectionLoading(false);
    }
    setOpenForm(true);
  };

  const handleOpenEdit = (medication) => {
    setEditingMedication(medication);
    setFormData({
      name: medication.name || "",
      description: medication.description || "",
      dosage: medication.dosage || "",
      frequency: medication.frequency || "",
      start_date: medication.start_date ? medication.start_date.split("T")[0] : "",
      end_date: medication.end_date ? medication.end_date.split("T")[0] : "",
    });
    setSubmitError(null);
    setOpenForm(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBoxChange = async (event) => {
    const nextBoxId = event.target.value;
    setSelectedBoxId(nextBoxId);
    setSelectedAnimalIds([]);
    setSelectionLoading(true);

    try {
      const response = await axiosInstance.get("/animals", {
        params: { box_id: nextBoxId, limit: 9999, page: 1 },
      });
      setBoxAnimals(
        Array.isArray(response.data?.animals) ? response.data.animals : [],
      );
    } catch (loadError) {
      setSubmitError(
        loadError.response?.data || "Nu am putut încărca animalele din boxă.",
      );
      setBoxAnimals([]);
    } finally {
      setSelectionLoading(false);
    }
  };

  const resolveTargetMedicalFileIds = () => {
    if (targetMode === "current") {
      return [medicalFileId];
    }

    if (targetMode === "box") {
      return boxAnimals.map((animal) => animal.medical_file_id).filter(Boolean);
    }

    if (targetMode === "custom") {
      return allAnimals
        .filter((animal) => selectedAnimalIds.includes(String(animal.id)))
        .map((animal) => animal.medical_file_id)
        .filter(Boolean);
    }

    return [];
  };

  const handleSubmit = async () => {
    if (formData.start_date < getTodayDateString()) {
      setSubmitError("Data de început nu poate fi în trecut.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const payload = {
      ...formData,
      description: formData.description.trim(),
      end_date: formData.end_date || null,
    };

    if (editingMedication) {
      const result = await dispatch(
        updateMedication({
          medicalFileId,
          id: editingMedication.id,
          data: payload,
        }),
      );
      setSubmitting(false);

      if (result.meta?.requestStatus === "fulfilled") {
        setOpenForm(false);
        resetForm();
        await dispatch(fetchMedicationsByFile(medicalFileId));
        notifySuccess("Medicația a fost actualizată cu succes.");
        return;
      }

      const message =
        typeof result.payload === "string"
          ? result.payload
          : "Nu am putut salva medicația.";
      setSubmitError(message);
      notifyError(message);
      return;
    }

    const targetMedicalFileIds = [...new Set(resolveTargetMedicalFileIds())];

    if (targetMedicalFileIds.length === 0) {
      setSubmitting(false);
      setSubmitError("Alege cel puțin un animal sau o boxă validă.");
      return;
    }

    const results = await Promise.all(
      targetMedicalFileIds.map((targetMedicalFileId) =>
        dispatch(
          createMedication({
            medicalFileId: targetMedicalFileId,
            data: payload,
          }),
        ),
      ),
    );

    setSubmitting(false);

    const failedResult = results.find(
      (result) => result.meta?.requestStatus !== "fulfilled",
    );

    if (!failedResult) {
      setOpenForm(false);
      resetForm();
      await dispatch(fetchMedicationsByFile(medicalFileId));
      notifySuccess("Medicația a fost adăugată cu succes.");
      return;
    }

    const message =
      typeof failedResult.payload === "string"
        ? failedResult.payload
        : "Nu am putut salva medicația pentru toate animalele selectate.";
    setSubmitError(message);
    notifyError(message);
  };

  const handleConfirmDelete = async () => {
    if (!deleteState.medication) {
      return;
    }

    setSubmitting(true);
    const result = await dispatch(
      deleteMedication({
        medicalFileId,
        id: deleteState.medication.id,
      }),
    );
    setSubmitting(false);

    if (result.meta?.requestStatus === "fulfilled") {
      setDeleteState({ open: false, medication: null });
      await dispatch(fetchMedicationsByFile(medicalFileId));
      notifySuccess("Medicația a fost ștearsă cu succes.");
      return;
    }

    notifyError(
      typeof result.payload === "string"
        ? result.payload
        : "Nu am putut șterge medicația.",
    );
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: "#1a1a1a" }}>
          Medicație
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label={`${sortedMedications.length} înregistrări`}
            size="small"
            sx={{
              fontSize: "0.7rem",
              fontWeight: 700,
              backgroundColor: "#f5f5f5",
              color: "#888",
              borderRadius: "6px",
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{
              backgroundColor: RED,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              "&:hover": { backgroundColor: RED_DARK },
            }}
          >
            Adaugă medicație
          </Button>
        </Box>
      </Box>

      {error ? (
        <Alert severity="error" sx={{ mb: 2, borderRadius: "12px" }}>
          {typeof error === "string" ? error : "Nu am putut încărca medicația."}
        </Alert>
      ) : null}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress sx={{ color: RED }} />
        </Box>
      ) : sortedMedications.length === 0 ? (
        <Box
          sx={{
            py: 5,
            textAlign: "center",
            backgroundColor: "#fafafa",
            borderRadius: "16px",
            border: "1.5px dashed #e0e0e0",
          }}
        >
          <Typography sx={{ fontSize: "0.85rem", color: "#bbb", fontWeight: 600 }}>
            Nu există medicații înregistrate
          </Typography>
        </Box>
      ) : (
        <Stack spacing={1.5}>
          {sortedMedications.map((medication) => (
            <MedicationCard
              key={medication.id}
              medication={medication}
              onEdit={handleOpenEdit}
              onDelete={(item) => setDeleteState({ open: true, medication: item })}
            />
          ))}
        </Stack>
      )}

      <Dialog
        open={openForm}
        onClose={() => !submitting && setOpenForm(false)}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            p: 1,
            width: { xs: "calc(100vw - 24px)", sm: 460 },
            maxWidth: "calc(100vw - 24px)",
            m: { xs: 1.5, sm: 2 },
          },
        }}
      >
        <DialogTitle sx={{ pb: 0 }}>
          <Typography fontWeight={800} fontSize="1rem">
            {editingMedication ? "Editează medicația" : "Adaugă medicație"}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: "1.2rem !important" }}>
          {submitError ? (
            <Alert severity="error" sx={{ mb: 2, borderRadius: "12px" }}>
              {submitError}
            </Alert>
          ) : null}

          <Stack spacing={1.5}>
            {!editingMedication ? (
              <FormControl>
                <FormLabel sx={{ mb: 1, color: "#666", fontWeight: 700 }}>
                  Prescrie pentru
                </FormLabel>
                <RadioGroup
                  value={targetMode}
                  onChange={(event) => setTargetMode(event.target.value)}
                >
                  <FormControlLabel
                    value="current"
                    control={<Radio sx={{ color: RED, "&.Mui-checked": { color: RED } }} />}
                    label="Animalul curent"
                  />
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
            ) : null}

            {!editingMedication && targetMode === "box" ? (
              <TextField
                select
                label="Boxă"
                value={selectedBoxId}
                onChange={handleBoxChange}
                fullWidth
                sx={fieldSx}
                helperText={
                  selectedBoxId && !selectionLoading
                    ? `${boxAnimals.length} animale vor primi această medicație`
                    : "Alege o boxă pentru prescriere simultană"
                }
              >
                {boxes.map((box) => (
                  <MenuItem key={box.id} value={box.id}>
                    {box.box_number} ({box.current_occupancy}/{box.capacity})
                  </MenuItem>
                ))}
              </TextField>
            ) : null}

            {!editingMedication && targetMode === "custom" ? (
              <TextField
                select
                label="Animale"
                value={selectedAnimalIds}
                onChange={(event) => setSelectedAnimalIds(event.target.value)}
                fullWidth
                sx={fieldSx}
                helperText="Poți selecta mai multe animale simultan"
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) =>
                    allAnimals
                      .filter((animal) => selected.includes(String(animal.id)))
                      .map((animal) => animal.name)
                      .join(", "),
                }}
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
            ) : null}

            <TextField
              label="Nume"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              sx={fieldSx}
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
            <TextField
              label="Data început"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: getTodayDateString() }}
              error={Boolean(formData.start_date) && formData.start_date < getTodayDateString()}
              helperText={
                formData.start_date && formData.start_date < getTodayDateString()
                  ? "Data de început nu poate fi în trecut."
                  : ""
              }
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
              inputProps={{ min: formData.start_date || getTodayDateString() }}
              sx={fieldSx}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => {
              setOpenForm(false);
              resetForm();
            }}
            disabled={submitting}
            sx={{
              color: "#999",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "10px",
            }}
          >
            Anulează
          </Button>
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
              formData.start_date < getTodayDateString() ||
              (!editingMedication &&
                ((targetMode === "box" && !selectedBoxId) ||
                  (targetMode === "custom" && selectedAnimalIds.length === 0)))
            }
            sx={{
              backgroundColor: RED,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              "&:hover": { backgroundColor: RED_DARK },
              "&.Mui-disabled": { backgroundColor: "#f5f5f5", color: "#ccc" },
            }}
          >
            {submitting ? (
              <CircularProgress size={18} sx={{ color: "white" }} />
            ) : editingMedication ? (
              "Salvează"
            ) : (
              "Adaugă"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteState.open}
        onClose={() => !submitting && setDeleteState({ open: false, medication: null })}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            p: 1,
            width: { xs: "calc(100vw - 24px)", sm: 340 },
            maxWidth: "calc(100vw - 24px)",
            m: { xs: 1.5, sm: 2 },
          },
        }}
      >
        <DialogTitle sx={{ pb: 0 }}>
          <Typography fontWeight={800} fontSize="1rem">
            Confirmă ștergerea
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: "1rem !important" }}>
          <Typography fontSize="0.9rem" color="#555">
            Ești sigur că vrei să ștergi medicația{" "}
            <strong>{deleteState.medication?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setDeleteState({ open: false, medication: null })}
            disabled={submitting}
            sx={{
              color: "#999",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "10px",
            }}
          >
            Anulează
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmDelete}
            disabled={submitting}
            sx={{
              backgroundColor: "#d32f2f",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              "&:hover": { backgroundColor: "#b71c1c" },
            }}
          >
            {submitting ? (
              <CircularProgress size={18} sx={{ color: "white" }} />
            ) : (
              "Șterge"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
