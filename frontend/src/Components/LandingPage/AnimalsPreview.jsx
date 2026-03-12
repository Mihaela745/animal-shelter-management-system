import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import AnimalCard from "../animals/AnimalCard";
import { fetchAnimals } from "../../features/animals/animalsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function AnimalsPreview() {
  const dispatch = useDispatch();
  const { animals, loading } = useSelector((state) => state.animals);

  useEffect(() => {
    dispatch(fetchAnimals());
  }, [dispatch]);

  return (
    <Box
      id="animals"
      sx={{ py: { xs: 8, md: 12 }, backgroundColor: "#fafafa" }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            mb: 6,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: "#a91111",
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "#a91111",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontFamily: "sans-serif",
                }}
              >
                Adopții
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: { xs: "1.8rem", md: "2.4rem" },
                fontWeight: 900,
                color: "#0f0f0f",
                letterSpacing: "-1px",
                lineHeight: 1.1,
                fontFamily: "'Georgia', serif",
              }}
            >
              Suflete care aşteaptă
              <br />
              <Box component="span" sx={{ color: "#a91111" }}>
                un cămin
              </Box>
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/register"
            sx={{
              border: "1.5px solid #e0e0e0",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              color: "#444",
              px: 2.5,
              py: 1,
              fontSize: "0.85rem",
              fontFamily: "sans-serif",
              "&:hover": {
                borderColor: "#a91111",
                color: "#a91111",
                backgroundColor: "#fff0f0",
              },
              transition: "all 0.2s",
            }}
          >
            Vezi toate →
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#a91111" }} />
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
              gap: 3,
            }}
          >
            {animals.slice(0, 3).map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </Box>
        )}

        {!loading && animals.length > 3 && (
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Typography
              sx={{
                fontSize: "0.85rem",
                color: "#aaa",
                mb: 2,
                fontFamily: "sans-serif",
              }}
            >
              Și multe alte animale te așteaptă
            </Typography>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              sx={{
                backgroundColor: "#a91111",
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 700,
                px: 4,
                py: 1.2,
                fontFamily: "sans-serif",
                "&:hover": {
                  backgroundColor: "#8a0d0d",
                  boxShadow: "0 6px 20px rgba(169,17,17,0.3)",
                },
              }}
            >
              Explorează toate animalele
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}
