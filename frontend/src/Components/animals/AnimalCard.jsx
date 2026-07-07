import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formatAnimalStatus, formatGender } from "../../utils/labels";

export default function AnimalCard({ animal }) {
  const { name, age, gender, image_url, status } = animal;
  const [imageFailed, setImageFailed] = useState(false);
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth?.user?.role);
  const handleNavigation = () => {
    if (role === "Manager") {
      navigate(`/manager/animals/${animal.id}`);
    } else if (role === "user") {
      navigate(`/user/animals/${animal.id}`);
    } else if (role === "Vet") {
      navigate(`/vet/animals/${animal.id}`);
    } else if (role === "Caretaker") {
      navigate(`/staff/animals/${animal.id}`);
    } else {
      navigate("/login", {
        state: {
          postLoginAnimalId: animal.id,
        },
      });
    }
  };
  return (
    <Box
      sx={{
        height: "100%",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px",
      }}
    >
      <Box
        sx={{
          height: 180,
          width: "100%",
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {image_url && !imageFailed ? (
          <CardMedia
            component="img"
            image={image_url}
            alt={name}
            sx={{ height: "100%", width: "100%", objectFit: "cover" }}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <PetsIcon sx={{ fontSize: 48, color: "#ddd" }} />
        )}
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
              {formatGender(gender)}
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
              label={formatAnimalStatus(status)}
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
              onClick={handleNavigation}
            >
              Vezi detalii
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
    </Box>
  );
}
