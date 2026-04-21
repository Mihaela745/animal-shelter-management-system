import { Box, Typography, Divider, Skeleton } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

import { fetchMedicalFileById } from "../../../features/medicalFiles/medicalFilesSlice";
import { fetchMedicationsByFile } from "../../../features/medications/medicationsSlice";
import MedicalFileInfo from "../../../components/medicalFileComponents/MedicalFileInfo";
import MedicationsList from "../../../components/medicalFileComponents/MedicationsList";

const RED = "#a91111";

export default function AnimalMedicalPage() {
  const { fileId, animalId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedFile, loading } = useSelector((state) => state.medicalFiles);

  useEffect(() => {
    dispatch(fetchMedicalFileById(fileId));
    dispatch(fetchMedicationsByFile(fileId));
  }, [dispatch, fileId]);

  if (loading || !selectedFile) {
    return (
      <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={80}
            sx={{ mb: 2, borderRadius: "14px" }}
          />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 2, md: 4 } }}>
      <Box
        onClick={() => navigate(`/staff/animals/${animalId}`)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          mb: 3,
          cursor: "pointer",
          width: "fit-content",
        }}
      >
        <ArrowBackIosNewRoundedIcon
          sx={{ fontSize: "0.75rem", color: "#aaa" }}
        />
        <Typography
          sx={{
            fontSize: "0.8rem",
            color: "#aaa",
            fontWeight: 600,
            "&:hover": { color: RED },
          }}
        >
          Înapoi la {selectedFile.Animal?.name}
        </Typography>
      </Box>

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
          <MedicalServicesOutlinedIcon
            sx={{ color: "white", fontSize: "1.2rem" }}
          />
        </Box>
        <Typography
          sx={{
            fontSize: "1.3rem",
            fontWeight: 800,
            color: "#1a1a1a",
            letterSpacing: "-0.5px",
          }}
        >
          Fișă medicală
        </Typography>
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
        <MedicalFileInfo file={selectedFile} />
        <Divider sx={{ my: 3 }} />
        <MedicationsList />
      </Box>
    </Box>
  );
}
