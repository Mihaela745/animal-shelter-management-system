import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import ManagerSidebar from "../components/managerMenu/Sidebar";
import ManagerMobileTopBar from "../components/managerMenu/MobileTopBar";
import { useState } from "react";

export default function ManagerLayout() {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [open, setOpen] = useState(false);

  return (
    <>
      {isMobile && <ManagerMobileTopBar onMenuClick={() => setOpen(true)} />}

      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {!isMobile && <ManagerSidebar />}

        {isMobile && (
          <ManagerSidebar mobile open={open} onClose={() => setOpen(false)} />
        )}

        <Box
          sx={{
            flex: "1 1 0",
            p: 3,
            mt: isMobile ? "64px" : 0,
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            minWidth: 0,
            maxWidth: "100%",
            boxSizing: "border-box",
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
