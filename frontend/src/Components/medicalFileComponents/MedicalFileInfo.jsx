import { Box, Typography, Chip } from "@mui/material";
import MonitorWeightOutlinedIcon from "@mui/icons-material/MonitorWeightOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import { formatAnimalStatus } from "../../utils/labels";

function InfoCard({ icon, label, value }) {
  return (
    <Box
      sx={{
        flex: "1 1 140px",
        backgroundColor: "#fafafa",
        border: "1.5px solid #f0f0f0",
        borderRadius: "14px",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
      }}
    >
      <Box sx={{ color: "#bbb", display: "flex", alignItems: "center" }}>
        {icon}
      </Box>
      <Typography
        sx={{
          fontSize: "0.68rem",
          fontWeight: 700,
          color: "#bbb",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{ fontSize: "0.95rem", fontWeight: 800, color: "#1a1a1a" }}
      >
        {value || "—"}
      </Typography>
    </Box>
  );
}

export default function MedicalFileInfo({ file }) {
  const animal = file.Animal;

  return (
    <Box mb={4}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "1.2rem",
              fontWeight: 800,
              color: "#1a1a1a",
              letterSpacing: "-0.5px",
            }}
          >
            {animal?.name}
          </Typography>
          <Typography
            sx={{ fontSize: "0.78rem", color: "#bbb", fontWeight: 600 }}
          >
            Fișă medicală
          </Typography>
        </Box>
        <Chip
          label={formatAnimalStatus(animal?.status)}
          sx={{
            fontWeight: 700,
            fontSize: "0.75rem",
            borderRadius: "8px",
            backgroundColor:
              animal?.status === "Available" ? "#e8f5e9" : "#ffebee",
            color: animal?.status === "Available" ? "#2e7d32" : "#c62828",
            border: "1px solid",
            borderColor: animal?.status === "Available" ? "#a5d6a7" : "#ef9a9a",
          }}
        />
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <InfoCard
          icon={<PetsOutlinedIcon sx={{ fontSize: "1rem" }} />}
          label="Animal"
          value={animal?.name}
        />
        <InfoCard
          icon={<MonitorWeightOutlinedIcon sx={{ fontSize: "1rem" }} />}
          label="Greutate"
          value={file.weight ? `${file.weight} kg` : null}
        />
        <InfoCard
          icon={<CalendarTodayOutlinedIcon sx={{ fontSize: "1rem" }} />}
          label="Ultimul control"
          value={
            file.last_checkup_date
              ? new Date(file.last_checkup_date).toLocaleDateString("ro-RO")
              : "N/A"
          }
        />
      </Box>
      {file.general_observations && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: "12px",
            backgroundColor: "#fafafa",
            border: "1.5px solid #f0f0f0",
            display: "flex",
            gap: 1.5,
            alignItems: "flex-start",
          }}
        >
          <NotesOutlinedIcon
            sx={{ fontSize: "1rem", color: "#bbb", mt: 0.2, flexShrink: 0 }}
          />
          <Box>
            <Typography
              sx={{
                fontSize: "0.68rem",
                fontWeight: 700,
                color: "#bbb",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                mb: 0.5,
              }}
            >
              Observații generale
            </Typography>
            <Typography
              sx={{ fontSize: "0.88rem", color: "#444", lineHeight: 1.6 }}
            >
              {file.general_observations}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
