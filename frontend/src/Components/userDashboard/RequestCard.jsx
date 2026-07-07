import { Card, Typography, Box, Button, Chip } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import { useNavigate } from "react-router-dom";
import { formatSpecies } from "../../utils/labels";

const statusConfig = {
  Pending: { label: "În așteptare", bg: "#fff8e1", color: "#f59f00" },
  Approved: { label: "Aprobată", bg: "#e8f5e9", color: "#2e7d32" },
  Rejected: { label: "Respinsă", bg: "#fce4ec", color: "#c62828" },
};

export default function RequestsCard({ requests = [] }) {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        borderRadius: "20px",
        p: 3,
        height: "100%",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        border: "1px solid #f5f5f5",
        overflow: "visible",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "12px",
            backgroundColor: "#fff0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PetsIcon sx={{ color: "#a91111", fontSize: 20 }} />
        </Box>
        <Box>
          <Typography fontWeight={700} fontSize="1rem" color="#1a1a1a">
            Cereri de adopție
          </Typography>
          <Typography fontSize="0.75rem" color="#999">
            {requests.length} în așteptare
          </Typography>
        </Box>
      </Box>

      {requests.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4, color: "#bbb" }}>
          <PetsIcon sx={{ fontSize: 40, mb: 1, opacity: 0.4 }} />
          <Typography fontSize="0.875rem">Nu ai cereri în așteptare</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            maxHeight: 340,
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
          {requests.map((request) => {
            const cfg = statusConfig[request.status] || statusConfig.Pending;
            return (
              <Box
                key={request.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.5,
                  borderRadius: "12px",
                  backgroundColor: "#fafafa",
                  border: "1px solid #f0f0f0",
                  gap: 1,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    fontWeight={700}
                    fontSize="0.875rem"
                    noWrap
                    color="#1a1a1a"
                  >
                    {request.Animal?.name || "Necunoscut"}
                  </Typography>
                  <Typography fontSize="0.75rem" color="#888" noWrap>
                    {formatSpecies(
                      request.Animal?.Species?.name || request.Animal?.species,
                    )}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexShrink: 0,
                  }}
                >
                  <Chip
                    label={cfg.label}
                    size="small"
                    sx={{
                      backgroundColor: cfg.bg,
                      color: cfg.color,
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      height: 24,
                      border: "none",
                    }}
                  />
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() =>
                      navigate(`/user/animals/${request.animal_id}`)
                    }
                    sx={{
                      backgroundColor: "#a91111",
                      borderRadius: "8px",
                      textTransform: "none",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      py: 0.5,
                      px: 1.5,
                      minWidth: 0,
                      "&:hover": { backgroundColor: "#8a0d0d" },
                    }}
                  >
                    Vezi
                  </Button>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Card>
  );
}
