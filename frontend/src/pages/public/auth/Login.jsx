import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser, forgotPassword } from "../../../features/auth/authSlice";
import {
  Typography,
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";

const RED = "#a91111";
const DARK = "#0f0f0f";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#fafafa",
    fontSize: "0.9rem",
    "& fieldset": { borderColor: "#e8e8e8" },
    "&:hover fieldset": { borderColor: "#ccc" },
    "&.Mui-focused fieldset": { borderColor: RED, borderWidth: "1.5px" },
  },
  "& label.Mui-focused": { color: RED },
};

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState(null);
  const [forgotError, setForgotError] = useState(null);
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const postLoginAnimalId = location.state?.postLoginAnimalId;

  const getAnimalRouteForRole = (role, animalId) => {
    if (!animalId) return null;
    if (role === "user") return `/user/animals/${animalId}`;
    if (role === "Manager") return `/manager/animals/${animalId}`;
    if (role === "Vet") return `/vet/animals/${animalId}`;
    if (role === "Caretaker") return `/staff/animals/${animalId}`;
    return null;
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleForgotPassword = async () => {
    setForgotError(null);
    if (!email) return setForgotError("Email obligatoriu");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return setForgotError("Email invalid");
    }

    const result = await dispatch(forgotPassword(email));
    if (result.meta.requestStatus === "fulfilled") {
      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setEmail("");
        setSuccess(false);
      }, 2000);
    } else {
      setForgotError(result.payload || "Eroare trimitere email");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);

    const result = await dispatch(loginUser(form));
    if (result.meta.requestStatus === "fulfilled") {
      const role = result.payload.user.role;
      const animalRoute = getAnimalRouteForRole(role, postLoginAnimalId);

      if (animalRoute) {
        navigate(animalRoute, { replace: true });
      } else if (role === "user") {
        navigate("/user/home");
      } else if (role === "Manager") {
        navigate("/manager/dashboard");
      } else if (role === "Vet") {
        navigate("/vet/dashboard");
      } else if (role === "Caretaker") {
        navigate("/staff/dashboard");
      }
    } else {
      setLoginError(result.payload || "Email sau parola incorecte");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: "'Georgia', serif",
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flex: "0 0 42%",
          backgroundColor: DARK,
          flexDirection: "column",
          justifyContent: "space-between",
          p: 5,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            border: `1px solid rgba(169,17,17,0.2)`,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            border: `1px solid rgba(169,17,17,0.15)`,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 60,
            left: -100,
            width: 350,
            height: 350,
            borderRadius: "50%",
            border: `1px solid rgba(255,255,255,0.04)`,
          }}
        />

        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                backgroundColor: RED,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ fontSize: "1.1rem" }}>🐾</Typography>
            </Box>
            <Typography
              sx={{
                color: "white",
                fontWeight: 700,
                fontSize: "1rem",
                letterSpacing: "0.02em",
              }}
            >
              Paws & Hearts
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: "2.8rem",
              fontWeight: 900,
              color: "white",
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              mb: 2,
              fontFamily: "'Georgia', serif",
            }}
          >
            Fiecare animal
            <br />
            <Box component="span" sx={{ color: RED }}>
              merită
            </Box>{" "}
            o casă.
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.88rem",
              lineHeight: 1.6,
              maxWidth: 280,
            }}
          >
            Gestionează adopțiile, îngrijirile medicale și echipa adăpostului
            dintr-un singur loc.
          </Typography>
        </Box>

        <Typography
          sx={{
            color: "rgba(255,255,255,0.2)",
            fontSize: "0.72rem",
            letterSpacing: "0.05em",
          }}
        >
          © 2026 PAWS & HEARTS
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: { xs: 3, sm: 6, md: 8 },
          backgroundColor: "white",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 380,
            backgroundColor: "white",
            borderRadius: "20px",
            border: "1.5px solid #f0f0f0",
            boxShadow:
              "0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
            p: { xs: 3, sm: 4 },
          }}
        >
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              gap: 1,
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "9px",
                backgroundColor: RED,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ fontSize: "1rem" }}>🐾</Typography>
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
              Paws & Hearts
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: "1.9rem",
              fontWeight: 900,
              color: DARK,
              letterSpacing: "-1px",
              mb: 0.5,
              fontFamily: "'Georgia', serif",
            }}
          >
            Bun venit
          </Typography>
          <Typography
            sx={{
              fontSize: "0.85rem",
              color: "#aaa",
              mb: 4,
              fontFamily: "sans-serif",
            }}
          >
            Intră în contul tău pentru a continua
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
              sx={inputSx}
            />
            <TextField
              label="Parola"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
              sx={inputSx}
            />

            {loginError && (
              <Box
                sx={{
                  backgroundColor: "#fff5f5",
                  border: "1px solid #ffd6d6",
                  borderRadius: "10px",
                  px: 2,
                  py: 1.2,
                }}
              >
                <Typography
                  sx={{ fontSize: "0.82rem", color: RED, fontWeight: 600 }}
                >
                  {loginError}
                </Typography>
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                backgroundColor: RED,
                color: "white",
                fontWeight: 700,
                fontSize: "0.9rem",
                borderRadius: "10px",
                py: 1.3,
                textTransform: "none",
                mt: 0.5,
                fontFamily: "sans-serif",
                "&:hover": {
                  backgroundColor: "#8a0d0d",
                  boxShadow: "0 6px 20px rgba(169,17,17,0.3)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                "Autentificare"
              )}
            </Button>
          </Box>

          <Box
            sx={{
              mt: 3,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              alignItems: "center",
              fontFamily: "sans-serif",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography sx={{ fontSize: "0.82rem", color: "#aaa" }}>
                Nu ai un cont?
              </Typography>
              <Button
                component={Link}
                to="/register"
                sx={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: RED,
                  textTransform: "none",
                  p: 0,
                  minWidth: 0,
                  "&:hover": {
                    backgroundColor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                Inregistrează-te
              </Button>
            </Box>
            <Button
              onClick={() => setOpen(true)}
              sx={{
                fontSize: "0.78rem",
                color: "#bbb",
                textTransform: "none",
                p: 0,
                minWidth: 0,
                fontFamily: "sans-serif",
                "&:hover": { backgroundColor: "transparent", color: RED },
              }}
            >
              Ai uitat parola?
            </Button>
          </Box>
        </Box>
      </Box>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEmail("");
          setSuccess(false);
        }}
        PaperProps={{ sx: { borderRadius: "20px", p: 1, minWidth: 340 } }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            fontSize: "1.1rem",
            pb: 0,
            fontFamily: "'Georgia', serif",
          }}
        >
          Resetare parola
        </DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          <Typography
            sx={{
              fontSize: "0.82rem",
              color: "#aaa",
              mb: 2,
              fontFamily: "sans-serif",
            }}
          >
            Introdu adresa de email și îți trimitem un link de resetare.
          </Typography>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={inputSx}
          />
          {success && (
            <Box
              sx={{
                mt: 2,
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "10px",
                px: 2,
                py: 1.2,
              }}
            >
              <Typography
                sx={{ fontSize: "0.82rem", color: "#166534", fontWeight: 600 }}
              >
                Email trimis! Verifică inbox-ul.
              </Typography>
            </Box>
          )}
          {forgotError && (
            <Box
              sx={{
                mt: 2,
                backgroundColor: "#fff5f5",
                border: "1px solid #ffd6d6",
                borderRadius: "10px",
                px: 2,
                py: 1.2,
              }}
            >
              <Typography
                sx={{ fontSize: "0.82rem", color: RED, fontWeight: 600 }}
              >
                {forgotError}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => {
              setOpen(false);
              setEmail("");
              setSuccess(false);
            }}
            sx={{
              color: "#aaa",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.85rem",
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
          >
            Anulează
          </Button>
          <Button
            variant="contained"
            onClick={handleForgotPassword}
            disabled={loading || success}
            sx={{
              backgroundColor: RED,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.85rem",
              px: 2.5,
              "&:hover": { backgroundColor: "#8a0d0d" },
            }}
          >
            Trimite link
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
