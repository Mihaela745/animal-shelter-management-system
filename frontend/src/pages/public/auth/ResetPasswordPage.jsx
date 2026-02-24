import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../../features/auth/authSlice";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import styles from "./Auth.module.css";
export default function ResetPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const id = searchParams.get("id");

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [localError, setLocalError] = useState(null);
  const validatePassword = () => {
    if (!newPassword) return "Parola este obligatorie";

    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    const hasSpecial = /[^a-zA-Z0-9]/.test(newPassword);

    if (newPassword.length < 8 || !hasUpperCase || !hasNumber || !hasSpecial) {
      return "Parola trebuie sa aiba minim 8 caractere, o majuscula, o cifra si un caracter special";
    }

    if (newPassword !== confirm) {
      return "Parolele nu coincid";
    }

    return null;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirm) {
      alert("Parolele nu coincid");
      return;
    }
    setLocalError(null);

    const validationError = validatePassword();
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    const result = await dispatch(resetPassword({ id, token, newPassword }));

    if (result.meta.requestStatus === "fulfilled") {
      alert("Parola resetata cu succes!");
      navigate("/login");
    }
  };

  if (token && id)
    {return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className={styles.mainContainer}
      >
        <Paper sx={{ p: 4, width: 400 }} className={styles.container}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Setează noua parolă
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Noua parolă"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Confirmă parola"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              sx={{ mb: 2 }}
            />

            {localError && (
              <Typography color="error" sx={{ mb: 1 }}>
                {localError}
              </Typography>
            )}

            {error && (
              <Typography color="error" sx={{ mb: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              className={styles.button}
            >
              Resetare
            </Button>
          </form>
        </Paper>
      </Box>
    );}
    else{
        if (!token || !id) {
          return (
            <Box>
              <Typography color="error">Link invalid sau expirat.</Typography>
            </Box>
          );
        }
    }
}
