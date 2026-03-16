import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PetsIcon from "@mui/icons-material/Pets";
import PsychologyIcon from "@mui/icons-material/Psychology";

const RED = "#a91111";
const RED_DARK = "#7d0d0d";

const cardSx = {
  borderRadius: "22px",
  border: "1px solid rgba(169,17,17,0.08)",
  boxShadow: "0 16px 40px rgba(169,17,17,0.08)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,246,246,0.98) 100%)",
  transition: "transform 0.25s ease, box-shadow 0.25s ease",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: "0 24px 48px rgba(169,17,17,0.12)",
  },
};

const iconWrapSx = {
  width: 78,
  height: 78,
  borderRadius: "22px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "linear-gradient(135deg, rgba(169,17,17,0.12) 0%, rgba(169,17,17,0.04) 100%)",
  mx: "auto",
  mb: 2,
};

export default function HomePage() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 3, md: 5 },
        background:
          "radial-gradient(circle at top left, rgba(169,17,17,0.08), transparent 28%), linear-gradient(180deg, #fffdfd 0%, #f8f1f1 100%)",
      }}
    >
      <Box
        sx={{
          maxWidth: 1180,
          mx: "auto",
          display: "grid",
          gap: { xs: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            p: { xs: 2.5, md: 4 },
            borderRadius: "28px",
            background: "linear-gradient(135deg, #b31616 0%, #7c0d0d 100%)",
            color: "white",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 20px 50px rgba(169,17,17,0.18)",
            "&::after": {
              content: '""',
              position: "absolute",
              right: -30,
              top: -30,
              width: 180,
              height: 180,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.08)",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "1.8rem", md: "2.4rem" },
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              maxWidth: 620,
            }}
          >
            Bun venit, {user?.username}
          </Typography>
          <Typography
            sx={{
              mt: 1,
              fontSize: { xs: "0.95rem", md: "1.02rem" },
              opacity: 0.88,
              maxWidth: 540,
            }}
          >
            Alege ce vrei sa faci mai departe si continua rapid catre zona care
            te intereseaza.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: { xs: 2, md: 3 },
          }}
        >
          <Card sx={cardSx}>
            <CardActionArea onClick={() => navigate("/user/animals")}>
              <CardContent sx={{ p: { xs: 2.5, md: 3.5 }, textAlign: "center" }}>
                <Box sx={iconWrapSx}>
                  <PetsIcon sx={{ fontSize: 40, color: RED }} />
                </Box>
                <Typography
                  sx={{
                    fontSize: "1.15rem",
                    fontWeight: 800,
                    color: "#1a1a1a",
                    mb: 1,
                  }}
                >
                  Cauta animale
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.92rem",
                    color: "#6b7280",
                    maxWidth: 320,
                    mx: "auto",
                    lineHeight: 1.6,
                  }}
                >
                  Exploreaza toate animalele disponibile si descopera companionul
                  potrivit pentru tine.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card sx={cardSx}>
            <CardActionArea onClick={() => navigate("/user/match")}>
              <CardContent sx={{ p: { xs: 2.5, md: 3.5 }, textAlign: "center" }}>
                <Box sx={iconWrapSx}>
                  <PsychologyIcon sx={{ fontSize: 40, color: RED }} />
                </Box>
                <Typography
                  sx={{
                    fontSize: "1.15rem",
                    fontWeight: 800,
                    color: "#1a1a1a",
                    mb: 1,
                  }}
                >
                  Gaseste-mi match-ul
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.92rem",
                    color: "#6b7280",
                    maxWidth: 340,
                    mx: "auto",
                    lineHeight: 1.6,
                  }}
                >
                  Spune-ne ce cauti, iar sistemul iti propune animalele care se
                  potrivesc cel mai bine cu stilul tau.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
          <Button
            component={Link}
            to="/user/dashboard"
            variant="contained"
            sx={{
              minWidth: { xs: "100%", sm: 260 },
              maxWidth: 320,
              borderRadius: "14px",
              textTransform: "none",
              fontWeight: 800,
              fontSize: "0.95rem",
              py: 1.2,
              backgroundColor: RED,
              boxShadow: "0 14px 30px rgba(169,17,17,0.18)",
              "&:hover": {
                backgroundColor: RED_DARK,
                boxShadow: "0 18px 34px rgba(169,17,17,0.24)",
              },
            }}
          >
            Mergi la dashboard
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
