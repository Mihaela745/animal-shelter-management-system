import { Box, Typography } from "@mui/material";
import AnimalCard from "../animals/AnimalCard";

const AiResponseCard = ({ results }) => {
  return (
    <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
     
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          backgroundColor: "#a91111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1rem",
          flexShrink: 0,
          mt: 0.5,
          boxShadow: "0 2px 6px rgba(169,17,17,0.25)",
        }}
      >
        🐾
      </Box>

      <Box
        sx={{
          backgroundColor: "#fff",
          border: "1px solid #f0f0f0",
          borderRadius: "4px 18px 18px 18px",
          px: 2.5,
          py: 2,
          width: "100%",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Typography
          fontWeight={700}
          fontSize="0.95rem"
          color="#1a1a1a"
          mb={0.5}
        >
          Am găsit {results.length} animale potrivite pentru tine! 🎉
        </Typography>
        <Typography fontSize="0.85rem" color="#777" mb={2}>
          Le-am ordonat după compatibilitate — primul e cel mai potrivit pentru
          preferințele tale.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {results
            .filter((a) => a != null && a.id != null)
            .map((animal) => (
              <Box
                key={animal.id}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <AnimalCard animal={animal} />
                {animal.explanation && (
                  <Box
                    sx={{
                      mt: 1,
                      px: 1.5,
                      py: 1,
                      backgroundColor: "#fff9f9",
                      border: "1px solid #f5e0e0",
                      borderRadius: "8px",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "#888",
                        fontStyle: "italic",
                        lineHeight: 1.5,
                        fontSize: "0.75rem",
                      }}
                    >
                      🤖 {animal.explanation}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default AiResponseCard;
