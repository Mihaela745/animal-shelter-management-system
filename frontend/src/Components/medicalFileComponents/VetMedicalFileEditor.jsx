import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

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

export default function VetMedicalFileEditor({
  file,
  saving,
  error,
  onSave,
}) {
  const [formData, setFormData] = useState({
    weight: "",
    general_observations: "",
  });

  useEffect(() => {
    setFormData({
      weight: file?.weight ?? "",
      general_observations: file?.general_observations ?? "",
    });
  }, [file]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave({
      weight: formData.weight === "" ? null : Number(formData.weight),
      general_observations: formData.general_observations.trim(),
    });
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: "#1a1a1a" }}>
          Actualizare fisa medicala
        </Typography>

        <Button
          variant="contained"
          startIcon={
            saving ? <CircularProgress size={16} sx={{ color: "white" }} /> : <SaveOutlinedIcon />
          }
          onClick={handleSubmit}
          disabled={saving}
          sx={{
            backgroundColor: RED,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 700,
            px: 2.5,
            "&:hover": { backgroundColor: RED_DARK },
            "&.Mui-disabled": { backgroundColor: "#f5f5f5", color: "#ccc" },
          }}
        >
          Salveaza
        </Button>
      </Box>

      {error ? (
        <Alert severity="error" sx={{ mb: 2, borderRadius: "12px" }}>
          {typeof error === "string" ? error : "Nu am putut actualiza fisa medicala."}
        </Alert>
      ) : null}

      <Stack spacing={2}>
        <TextField
          label="Greutate (kg)"
          name="weight"
          type="number"
          value={formData.weight}
          onChange={handleChange}
          sx={fieldSx}
          inputProps={{ min: 0, step: "0.1" }}
          fullWidth
        />

        <TextField
          label="Observatii generale"
          name="general_observations"
          value={formData.general_observations}
          onChange={handleChange}
          sx={fieldSx}
          fullWidth
          multiline
          minRows={4}
        />
      </Stack>
    </Box>
  );
}
