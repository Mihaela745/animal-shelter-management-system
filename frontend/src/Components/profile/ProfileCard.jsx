import {
  Card,
  Typography,
  Box,
  Avatar,
  Button,
  Divider,
  Chip,
  Stack,
  TextField,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { useSelector, useDispatch } from "react-redux";
import { useMemo, useState } from "react";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { formatRole } from "../../utils/labels";
import { setAuthUser, updateMyProfile } from "../../features/auth/authSlice";

const RED = "#a91111";
const RED_LIGHT = "#fff0f0";
const RED_DARK = "#8a0d0d";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#fafafa",
    "&.Mui-focused fieldset": { borderColor: RED },
  },
  "& label.Mui-focused": { color: RED },
};

const InfoRow = ({ icon, label, value }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 2,
      py: 1.5,
      px: 2,
      minWidth: 0,
      borderRadius: "12px",
      "&:hover": { backgroundColor: "#fafafa" },
      transition: "background 0.2s",
    }}
  >
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: "10px",
        backgroundColor: RED_LIGHT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography
        fontSize="0.72rem"
        color="#aaa"
        fontWeight={600}
        lineHeight={1}
      >
        {label}
      </Typography>
      <Typography
        fontSize="0.92rem"
        fontWeight={600}
        color="#1a1a1a"
        mt={0.3}
        sx={{ wordBreak: "break-word" }}
      >
        {value || "-"}
      </Typography>
    </Box>
  </Box>
);

export default function ProfileCard() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [openPassword, setOpenPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    phonenumber: user?.phonenumber || "",
    address: user?.address || "",
  });

  const initials = useMemo(
    () => (user?.username ? user.username.slice(0, 2).toUpperCase() : "?"),
    [user],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSaveError(null);
    setFormData({
      username: user?.username || "",
      phonenumber: user?.phonenumber || "",
      address: user?.address || "",
    });
  };

  const handleSave = async () => {
    setSaveError(null);
    const result = await dispatch(updateMyProfile(formData));

    if (result.meta?.requestStatus === "fulfilled") {
      dispatch(
        setAuthUser({
          ...user,
          ...result.payload,
        }),
      );
      setIsEditing(false);
      return;
    }

    setSaveError(
      typeof result.payload === "string"
        ? result.payload
        : "A aparut o eroare la actualizarea profilului.",
    );
  };

  return (
    <>
      <Card
        sx={{
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          border: "1px solid #f0f0f0",
          p: 0,
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #a91111 0%, #6d0a0a 100%)",
            pt: { xs: 4, sm: 5 },
            pb: { xs: 6, sm: 7 },
            px: { xs: 2, sm: 3 },
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              right: 0,
              top: -20,
              width: 140,
              height: 140,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.05)",
            },
            "&::before": {
              content: '""',
              position: "absolute",
              left: 40,
              bottom: -30,
              width: 100,
              height: 100,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.04)",
            },
          }}
        />

        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            mt: { xs: "-42px", sm: "-48px" },
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            mb: 2,
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Avatar
            sx={{
              width: { xs: 80, sm: 90 },
              height: { xs: 80, sm: 90 },
              fontSize: { xs: "1.7rem", sm: "2rem" },
              fontWeight: 800,
              backgroundColor: "#fff",
              color: RED,
              border: "4px solid #fff",
              boxShadow: "0 4px 20px rgba(169,17,17,0.2)",
            }}
          >
            {initials}
          </Avatar>

          {user?.role && (
            <Chip
              icon={<AdminPanelSettingsOutlinedIcon sx={{ fontSize: 16 }} />}
              label={formatRole(user.role)}
              size="small"
              sx={{
                mb: 1,
                fontWeight: 700,
                fontSize: "0.72rem",
                backgroundColor:
                  user.role === "admin" ? "#fff3e0" : "#eff6ff",
                color: user.role === "admin" ? "#e65100" : "#1d4ed8",
                border: "1px solid",
                borderColor: user.role === "admin" ? "#ffcc80" : "#bfdbfe",
              }}
            />
          )}
        </Box>

        <Box sx={{ px: { xs: 2, sm: 3 }, mb: 1 }}>
          <Typography
            variant="h6"
            fontWeight={800}
            color="#1a1a1a"
            lineHeight={1.2}
          >
            {user?.username || "Utilizator"}
          </Typography>
          <Typography fontSize="0.82rem" color="#999" mt={0.3}>
            Membru Paws & Hearts
          </Typography>
        </Box>

        <Divider sx={{ my: 2, mx: { xs: 2, sm: 3 } }} />

        {saveError && (
          <Box
            sx={{
              mx: { xs: 2, sm: 3 },
              mb: 2,
              p: 1.5,
              borderRadius: "12px",
              backgroundColor: "#fff1f2",
              border: "1px solid #fecdd3",
            }}
          >
            <Typography sx={{ fontSize: "0.82rem", color: "#991b1b" }}>
              {saveError}
            </Typography>
          </Box>
        )}

        <Box sx={{ px: { xs: 1, sm: 1.5 }, pb: 1 }}>
          {isEditing ? (
            <Box sx={{ px: { xs: 1, sm: 1.5 }, display: "grid", gap: 2 }}>
              <TextField
                label="Nume utilizator"
                name="username"
                value={formData.username}
                onChange={handleChange}
                fullWidth
                sx={inputSx}
              />
              <TextField
                label="Telefon"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleChange}
                fullWidth
                sx={inputSx}
              />
              <TextField
                label="Adresa"
                name="address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={2}
                sx={inputSx}
              />
              <TextField
                label="Email"
                value={user?.email || ""}
                disabled
                fullWidth
                sx={inputSx}
              />
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 1,
              }}
            >
              <InfoRow
                icon={<PersonOutlineIcon sx={{ color: RED, fontSize: 18 }} />}
                label="Nume utilizator"
                value={user?.username}
              />
              <InfoRow
                icon={<EmailOutlinedIcon sx={{ color: RED, fontSize: 18 }} />}
                label="Email"
                value={user?.email}
              />
              <InfoRow
                icon={<PhoneOutlinedIcon sx={{ color: RED, fontSize: 18 }} />}
                label="Telefon"
                value={user?.phonenumber}
              />
              <InfoRow
                icon={<HomeOutlinedIcon sx={{ color: RED, fontSize: 18 }} />}
                label="Adresa"
                value={user?.address}
              />
            </Box>
          )}
        </Box>

        <Divider sx={{ mx: { xs: 2, sm: 3 }, my: 1 }} />

        <Box sx={{ px: { xs: 2, sm: 3 }, pb: 3, pt: 2 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            {isEditing ? (
              <>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<SaveOutlinedIcon />}
                  onClick={handleSave}
                  disabled={loading || !formData.username}
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: RED,
                    fontWeight: 700,
                    textTransform: "none",
                    py: 1,
                    "&:hover": { backgroundColor: RED_DARK },
                  }}
                >
                  {loading ? "Se salveaza..." : "Salveaza modificarile"}
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleCancel}
                  sx={{
                    borderRadius: "12px",
                    border: "2px solid #d9d9d9",
                    color: "#666",
                    fontWeight: 700,
                    textTransform: "none",
                    py: 1,
                  }}
                >
                  Renunta
                </Button>
              </>
            ) : (
              <>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<EditOutlinedIcon />}
                  onClick={() => setIsEditing(true)}
                  sx={{
                    borderRadius: "12px",
                    border: `2px solid ${RED}`,
                    color: RED,
                    fontWeight: 700,
                    textTransform: "none",
                    py: 1,
                    "&:hover": {
                      backgroundColor: RED_LIGHT,
                      border: `2px solid ${RED_DARK}`,
                    },
                  }}
                >
                  Editeaza profilul
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<LockOutlinedIcon />}
                  onClick={() => setOpenPassword(true)}
                  sx={{
                    borderRadius: "12px",
                    border: `2px solid ${RED}`,
                    color: RED,
                    fontWeight: 700,
                    textTransform: "none",
                    py: 1,
                    "&:hover": {
                      backgroundColor: RED_LIGHT,
                      border: `2px solid ${RED_DARK}`,
                    },
                  }}
                >
                  Schimba parola
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Card>

      <ChangePasswordDialog
        open={openPassword}
        handleClose={() => setOpenPassword(false)}
      />
    </>
  );
}
