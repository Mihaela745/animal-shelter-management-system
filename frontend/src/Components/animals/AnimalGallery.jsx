import { Box } from "@mui/material";

export default function AnimalGallery({ animal }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
      }}
    >
      <img
        src={animal.image_url}
        alt={animal.name}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "400px",
          objectFit: "cover",
          display: "block",
        }}
      />
    </Box>
  );
}
