import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/user/Sidebar";
import MobileTopBar from "../Components/user/MobileTopBar";
import { useState } from "react";

export default function UserLayout() {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [open, setOpen] = useState(false);

  return (
    <>
      {isMobile && <MobileTopBar onMenuClick={() => setOpen(true)} />}

      <Box
        sx={{
          display: "flex",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {!isMobile && <Sidebar />}

        {isMobile && (
          <Sidebar mobile open={open} onClose={() => setOpen(false)} />
        )}

        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            mt: isMobile ? "64px" : 0,
            width: "100%",
            height: "100%", 
            overflowY: "auto",
            minWidth: 0,
            "&::-webkit-scrollbar": { width: "8px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#c1c1c1",
              borderRadius: "4px",
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </>
  );
}
