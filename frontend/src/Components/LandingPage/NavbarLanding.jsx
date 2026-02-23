import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import App from "../../App";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useState } from "react";
import styles from "./NavbarLanding.module.css";
const navItems = [
  { label: "Acasă", id: "home" },
  { label: "Animale", id: "animals" },
  { label: "Despre", id: "about" },
];
export default function NavbarLanding() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const drawer = (
    <Box sx={{ textAlign: "center" }} onClick={handleDrawerToggle}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Paws & hearts
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              sx={{ textAlign: "center" }}
              onClick={()=>document
                .getElementById(item.id)
                ?.scrollIntoView({ behavior: "smooth" })}
            >
              <ListItemText primary={item.label} className={styles.listItem} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center" }}>
            <ListItemText className={styles.login} primary="Login" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center" }}>
            <ListItemText primary="Register" className={styles.register} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
  return (
    <>
      <AppBar
        position="fixed"
        color="transparent"
        elevation={0}
        className={styles.appBar}
      >
        <Toolbar disableGutters className={styles.toolBar}>
          <Box className={styles.left}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FavoriteIcon sx={{ color: "#e63946" }} />

              <Typography variant="h6" className={styles.logo}>
                Paws & hearts
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{ display: { xs: "none", sm: "block" } }}
            className={styles.menuList}
          >
            {navItems.map((item) => (
              <Button
                key={item.id}
                className={styles.listItem}
                onClick={() =>
                  document
                    .getElementById(item.id)
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {item.label}
              </Button>
            ))}
            <Button className={styles.login}>Login</Button>
            <Button variant="contained" className={styles.register}>
              Register
            </Button>
          </Box>{" "}
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>{" "}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { sm: "none" },
          "& .MuiDrawer-paper": { width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
