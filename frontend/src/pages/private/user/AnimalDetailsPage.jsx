import { Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnimalById } from "../../../features/animals/animalsSlice";
import {
  fetchBreedMetadata,
  clearBreedMetadata,
} from "../../../features/breedMetadata/breedMetadata";
import AnimalGallery from "../../../components/animals/AnimalGallery";
import AnimalInfo from "../../../components/animals/AnimalInfo";
import AnimalActions from "../../../components/animals/AnimalActions";

export default function AnimalDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedAnimal, loading } = useSelector((state) => state.animals);

  useEffect(() => {
    dispatch(fetchAnimalById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedAnimal?.breed) {
      dispatch(fetchBreedMetadata(selectedAnimal.breed));
    }
    return () => {
      dispatch(clearBreedMetadata());
    };
  }, [dispatch, selectedAnimal]);

  if (loading)
    return (
      <Typography sx={{ p: 4, textAlign: "center" }}>
        Se încarcă detaliile...
      </Typography>
    );
  if (!selectedAnimal) return null;

  if (selectedAnimal.status !== "Available") {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "900px", margin: "0 auto" }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: "24px",
            textAlign: "center",
            boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
          }}
        >
          <Typography variant="h5" fontWeight={800} mb={1}>
            Acest animal nu mai este disponibil
          </Typography>
          <Typography color="text.secondary" mb={3}>
            Animalul a fost deja adoptat sau nu mai este disponibil pentru
            utilizatori.
          </Typography>
          <Typography
            onClick={() => navigate("/user/animals")}
            sx={{
              color: "#a91111",
              fontWeight: 700,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Inapoi la animalele disponibile
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        maxWidth: "1200px",
        margin: "0 auto",
        height: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          borderRadius: "24px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
          height: "100%",
        }}
      >
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          borderRadius: "24px",
          overflow: "hidden",
          backgroundColor: "white",
          height: "100%",
        }}
      >
        <Box
          sx={{
            flex: { xs: "0 0 40%", md: 1 },
            display: "flex",
          }}
        >
          <AnimalGallery animal={selectedAnimal} />
        </Box>

        <Box
          sx={{
            flex: { xs: "0 0 60%", md: 1 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            p: { xs: 3, md: 5 },
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <AnimalInfo animal={selectedAnimal} />
          <AnimalActions animal={selectedAnimal} />
        </Box>
      </Paper>
      </Box>
    </Box>
  );
}
