import { Card, Typography, Box } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MiniAnimalCard from "../animals/MiniAnimalCard";

export default function AdoptionHistoryCard({ adoptions = [] }) {
  return (
    <Card
      sx={{
        borderRadius: "20px",
        p: 3,
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        border: "1px solid #f5f5f5",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "12px",
            backgroundColor: "#fff0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FavoriteIcon sx={{ color: "#a91111", fontSize: 20 }} />
        </Box>
        <Box>
          <Typography fontWeight={700} fontSize="1rem" color="#1a1a1a">
            Istoricul adopțiilor
          </Typography>
          <Typography fontSize="0.75rem" color="#999">
            {adoptions.length} animale adoptate
          </Typography>
        </Box>
      </Box>

      {adoptions.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4, color: "#bbb" }}>
          <FavoriteIcon sx={{ fontSize: 40, mb: 1, opacity: 0.3 }} />
          <Typography fontSize="0.875rem">
            Nu ai adoptat niciun animal încă
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: 2,
          }}
        >
          {adoptions.map((adoption) =>
            adoption.Animal ? (
              <MiniAnimalCard key={adoption.id} animal={adoption.Animal} />
            ) : null,
          )}
        </Box>
      )}
    </Card>
  );
}
