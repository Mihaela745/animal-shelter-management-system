import { Box, Typography, Button, CircularProgress, Chip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PetsIcon from "@mui/icons-material/Pets";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAnimals } from "../../../features/animals/animalsSlice";
import { fetchBoxById } from "../../../features/boxes/boxesSlice";
import { formatAnimalStatus, formatGender, formatSpecies } from "../../../utils/labels";

const RED = "#a91111";
const RED_DARK = "#8a0d0d";

function AnimalViewCard({ animal, currentBoxNumber, onOpen }) {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: "16px",
        border: "1.5px solid #f0f0f0",
        p: 2.5,
        transition: "box-shadow 0.2s, transform 0.2s",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 1.5,
          mb: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1rem",
              color: "#1a1a1a",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {animal.name}
          </Typography>
          <Typography sx={{ fontSize: "0.78rem", color: "#888", mt: 0.5 }}>
            {formatSpecies(animal.Species?.name)} • {formatGender(animal.gender)} • {animal.age ?? "-"} ani
          </Typography>
        </Box>

        <Chip
          size="small"
          label={formatAnimalStatus(animal.status)}
          sx={{
            fontWeight: 700,
            backgroundColor: "#f5f5f5",
            flexShrink: 0,
          }}
        />
      </Box>

      <Typography sx={{ fontSize: "0.82rem", color: "#666", mb: 2 }}>
        Boxa curenta: <strong>{currentBoxNumber}</strong>
      </Typography>

      <Button
        fullWidth
        variant="contained"
        startIcon={<VisibilityOutlinedIcon />}
        onClick={() => onOpen(animal)}
        sx={{
          backgroundColor: RED,
          borderRadius: "10px",
          textTransform: "none",
          fontWeight: 700,
          "&:hover": { backgroundColor: RED_DARK },
        }}
      >
        Vezi detalii
      </Button>
    </Box>
  );
}

export default function CaretakerBoxAnimalsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { animals, loading } = useSelector((state) => state.animals);
  const { selectedBox, loading: boxesLoading } = useSelector(
    (state) => state.boxes,
  );

  useEffect(() => {
    dispatch(fetchAnimals({ box_id: id, limit: 9999, page: 1 }));
    dispatch(fetchBoxById(id));
  }, [dispatch, id]);

  const handleOpenAnimal = (animal) => {
    navigate(`/staff/animals/${animal.id}`);
  };

  const currentBoxNumber = selectedBox?.box_number || `Boxa #${id}`;

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2, md: 4 },
        pb: { xs: 10, sm: 4 },
        maxWidth: 1200,
        mx: "auto",
        width: "100%",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          mb: { xs: 2.5, md: 4 },
        }}
      >
        <Box>
          <Button
            onClick={() => navigate("/staff/boxes")}
            startIcon={<ArrowBackIcon />}
            sx={{
              mb: 1.5,
              color: "#666",
              textTransform: "none",
              fontWeight: 700,
              px: 0,
              "&:hover": { backgroundColor: "transparent", color: "#222" },
            }}
          >
            Inapoi la boxe
          </Button>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                backgroundColor: RED,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PetsIcon sx={{ color: "white", fontSize: 18 }} />
            </Box>
            <Typography
              sx={{
                fontSize: "1.4rem",
                fontWeight: 800,
                color: "#1a1a1a",
                letterSpacing: "-0.5px",
              }}
            >
              Animalele din {currentBoxNumber}
            </Typography>
          </Box>

          <Typography sx={{ fontSize: "0.85rem", color: "#aaa", ml: "52px" }}>
            Vizualizare pentru boxele tale atribuite
          </Typography>
        </Box>
      </Box>

      {loading || boxesLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: RED }} />
        </Box>
      ) : animals.length === 0 ? (
        <Box
          sx={{
            py: 8,
            textAlign: "center",
            backgroundColor: "white",
            borderRadius: "16px",
            border: "1.5px dashed #e0e0e0",
          }}
        >
          <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#bbb" }}>
            Nu exista animale in aceasta boxa
          </Typography>
          <Typography sx={{ fontSize: "0.82rem", color: "#ccc", mt: 0.5 }}>
            Poti reveni la lista de boxe pentru a verifica alta boxa atribuita
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: { xs: 1.5, md: 2 },
            alignItems: "stretch",
          }}
        >
          {animals.map((animal) => (
            <AnimalViewCard
              key={animal.id}
              animal={animal}
              currentBoxNumber={animal.Boxes?.box_number || currentBoxNumber}
              onOpen={handleOpenAnimal}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
