import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function MiniAnimalCard({ animal }) {
  const navigate = useNavigate();

  if (!animal) return null;

  return (
    <Box
      onClick={() => navigate(`/user/animals/${animal.id}`)}
      sx={{
        cursor: "pointer",
        borderRadius: "16px",
        border: "1px solid #f0f0f0",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 20px rgba(169,17,17,0.12)",
          borderColor: "#ffcdd2",
        },
      }}
    >
      <Box sx={{ borderRadius: "16px", overflow: "hidden" }}>
        <Box
          component="img"
          src={animal.image_url}
          alt={animal.name}
          sx={{
            width: "100%",
            height: 110,
            objectFit: "cover",
            display: "block",
          }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <Box sx={{ p: 1, backgroundColor: "#fff" }}>
          <Typography
            fontWeight={700}
            fontSize="0.8rem"
            noWrap
            color="#1a1a1a"
            textAlign="center"
          >
            {animal.name}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
