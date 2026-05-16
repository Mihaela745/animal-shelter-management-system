import { Box, Typography } from "@mui/material";

const WelcomeMessage = () => {
  return (
    <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          backgroundColor: "#a91111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1rem",
          flexShrink: 0,
          mt: 0.5,
          boxShadow: "0 2px 6px rgba(169,17,17,0.25)",
        }}
      >
        🐾
      </Box>

      <Box
        sx={{
          backgroundColor: "#fff",
          border: "1px solid #f0f0f0",
          borderRadius: "4px 18px 18px 18px",
          px: 2.5,
          py: 2,
          maxWidth: "80%",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Typography
          fontWeight={700}
          fontSize="0.95rem"
          color="#1a1a1a"
          mb={0.5}
        >
          Bună! Sunt PawsAssistant 🐾
        </Typography>
        <Typography fontSize="0.88rem" color="#555" lineHeight={1.6}>
          Sunt aici să te ajut să găsești companionul perfect pentru tine.
          Spune-mi ce preferințe ai — specie, temperament, vârstă, stilul tău de
          viață — și eu mă ocup de rest!
        </Typography>
      </Box>
    </Box>
  );
};

export default WelcomeMessage;
