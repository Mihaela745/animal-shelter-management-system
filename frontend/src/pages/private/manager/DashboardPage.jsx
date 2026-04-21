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

function parseDateValue(dateValue) {
  if (!dateValue) return null;
  if (typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return new Date(`${dateValue}T00:00:00`);
  }
  const parsed = new Date(dateValue);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getDiffInDays(startDate, endDate) {
  if (!startDate || !endDate) return null;
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.max(
    0,
    Math.round((endDate.getTime() - startDate.getTime()) / msPerDay),
  );
}

function formatPercent(value) {
  if (!Number.isFinite(value)) return "0%";
  return `${value.toFixed(1)}%`;
}

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
    (animal) => animal.status === "Available",
  ).length;
  const adoptedAnimals = animals.filter(
    (animal) => animal.status === "Adopted",
  ).length;
  const pendingRequests = requests.filter(
    (request) => request.status === "Pending",
  ).length;

  const today = new Date().toISOString().split("T")[0];
  const appointmentsToday = appointments.filter(
    (appointment) => appointment.date?.split("T")[0] === today,
  ).length;

  const totalEntries = animals.filter((animal) =>
    Boolean(parseDateValue(animal.date_added)),
  ).length;

  const adoptionRate =
    totalEntries > 0 ? (adoptions.length / totalEntries) * 100 : 0;

  const animalEntryDateById = animals.reduce((acc, animal) => {
    const entryDate = parseDateValue(animal.date_added);
    if (entryDate) {
      acc[animal.id] = entryDate;
    }
    return acc;
  }, {});

  const resolvedStayDurations = adoptions
    .map((adoption) => {
      const entryDate = animalEntryDateById[adoption.animal_id];
      const resolutionDate = parseDateValue(adoption.adoption_date);
      return getDiffInDays(entryDate, resolutionDate);
    })
    .filter((value) => value !== null);

  const averageLos =
    resolvedStayDurations.length > 0
      ? resolvedStayDurations.reduce((sum, value) => sum + value, 0) /
        resolvedStayDurations.length
      : 0;

  const totalCapacity = boxes.reduce((sum, box) => sum + (box.capacity || 0), 0);
  const totalOccupied = boxes.reduce(
    (sum, box) => sum + (box.current_occupancy || 0),
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
            <Tooltip title="Adapostul este supraincarcat!" arrow>
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
    { title: "Total animale", value: totalAnimals, color: "#a91111" },
    { title: "Total intrari", value: totalEntries, color: "#5d4037" },
    { title: "Disponibile", value: availableAnimals, color: "#2e7d32" },
    { title: "Adoptate", value: adoptedAnimals, color: "#1565c0" },
    {
      title: "Rata adoptie",
      value: formatPercent(adoptionRate),
      color: "#00897b",
    },
    {
      title: "LOS mediu",
      value: `${averageLos.toFixed(1)} zile`,
      color: "#6a1b9a",
    },
    { title: "Cereri in asteptare", value: pendingRequests, color: "#e65100" },
    { title: "Programari azi", value: appointmentsToday, color: "#a91111" },
    { title: "Membri personal", value: staff.length, color: "#3949ab" },
    { title: "Capacitate adapost", value: totalCapacity, color: "#00695c" },
    {
      title: "Ocupare %",
      value: isOverCapacity
        ? `! ${((totalOccupied / totalCapacity) * 100).toFixed(1)}%`
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
          Panou manager
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
          Statistici si activitate in timp real.
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 1.25 }}>
          Indicatori integrati: total intrari, rata de adoptie si durata medie a
          sederii pentru animalele rezolvate prin adoptie.
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 1.5, md: 3 }} mb={4}>
        {stats.map((stat) => (
          <Grid item xs={6} sm={6} md={3} key={stat.title}>
            <StatCard {...stat} />
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
            Adapostul este supraincarcat! Capacitate totala: {totalCapacity},
            ocupate: {totalOccupied}. Verifica distributia animalelor pe boxe.
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
