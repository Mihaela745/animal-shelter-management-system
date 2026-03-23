import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function MobileTopBar({ onMenuClick }) {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#a91111" }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={onMenuClick}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ ml: 2 }}>
          Paws & Hearts
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
