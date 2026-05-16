import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { registerUser } from "../../../features/auth/authSlice";
import {
  isValidFullName,
  normalizeFullName,
} from "../../../utils/nameValidation";

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

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phonenumber: "",
    address: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState(null);

  const validations = () => {
    if (!form.username) return "Numele utilizatorului este obligatoriu.";
    if (!isValidFullName(form.username)) {
      return "Numele trebuie să fie de forma Nume Prenume.";
    }
    if (!form.email) return "Emailul este obligatoriu.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return "Email invalid.";
    if (!form.password) return "Parola este obligatorie.";
    if (
      form.password.length < 8 ||
      !/[A-Z]/.test(form.password) ||
      !/\d/.test(form.password) ||
      !/[^a-zA-Z0-9]/.test(form.password)
    ) {
      return "Parola: minim 8 caractere, o majusculă, o cifră, un caracter special.";
    }
    if (form.password !== confirmPassword) return "Parolele nu coincid.";
    return null;
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    const validationError = validations();
    if (validationError) return setLocalError(validationError);

    const result = await dispatch(
      registerUser({
        ...form,
        username: normalizeFullName(form.username),
      }),
    );

    if (result.meta.requestStatus === "fulfilled") {
      navigate("/login");
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
          flex: "0 0 38%",
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
            top: -60,
            right: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            border: "1px solid rgba(169,17,17,0.18)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 80,
            left: -120,
            width: 400,
            height: 400,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.03)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -40,
            right: 40,
            width: 160,
            height: 160,
            borderRadius: "50%",
            border: "1px solid rgba(169,17,17,0.1)",
          }}
        />

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
            sx={{ color: "white", fontWeight: 700, fontSize: "1rem" }}
          >
            Paws & Hearts
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: "2.6rem",
              fontWeight: 900,
              color: "white",
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              mb: 2,
              fontFamily: "'Georgia', serif",
            }}
          >
            Alătură-te
            <br />
            <Box component="span" sx={{ color: RED }}>
              echipei
            </Box>{" "}
            noastre.
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.85rem",
              lineHeight: 1.6,
              maxWidth: 260,
            }}
          >
            Creează-ți un cont și începe să ajuți animalele care au nevoie de o
            casă.
          </Typography>
        </Box>

        <Typography
          sx={{
            color: "rgba(255,255,255,0.18)",
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
          px: { xs: 3, sm: 5, md: 7 },
          py: 5,
          backgroundColor: "white",
          overflowY: "auto",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 400 }}>
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
              fontSize: "1.8rem",
              fontWeight: 900,
              color: DARK,
              letterSpacing: "-1px",
              mb: 0.5,
              fontFamily: "'Georgia', serif",
            }}
          >
            Cont nou
          </Typography>
          <Typography
            sx={{
              fontSize: "0.85rem",
              color: "#aaa",
              mb: 3.5,
              fontFamily: "sans-serif",
            }}
          >
            Completează datele pentru înregistrare
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 1.8 }}
          >
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.8 }}
            >
              <TextField
                label="Nume complet"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                sx={inputSx}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                sx={inputSx}
              />
            </Box>

            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.8 }}
            >
              <TextField
                label="Telefon"
                name="phonenumber"
                type="tel"
                value={form.phonenumber}
                onChange={handleChange}
                sx={inputSx}
              />
              <TextField
                label="Adresă"
                name="address"
                value={form.address}
                onChange={handleChange}
                sx={inputSx}
              />
            </Box>

            <TextField
              label="Parolă"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
              sx={inputSx}
            />
            <TextField
              label="Confirmă parola"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
              sx={inputSx}
            />

            {(localError || error) && (
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
                  sx={{
                    fontSize: "0.82rem",
                    color: RED,
                    fontWeight: 600,
                    fontFamily: "sans-serif",
                  }}
                >
                  {localError || error}
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
                "Creează cont"
              )}
            </Button>
          </Box>

          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 0.5,
              fontFamily: "sans-serif",
            }}
          >
            <Typography sx={{ fontSize: "0.82rem", color: "#aaa" }}>
              Ai deja un cont?
            </Typography>
            <Button
              component={Link}
              to="/login"
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
              Autentifică-te
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
