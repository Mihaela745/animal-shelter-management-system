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
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnimals } from "../../../features/animals/animalsSlice";
import AnimalCard from "../../../components/animals/AnimalCard";
import { useSearchParams } from "react-router-dom";
import { formatGender, formatSpecies } from "../../../utils/labels";

const filterFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#fff",
    fontSize: "0.9rem",
    "& fieldset": { borderColor: "#e0e0e0" },
    "&:hover fieldset": { borderColor: "#a91111" },
    "&.Mui-focused fieldset": {
      borderColor: "#a91111",
      borderWidth: "1.5px",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#a91111" },
};

export default function AnimalsPageManager() {
  const dispatch = useDispatch();
  const { animals, loading, totalPages } = useSelector(
    (state) => state.animals,
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    name: searchParams.get("name") || "",
    species: searchParams.get("species") || "",
    gender: searchParams.get("gender") || "",
    minAge: searchParams.get("minAge") || "",
    maxAge: searchParams.get("maxAge") || "",
  };

  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    dispatch(fetchAnimals({ ...filters, page }));
  }, [
    dispatch,
    filters.name,
    filters.species,
    filters.gender,
    filters.minAge,
    filters.maxAge,
    page,
  ]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const params = Object.fromEntries(searchParams);

    if (value) {
      params[name] = value;
    } else {
      delete params[name];
    }

    params.page = "1";
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChange = (e, value) => {
    const params = Object.fromEntries(searchParams);
    params.page = String(value);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          Găsește companionul perfect pentru tine
        </Typography>

        {!loading && (
          <Typography variant="body2" sx={{ color: "#666", mt: 1 }}>
            {animals.length} animale găsite
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(5, 1fr)",
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
          size="small"
          label="Nume"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          placeholder="Caută după nume"
          sx={filterFieldSx}
        />

        <TextField
          select
          size="small"
          label="Specie"
          name="species"
          value={filters.species}
          onChange={handleFilterChange}
          sx={filterFieldSx}
        >
          <MenuItem value="">Toate</MenuItem>
          <MenuItem value="Dog">{formatSpecies("Dog")}</MenuItem>
          <MenuItem value="Cat">{formatSpecies("Cat")}</MenuItem>
        </TextField>

        <TextField
          select
          size="small"
          label="Gen"
          name="gender"
          value={filters.gender}
          onChange={handleFilterChange}
          sx={filterFieldSx}
        >
          <MenuItem value="">Toate</MenuItem>
          <MenuItem value="Male">Mascul</MenuItem>
          <MenuItem value="Female">{formatGender("Female")}</MenuItem>
        </TextField>

        <TextField
          size="small"
          label="Vârsta min."
          name="minAge"
          type="number"
          value={filters.minAge}
          onChange={handleFilterChange}
          InputProps={{
            endAdornment: <InputAdornment position="end">ani</InputAdornment>,
            inputProps: { min: 0 },
          }}
          sx={filterFieldSx}
        />

        <TextField
          size="small"
          label="Vârsta max."
          name="maxAge"
          type="number"
          value={filters.maxAge}
          onChange={handleFilterChange}
          InputProps={{
            endAdornment: <InputAdornment position="end">ani</InputAdornment>,
            inputProps: { min: 0 },
          }}
          sx={filterFieldSx}
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
            Încearcă să modifici numele, vârsta sau specia pentru a vedea mai
            multe rezultate.
          </Typography>
        </Box>
      )}

      {!loading && animals.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {animals.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </Box>
      )}

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={6} mb={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
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
