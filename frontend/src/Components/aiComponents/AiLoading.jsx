import { Box, CircularProgress } from "@mui/material";

const AiLoading = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
      <CircularProgress size={28} />
    </Box>
  );
};

export default AiLoading;
