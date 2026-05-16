import { Card, Typography, Box, Button } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateAppointmentStatus } from "../../features/appointments/appointmentsSlice";

export default function AppointmentsCard({ appointments = [] }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCancel = (id) => {
    dispatch(updateAppointmentStatus({ id, status: "Cancelled" }));
  };

  return (
    <Card
      sx={{
        borderRadius: "20px",
        p: 3,
        height: "100%",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        border: "1px solid #f5f5f5",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 3,
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "12px",
            backgroundColor: "#fff0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <CalendarMonthIcon sx={{ color: "#a91111", fontSize: 20 }} />
        </Box>
        <Box sx={{ textAlign: "left" }}>
          <Typography fontWeight={700} fontSize="1rem" color="#1a1a1a">
            Programări
          </Typography>
          <Typography fontSize="0.75rem" color="#999">
            {appointments.length} programări active
          </Typography>
        </Box>
      </Box>

      {appointments.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 4,
            color: "#bbb",
          }}
        >
          <CalendarMonthIcon sx={{ fontSize: 40, mb: 1, opacity: 0.4 }} />
          <Typography fontSize="0.875rem">Nu ai programări active</Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {appointments.slice(0, 5).map((appointment) => (
            <Box
              key={appointment.id}
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
              <Box>
                <Typography
                  fontWeight={700}
                  fontSize="0.875rem"
                  color="#1a1a1a"
                >
                  {new Date(appointment.date).toLocaleDateString("ro-RO", {
                    day: "numeric",
                    month: "short",
                  })}
                </Typography>
                <Typography fontSize="0.75rem" color="#888">
                  {appointment.hour}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() =>
                    navigate(`/user/animals/${appointment.animal_id}`)
                  }
                  sx={{
                    backgroundColor: "#a91111",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    py: 0.5,
                    px: 1.5,
                    "&:hover": { backgroundColor: "#8a0d0d" },
                  }}
                >
                  Animal
                </Button>

                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleCancel(appointment.id)}
                  sx={{
                    borderColor: "#ffcdd2",
                    color: "#a91111",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    py: 0.5,
                    px: 1.5,
                    "&:hover": {
                      backgroundColor: "#fff0f0",
                      borderColor: "#a91111",
                    },
                  }}
                >
                  Anulează
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Card>
  );
}
