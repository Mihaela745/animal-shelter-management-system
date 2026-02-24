import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, forgotPassword } from "../../../features/auth/authSlice";
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import styles from "./Auth.module.css";
export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(null);
  const [forgotError, setForgotError] = useState(null);

  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleForgotPassword = async () => {
    setForgotError(null);

    if (!email) {
      setForgotError("Email obligatoriu");
      return;
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setForgotError("Email invalid");
      return;
    }

    const result = await dispatch(forgotPassword(email));

    if (result.meta.requestStatus === "fulfilled") {
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } else {
      setForgotError(result.payload || "Eroare trimitere email");
    }
  };
  const handleClose = () => {
    setOpen(false);
    setEmail("");
    setSuccess(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);
    const result = await dispatch(loginUser(form));
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/");
    } else {
      setLoginError(result.payload || "Eroare login");
    }
  };
  return (
    <Box className={styles.mainContainer}>
      <Paper className={styles.container}>
        <Typography variant="h6" className={styles.title}>
          Login
        </Typography>
        <form onSubmit={handleSubmit} className={styles.form}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            disabled={loading}
            type="submit"
            className={styles.button}
          >
            Login
          </Button>
          {loginError && (
            <Typography color="error" sx={{ mt: 1 }}>
              {loginError}
            </Typography>
          )}
        </form>
        <Box
          display={"flex"}
          flexDirection={"row"}
          alignContent={"center"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Typography>Nu ai un cont?</Typography>
          <Button component={Link} to="/register" className={styles.link}>
            Register
          </Button>
        </Box>
        <Box
          display={"flex"}
          flexDirection={"row"}
          alignContent={"center"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Typography>Parolă uitată?</Typography>
          <Button onClick={() => setOpen(true)} className={styles.link}>
            Reset Password
          </Button>{" "}
        </Box>
        <Dialog open={open} onClose={handleClose} className={styles.form}>
          <DialogTitle>Resetare parolă</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mt: 1 }}
            />

            {success && (
              <Typography color="success.main" sx={{ mt: 1 }}>
                Email trimis! Verifică inbox-ul.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            {" "}
            <Button onClick={() => setOpen(false) }  className={styles.link}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleForgotPassword}
              disabled={loading || success}
              className={styles.button}
            >
              Trimite
            </Button>
          </DialogActions>
          {forgotError && (
            <Typography color="error" sx={{ mt: 1 }}>
              {forgotError}
            </Typography>
          )}
        </Dialog>
      </Paper>
    </Box>
  );
}
