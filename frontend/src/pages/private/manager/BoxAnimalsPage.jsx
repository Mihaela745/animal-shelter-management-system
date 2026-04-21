import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Chip,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PetsIcon from "@mui/icons-material/Pets";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchAnimals,
  updateAnimal,
} from "../../../features/animals/animalsSlice";
import { fetchBoxes, fetchBoxById } from "../../../features/boxes/boxesSlice";
import { formatAnimalStatus, formatGender } from "../../../utils/labels";

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

function AnimalMoveCard({ animal, currentBoxNumber, onMove }) {
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
            {animal.Species?.name || "-"} • {formatGender(animal.gender)} •{" "}
            {animal.age ?? "-"} ani
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
        startIcon={<SwapHorizIcon />}
        onClick={() => onMove(animal)}
        sx={{
          backgroundColor: RED,
          borderRadius: "10px",
          textTransform: "none",
          fontWeight: 700,
          "&:hover": { backgroundColor: RED_DARK },
        }}
      >
        Muta in alta boxa
      </Button>
    </Box>
  );
}

export default function BoxAnimalsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { animals, loading } = useSelector((state) => state.animals);
  const { boxes, selectedBox, loading: boxesLoading } = useSelector(
    (state) => state.boxes,
  );

  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [destinationBoxId, setDestinationBoxId] = useState("");
  const [openMove, setOpenMove] = useState(false);
  const [moveLoading, setMoveLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchAnimals({ box_id: id, limit: 9999, page: 1 }));
    dispatch(fetchBoxes());
    dispatch(fetchBoxById(id));
  }, [dispatch, id]);

  const candidateBoxes = useMemo(() => {
    if (!selectedAnimal) {
      return [];
    }

    return boxes.filter(
      (boxItem) =>
        boxItem.id !== selectedAnimal.box_id &&
        boxItem.species_id === selectedAnimal.species_id,
    );
  }, [boxes, selectedAnimal]);

  const handleOpenMove = (animal) => {
    setSelectedAnimal(animal);
    setDestinationBoxId("");
    setError(null);
    setOpenMove(true);
  };

  const handleMoveAnimal = async () => {
    if (!selectedAnimal || !destinationBoxId) {
      return;
    }

    setMoveLoading(true);
    setError(null);
    const result = await dispatch(
      updateAnimal({
        id: selectedAnimal.id,
        data: {
          box_id: Number(destinationBoxId),
        },
      }),
    );
    setMoveLoading(false);

    if (result.meta?.requestStatus === "fulfilled") {
      await dispatch(fetchAnimals({ box_id: id, limit: 9999, page: 1 }));
      await dispatch(fetchBoxes());
      await dispatch(fetchBoxById(id));
      setOpenMove(false);
      setSelectedAnimal(null);
      setDestinationBoxId("");
      return;
    }

    setError(
      typeof result.payload === "string"
        ? result.payload
        : "A aparut o eroare la mutarea animalului. Incearca din nou.",
    );
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
            onClick={() => navigate("/manager/boxes")}
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
            {animals.length} animale in aceasta boxa
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
            Poti reveni la lista de boxe pentru alte actiuni
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
            <AnimalMoveCard
              key={animal.id}
              animal={animal}
              currentBoxNumber={animal.Boxes?.box_number || currentBoxNumber}
              onMove={handleOpenMove}
            />
          ))}
        </Box>
      )}

      <Dialog
        open={openMove}
        onClose={() => !moveLoading && setOpenMove(false)}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            p: 1,
            width: { xs: "calc(100vw - 24px)", sm: 420 },
            maxWidth: "calc(100vw - 24px)",
            m: { xs: 1.5, sm: 2 },
          },
        }}
      >
        <DialogTitle sx={{ pb: 0 }}>
          <Typography fontWeight={800} fontSize="1rem">
            Muta {selectedAnimal?.name} in alta boxa
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: "1.2rem !important" }}>
          {error && (
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
                {error}
              </Typography>
            </Box>
          )}

          <TextField
            select
            fullWidth
            label="Boxa destinatie"
            value={destinationBoxId}
            onChange={(e) => setDestinationBoxId(e.target.value)}
            sx={fieldSx}
          >
            <MenuItem value="" disabled>
              <em style={{ color: "#bbb" }}>Alege boxa noua</em>
            </MenuItem>
            {candidateBoxes.map((boxItem) => (
              <MenuItem key={boxItem.id} value={boxItem.id}>
                {boxItem.box_number} ({boxItem.current_occupancy}/{boxItem.capacity})
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => {
              setOpenMove(false);
              setError(null);
            }}
            disabled={moveLoading}
            sx={{
              color: "#999",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "10px",
            }}
          >
            Anuleaza
          </Button>
          <Button
            variant="contained"
            onClick={handleMoveAnimal}
            disabled={moveLoading || !destinationBoxId}
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
            {moveLoading ? (
              <CircularProgress size={18} sx={{ color: "white" }} />
            ) : (
              "Muta animalul"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
