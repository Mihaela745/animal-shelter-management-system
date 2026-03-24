import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/caretakerMenu/Sidebar";
import MobileTopBar from "../components/caretakerMenu/MobileTopBar";
import { useState } from "react";
export default function CaretakerLayout() {
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
          width: "100%",
          maxWidth: "100vw",
          backgroundColor: "#f7f8fa",
        }}
      >
        {!isMobile && <Sidebar />}

        {isMobile && (
          <Sidebar mobile open={open} onClose={() => setOpen(false)} />
        )}

        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 1.5, sm: 2, md: 3 },
            mt: isMobile ? "64px" : 0,
            width: "100%",
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
          <Box
            sx={{
              width: "100%",
              maxWidth: "100%",
              minWidth: 0,
              overflowX: "hidden",
              pb: { xs: 10, md: 5 },
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </>
  );
}
