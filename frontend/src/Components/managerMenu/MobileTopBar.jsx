import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function ManagerMobileTopBar({ onMenuClick }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#a91111",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
          Paws & Hearts
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
