import { Box, Button } from "@mui/material";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import { useNavigate } from "react-router-dom";

export default function AnimalMedicalAction({ animal }) {
  const navigate = useNavigate();

  return (
    <Box mt={2} sx={{ width: "100%", boxSizing: "border-box" }}>
      <Button
        variant="contained"
        fullWidth
        startIcon={<MedicalServicesOutlinedIcon />}
        onClick={() => navigate(`/manager/animals/${animal.id}/medical`)}
        sx={{
          backgroundColor: "#a91111",
          color: "white",
          fontWeight: 700,
          textTransform: "none",
          borderRadius: "12px",
          py: 1.2,
          fontSize: "0.9rem",
          minWidth: 0,
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
