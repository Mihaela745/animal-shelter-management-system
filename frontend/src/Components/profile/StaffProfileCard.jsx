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
  CircularProgress,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import ChangePasswordDialog from "./ChangePasswordDialog";
import {
  fetchMyStaffProfile,
  updateMyStaffProfile,
} from "../../features/staff/staffSlice";
import { setAuthUser } from "../../features/auth/authSlice";
import { formatRole } from "../../utils/labels";
import { useNotification } from "../../context/NotificationContext";

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
      <Typography fontSize="0.72rem" color="#aaa" fontWeight={600} lineHeight={1}>
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

export default function StaffProfileCard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myProfile, loading } = useSelector((state) => state.staff);
  const { notifySuccess, notifyError } = useNotification();

  const [openPassword, setOpenPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [formData, setFormData] = useState({ name: "", phonenumber: "" });

  useEffect(() => {
    dispatch(fetchMyStaffProfile());
  }, [dispatch]);

  useEffect(() => {
    if (myProfile) {
      setFormData({
        name: myProfile.name || "",
        phonenumber: myProfile.phonenumber || "",
      });
    }
  }, [myProfile]);

  const initials = useMemo(() => {
    const baseName = myProfile?.name || user?.username || "?";
    return baseName.slice(0, 2).toUpperCase();
  }, [myProfile, user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSaveError(null);
    setFormData({
      name: myProfile?.name || "",
      phonenumber: myProfile?.phonenumber || "",
    });
  };

  const handleSave = async () => {
    setSaveError(null);
    setSaveLoading(true);
    const result = await dispatch(updateMyStaffProfile(formData));
    setSaveLoading(false);

    if (result.meta?.requestStatus === "fulfilled") {
      dispatch(
        setAuthUser({
          ...user,
          username: result.payload.name ?? user?.username,
          phonenumber: result.payload.phonenumber ?? user?.phonenumber,
        }),
      );
      setIsEditing(false);
      notifySuccess("Profilul a fost actualizat cu succes.");
      return;
    }

    const message =
      typeof result.payload === "string"
        ? result.payload
        : "A aparut o eroare la actualizarea profilului.";
    setSaveError(message);
    notifyError(message);
  };

  return (
    <>
      <Box sx={{ borderRadius: "24px", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
      <Card
        sx={{
          borderRadius: "24px",
          overflow: "hidden",
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

          <Chip
            icon={<AdminPanelSettingsOutlinedIcon sx={{ fontSize: 16 }} />}
            label={formatRole(user?.role)}
            size="small"
            sx={{
              mb: 1,
              fontWeight: 700,
              fontSize: "0.72rem",
              backgroundColor: "#fff3e0",
              color: "#e65100",
              border: "1px solid #ffcc80",
            }}
          />
        </Box>

        <Box sx={{ px: { xs: 2, sm: 3 }, mb: 1 }}>
          <Typography variant="h6" fontWeight={800} color="#1a1a1a" lineHeight={1.2}>
            {myProfile?.name || user?.username || "Utilizator"}
          </Typography>
          <Typography fontSize="0.82rem" color="#999" mt={0.3}>
            Profil {formatRole(user?.role).toLowerCase()} Paws & Hearts
          </Typography>
        </Box>

        <Divider sx={{ my: 2, mx: { xs: 2, sm: 3 } }} />

        {loading && !myProfile ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress sx={{ color: RED }} />
          </Box>
        ) : (
          <>
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
                    label="Nume complet"
                    name="name"
                    value={formData.name}
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
                    label="Nume complet"
                    value={myProfile?.name || user?.username}
                  />
                  <InfoRow
                    icon={<EmailOutlinedIcon sx={{ color: RED, fontSize: 18 }} />}
                    label="Email"
                    value={user?.email}
                  />
                  <InfoRow
                    icon={<PhoneOutlinedIcon sx={{ color: RED, fontSize: 18 }} />}
                    label="Telefon"
                    value={myProfile?.phonenumber || user?.phonenumber}
                  />
                  <InfoRow
                    icon={<WorkOutlineIcon sx={{ color: RED, fontSize: 18 }} />}
                    label="Poziție"
                    value={myProfile?.Position?.title || formatRole(user?.role)}
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
                      disabled={saveLoading || !formData.name}
                      sx={{
                        borderRadius: "12px",
                        backgroundColor: RED,
                        fontWeight: 700,
                        textTransform: "none",
                        py: 1,
                        "&:hover": { backgroundColor: RED_DARK },
                      }}
                    >
                      {saveLoading ? "Se salveaza..." : "Salvează modificarile"}
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
          </>
        )}
      </Card>
      </Box>

      <ChangePasswordDialog
        open={openPassword}
        handleClose={() => setOpenPassword(false)}
      />
    </>
  );
}
