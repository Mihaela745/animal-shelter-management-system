import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";

const RED = "#a91111";

const navItems = [
  { label: "Acasă", id: "home" },
  { label: "Animale", id: "animals" },
  { label: "Despre", id: "about" },
];

const scrollTo = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function NavbarLanding() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: scrolled ? "rgba(15,15,15,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
          transition: "all 0.35s ease",
        }}
      >
        <Toolbar
          sx={{
            px: { xs: 2.5, md: 6 },
            py: 0.5,
            justifyContent: "space-between",
            minHeight: "64px !important",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "10px",
                backgroundColor: RED,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(169,17,17,0.4)",
              }}
            >
              <Typography sx={{ fontSize: "1rem", lineHeight: 1 }}>
                🐾
              </Typography>
            </Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1rem",
                color: "white",
                letterSpacing: "-0.3px",
                fontFamily: "'Georgia', serif",
              }}
            >
              Paws & Hearts
            </Typography>
          </Box>

          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 0.5,
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                sx={{
                  color: "rgba(255,255,255,0.75)",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  textTransform: "none",
                  borderRadius: "8px",
                  px: 1.8,
                  py: 0.8,
                  "&:hover": {
                    color: "white",
                    backgroundColor: "rgba(255,255,255,0.08)",
                  },
                  transition: "all 0.15s",
                }}
              >
                {item.label}
              </Button>
            ))}

            <Box
              sx={{
                width: "1px",
                height: 18,
                backgroundColor: "rgba(255,255,255,0.15)",
                mx: 1,
              }}
            />

            <Button
              component={Link}
              to="/login"
              sx={{
                color: "rgba(255,255,255,0.75)",
                fontWeight: 600,
                fontSize: "0.88rem",
                textTransform: "none",
                borderRadius: "8px",
                px: 1.8,
                py: 0.8,
                "&:hover": {
                  color: "white",
                  backgroundColor: "rgba(255,255,255,0.08)",
                },
              }}
            >
            Autentificare
            </Button>
            <Button
              component={Link}
              to="/register"
              sx={{
                backgroundColor: RED,
                color: "white",
                fontWeight: 700,
                fontSize: "0.85rem",
                textTransform: "none",
                borderRadius: "8px",
                px: 2.2,
                py: 0.8,
                ml: 0.5,
                boxShadow: "0 2px 10px rgba(169,17,17,0.35)",
                "&:hover": {
                  backgroundColor: "#8a0d0d",
                  boxShadow: "0 4px 16px rgba(169,17,17,0.45)",
                },
                transition: "all 0.2s",
              }}
            >
              Înregistrare
            </Button>
          </Box>

          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{
              display: { sm: "none" },
              color: "white",
              backgroundColor: "rgba(255,255,255,0.08)",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.14)" },
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: "75vw",
            maxWidth: 300,
            height: "100vh",
            backgroundColor: "#0f0f0f",
            border: "none",
            display: "flex",
            flexDirection: "column",
            p: 0,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2.5,
            py: 2,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "8px",
                backgroundColor: RED,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ fontSize: "0.8rem" }}>🐾</Typography>
            </Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "0.9rem",
                color: "white",
                fontFamily: "'Georgia', serif",
              }}
            >
              Paws & Hearts
            </Typography>
          </Box>
          <IconButton
            onClick={() => setMobileOpen(false)}
            size="small"
            sx={{
              color: "rgba(255,255,255,0.5)",
              "&:hover": { color: "white" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, px: 2, py: 2 }}>
          {navItems.map((item) => (
            <Box
              key={item.id}
              onClick={() => {
                scrollTo(item.id);
                setMobileOpen(false);
              }}
              sx={{
                px: 2,
                py: 1.3,
                borderRadius: "10px",
                cursor: "pointer",
                color: "rgba(255,255,255,0.65)",
                fontWeight: 600,
                fontSize: "0.9rem",
                fontFamily: "sans-serif",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.06)",
                  color: "white",
                },
                transition: "all 0.15s",
                mb: 0.5,
              }}
            >
              {item.label}
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            px: 2.5,
            py: 3,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
            gap: 1.2,
          }}
        >
          <Button
            component={Link}
            to="/login"
            onClick={() => setMobileOpen(false)}
            fullWidth
            sx={{
              border: "1.5px solid rgba(255,255,255,0.12)",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              color: "rgba(255,255,255,0.7)",
              py: 1,
              "&:hover": {
                borderColor: "rgba(255,255,255,0.3)",
                color: "white",
                backgroundColor: "rgba(255,255,255,0.05)",
              },
            }}
          >
              Autentificare
          </Button>
          <Button
            component={Link}
            to="/register"
            onClick={() => setMobileOpen(false)}
            fullWidth
            sx={{
              backgroundColor: RED,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              color: "white",
              py: 1,
              boxShadow: "0 4px 14px rgba(169,17,17,0.35)",
              "&:hover": { backgroundColor: "#8a0d0d" },
            }}
          >
            Înregistrare
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
