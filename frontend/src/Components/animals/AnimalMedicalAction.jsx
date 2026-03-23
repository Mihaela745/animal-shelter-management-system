import { Box, Button } from "@mui/material";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AnimalMedicalAction({ animal }) {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const roleBasePath = {
    Manager: "manager",
    Vet: "vet",
    Caretaker: "staff",
  };

  const base = roleBasePath[user?.role] || "user";

  const handleOpenMedical = () => {
    navigate(`/${base}/animals/${animal.id}/medical/${animal.medical_file_id}`);
  };

  return (
    <Box mt={2} sx={{ width: "100%", boxSizing: "border-box" }}>
      <Button
        variant="contained"
        fullWidth
        startIcon={<MedicalServicesOutlinedIcon />}
        onClick={handleOpenMedical}
        sx={{
          backgroundColor: "#a91111",
          color: "white",
          fontWeight: 700,
          textTransform: "none",
          borderRadius: "12px",
          py: 1.2,
          fontSize: "0.9rem",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "#74021f",
            transform: "translateY(-1px)",
            boxShadow: "0 4px 16px rgba(192, 21, 55, 0.3)",
          },
        }}
      >
        Vezi fișa medicală
      </Button>
    </Box>
  );
}
