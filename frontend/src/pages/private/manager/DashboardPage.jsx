import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Tooltip,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { fetchAnimals } from "../../../features/animals/animalsSlice";
import { fetchAllAdoptions } from "../../../features/adoptionsHistory/adoptionsHistorySlicer";
import { fetchAllAdoptionRequests } from "../../../features/adoptionRequests/adoptionRequestsSlice";
import { fetchAllAppointments } from "../../../features/appointments/appointmentsSlice";
import { fetchBoxes } from "../../../features/boxes/boxesSlice";
import { fetchStaff } from "../../../features/staff/staffSlice";
import DashboardCharts from "../../../components/managerDashboard/DashboardCharts";

export default function DashboardPage() {
  const dispatch = useDispatch();

  const { animals, total: totalAnimals } = useSelector(
    (state) => state.animals,
  );
  const adoptions = useSelector((state) => state.adoptionHistory.adoptions);
  const requests = useSelector((state) => state.adoptionRequests.requests);
  const appointments = useSelector((state) => state.appointments.appointments);
  const boxes = useSelector((state) => state.boxes.boxes);
  const staff = useSelector((state) => state.staff.staff);

  useEffect(() => {
    dispatch(fetchAnimals({ limit: 9999 }));
    dispatch(fetchAllAdoptions());
    dispatch(fetchAllAdoptionRequests());
    dispatch(fetchAllAppointments());
    dispatch(fetchBoxes());
    dispatch(fetchStaff());
  }, [dispatch]);

  const availableAnimals = animals.filter(
    (a) => a.status === "Available",
  ).length;
  const adoptedAnimals = animals.filter((a) => a.status === "Adopted").length;
  const pendingRequests = requests.filter((r) => r.status === "Pending").length;

  const today = new Date().toISOString().split("T")[0];
  const appointmentsToday = appointments.filter(
    (a) => a.date?.split("T")[0] === today,
  ).length;

  const totalCapacity = boxes.reduce((sum, b) => sum + (b.capacity || 0), 0);
  const totalOccupied = boxes.reduce(
    (sum, b) => sum + (b.current_occupancy || 0),
    0,
  );
  const occupancyRate =
    totalCapacity > 0
      ? Math.min(((totalOccupied / totalCapacity) * 100).toFixed(1), 100)
      : 0;
  const isOverCapacity = totalCapacity > 0 && totalOccupied > totalCapacity;

  const StatCard = ({ title, value, color = "#a91111", warning = false }) => (
    <Card
      sx={{
        height: "100%",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        border: warning ? "1px solid #ffcc80" : "1px solid #f5f5f5",
        backgroundColor: warning ? "#fffde7" : "#fff",
        transition: "transform 0.2s",
        "&:hover": { transform: "translateY(-2px)" },
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography
            fontSize="0.72rem"
            color={warning ? "#e65100" : "#999"}
            fontWeight={700}
          >
            {title.toUpperCase()}
          </Typography>
          {warning && (
            <Tooltip title="Adăpostul este supraîncărcat!" arrow>
              <WarningAmberIcon sx={{ fontSize: 16, color: "#e65100" }} />
            </Tooltip>
          )}
        </Box>
        <Typography
          fontWeight={800}
          color={color}
          sx={{ fontSize: { xs: "1.6rem", md: "2rem" } }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  const stats = [
    { title: "Total Animals", value: totalAnimals, color: "#a91111" },
    { title: "Available", value: availableAnimals, color: "#2e7d32" },
    { title: "Adopted", value: adoptedAnimals, color: "#1565c0" },
    { title: "Pending Requests", value: pendingRequests, color: "#e65100" },
    { title: "Appointments Today", value: appointmentsToday, color: "#a91111" },
    { title: "Staff Members", value: staff.length, color: "#6a1b9a" },
    { title: "Shelter Capacity", value: totalCapacity, color: "#00695c" },
    {
      title: "Occupancy %",
      value: isOverCapacity
        ? `⚠ ${((totalOccupied / totalCapacity) * 100).toFixed(1)}%`
        : `${occupancyRate}%`,
      color: isOverCapacity ? "#e65100" : "#c62828",
      warning: isOverCapacity,
    },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 0, md: 0 } }}>
      <Box
        sx={{
          mb: 4,
          p: { xs: 2.5, md: 3 },
          borderRadius: "20px",
          background: "linear-gradient(135deg, #a91111 0%, #6d0a0a 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            right: 0,
            top: -20,
            width: 160,
            height: 160,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.06)",
          },
        }}
      >
        <Typography
          fontWeight={800}
          sx={{
            letterSpacing: "-0.5px",
            fontSize: { xs: "1.1rem", md: "1.4rem" },
          }}
        >
          Manager Dashboard 🐾
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
          Statistici și activitate în timp real.
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 1.5, md: 3 }} mb={4}>
        {stats.map((s) => (
          <Grid item xs={6} sm={6} md={3} key={s.title}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>

      {isOverCapacity && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: "12px",
            backgroundColor: "#fff3e0",
            border: "1px solid #ffcc80",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <WarningAmberIcon sx={{ color: "#e65100" }} />
          <Typography fontSize="0.88rem" fontWeight={600} color="#bf360c">
            Adăpostul este supraîncărcat! Capacitate totală: {totalCapacity},
            ocupate: {totalOccupied}. Verificați distribuția animalelor pe boxe.
          </Typography>
        </Box>
      )}

      <DashboardCharts
        animals={animals}
        adoptions={adoptions}
        requests={requests}
        appointments={appointments}
      />
    </Box>
  );
}
