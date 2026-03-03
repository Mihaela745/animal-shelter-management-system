import {
  Box,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Pagination,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnimals } from "../../../features/animals/animalsSlice";
import AnimalCard from "../../../Components/animals/AnimalCard";

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
        p: { xs: 2, md: 4 },
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      <Typography variant="h4" fontWeight={800} mb={3} sx={{ color: "#333" }}>
        Animale disponibile 🐾
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 5,
          borderRadius: "16px",
          backgroundColor: "white",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)", 
          border: "1px solid #f0f0f0",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              size="small"
              label="Specie"
              name="species"
              value={filters.species}
              onChange={handleFilterChange}
            >
              <MenuItem value="">Toate</MenuItem>
              <MenuItem value="Dog">Câine</MenuItem>
              <MenuItem value="Cat">Pisică</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              size="small"
              label="Gen"
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
            >
              <MenuItem value="">Toate</MenuItem>
              <MenuItem value="Male">Mascul</MenuItem>
              <MenuItem value="Female">Femelă</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Vârstă minimă"
              name="minAge"
              type="number"
              value={filters.minAge}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Vârstă maximă"
              name="maxAge"
              type="number"
              value={filters.maxAge}
              onChange={handleFilterChange}
            />
          </Grid>
        </Grid>
      </Paper>

      {loading && (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress sx={{ color: "#a91111" }} />
        </Box>
      )}

      {!loading && animals.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 10,
            px: 2,
            backgroundColor: "#fafafa",
            borderRadius: "16px",
            border: "2px dashed #e0e0e0",
          }}
        >
          <Typography variant="h6" color="text.secondary" fontWeight={500}>
            Nu am găsit animale conform filtrelor tale 😿
          </Typography>
          <Typography variant="body2" color="text.disabled" mt={1}>
            Încearcă să modifici vârsta sau specia pentru a vedea mai multe
            rezultate.
          </Typography>
        </Box>
      )}


      <Grid container spacing={3} alignItems="stretch">
        {animals.map((animal) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={animal.id}>
            <AnimalCard animal={animal} />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={6} mb={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            sx={{
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "#a91111",
                color: "white",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#8a0d0d" },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
