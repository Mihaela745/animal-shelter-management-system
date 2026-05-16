import { Box, Typography, Chip, Stack, Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ScaleOutlinedIcon from "@mui/icons-material/ScaleOutlined";

const RED = "#a91111";
const RED_LIGHT = "#fff0f0";

function parseDateValue(dateValue) {
  if (!dateValue) {
    return null;
  }

  if (typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return new Date(`${dateValue}T00:00:00`);
  }

  const parsed = new Date(dateValue);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDate(dateValue) {
  const parsed = parseDateValue(dateValue);
  return parsed ? parsed.toLocaleDateString("ro-RO") : "-";
}

function MedCard({ med }) {
  const endDate = parseDateValue(med.end_date);
  const isActive = !endDate || endDate >= new Date();

  return (
    <Box
      sx={{
        border: "1.5px solid",
        borderColor: isActive ? "#ffd6d6" : "#f0f0f0",
        borderRadius: "16px",
        p: 2.5,
        backgroundColor: isActive ? RED_LIGHT : "white",
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.07)" },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          backgroundColor: isActive ? RED : "#e0e0e0",
          borderRadius: "4px 0 0 4px",
        }}
      />

      <Box sx={{ pl: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MedicationOutlinedIcon
              sx={{ fontSize: "1rem", color: isActive ? RED : "#bbb" }}
            />
            <Typography
              sx={{ fontWeight: 800, fontSize: "0.95rem", color: "#1a1a1a" }}
            >
              {med.name}
            </Typography>
          </Box>
          <Chip
            label={isActive ? "Activ" : "Încheiat"}
            size="small"
            sx={{
              fontSize: "0.65rem",
              fontWeight: 700,
              borderRadius: "6px",
              height: 20,
              flexShrink: 0,
              ml: 1,
              backgroundColor: isActive ? RED : "#f5f5f5",
              color: isActive ? "white" : "#aaa",
            }}
          />
        </Box>
        {med.description && (
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: "#888",
              mb: 1.5,
              fontStyle: "italic",
              lineHeight: 1.4,
            }}
          >
            {med.description}
          </Typography>
        )}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              backgroundColor: isActive ? "rgba(169,17,17,0.07)" : "#f5f5f5",
              borderRadius: "8px",
              px: 1.2,
              py: 0.4,
            }}
          >
            <ScaleOutlinedIcon
              sx={{ fontSize: "0.75rem", color: isActive ? RED : "#999" }}
            />
            <Typography
              sx={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: isActive ? RED : "#666",
              }}
            >
              {med.dosage}
            </Typography>
          </Box>

          {med.frequency && (
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                backgroundColor: "#f0f0f0",
                borderRadius: "8px",
                px: 1.2,
                py: 0.4,
              }}
            >
              <Typography
                sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#666" }}
              >
                🔁 {med.frequency}
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CalendarTodayOutlinedIcon
              sx={{ fontSize: "0.75rem", color: "#bbb" }}
            />
            <Typography
              sx={{ fontSize: "0.75rem", color: "#888", fontWeight: 600 }}
            >
              {formatDate(med.start_date)}
              {med.end_date && ` → ${formatDate(med.end_date)}`}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <PersonOutlineIcon sx={{ fontSize: "0.75rem", color: "#bbb" }} />
            <Typography
              sx={{ fontSize: "0.75rem", color: "#888", fontWeight: 600 }}
            >
              Dr. {med.Staff?.name || "Necunoscut"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function MedicationsList() {
  const { medications, loading } = useSelector((state) => state.medications);
  const medsArray = Array.isArray(medications) ? medications : [];

  const sorted = [...medsArray].sort((a, b) => {
    const firstDate = parseDateValue(a.start_date);
    const secondDate = parseDateValue(b.start_date);
    return (secondDate?.getTime() || 0) - (firstDate?.getTime() || 0);
  });

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography
          sx={{ fontWeight: 800, fontSize: "1rem", color: "#1a1a1a" }}
        >
          Medicație
        </Typography>
        {!loading && (
          <Chip
            label={`${sorted.length} înregistrări`}
            size="small"
            sx={{
              fontSize: "0.7rem",
              fontWeight: 700,
              backgroundColor: "#f5f5f5",
              color: "#888",
              borderRadius: "6px",
            }}
          />
        )}
      </Box>

      {loading ? (
        <Stack spacing={1.5}>
          {[1, 2].map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={90}
              sx={{ borderRadius: "16px" }}
            />
          ))}
        </Stack>
      ) : sorted.length === 0 ? (
        <Box
          sx={{
            py: 5,
            textAlign: "center",
            backgroundColor: "#fafafa",
            borderRadius: "16px",
            border: "1.5px dashed #e0e0e0",
          }}
        >
          <Typography sx={{ fontSize: "1.5rem", mb: 1 }}>💊</Typography>
          <Typography
            sx={{ fontSize: "0.85rem", color: "#bbb", fontWeight: 600 }}
          >
            Nu există medicații înregistrate
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            maxHeight: 420,
            overflowY: "auto",
            pr: 0.5,
            "&::-webkit-scrollbar": { width: "4px" },
            "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#e0e0e0",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#bbb" },
          }}
        >
          <Stack spacing={1.5}>
            {sorted.map((med) => (
              <MedCard key={med.id} med={med} />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
