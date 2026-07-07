import { Box, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import heroImg from "../../assets/cats-dogs-curiously-peeking-over-white-web-banner-playful-moment-companionship-where-group-clean-423319524.webp";
import { Link } from "react-router-dom";
import axiosInstance from "../../sercives/axiosInstance";

export default function HeroPage() {
  const [stats, setStats] = useState({ adopted: null, available: null });

  useEffect(() => {
    let ignore = false;

    async function loadStats() {
      try {
        const [adoptedRes, availableRes] = await Promise.all([
          axiosInstance.get("/animals", { params: { status: "Adopted", limit: 1 } }),
          axiosInstance.get("/animals", { params: { status: "Available", limit: 1 } }),
        ]);

        if (!ignore) {
          setStats({
            adopted: adoptedRes.data.total,
            available: availableRes.data.total,
          });
        }
      } catch {
        if (!ignore) {
          setStats({ adopted: null, available: null });
        }
      }
    }

    loadStats();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <Box
      id="home"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0f0f0f",
      }}
    >
      <Box
        component="img"
        src={heroImg}
        alt="hero"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          opacity: 0.22,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(169,17,17,0.7) 0%, rgba(15,15,15,0.95) 60%)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 500,
          height: 500,
          borderRadius: "50%",
          border: "1px solid rgba(169,17,17,0.15)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 320,
          height: 320,
          borderRadius: "50%",
          border: "1px solid rgba(169,17,17,0.1)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -80,
          left: "30%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.04)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: { xs: 4, sm: 8, md: 12 },
          py: { xs: 16, md: 0 },
          maxWidth: { md: "60%" },
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            backgroundColor: "rgba(169,17,17,0.2)",
            border: "1px solid rgba(169,17,17,0.4)",
            borderRadius: "20px",
            px: 2,
            py: 0.6,
            mb: 3,
            width: "fit-content",
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "#ff6b6b",
              animation: "pulse 2s infinite",
            }}
          />
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "rgba(255,255,255,0.8)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Animale care așteaptă
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: { xs: "2.8rem", sm: "3.8rem", md: "4.8rem" },
            fontWeight: 900,
            color: "white",
            lineHeight: 1.05,
            letterSpacing: "-2px",
            mb: 1.5,
            fontFamily: "'Georgia', serif",
          }}
        >
          Oferă-le
          <Box component="span" sx={{ color: "#ff6b6b" }}>
            {" "}
            o casă.
          </Box>
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: "1.4rem", sm: "1.8rem", md: "2.2rem" },
            fontWeight: 700,
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.2,
            letterSpacing: "-0.5px",
            mb: 2,
            fontFamily: "'Georgia', serif",
          }}
        >
          Iar ei o să-ți ofere iubire.
        </Typography>

        <Typography
          sx={{
            fontSize: "1rem",
            color: "rgba(255,255,255,0.4)",
            mb: 5,
            maxWidth: 400,
            lineHeight: 1.7,
            fontFamily: "sans-serif",
          }}
        >
          Adoptă un animal și schimbă-i viața pentru totdeauna. Fiecare suflet
          merită un cămin cald.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            onClick={() =>
              document
                .getElementById("animals")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            sx={{
              backgroundColor: "#a91111",
              color: "white",
              fontWeight: 800,
              fontSize: "0.95rem",
              textTransform: "none",
              borderRadius: "12px",
              px: 4,
              py: 1.4,
              fontFamily: "sans-serif",
              "&:hover": {
                backgroundColor: "#8a0d0d",
                boxShadow: "0 8px 24px rgba(169,17,17,0.45)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s",
            }}
          >
            Adoptă acum
          </Button>
          <Button
            onClick={() =>
              document
                .getElementById("about")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            sx={{
              color: "rgba(255,255,255,0.7)",
              fontWeight: 600,
              fontSize: "0.95rem",
              textTransform: "none",
              borderRadius: "12px",
              px: 3,
              py: 1.4,
              border: "1.5px solid rgba(255,255,255,0.15)",
              fontFamily: "sans-serif",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.06)",
                borderColor: "rgba(255,255,255,0.3)",
              },
            }}
          >
            Află mai mult →
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 4,
            mt: 6,
            pt: 4,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {[
            {
              num: stats.adopted !== null ? String(stats.adopted) : "…",
              label: "Animale adoptate",
            },
            {
              num: stats.available !== null ? String(stats.available) : "…",
              label: "Animale disponibile",
            },
            { num: "5★", label: "Rating platformă" },
          ].map((s) => (
            <Box key={s.label}>
              <Typography
                sx={{
                  fontSize: "1.4rem",
                  fontWeight: 900,
                  color: "white",
                  letterSpacing: "-0.5px",
                  fontFamily: "'Georgia', serif",
                }}
              >
                {s.num}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  color: "rgba(255,255,255,0.35)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontFamily: "sans-serif",
                }}
              >
                {s.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
