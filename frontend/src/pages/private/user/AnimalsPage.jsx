import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Pagination,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnimals } from "../../../features/animals/animalsSlice";
import AnimalCard from "../../../Components/animals/AnimalCard";

const filterFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#fff",
    fontSize: "0.9rem",
    "& fieldset": { borderColor: "#e0e0e0" },
    "&:hover fieldset": { borderColor: "#a91111" },
    "&.Mui-focused fieldset": { borderColor: "#a91111", borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#a91111" },
};

export default function AnimalsPage() {
  const dispatch = useDispatch();
  const { animals, loading, totalPages } = useSelector(
    (state) => state.animals,
  );

  const [filters, setFilters] = useState({
    species: "",
    gender: "",
    minAge: "",
    maxAge: "",
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAnimals({ ...filters, page }));
  }, [dispatch, filters, page]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 5 },
        py: { xs: 3, md: 4 },
        width: "100%",
        maxWidth: "1200px",
        mx: "auto",
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            color: "#1a1a1a",
            letterSpacing: "-0.5px",
            fontSize: { xs: "1.6rem", sm: "2rem", md: "2.125rem" },
          }}
        >
          Animale disponibile
        </Typography>
        <Typography variant="body2" sx={{ color: "#888", mt: 0.5 }}>
          Găsește companionul perfect pentru tine 🐾
        </Typography>
      </Box>

      {/* Box Filtre */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 5,
          p: { xs: 2, md: 3 },
          borderRadius: "16px",
          backgroundColor: "white",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          border: "1px solid #f0f0f0",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <TextField
          select
          size="small"
          label="Specie"
          name="species"
          value={filters.species}
          onChange={handleFilterChange}
          sx={{ ...filterFieldSx }}
        >
          <MenuItem value="">Toate</MenuItem>
          <MenuItem value="Dog">Câine</MenuItem>
          <MenuItem value="Cat">Pisică</MenuItem>
        </TextField>

        <TextField
          select
          size="small"
          label="Gen"
          name="gender"
          value={filters.gender}
          onChange={handleFilterChange}
          sx={{ ...filterFieldSx }}
        >
          <MenuItem value="">Toate</MenuItem>
          <MenuItem value="Male">Mascul</MenuItem>
          <MenuItem value="Female">Femelă</MenuItem>
        </TextField>

        <TextField
          size="small"
          label="Vârstă min."
          name="minAge"
          type="number"
          value={filters.minAge}
          onChange={handleFilterChange}
          InputProps={{
            endAdornment: <InputAdornment position="end">ani</InputAdornment>,
            inputProps: { min: 0 },
          }}
          sx={{ ...filterFieldSx }}
        />

        <TextField
          size="small"
          label="Vârstă max."
          name="maxAge"
          type="number"
          value={filters.maxAge}
          onChange={handleFilterChange}
          InputProps={{
            endAdornment: <InputAdornment position="end">ani</InputAdornment>,
            inputProps: { min: 0 },
          }}
          sx={{ ...filterFieldSx }}
        />
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress sx={{ color: "#a91111" }} />
        </Box>
      )}

      {!loading && animals.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 12,
            px: 3,
            borderRadius: "16px",
            backgroundColor: "#fafafa",
            border: "2px dashed #e8e8e8",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <PetsIcon sx={{ fontSize: 48, color: "#ddd", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" fontWeight={600}>
            Nu am găsit animale conform filtrelor tale
          </Typography>
          <Typography variant="body2" color="text.disabled" mt={1}>
            Încearcă să modifici vârsta sau specia pentru a vedea mai multe
            rezultate.
          </Typography>
        </Box>
      )}

      {/* Lista de animale: SCĂPĂM DE MUI GRID! Folosim CSS Grid curat pentru aliniere perfectă */}
      {!loading && animals.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr", // 1 pe rând pe telefon
              sm: "repeat(2, 1fr)", // 2 pe rând pe tabletă
              md: "repeat(3, 1fr)", // STRICT 3 pe rând pe desktop
            },
            gap: 3, // Spațiu egal pe toate direcțiile, fără offset-uri stupide
            width: "100%", // Ocupă fix lățimea containerului
            boxSizing: "border-box",
          }}
        >
          {animals.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </Box>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={6} mb={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: "8px",
                fontWeight: 500,
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "#a91111",
                color: "white",
                fontWeight: 700,
                "&:hover": { backgroundColor: "#8a0d0d" },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
