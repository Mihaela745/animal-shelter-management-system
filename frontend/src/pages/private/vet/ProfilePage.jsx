import { Box } from "@mui/material";
import ProfileCard from "../../../components/profile/ProfileCard";

export default function ProfilePage() {
  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 5 },
        py: { xs: 3, md: 4 },
        width: "100%",
        maxWidth: "800px",
        mx: "auto",
        overflowX: "hidden",
      }}
    >
      <ProfileCard />
    </Box>
  );
}
