import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../features/auth/authSlice";
import { Box, Typography, Paper, TextField, Button } from "@mui/material";
import styles from "./Auth.module.css";
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
    if (!form.username) return "Username este obligatoriu";
    if (!/^[a-zA-Z0-9_]{3,}$/.test(form.username))
      return "Username invalid (minim 3 caractere, doar litere, cifre, underscore)";

    if (!form.email) return "Email este obligatoriu";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return "Email invalid";

    if (!form.password) return "Parola este obligatorie";

    const hasUpperCase = /[A-Z]/.test(form.password);
    const hasNumber = /\d/.test(form.password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(form.password);

    if (form.password.length < 8 || !hasUpperCase || !hasNumber || !hasSpecial)
      return "Parola trebuie sa aiba minim 8 caractere, o majuscula, o cifra si un caracter special";

    if (form.password !== confirmPassword) return "Parolele nu coincid";

    return null;
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    const validationError = validations();
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    const result = await dispatch(registerUser(form));

    if (result.meta.requestStatus === "fulfilled") {
      alert("Cont creat cu succes!");
      navigate("/login");
    }
  };
  return (
    <Box className={styles.mainContainer}>
      <Paper className={styles.container}>
        <Typography variant="h6" className={styles.title}>
          Creează cont
        </Typography>
        <form onSubmit={handleSubmit} className={styles.form}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            type="text"
            autoComplete="username"
            value={form.username}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Telefon"
            name="phonenumber"
            type="tel"
            value={form.phonenumber}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Adresă"
            name="address"
            autoComplete="street-address"
            value={form.address}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Parolă"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Confirmă parola"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 2 }}
          />

          {(localError || error) && (
            <Typography color="error" sx={{ mb: 2 }}>
              {localError || error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            className={styles.button}
          >
            Register
          </Button>
        </form>
        <Box
          display={"flex"}
          flexDirection={"row"}
          alignContent={"center"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Typography>Ai deja un cont?</Typography>
          <Button component={Link} to="/login" className={styles.link}>
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
