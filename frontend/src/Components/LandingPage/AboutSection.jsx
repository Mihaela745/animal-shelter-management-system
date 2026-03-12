import { Box, Container, Typography, Button } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HealingIcon from "@mui/icons-material/Healing";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { Link } from "react-router-dom";

const items = [
  {
    icon: <FavoriteIcon sx={{ fontSize: "1.3rem" }} />,
    title: "Adopții responsabile",
    text: "Gestionăm cererile de adopție și potrivirea cu un cămin potrivit.",
  },
  {
    icon: <HealingIcon sx={{ fontSize: "1.3rem" }} />,
    title: "Îngrijire & fișe medicale",
    text: "Urmărim controalele și tratamentele pentru siguranța animalelor.",
  },
  {
    icon: <EventAvailableIcon sx={{ fontSize: "1.3rem" }} />,
    title: "Programări ușoare",
    text: "Poți programa vizite și întâlniri direct din platformă.",
  },
];

export default function AboutSection() {
  return (
    <Box
      id="about"
      sx={{
        backgroundColor: "#0f0f0f",
        py: { xs: 8, md: 12 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          border: "1px solid rgba(169,17,17,0.12)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -60,
          left: -60,
          width: 280,
          height: 280,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.04)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ mb: 8, maxWidth: 560 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
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
              Despre noi
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: { xs: "2rem", md: "2.8rem" },
              fontWeight: 900,
              color: "white",
              letterSpacing: "-1.5px",
              lineHeight: 1.1,
              mb: 2.5,
              fontFamily: "'Georgia', serif",
            }}
          >
            Paws & Hearts
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "1rem",
              lineHeight: 1.8,
              fontFamily: "sans-serif",
            }}
          >
            O platformă de management pentru adăpost și adopții, creată pentru a
            conecta animalele cu familii responsabile. Ne ocupăm de îngrijire,
            evidențe medicale și un proces de adopție clar și sigur.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 2,
            mb: 8,
          }}
        >
          {items.map((item) => (
            <Box
              key={item.title}
              sx={{
                p: 3.5,
                borderRadius: "20px",
                border: "1.5px solid rgba(255,255,255,0.06)",
                backgroundColor: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(4px)",
                transition: "all 0.25s",
                "&:hover": {
                  backgroundColor: "rgba(169,17,17,0.08)",
                  borderColor: "rgba(169,17,17,0.3)",
                  transform: "translateY(-3px)",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
                },
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  backgroundColor: "rgba(169,17,17,0.15)",
                  border: "1px solid rgba(169,17,17,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ff6b6b",
                  mb: 2.5,
                }}
              >
                {item.icon}
              </Box>

              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: "1rem",
                  color: "white",
                  mb: 1,
                  fontFamily: "'Georgia', serif",
                }}
              >
                {item.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.7,
                  fontFamily: "sans-serif",
                }}
              >
                {item.text}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { sm: "center" },
            justifyContent: "space-between",
            pt: 4,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            gap: 3,
          }}
        >
          <Typography
            sx={{
              color: "rgba(255,255,255,0.3)",
              fontSize: "0.85rem",
              maxWidth: 340,
              fontFamily: "sans-serif",
              lineHeight: 1.6,
            }}
          >
            Fiecare animal adoptat înseamnă o viață schimbată. Alătură-te
            comunității noastre astăzi.
          </Typography>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            sx={{
              backgroundColor: "#a91111",
              color: "white",
              fontWeight: 800,
              fontSize: "0.9rem",
              textTransform: "none",
              borderRadius: "12px",
              px: 4,
              py: 1.3,
              flexShrink: 0,
              fontFamily: "sans-serif",
              "&:hover": {
                backgroundColor: "#8a0d0d",
                boxShadow: "0 8px 24px rgba(169,17,17,0.4)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s",
            }}
          >
            Începe acum →
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
