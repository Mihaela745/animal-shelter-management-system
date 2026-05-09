import {
  Avatar,
  Box,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PetsIcon from "@mui/icons-material/Pets";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";

export default function ManagerSidebar({ mobile = false, open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [collapsed, setCollapsed] = useState(false);
  const [openAnimals, setOpenAnimals] = useState(false);

  const sidebarWidth = mobile ? 240 : collapsed ? 80 : 240;

  const isSelected = (path) => location.pathname === path;

  const itemSx = {
    px: 2,
    justifyContent: mobile ? "flex-start" : collapsed ? "center" : "flex-start",
    "&.Mui-selected": { backgroundColor: "#680d0d" },
    "&:hover": { backgroundColor: "#ca2929" },
  };

  const iconSx = {
    color: "white",
    minWidth: mobile || !collapsed ? 40 : 0,
    justifyContent: "center",
  };

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
          <ListItemButton
            selected={isSelected("/manager/dashboard")}
            onClick={() => {
              navigate("/manager/dashboard");
              if (mobile) onClose();
            }}
            sx={itemSx}
          >
            <ListItemIcon sx={iconSx}>
              <DashboardIcon />
            </ListItemIcon>
            {(mobile || !collapsed) && <ListItemText primary="Panou" />}
          </ListItemButton>

          <ListItemButton onClick={() => setOpenAnimals(!openAnimals)} sx={itemSx}>
            <ListItemIcon sx={iconSx}>
              <PetsIcon />
            </ListItemIcon>
            {(mobile || !collapsed) && <ListItemText primary="Animale" />}
            {(mobile || !collapsed) &&
              (openAnimals ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
          </ListItemButton>

          <Collapse
            in={openAnimals && (mobile || !collapsed)}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              <ListItemButton
                sx={{
                  pl: 4,
                  "&.Mui-selected": { backgroundColor: "#680d0d" },
                  "&:hover": { backgroundColor: "#ca2929" },
                }}
                selected={isSelected("/manager/animals")}
                onClick={() => {
                  navigate("/manager/animals");
                  if (mobile) onClose();
                }}
              >
                <ListItemText primary="Vezi animale" />
              </ListItemButton>
              <ListItemButton
                sx={{
                  pl: 4,
                  "&.Mui-selected": { backgroundColor: "#680d0d" },
                  "&:hover": { backgroundColor: "#ca2929" },
                }}
                selected={isSelected("/manager/animals/add")}
                onClick={() => {
                  navigate("/manager/animals/add");
                  if (mobile) onClose();
                }}
              >
                <ListItemText primary="Adaugă animal" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton
            selected={isSelected("/manager/boxes")}
            onClick={() => {
              navigate("/manager/boxes");
              if (mobile) onClose();
            }}
            sx={itemSx}
          >
            <ListItemIcon sx={iconSx}>
              <InventoryIcon />
            </ListItemIcon>
            {(mobile || !collapsed) && <ListItemText primary="Boxe" />}
          </ListItemButton>

          <ListItemButton
            selected={isSelected("/manager/appointments")}
            onClick={() => {
              navigate("/manager/appointments");
              if (mobile) onClose();
            }}
            sx={itemSx}
          >
            <ListItemIcon sx={iconSx}>
              <EventIcon />
            </ListItemIcon>
            {(mobile || !collapsed) && <ListItemText primary="Programări" />}
          </ListItemButton>

          <ListItemButton
            selected={isSelected("/manager/requests")}
            onClick={() => {
              navigate("/manager/requests");
              if (mobile) onClose();
            }}
            sx={itemSx}
          >
            <ListItemIcon sx={iconSx}>
              <FavoriteIcon />
            </ListItemIcon>
            {(mobile || !collapsed) && <ListItemText primary="Cereri de adopție" />}
          </ListItemButton>

          <ListItemButton
            selected={isSelected("/manager/staff")}
            onClick={() => {
              navigate("/manager/staff");
              if (mobile) onClose();
            }}
            sx={itemSx}
          >
            <ListItemIcon sx={iconSx}>
              <PeopleIcon />
            </ListItemIcon>
            {(mobile || !collapsed) && <ListItemText primary="Personal" />}
          </ListItemButton>

          <ListItemButton
            selected={isSelected("/manager/users")}
            onClick={() => {
              navigate("/manager/users");
              if (mobile) onClose();
            }}
            sx={itemSx}
          >
            <ListItemIcon sx={iconSx}>
              <PeopleIcon />
            </ListItemIcon>
            {(mobile || !collapsed) && <ListItemText primary="Utilizatori" />}
          </ListItemButton>

          <ListItemButton
            selected={isSelected("/manager/reports")}
            onClick={() => {
              navigate("/manager/reports");
              if (mobile) onClose();
            }}
            sx={itemSx}
          >
            <ListItemIcon sx={iconSx}>
              <AssessmentOutlinedIcon />
            </ListItemIcon>
            {(mobile || !collapsed) && <ListItemText primary="Rapoarte" />}
          </ListItemButton>

          <ListItemButton
            selected={isSelected("/manager/profile")}
            onClick={() => {
              navigate("/manager/profile");
              if (mobile) onClose();
            }}
            sx={itemSx}
          >
            <ListItemIcon sx={iconSx}>
              <AccountCircleOutlinedIcon />
            </ListItemIcon>
            {(mobile || !collapsed) && <ListItemText primary="Profil" />}
          </ListItemButton>
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
            "&:hover": { backgroundColor: "#ca2929" },
            pb: 2,
          }}
        >
          <ListItemIcon sx={iconSx}>
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
