import { Box, Container, Typography, Grid, Button } from "@mui/material";
import AnimalCard from "../animals/AnimalCard";
import { fetchAnimals } from "../../features/animals/animalsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import styles from "./AnimalsPreview.module.css"
export default function AnimalsPreview() {
  const dispatch = useDispatch();
  const { animals, loading } = useSelector((state) => state.animals);
  useEffect(() => {
    dispatch(fetchAnimals());
  }, [dispatch]);
  return (
    <Box id="animals" sx={{ py: 10, backgroundColor: "#fff" }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            alignItems: "end",
            justifyContent: "space-between",
            gap: 2,
            mb: 4,
            flexWrap: "wrap",
          }}
        className={styles.beggining}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              Animale disponibile pentru adopție
            </Typography>
            <Typography variant="body1" sx={{ color: "#666", mt: 1 }}>
              Câteva suflete care abia așteaptă să-și găsească omul. 🐾
            </Typography>
          </Box>

          <Button
            variant="outlined"
            sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700 }}
            className={styles.details}
         >
            Vezi toate
          </Button>
        </Box>
        {loading && <p>Loading...</p>}

        <Grid container spacing={3}  className={styles.animalsBody}>
          {animals.slice(0, 3).map((animal) => (
            <Grid key={animal.id} item xs={12} sm={6} md={3}>
              <AnimalCard animal={animal} className={styles.animalsCards} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
