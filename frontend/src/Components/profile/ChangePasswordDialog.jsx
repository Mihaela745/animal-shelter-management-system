import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../../features/auth/authSlice";

export default function ChangePasswordDialog({ open, handleClose }) {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!oldPassword || !newPassword || !confirm) {
      setError("Completează toate câmpurile.");
      return;
    }
    if (newPassword !== confirm) {
      setError("Parolele noi nu coincid.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Parola nouă trebuie să aibă cel puțin 6 caractere.");
      return;
    }

    const result = await dispatch(
      updatePassword({ email: user.email, oldPassword, newPassword }),
    );

    if (updatePassword.fulfilled.match(result)) {
      setOldPassword("");
      setNewPassword("");
      setConfirm("");
      handleClose();
    } else {
      setError(result.payload || "Eroare la actualizarea parolei.");
    }
  };

  const handleCancel = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirm("");
    setError("");
    handleClose();
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      "&.Mui-focused fieldset": { borderColor: "#a91111" },
    },
    "& label.Mui-focused": { color: "#a91111" },
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
    >
      <DialogTitle sx={{ pb: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              backgroundColor: "#fff0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LockOutlinedIcon sx={{ color: "#a91111", fontSize: 18 }} />
          </Box>
          <Typography fontWeight={800} fontSize="1rem">
            Schimbă parola
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: "1.2rem !important" }}>
        <TextField
          fullWidth
          margin="normal"
          label="Parola actuală"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          sx={inputSx}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Parola nouă"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={inputSx}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Confirmă parola nouă"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          sx={inputSx}
        />
        {error && (
          <Typography fontSize="0.82rem" color="error" mt={1}>
            {error}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          onClick={handleCancel}
          sx={{
            color: "#999",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "10px",
          }}
        >
          Anulează
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            backgroundColor: "#a91111",
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 700,
            px: 3,
            "&:hover": { backgroundColor: "#8a0d0d" },
          }}
        >
          Actualizează
        </Button>
      </DialogActions>
    </Dialog>
  );
}
