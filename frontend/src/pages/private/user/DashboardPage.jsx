import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchUserAppointments } from "../../../features/appointments/appointmentsSlice";
import { fetchUserAdoptionRequests } from "../../../features/adoptionRequests/adoptionRequestsSlice";
import { fetchUserAdoptions } from "../../../features/adoptionsHistory/adoptionsHistorySlicer";

import AppointmentsCard from "../../../Components/userDashboard/AppoinmentsCard";
import RequestsCard from "../../../Components/userDashboard/RequestCard";
import AdoptionHistoryCard from "../../../Components/userDashboard/AdoptionHistoryCard";

export default function DashboardPage() {
  const dispatch = useDispatch();

  const { appointments } = useSelector((state) => state.appointments);
  const { requests } = useSelector((state) => state.adoptionRequests);
  const { adoptions: adoptionHistory } = useSelector(
    (state) => state.adoptionHistory,
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUserAppointments());
    dispatch(fetchUserAdoptionRequests());
    dispatch(fetchUserAdoptions());
  }, [dispatch]);

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3, md: 4 },
        pt: { xs: 3, md: 5 }, 
        pb: { xs: 12, md: 8 }, 
        maxWidth: 1200,
        mx: "auto",
      }}
    >
      <Box
        sx={{
          mb: 5,
          p: { xs: 3, md: 4 },
          borderRadius: "24px",
          background: "linear-gradient(135deg, #a91111 0%, #6d0a0a 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 12px 30px rgba(169, 17, 17, 0.25)",
          "&::after": {
            content: '""',
            position: "absolute",
            right: -30,
            top: -30,
            width: 160,
            height: 160,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.06)",
          },
          "&::before": {
            content: '""',
            position: "absolute",
            right: 60,
            bottom: -40,
            width: 120,
            height: 120,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.04)",
          },
        }}
      >
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            letterSpacing: "-0.5px",
            mb: 1,
            fontSize: { xs: "1.75rem", md: "2.125rem" },
          }}
        >
          Bun venit{user?.username ? `, ${user.username}` : ""}! 🐾
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.85, mb: 3.5 }}>
          Aici poți urmări programările, cererile și istoricul adopțiilor tale.
        </Typography>

        <Box sx={{ display: "flex", gap: { xs: 3, md: 6 }, flexWrap: "wrap" }}>
          {[
            { label: "Programări active", value: appointments?.length ?? 0 },
            { label: "Cereri trimise", value: requests?.length ?? 0 },
            { label: "Animale adoptate", value: adoptionHistory?.length ?? 0 },
          ].map((stat) => (
            <Box key={stat.label}>
              <Typography fontWeight={800} fontSize="2rem" lineHeight={1.1}>
                {stat.value}
              </Typography>
              <Typography
                fontSize="0.85rem"
                sx={{ opacity: 0.8, fontWeight: 500, mt: 0.5 }}
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: { xs: 10, md: 5 },
          alignItems: "stretch",
        }}
      >
        <Box>
          <AppointmentsCard appointments={appointments} />
        </Box>

        <Box>
          <RequestsCard requests={requests} />
        </Box>

        <Box
          sx={{ gridColumn: { xs: "1", md: "1 / -1" }, mt: { xs: 0, md: 2 } }}
        >
          <AdoptionHistoryCard adoptions={adoptionHistory} />
        </Box>
      </Box>
    </Box>
  );
}
