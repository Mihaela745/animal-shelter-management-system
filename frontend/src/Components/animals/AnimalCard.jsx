import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AnimalCard({ animal }) {
  const { name, age, gender, image_url, status } = animal;
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        borderRadius: "12px",
      }}
    >
      <Box sx={{ height: 180, width: "100%", backgroundColor: "#f5f5f5" }}>
        <CardMedia
          component="img"
          image={image_url}
          alt={name}
          sx={{ height: "100%", width: "100%", objectFit: "cover" }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </Box>

     
      <CardContent
        sx={{
          p: 2,
          "&:last-child": { pb: 2 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "nowrap",
            gap: 1,
          }}
        >
          <Box sx={{ overflow: "hidden", minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              noWrap
              sx={{ fontWeight: 800, lineHeight: 1.2, mb: 0.5 }}
            >
              {name}
            </Typography>

            <Typography
              variant="body2"
              noWrap
              sx={{ color: "#555", fontSize: "0.85rem" }}
            >
              {age} ani |{" "}
              {gender === "Male"
                ? "Mascul"
                : gender === "Female"
                  ? "Femelă"
                  : gender}
            </Typography>
          </Box>

          <Box
            sx={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Chip
              size="small"
              label={status}
              sx={{
                fontWeight: 600,
                backgroundColor: "#f0f0f0",
                height: "24px",
                fontSize: "0.75rem",
              }}
            />

            <Button
              variant="contained"
              size="small"
              sx={{
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 700,
                backgroundColor: "#a91111",
                py: 0.5,
                px: 1.5,
                "&:hover": { backgroundColor: "#8a0d0d" },
              }}
              onClick={() => navigate(`/user/animals/${animal.id}`)}
            >
              Vezi detalii
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
