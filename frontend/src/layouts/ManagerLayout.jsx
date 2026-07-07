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

      <Box
        sx={{
          display: "flex",
          height: "100vh",
          overflow: "hidden",
          width: "100%",
          maxWidth: "100vw",
          backgroundColor: "#f7f8fa",
        }}
      >
        {!isMobile && <ManagerSidebar />}

        {isMobile && (
          <ManagerSidebar mobile open={open} onClose={() => setOpen(false)} />
        )}

        <Box
          sx={{
            flex: "1 1 0",
            p: { xs: 1.5, sm: 2, md: 3 },
            mt: isMobile ? "64px" : 0,
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            minWidth: 0,
            maxWidth: "100%",
            boxSizing: "border-box",
            width: "100%",
            "&::-webkit-scrollbar": { width: "8px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#c1c1c1",
              borderRadius: "4px",
            },
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "100%",
              minWidth: 0,
              height: "100%",
              boxSizing: "border-box",
              overflowX: "hidden",
              pb: { xs: 8, md: 4 },
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </>
  );
}
