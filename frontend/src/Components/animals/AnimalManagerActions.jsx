import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateAnimal,
  deleteAnimal,
} from "../../features/animals/animalsSlice";
import { fetchBreedsBySpecies } from "../../features/breedMetadata/breedMetadata";
import { fetchBoxes } from "../../features/boxes/boxesSlice";
import { useNavigate } from "react-router-dom";
import CameraCaptureDialog from "./CameraCaptureDialog";
import { formatAnimalStatus, formatGender } from "../../utils/labels";
import { useNotification } from "../../context/NotificationContext";

export default function AnimalManagerActions({ animal }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotification();
  const { breeds, breedsLoading } = useSelector((state) => state.breedMetadata);
  const { boxes } = useSelector((state) => state.boxes);
  const fileInputRef = useRef(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(animal.image_url || null);
  const [formData, setFormData] = useState({
    name: animal.name,
    breed: animal.breed || "",
    age: animal.age || "",
    date_added: animal.date_added
      ? String(animal.date_added).split("T")[0]
      : "",
    gender: animal.gender || "",
    status: animal.status || "",
    box_id: animal.box_id || "",
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (openEdit && animal?.Species?.name) {
      dispatch(fetchBreedsBySpecies(animal.Species.name));
    }
  }, [openEdit, dispatch, animal?.Species?.name]);

  useEffect(() => {
    if (openEdit) {
      dispatch(fetchBoxes());
    }
  }, [openEdit, dispatch]);

  useEffect(() => {
    if (!openEdit) {
      return;
    }

    setFormError(null);
    setImageFile(null);
    setImagePreview(animal.image_url || null);
    setFormData({
      name: animal.name,
      breed: animal.breed || "",
      age: animal.age || "",
      date_added: animal.date_added
        ? String(animal.date_added).split("T")[0]
        : "",
      gender: animal.gender || "",
      status: animal.status || "",
      box_id: animal.box_id || "",
    });
  }, [openEdit, animal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "box_id" ? Number(value) : value,
    });
  };

  const filteredBoxes = boxes.filter(
    (box) => Number(box.species_id) === Number(animal.species_id),
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCameraCapture = (file) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    setSaving(true);
    setFormError(null);

    let result;
    if (imageFile) {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, val]) => fd.append(key, val));
      fd.append("image", imageFile);
      result = await dispatch(updateAnimal({ id: animal.id, data: fd }));
    } else {
      result = await dispatch(updateAnimal({ id: animal.id, data: formData }));
    }

    setSaving(false);

    if (result.meta?.requestStatus !== "fulfilled") {
      const message =
        typeof result.payload === "string"
          ? result.payload
          : "Nu am putut salva modificările. Încearcă din nou.";
      setFormError(message);
      notifyError(message);
      return;
    }

    setOpenEdit(false);
    notifySuccess("Animalul a fost actualizat cu succes.");
  };

  const handleDelete = async () => {
    setDeleting(true);
    const result = await dispatch(deleteAnimal(animal.id));
    setDeleting(false);

    if (result.meta?.requestStatus !== "fulfilled") {
      const message =
        typeof result.payload === "string"
          ? result.payload
          : "Nu am putut șterge animalul. Încearcă din nou.";
      setFormError(message);
      notifyError(message);
      return;
    }

    setOpenDelete(false);
    notifySuccess("Animalul a fost șters cu succes.");
    navigate("/manager/animals");
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setImageFile(null);
    setImagePreview(animal.image_url || null);
    setFormError(null);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setFormError(null);
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      "&.Mui-focused fieldset": { borderColor: "#1976d2" },
    },
    "& label.Mui-focused": { color: "#1976d2" },
  };

  return (
    <Box mt={2} sx={{ width: "100%", boxSizing: "border-box" }}>
      <Stack spacing={1.5} sx={{ width: "100%" }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<EditOutlinedIcon />}
          onClick={() => setOpenEdit(true)}
          sx={{
            border: "2px solid #a91111",
            color: "#a91111",
            fontWeight: 700,
            borderRadius: "12px",
            textTransform: "none",
            py: 1.2,
            fontSize: "0.9rem",
            minWidth: 0,
            "&:hover": {
              border: "2px solid #c01515",
              backgroundColor: "#fde3e3",
            },
          }}
        >
          Editează animal
        </Button>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<DeleteOutlineIcon />}
          onClick={() => setOpenDelete(true)}
          sx={{
            border: "2px solid #d32f2f",
            color: "#d32f2f",
            fontWeight: 700,
            borderRadius: "12px",
            textTransform: "none",
            py: 1.2,
            fontSize: "0.9rem",
            minWidth: 0,
            "&:hover": {
              border: "2px solid #b71c1c",
              backgroundColor: "#ffebee",
            },
          }}
        >
          Șterge animal
        </Button>
      </Stack>

      <Dialog
        open={openEdit}
        onClose={handleCloseEdit}
        PaperProps={{ sx: { borderRadius: "20px", p: 1, minWidth: 360 } }}
      >
        <DialogTitle sx={{ pb: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                backgroundColor: "#fde3e3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <EditOutlinedIcon sx={{ color: "#d21919", fontSize: 18 }} />
            </Box>
            <Typography fontWeight={800} fontSize="1rem">
              Editează animal
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: "1.2rem !important" }}>
          {formError && (
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                borderRadius: "10px",
                backgroundColor: "#fff1f2",
                border: "1px solid #fecdd3",
              }}
            >
              <Typography sx={{ fontSize: "0.82rem", color: "#991b1b" }}>
                {formError}
              </Typography>
            </Box>
          )}
          <Box sx={{ mb: 1 }}>
            {imagePreview && (
              <Box
                component="img"
                src={imagePreview}
                alt="Previzualizare"
                sx={{
                  width: "100%",
                  height: 160,
                  objectFit: "cover",
                  borderRadius: "12px",
                  mb: 1.5,
                  border: "1px solid #f0f0f0",
                }}
              />
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <Button
              fullWidth
              variant="outlined"
              startIcon={<CloudUploadOutlinedIcon />}
              onClick={() => fileInputRef.current.click()}
              sx={{
                border: "2px dashed #e0e0e0",
                color: "#999",
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                py: 1,
                "&:hover": {
                  border: "2px dashed #1976d2",
                  color: "#1976d2",
                  backgroundColor: "#f3f8ff",
                },
              }}
            >
              {imageFile ? imageFile.name : "Încarcă imagine nouă"}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PhotoCameraOutlinedIcon />}
              onClick={() => setOpenCamera(true)}
              sx={{
                mt: 1,
                borderColor: "#f0c9c9",
                color: "#a91111",
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 700,
                py: 1,
                backgroundColor: "#fff8f8",
                "&:hover": {
                  borderColor: "#a91111",
                  backgroundColor: "#fff0f0",
                },
              }}
            >
              Fă poză pe loc
            </Button>
          </Box>

          <TextField
            fullWidth
            margin="dense"
            label="Nume"
            name="name"
            value={formData.name}
            onChange={handleChange}
            sx={inputSx}
          />
          <TextField
            select
            fullWidth
            margin="dense"
            label="Rasa"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            disabled={breedsLoading}
            sx={inputSx}
          >
            {breeds.length > 0 ? (
              [{ value: "Maidanez" }, ...breeds.map((b) => ({ value: b }))].map(
                ({ value }) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ),
              )
            ) : (
              <MenuItem value={formData.breed}>
                {formData.breed || "-"}
              </MenuItem>
            )}
          </TextField>
          <TextField
            fullWidth
            margin="dense"
            type="number"
            label="Vârstă"
            name="age"
            value={formData.age}
            onChange={handleChange}
            sx={inputSx}
          />
          <TextField
            fullWidth
            margin="dense"
            type="date"
            label="Data adăugării"
            name="date_added"
            value={formData.date_added}
            onChange={handleChange}
            sx={inputSx}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            fullWidth
            margin="dense"
            label="Gen"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            sx={inputSx}
          >
            <MenuItem value="Male">{formatGender("Male")}</MenuItem>
            <MenuItem value="Female">{formatGender("Female")}</MenuItem>
          </TextField>
          <TextField
            select
            fullWidth
            margin="dense"
            label="Stare"
            name="status"
            value={formData.status}
            onChange={handleChange}
            sx={inputSx}
          >
            <MenuItem value="Available">{formatAnimalStatus("Available")}</MenuItem>
            <MenuItem value="Adopted">{formatAnimalStatus("Adopted")}</MenuItem>
            <MenuItem value="Fostered">{formatAnimalStatus("Fostered")}</MenuItem>
          </TextField>
          <TextField
            select
            fullWidth
            margin="dense"
            label="Boxă"
            name="box_id"
            value={formData.box_id}
            onChange={handleChange}
            sx={inputSx}
          >
            {filteredBoxes.length === 0 ? (
              <MenuItem value={formData.box_id} disabled>
                Nu există boxe pentru această specie.
              </MenuItem>
            ) : (
              filteredBoxes.map((box) => (
                <MenuItem
                  key={box.id}
                  value={box.id}
                  disabled={
                    box.id !== animal.box_id &&
                    box.current_occupancy >= box.capacity
                  }
                >
                  {box.box_number} ({box.current_occupancy}/{box.capacity}
                  {box.current_occupancy >= box.capacity ? " - plină" : ""})
                </MenuItem>
              ))
            )}
          </TextField>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={handleCloseEdit}
            disabled={saving}
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
            onClick={handleUpdate}
            disabled={saving}
            sx={{
              backgroundColor: "#1976d2",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            {saving ? (
              <CircularProgress size={18} sx={{ color: "white" }} />
            ) : (
              "Salvează"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
      >
        <DialogTitle sx={{ pb: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                backgroundColor: "#ffebee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DeleteOutlineIcon sx={{ color: "#d32f2f", fontSize: 18 }} />
            </Box>
            <Typography fontWeight={800} fontSize="1rem">
              Confirmă ștergerea
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: "1rem !important" }}>
          {formError && (
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                borderRadius: "10px",
                backgroundColor: "#fff1f2",
                border: "1px solid #fecdd3",
              }}
            >
              <Typography sx={{ fontSize: "0.82rem", color: "#991b1b" }}>
                {formError}
              </Typography>
            </Box>
          )}
          <Typography fontSize="0.9rem" color="#555">
            Ești sigur că vrei să ștergi <strong>{animal.name}</strong>? Această
            acțiune nu poate fi anulată.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={handleCloseDelete}
            disabled={deleting}
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
            onClick={handleDelete}
            disabled={deleting}
            sx={{
              backgroundColor: "#d32f2f",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              "&:hover": { backgroundColor: "#b71c1c" },
            }}
          >
            {deleting ? (
              <CircularProgress size={18} sx={{ color: "white" }} />
            ) : (
              "Șterge"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <CameraCaptureDialog
        open={openCamera}
        onClose={() => setOpenCamera(false)}
        onCapture={handleCameraCapture}
      />
    </Box>
  );
}
