import { Box, Typography } from "@mui/material";
import AnimalCard from "../animals/AnimalCard";

const ResultsGrid = ({ results }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2,1fr)",
          md: "repeat(3,1fr)",
        },
        gap: 3,
        mt: 2,
      }}
    >
      {results
        .filter((animal) => animal != null && animal.id != null)
        .map((animal) => (
          <div key={animal.id}>
            <AnimalCard animal={animal} />
            {animal.explanation && (
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 1,
                  px: 1,
                  color: "#666",
                  fontStyle: "italic",
                  lineHeight: 1.4,
                }}
              >
                🤖 {animal.explanation}
              </Typography>
            )}
          </div>
        ))}
    </Box>
  );
};

export default ResultsGrid;
