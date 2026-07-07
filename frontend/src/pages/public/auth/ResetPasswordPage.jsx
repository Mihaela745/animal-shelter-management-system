import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../../features/auth/authSlice";
import { useNotification } from "../../../context/NotificationContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

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

export default function ResetPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const { notifySuccess, notifyError } = useNotification();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const id = searchParams.get("id");

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [localError, setLocalError] = useState(null);
  const [done, setDone] = useState(false);

  const validatePassword = () => {
    if (!newPassword) return "Parola este obligatorie";
    if (
      newPassword.length < 8 ||
      !/[A-Z]/.test(newPassword) ||
      !/\d/.test(newPassword) ||
      !/[^a-zA-Z0-9]/.test(newPassword)
    )
      return "Parola: minim 8 caractere, o majusculă, o cifră, un caracter special";
    if (newPassword !== confirm) return "Parolele nu coincid";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    const validationError = validatePassword();
    if (validationError) return setLocalError(validationError);
    const result = await dispatch(resetPassword({ id, token, newPassword }));
    if (result.meta.requestStatus === "fulfilled") {
      setDone(true);
      notifySuccess("Parola a fost resetată cu succes.");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      notifyError(result.payload || "Eroare la resetarea parolei.");
    }
  };

  if (!token || !id) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fafafa",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            p: 5,
            backgroundColor: "white",
            borderRadius: "24px",
            border: "1.5px solid #f0f0f0",
            boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
            maxWidth: 360,
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "16px",
              backgroundColor: "#fff5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <ErrorOutlineIcon sx={{ color: RED, fontSize: "1.6rem" }} />
          </Box>
          <Typography
            sx={{
              fontSize: "1.2rem",
              fontWeight: 800,
              color: DARK,
              mb: 1,
              fontFamily: "'Georgia', serif",
            }}
          >
            Link invalid
          </Typography>
          <Typography
            sx={{
              fontSize: "0.85rem",
              color: "#aaa",
              mb: 3,
              fontFamily: "sans-serif",
            }}
          >
            Acest link de resetare este invalid sau a expirat.
          </Typography>
          <Button
            onClick={() => navigate("/login")}
            sx={{
              backgroundColor: RED,
              color: "white",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              py: 1,
              "&:hover": { backgroundColor: "#8a0d0d" },
            }}
          >
            Înapoi la autentificare
          </Button>
        </Box>
      </Box>
    );
  }

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
            bottom: 60,
            left: -100,
            width: 350,
            height: 350,
            borderRadius: "50%",
            border: `1px solid rgba(255,255,255,0.04)`,
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
              fontSize: "2.8rem",
              fontWeight: 900,
              color: "white",
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              mb: 2,
              fontFamily: "'Georgia', serif",
            }}
          >
            Parolă
            <br />
            <Box component="span" sx={{ color: RED }}>
              nouă.
            </Box>
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.85rem",
              lineHeight: 1.6,
              maxWidth: 260,
            }}
          >
            Alege o parolă sigură pentru a-ți proteja contul.
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
              width: 52,
              height: 52,
              borderRadius: "14px",
              backgroundColor: "#fff0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <LockResetOutlinedIcon sx={{ color: RED, fontSize: "1.5rem" }} />
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
            Resetare parolă
          </Typography>
          <Typography
            sx={{
              fontSize: "0.85rem",
              color: "#aaa",
              mb: 4,
              fontFamily: "sans-serif",
            }}
          >
            Introdu noua ta parolă mai jos
          </Typography>

          {done ? (
            <Box
              sx={{
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "14px",
                p: 3,
                textAlign: "center",
              }}
            >
              <Typography sx={{ fontSize: "1.5rem", mb: 1 }}>✓</Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#166534",
                  fontFamily: "sans-serif",
                }}
              >
                Parolă resetată cu succes!
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.82rem",
                  color: "#166534",
                  mt: 0.5,
                  fontFamily: "sans-serif",
                }}
              >
              Ești redirecționat către autentificare...
              </Typography>
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="Noua parolă"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                fullWidth
                sx={inputSx}
              />
              <TextField
                label="Confirmă parola"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
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
                  "Setează parola"
                )}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
