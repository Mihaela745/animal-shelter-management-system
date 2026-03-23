import { Box, Typography, Paper } from "@mui/material";
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
import AnimalMedicalAction from "../../../components/animals/AnimalMedicalAction";
import AnimalManagerActions from "../../../components/animals/AnimalManagerActions";

export default function AnimalDetailsPageManager() {
  const { id } = useParams();
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

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        pb: { xs: 12, md: 4 },
        width: "100%",
        boxSizing: "border-box",
        maxWidth: "1200px",
        margin: "0 auto",
        overflowX: "hidden",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
          backgroundColor: "white",
          minHeight: { md: "450px" },
          maxHeight: { md: "600px" },
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            height: { xs: "320px", md: "auto" },
            display: "flex",
            boxSizing: "border-box",
          }}
        >
          <Box sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
            <AnimalGallery animal={selectedAnimal} />
          </Box>
        </Box>

        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: { xs: 3, md: 5 },
            overflowY: { xs: "visible", md: "auto" },
            boxSizing: "border-box",
          }}
        >
          <AnimalInfo animal={selectedAnimal} />
          <AnimalMedicalAction animal={selectedAnimal} />
        </Box>
      </Paper>
    </Box>
  );
}
