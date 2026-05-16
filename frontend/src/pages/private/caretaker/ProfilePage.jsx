import {
  Card,
  Typography,
  Box,
  Avatar,
  Button,
  Divider,
  Chip,
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
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChangePasswordDialog from "../../../components/profile/ChangePasswordDialog";
import {
  fetchMyStaffProfile,
  updateMyStaffProfile,
} from "../../../features/staff/staffSlice";
import { setAuthUser } from "../../../features/auth/authSlice";
import { formatRole } from "../../../utils/labels";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#fafafa",
    "&.Mui-focused fieldset": { borderColor: "#a91111" },
  },
  "& label.Mui-focused": { color: "#a91111" },
};

const InfoRow = ({ icon, label, value }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      py: 1.5,
      px: 2,
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
        backgroundColor: "#fff0f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography
        fontSize="0.72rem"
        color="#aaa"
        fontWeight={600}
        lineHeight={1}
      >
        {label}
      </Typography>
      <Typography fontSize="0.92rem" fontWeight={600} color="#1a1a1a" mt={0.3}>
        {value || "-"}
      </Typography>
    </Box>
  </Box>
);

export default function ManagerProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myProfile, loading } = useSelector((state) => state.staff);

  const [isEditing, setIsEditing] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phonenumber: "",
  });

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

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setError(null);
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
      return;
    }

    setError(
      typeof result.payload === "string"
        ? result.payload
        : "A aparut o eroare la actualizarea profilului.",
    );
  };

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 5 },
        py: { xs: 3, md: 4 },
        width: "100%",
        maxWidth: "800px",
        mx: "auto",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <Card
        sx={{
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          border: "1px solid #f0f0f0",
          padding: 0,
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #a91111 0%, #6d0a0a 100%)",
            pt: 5,
            pb: 7,
            px: 3,
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
            px: 3,
            mt: "-48px",
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
              width: 90,
              height: 90,
              fontSize: "2rem",
              fontWeight: 800,
              backgroundColor: "#fff",
              color: "#a91111",
              border: "4px solid #fff",
              boxShadow: "0 4px 20px rgba(169,17,17,0.2)",
            }}
          >
            {initials}
          </Avatar>

          <Chip
            icon={<AdminPanelSettingsOutlinedIcon sx={{ fontSize: 16 }} />}
            label={formatRole(user?.role || "Caretaker")}
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

        <Box sx={{ px: 3, mb: 1 }}>
          <Typography
            variant="h6"
            fontWeight={800}
            color="#1a1a1a"
            lineHeight={1.2}
          >
            {myProfile?.name || user?.username || "Ingrijitor"}
          </Typography>
          <Typography fontSize="0.82rem" color="#999" mt={0.3}>
            Profil manager Paws & Hearts
          </Typography>
        </Box>

        <Divider sx={{ my: 2, mx: 3 }} />

        {loading && !myProfile ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress sx={{ color: "#a91111" }} />
          </Box>
        ) : (
          <>
            {error && (
              <Box
                sx={{
                  mx: 3,
                  mb: 2,
                  p: 1.5,
                  borderRadius: "12px",
                  backgroundColor: "#fff1f2",
                  border: "1px solid #fecdd3",
                }}
              >
                <Typography sx={{ fontSize: "0.82rem", color: "#991b1b" }}>
                  {error}
                </Typography>
              </Box>
            )}

            <Box sx={{ px: 1, pb: 1 }}>
              {isEditing ? (
                <Box sx={{ px: 2, display: "grid", gap: 2 }}>
                  <TextField
                    label="Nume complet"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    sx={inputSx}
                    fullWidth
                  />
                  <TextField
                    label="Telefon"
                    name="phonenumber"
                    value={formData.phonenumber}
                    onChange={handleChange}
                    sx={inputSx}
                    fullWidth
                  />
                  <TextField
                    label="Email"
                    value={user?.email || ""}
                    disabled
                    sx={inputSx}
                    fullWidth
                  />
                </Box>
              ) : (
                <>
                  <InfoRow
                    icon={
                      <PersonOutlineIcon
                        sx={{ color: "#a91111", fontSize: 18 }}
                      />
                    }
                    label="Nume"
                    value={myProfile?.name || user?.username}
                  />
                  <InfoRow
                    icon={
                      <EmailOutlinedIcon
                        sx={{ color: "#a91111", fontSize: 18 }}
                      />
                    }
                    label="Email"
                    value={user?.email}
                  />
                  <InfoRow
                    icon={
                      <PhoneOutlinedIcon
                        sx={{ color: "#a91111", fontSize: 18 }}
                      />
                    }
                    label="Telefon"
                    value={myProfile?.phonenumber || user?.phonenumber}
                  />
                  <InfoRow
                    icon={
                      <WorkOutlineIcon
                        sx={{ color: "#a91111", fontSize: 18 }}
                      />
                    }
                    label="Pozitie"
                    value={myProfile?.Position?.title || formatRole(user?.role)}
                  />
                </>
              )}
            </Box>

            <Divider sx={{ mx: 3, my: 1 }} />

            <Box
              sx={{
                px: 3,
                pb: 3,
                pt: 2,
                display: "grid",
                gap: 1.5,
              }}
            >
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
                      backgroundColor: "#a91111",
                      fontWeight: 700,
                      textTransform: "none",
                      py: 1,
                      "&:hover": { backgroundColor: "#8a0d0d" },
                    }}
                  >
                    {saveLoading ? "Se salveaza..." : "Salvează modificarile"}
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                      setIsEditing(false);
                      setError(null);
                      setFormData({
                        name: myProfile?.name || "",
                        phonenumber: myProfile?.phonenumber || "",
                      });
                    }}
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
                      border: "2px solid #a91111",
                      color: "#a91111",
                      fontWeight: 700,
                      textTransform: "none",
                      py: 1,
                      "&:hover": {
                        backgroundColor: "#fff0f0",
                        border: "2px solid #8a0d0d",
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
                      border: "2px solid #a91111",
                      color: "#a91111",
                      fontWeight: 700,
                      textTransform: "none",
                      py: 1,
                      "&:hover": {
                        backgroundColor: "#fff0f0",
                        border: "2px solid #8a0d0d",
                      },
                    }}
                  >
                    Schimba parola
                  </Button>
                </>
              )}
            </Box>
          </>
        )}
      </Card>

      <ChangePasswordDialog
        open={openPassword}
        handleClose={() => setOpenPassword(false)}
      />
    </Box>
  );
}
