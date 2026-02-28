import { Box, useMediaQuery} from "@mui/material";
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

       <Box sx={{ display: "flex", minHeight: "100vh" }}>
         {!isMobile && <Sidebar />}

         {isMobile && (
           <Sidebar mobile open={open} onClose={() => setOpen(false)} />
         )}

         <Box
           sx={{
             flexGrow: 1,
             p: 3,
             mt: isMobile ? "64px" : 0,
           }}
         >
           <Outlet />
         </Box>
       </Box>
     </>
   );
}
