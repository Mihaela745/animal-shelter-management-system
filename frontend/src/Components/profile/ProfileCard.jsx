import {
  Card,
  Typography,
  Box,
  Avatar,
  Button,
  Divider,
  Chip,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";

import { useSelector } from "react-redux";
import { useState } from "react";

import ChangePasswordDialog from "./ChangePasswordDialog";

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
        {value || "—"}
      </Typography>
    </Box>
  </Box>
);

export default function ProfileCard() {
  const { user } = useSelector((state) => state.auth);
  const [openPassword, setOpenPassword] = useState(false);

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "?";

  return (
    <>
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

          {user?.role && (
            <Chip
              icon={<AdminPanelSettingsOutlinedIcon sx={{ fontSize: 16 }} />}
              label={user.role}
              size="small"
              sx={{
                mb: 1,
                fontWeight: 700,
                fontSize: "0.72rem",
                backgroundColor: user.role === "admin" ? "#fff3e0" : "#f0f0f0",
                color: user.role === "admin" ? "#e65100" : "#555",
                border: "1px solid",
                borderColor: user.role === "admin" ? "#ffcc80" : "#e0e0e0",
              }}
            />
          )}
        </Box>

        <Box sx={{ px: 3, mb: 1 }}>
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

        <Divider sx={{ my: 2, mx: 3 }} />

        <Box sx={{ px: 1, pb: 1 }}>
          <InfoRow
            icon={<PersonOutlineIcon sx={{ color: "#a91111", fontSize: 18 }} />}
            label="Nume utilizator"
            value={user?.username}
          />
          <InfoRow
            icon={<EmailOutlinedIcon sx={{ color: "#a91111", fontSize: 18 }} />}
            label="Email"
            value={user?.email}
          />
          <InfoRow
            icon={<PhoneOutlinedIcon sx={{ color: "#a91111", fontSize: 18 }} />}
            label="Telefon"
            value={user?.phonenumber}
          />
          <InfoRow
            icon={<HomeOutlinedIcon sx={{ color: "#a91111", fontSize: 18 }} />}
            label="Adresă"
            value={user?.address}
          />
        </Box>

        <Divider sx={{ mx: 3, my: 1 }} />

        <Box sx={{ px: 3, pb: 3, pt: 2 }}>
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
            Schimbă parola
          </Button>
        </Box>
      </Card>

      <ChangePasswordDialog
        open={openPassword}
        handleClose={() => setOpenPassword(false)}
      />
    </>
  );
}
