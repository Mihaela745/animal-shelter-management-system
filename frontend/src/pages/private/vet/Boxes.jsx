import {
  Box,
  Typography,
  TextField,
  MenuItem,
  CircularProgress,
  InputAdornment,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PetsIcon from "@mui/icons-material/Pets";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchBoxes } from "../../../features/boxes/boxesSlice";
import { fetchSpecies } from "../../../features/species/speciesSlice";
import { fetchResponsiblesByBoxId } from "../../../features/responsibleBoxes/responsibleBoxesSlice";
import { formatSpecies } from "../../../utils/labels";

const RED = "#a91111";
const RED_LIGHT = "#fff0f0";

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
  "& .MuiInputBase-input": { py: "10px", px: "14px" },
};

function BoxCard({ boxItem, speciesName, responsibles, onOpenAnimals }) {
  const occupancyRate =
    boxItem.capacity > 0
      ? Math.round((boxItem.current_occupancy / boxItem.capacity) * 100)
      : 0;

  const occupancyColor =
    occupancyRate >= 100 ? "#d32f2f" : occupancyRate >= 70 ? "#f59e0b" : "#2e7d32";

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: "16px",
        border: "1.5px solid #f0f0f0",
        p: 2.5,
        cursor: "pointer",
        transition: "box-shadow 0.2s, transform 0.2s",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          transform: "translateY(-2px)",
        },
      }}
      onClick={() => onOpenAnimals(boxItem)}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
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
            }}
          >
            {boxItem.box_number}
          </Typography>

          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              mt: 0.4,
              px: 1,
              py: 0.2,
              borderRadius: "6px",
              backgroundColor: RED_LIGHT,
              border: "1px solid rgba(169,17,17,0.15)",
            }}
          >
            <PetsIcon sx={{ fontSize: 11, color: RED }} />
            <Typography
              sx={{ fontSize: "0.68rem", fontWeight: 700, color: RED }}
            >
              {speciesName}
            </Typography>
          </Box>
        </Box>

        <Chip
          label={`${occupancyRate}% ocupat`}
          size="small"
          sx={{
            backgroundColor: "#fafafa",
            border: "1px solid #ececec",
            "& .MuiChip-label": {
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "#555",
            },
          }}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
        <Typography sx={{ fontSize: "0.8rem", color: "#666" }}>
          Capacitate: <strong>{boxItem.current_occupancy}</strong> /{" "}
          <strong>{boxItem.capacity}</strong>
        </Typography>

        <Typography sx={{ fontSize: "0.8rem", color: "#666" }}>
          Animale in boxa: <strong>{boxItem.current_occupancy || 0}</strong>
        </Typography>

        <Box
          sx={{
            height: 8,
            borderRadius: 999,
            backgroundColor: "#f2f2f2",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: `${Math.min(occupancyRate, 100)}%`,
              backgroundColor: occupancyColor,
            }}
          />
        </Box>

        <Box sx={{ mt: 0.6 }}>
          <Typography
            sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#999", mb: 1 }}
          >
            Responsabili
          </Typography>

          {responsibles.length === 0 ? (
            <Typography sx={{ fontSize: "0.78rem", color: "#bbb" }}>
              Nu exista responsabili asignati
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
              {responsibles.map((responsible) => (
                <Chip
                  key={responsible.id}
                  icon={<PersonOutlineIcon />}
                  label={responsible.Staff?.name || "Responsabil"}
                  sx={{
                    borderRadius: "10px",
                    backgroundColor: "#fafafa",
                    border: "1px solid #ececec",
                    "& .MuiChip-label": {
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    },
                    "& .MuiChip-icon": {
                      color: "#999",
                      fontSize: "0.95rem",
                    },
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

        <Box
          sx={{
            mt: 0.8,
            p: 1.2,
            borderRadius: "12px",
            backgroundColor: "#fafafa",
            border: "1px solid #f0f0f0",
          }}
        >
          <Typography sx={{ fontSize: "0.78rem", color: "#777", lineHeight: 1.5 }}>
            Apasa pe boxa pentru a vedea animalele din ea. Operatiile de modificare
            raman disponibile doar pentru manager.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function BoxesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { boxes, loading: boxesLoading } = useSelector((s) => s.boxes);
  const { species, loading: speciesLoading } = useSelector((s) => s.species);
  const { responsiblesByBoxId, loading: responsiblesLoading } = useSelector(
    (s) => s.responsibleBoxes,
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const filterSpecies = searchParams.get("species") || "all";

  useEffect(() => {
    dispatch(fetchBoxes());
    dispatch(fetchSpecies());
  }, [dispatch]);

  useEffect(() => {
    boxes.forEach((boxItem) => {
      dispatch(fetchResponsiblesByBoxId(boxItem.id));
    });
  }, [boxes, dispatch]);

  const filteredBoxes = boxes.filter((boxItem) => {
    const matchesSearch = (boxItem.box_number || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesSpecies =
      filterSpecies === "all" ||
      String(boxItem.species_id) === String(filterSpecies);

    return matchesSearch && matchesSpecies;
  });

  const getSpeciesName = (speciesId) => {
    const matchedSpecies = species.find((item) => item.id === speciesId);
    return matchedSpecies ? formatSpecies(matchedSpecies.name) : "Specie necunoscuta";
  };

  const handleSearchChange = (value) => {
    const params = Object.fromEntries(searchParams);
    if (value) {
      params.search = value;
    } else {
      delete params.search;
    }
    setSearchParams(params);
  };

  const handleSpeciesFilterChange = (value) => {
    const params = Object.fromEntries(searchParams);
    if (value && value !== "all") {
      params.species = value;
    } else {
      delete params.species;
    }
    setSearchParams(params);
  };

  const handleOpenAnimals = (boxItem) => {
    navigate(`/vet/boxes/${boxItem.id}/animals`);
  };

  const isLoading = boxesLoading || speciesLoading || responsiblesLoading;

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
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: { xs: 2.5, md: 4 },
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
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
              <Inventory2OutlinedIcon sx={{ color: "white", fontSize: 18 }} />
            </Box>
            <Typography
              sx={{
                fontSize: "1.4rem",
                fontWeight: 800,
                color: "#1a1a1a",
                letterSpacing: "-0.5px",
              }}
            >
              Boxe
            </Typography>
          </Box>
          <Typography sx={{ fontSize: "0.85rem", color: "#aaa", ml: "52px" }}>
            Vizualizare boxe disponibile pentru consult
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 1.5,
          mb: { xs: 2, md: 3 },
        }}
      >
        <TextField
          placeholder="Cauta dupa numarul boxei..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          sx={fieldSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: "#ccc" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          value={filterSpecies}
          onChange={(e) => handleSpeciesFilterChange(e.target.value)}
          sx={fieldSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PetsIcon sx={{ fontSize: 18, color: "#ccc" }} />
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value="all">Toate speciile</MenuItem>
          {species.map((item) => (
            <MenuItem key={item.id} value={String(item.id)}>
              {formatSpecies(item.name)}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: RED }} />
        </Box>
      ) : filteredBoxes.length === 0 ? (
        <Box
          sx={{
            py: 8,
            textAlign: "center",
            backgroundColor: "white",
            borderRadius: "16px",
            border: "1.5px dashed #e0e0e0",
          }}
        >
          <Typography
            sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#bbb" }}
          >
            Nicio boxa gasita
          </Typography>
          <Typography sx={{ fontSize: "0.82rem", color: "#ccc", mt: 0.5 }}>
            Incearca sa schimbi filtrele sau termenul de cautare
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
          {filteredBoxes.map((boxItem) => (
            <BoxCard
              key={boxItem.id}
              boxItem={boxItem}
              speciesName={getSpeciesName(boxItem.species_id)}
              responsibles={responsiblesByBoxId[boxItem.id] || []}
              onOpenAnimals={handleOpenAnimals}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
