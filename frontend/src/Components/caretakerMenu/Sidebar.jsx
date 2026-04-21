import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Typography,
  Drawer,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import PetsIcon from "@mui/icons-material/Pets";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";

import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";

export default function CaretakerSidebar({ mobile = false, open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { text: "Panou", icon: <DashboardIcon />, path: "/staff/dashboard" },
    { text: "Animale", icon: <PetsIcon />, path: "/staff/animals" },
    { text: "Boxe", icon: <Inventory2Icon />, path: "/staff/boxes" },
    { text: "Programări", icon: <EventIcon />, path: "/staff/appointments" },
    { text: "Profil", icon: <PersonIcon />, path: "/staff/profile" },
  ];

  const sidebarWidth = mobile ? 240 : collapsed ? 80 : 240;

  const sidebarContent = (
    <Box
      sx={{
        width: sidebarWidth,
        height: "100vh",
        position: "sticky",
        top: 0,
        overflowY: "auto",
        backgroundColor: "#a91111",
        color: "white",
        display: "flex",
        flexDirection: "column",
        transition: mobile ? "none" : "width 0.3s ease",
        py: 2,
        boxSizing: "border-box",
        "&::-webkit-scrollbar": { display: "none" },
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        {!mobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "space-between",
              px: 2,
              mb: 3,
            }}
          >
            {!collapsed && (
              <Typography variant="h6" fontWeight={600}>
                Paws & Hearts
              </Typography>
            )}

            <IconButton
              onClick={() => setCollapsed(!collapsed)}
              sx={{ color: "white" }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: collapsed ? "column" : "row",
            alignItems: "center",
            gap: 1,
            px: 2,
            mb: 3,
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <Avatar sx={{ bgcolor: "#680d0d" }}>
            {user?.username?.charAt(0)?.toUpperCase()}
          </Avatar>

          {(mobile || !collapsed) && (
            <Typography variant="body2">{user?.username}</Typography>
          )}
        </Box>

        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (mobile) onClose();
              }}
              sx={{
                px: 2,
                justifyContent: mobile
                  ? "flex-start"
                  : collapsed
                    ? "center"
                    : "flex-start",
                "&.Mui-selected": { backgroundColor: "#680d0d" },
                "&:hover": { backgroundColor: "#ca2929" },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "white",
                  minWidth: mobile || !collapsed ? 40 : 0,
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>

              {(mobile || !collapsed) && <ListItemText primary={item.text} />}
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box>
        <ListItemButton
          onClick={() => {
            dispatch(logout());
            navigate("/");
          }}
          sx={{
            px: 2,
            justifyContent: mobile
              ? "flex-start"
              : collapsed
                ? "center"
                : "flex-start",
            "&:hover": { backgroundColor: "#a91111" },
            pb: 2,
          }}
        >
          <ListItemIcon
            sx={{
              color: "white",
              minWidth: mobile || !collapsed ? 40 : 0,
              justifyContent: "center",
            }}
          >
            <LogoutIcon />
          </ListItemIcon>

          {(mobile || !collapsed) && <ListItemText primary="Deconectare" />}
        </ListItemButton>
      </Box>
    </Box>
  );

  if (mobile) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return sidebarContent;
}
