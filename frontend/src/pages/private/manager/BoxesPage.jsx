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
  InputAdornment,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PetsIcon from "@mui/icons-material/Pets";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchBoxes } from "../../../features/boxes/boxesSlice";
import {
  createResponsibleBox,
  deleteResponsibleBox,
  fetchResponsibleBoxes,
} from "../../../features/responsibleBoxes/responsibleBoxesSlice";
import { fetchSpecies } from "../../../features/species/speciesSlice";
import { fetchStaff } from "../../../features/staff/staffSlice";
import { formatSpecies } from "../../../utils/labels";
import { useNotification } from "../../../context/NotificationContext";

const RED = "#a91111";
const RED_LIGHT = "#fff0f0";
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
  "& .MuiInputBase-input": { py: "10px", px: "14px" },
};

function BoxCard({
  boxItem,
  speciesName,
  responsibles,
  onAssign,
  onRemove,
  onOpenAnimals,
}) {
  const occupancyRate =
    boxItem.capacity > 0
      ? Math.round((boxItem.current_occupancy / boxItem.capacity) * 100)
      : 0;

  return (
    <Box
      onClick={() => onOpenAnimals(boxItem)}
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

        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={(event) => {
            event.stopPropagation();
            onAssign(boxItem);
          }}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            backgroundColor: RED,
            color: "white",
            borderRadius: "10px",
            "&:hover": { backgroundColor: RED_DARK },
            flexShrink: 0,
          }}
        >
          Asigneaza
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
        <Typography sx={{ fontSize: "0.8rem", color: "#666" }}>
          Capacitate: <strong>{boxItem.current_occupancy}</strong> /{" "}
          <strong>{boxItem.capacity}</strong>
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
              backgroundColor:
                occupancyRate >= 100
                  ? "#d32f2f"
                  : occupancyRate >= 70
                    ? "#f59e0b"
                    : "#2e7d32",
            }}
          />
        </Box>

        <Box sx={{ mt: 0.5 }}>
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
                  label={responsible.Staff?.name || "Responsabil"}
                  onDelete={(event) => {
                    event.stopPropagation();
                    onRemove(responsible);
                  }}
                  deleteIcon={<DeleteOutlineIcon />}
                  sx={{
                    borderRadius: "10px",
                    backgroundColor: "#fafafa",
                    border: "1px solid #ececec",
                    "& .MuiChip-label": {
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    },
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default function BoxesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notifySuccess, notifyError } = useNotification();
  const { boxes, loading: boxesLoading } = useSelector((s) => s.boxes);
  const { responsibleBoxes, loading: responsibilitiesLoading } = useSelector(
    (s) => s.responsibleBoxes,
  );
  const { species } = useSelector((s) => s.species);
  const { staff } = useSelector((s) => s.staff);

  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const filterSpecies = searchParams.get("species") || "all";
  const [openAssign, setOpenAssign] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);
  const [selectedResponsible, setSelectedResponsible] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchBoxes());
    dispatch(fetchResponsibleBoxes());
    dispatch(fetchSpecies());
    dispatch(fetchStaff());
  }, [dispatch]);

  const caretakers = useMemo(
    () =>
      staff.filter(
        (member) =>
          member.Position?.title === "Caretaker" ||
          member.position === "Caretaker",
      ),
    [staff],
  );

  const responsiblesByBoxId = useMemo(() => {
    return responsibleBoxes.reduce((acc, item) => {
      const boxId = item.box_id || item.Boxes?.id;
      if (!boxId) {
        return acc;
      }

      if (!acc[boxId]) {
        acc[boxId] = [];
      }

      acc[boxId].push(item);
      return acc;
    }, {});
  }, [responsibleBoxes]);

  const filteredBoxes = boxes.filter((boxItem) => {
    const matchesSearch = (boxItem.box_number || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesSpecies =
      filterSpecies === "all" || String(boxItem.species_id) === String(filterSpecies);
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
    navigate(`/manager/boxes/${boxItem.id}/animals`);
  };

  const handleOpenAssign = (boxItem) => {
    setSelectedBox(boxItem);
    setSelectedResponsible("");
    setError(null);
    setOpenAssign(true);
  };

  const handleAssign = async () => {
    if (!selectedBox || !selectedResponsible) {
      return;
    }

    setAssignLoading(true);
    setError(null);
    const result = await dispatch(
      createResponsibleBox({
        box_id: selectedBox.id,
        responsible_id: selectedResponsible,
      }),
    );
    setAssignLoading(false);

    if (result.meta?.requestStatus === "fulfilled") {
      await dispatch(fetchResponsibleBoxes());
      setOpenAssign(false);
      setSelectedBox(null);
      setSelectedResponsible("");
      notifySuccess("Responsabilul a fost asignat cu succes.");
      return;
    }

    const message =
      typeof result.payload === "string"
        ? result.payload
        : "A aparut o eroare la asignare. Incearca din nou.";
    setError(message);
    notifyError(message);
  };

  const handleRemoveResponsible = async (responsibleRelation) => {
    setDeleteLoadingId(responsibleRelation.id);
    const result = await dispatch(deleteResponsibleBox(responsibleRelation.id));
    await dispatch(fetchResponsibleBoxes());
    setDeleteLoadingId(null);

    if (result.meta?.requestStatus === "fulfilled") {
      notifySuccess("Responsabilul a fost eliminat cu succes.");
      return;
    }

    notifyError(
      typeof result.payload === "string"
        ? result.payload
        : "Nu am putut elimina responsabilul.",
    );
  };

  const isLoading = boxesLoading || responsibilitiesLoading;

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
            {boxes.length} boxe in adapost
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
          <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#bbb" }}>
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
              onAssign={handleOpenAssign}
              onRemove={handleRemoveResponsible}
              onOpenAnimals={handleOpenAnimals}
            />
          ))}
        </Box>
      )}

      <Dialog
        open={openAssign}
        onClose={() => !assignLoading && setOpenAssign(false)}
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                backgroundColor: RED_LIGHT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PersonOutlineIcon sx={{ color: RED, fontSize: 18 }} />
            </Box>
            <Typography fontWeight={800} fontSize="1rem">
              Asigneaza responsabil pentru {selectedBox?.box_number}
            </Typography>
          </Box>
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
            label="Ingrijitor"
            value={selectedResponsible}
            onChange={(e) => setSelectedResponsible(e.target.value)}
            sx={fieldSx}
          >
            <MenuItem value="" disabled>
              <em style={{ color: "#bbb" }}>Alege responsabilul</em>
            </MenuItem>
            {caretakers.map((member) => (
              <MenuItem key={member.id} value={member.id}>
                {member.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => {
              setOpenAssign(false);
              setError(null);
            }}
            disabled={assignLoading}
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
            onClick={handleAssign}
            disabled={assignLoading || !selectedResponsible}
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
            {assignLoading ? (
              <CircularProgress size={18} sx={{ color: "white" }} />
            ) : (
              "Asigneaza"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {deleteLoadingId && (
        <Box
          sx={{
            position: "fixed",
            right: 16,
            bottom: 16,
            backgroundColor: "white",
            border: "1px solid #eee",
            borderRadius: "12px",
            px: 2,
            py: 1.2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            zIndex: 1400,
          }}
        >
          <Typography sx={{ fontSize: "0.8rem", color: "#666" }}>
            Se actualizeaza responsabilul...
          </Typography>
        </Box>
      )}
    </Box>
  );
}
