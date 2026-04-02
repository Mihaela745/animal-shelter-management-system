import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { fetchAnimals } from "../../../features/animals/animalsSlice";
import { fetchAppointmentsByStaffId } from "../../../features/appointments/appointmentsSlice";
import {
  fetchBoxesByStaffId,
  fetchResponsiblesByBoxId,
} from "../../../features/responsibleBoxes/responsibleBoxesSlice";
import { fetchMyStaffProfile } from "../../../features/staff/staffSlice";

const RED = "#a91111";

function StatCard({ title, value, subtitle, color, icon }) {
  return (
    <Card
      sx={{
        borderRadius: "18px",
        border: "1px solid #f1f1f1",
        boxShadow: "0 6px 24px rgba(0,0,0,0.05)",
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1.5,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "0.72rem",
                color: "#999",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                mt: 1,
                fontSize: { xs: "1.7rem", md: "2rem" },
                fontWeight: 800,
                color,
              }}
            >
              {value}
            </Typography>
            {subtitle ? (
              <Typography sx={{ mt: 0.5, fontSize: "0.8rem", color: "#999" }}>
                {subtitle}
              </Typography>
            ) : null}
          </Box>

          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "12px",
              backgroundColor: `${color}15`,
              color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function SectionCard({ title, subtitle, action, children }) {
  return (
    <Card
      sx={{
        borderRadius: "20px",
        border: "1px solid #f0f0f0",
        boxShadow: "0 8px 28px rgba(0,0,0,0.05)",
        height: "100%",
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            mb: 2,
          }}
        >
          <Box>
            <Typography
              sx={{ fontWeight: 800, fontSize: "1rem", color: "#1a1a1a" }}
            >
              {title}
            </Typography>
            {subtitle ? (
              <Typography sx={{ fontSize: "0.8rem", color: "#999", mt: 0.4 }}>
                {subtitle}
              </Typography>
            ) : null}
          </Box>
          {action}
        </Box>
        {children}
      </CardContent>
    </Card>
  );
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "-";
  }

  const date = parseDateValue(dateValue);
  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("ro-RO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function normalizeAppointment(appointment) {
  return {
    ...appointment,
    Animal: appointment.Animal || appointment.Animals || null,
    Room: appointment.Room || appointment.Rooms || null,
    Staff: appointment.Staff || null,
  };
}

function parseDateValue(dateValue) {
  if (!dateValue) {
    return new Date(NaN);
  }

  if (dateValue instanceof Date) {
    return new Date(dateValue);
  }

  if (typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    const [year, month, day] = dateValue.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(dateValue);
}

function getLocalDateKey(dateValue) {
  const date = parseDateValue(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getAnimalBoxId(animal) {
  return (
    animal.box_id ||
    animal.Box?.id ||
    animal.Boxes?.id ||
    animal.box?.id ||
    null
  );
}

function getStatusChipStyles(status) {
  if (status === "Completed") {
    return { bg: "#f0fdf4", border: "#bbf7d0", color: "#166534" };
  }
  if (status === "Cancelled") {
    return { bg: "#fef2f2", border: "#fecaca", color: "#b91c1c" };
  }
  return { bg: "#eff6ff", border: "#bfdbfe", color: "#1d4ed8" };
}

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    myProfile,
    loading: profileLoading,
    error: profileError,
  } = useSelector((state) => state.staff);
  const {
    staffBoxes,
    responsiblesByBoxId,
    loading: boxesLoading,
    error: boxesError,
  } = useSelector((state) => state.responsibleBoxes);
  const {
    appointments,
    loading: appointmentsLoading,
    error: appointmentsError,
  } = useSelector((state) => state.appointments);
  const {
    animals,
    loading: animalsLoading,
    error: animalsError,
  } = useSelector((state) => state.animals);

  useEffect(() => {
    dispatch(fetchMyStaffProfile());
    dispatch(fetchAnimals({ limit: 9999, page: 1 }));
  }, [dispatch]);

  useEffect(() => {
    if (!myProfile?.id) {
      return;
    }

    dispatch(fetchBoxesByStaffId(myProfile.id));
    dispatch(fetchAppointmentsByStaffId(myProfile.id));
  }, [dispatch, myProfile?.id]);

  useEffect(() => {
    staffBoxes.forEach((boxItem) => {
      dispatch(fetchResponsiblesByBoxId(boxItem.id));
    });
  }, [dispatch, staffBoxes]);

  const now = new Date();
  const todayKey = getLocalDateKey(now);
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const normalizedAppointments = useMemo(
    () => appointments.map(normalizeAppointment),
    [appointments],
  );

  const assignedBoxIds = useMemo(
    () => new Set(staffBoxes.map((boxItem) => boxItem.id)),
    [staffBoxes],
  );

  const animalsInMyBoxes = useMemo(
    () =>
      animals.filter((animal) => assignedBoxIds.has(getAnimalBoxId(animal))),
    [animals, assignedBoxIds],
  );

  const todayAppointments = useMemo(
    () =>
      normalizedAppointments
        .filter((appointment) => {
          const dateKey = getLocalDateKey(appointment.date);
          return dateKey === todayKey;
        })
        .sort((a, b) => `${a.hour || ""}`.localeCompare(`${b.hour || ""}`)),
    [normalizedAppointments, todayKey],
  );

  const thisMonthAppointments = useMemo(
    () =>
      normalizedAppointments.filter((appointment) => {
        if (!appointment.date) {
          return false;
        }

        const date = parseDateValue(appointment.date);
        return (
          !Number.isNaN(date.getTime()) &&
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );
      }),
    [currentMonth, currentYear, normalizedAppointments],
  );

  const scheduledTodayCount = todayAppointments.filter(
    (appointment) => appointment.status === "Scheduled",
  ).length;

  const totalCapacity = staffBoxes.reduce(
    (sum, boxItem) => sum + (boxItem.capacity || 0),
    0,
  );
  const totalOccupancy = staffBoxes.reduce(
    (sum, boxItem) => sum + (boxItem.current_occupancy || 0),
    0,
  );
  const occupancyRate = totalCapacity
    ? `${Math.round((totalOccupancy / totalCapacity) * 100)}%`
    : "0%";

  const busiestBoxes = useMemo(
    () =>
      [...staffBoxes]
        .sort((a, b) => {
          const aRate = a.capacity ? a.current_occupancy / a.capacity : 0;
          const bRate = b.capacity ? b.current_occupancy / b.capacity : 0;
          return bRate - aRate;
        })
        .slice(0, 4),
    [staffBoxes],
  );

  const recentAnimals = useMemo(
    () => animalsInMyBoxes.slice(0, 5),
    [animalsInMyBoxes],
  );

  const isLoading =
    profileLoading || boxesLoading || appointmentsLoading || animalsLoading;
  const error = profileError || boxesError || appointmentsError || animalsError;

  return (
    <Box
      sx={{ maxWidth: 1200, mx: "auto", width: "100%", pb: { xs: 10, md: 5 } }}
    >
      <Box
        sx={{
          mb: 4,
          p: { xs: 2.5, md: 3 },
          borderRadius: "22px",
          background: "linear-gradient(135deg, #8f1111 0%, #c53a1c 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            letterSpacing: "-0.5px",
            fontSize: { xs: "1.2rem", md: "1.5rem" },
          }}
        >
          Dashboard caretaker
        </Typography>
        <Typography sx={{ opacity: 0.86, mt: 0.6, fontSize: "0.9rem" }}>
          Urmareste rapid boxele tale, animalele aflate in grija ta si
          programarile planificate pentru astazi si luna curenta.
        </Typography>
      </Box>

      {error ? (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "14px" }}>
          {typeof error === "string"
            ? error
            : "Nu am putut incarca datele pentru dashboard."}
        </Alert>
      ) : null}

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress sx={{ color: RED }} />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr 1fr",
                md: "repeat(4, 1fr)",
              },
              gap: { xs: 1.5, md: 2.5 },
              mb: 4,
            }}
          >
            <StatCard
              title="Boxe atribuite"
              value={staffBoxes.length}
              subtitle="zone aflate in grija ta"
              color="#a91111"
              icon={<Inventory2OutlinedIcon />}
            />
            <StatCard
              title="Animale in boxe"
              value={animalsInMyBoxes.length}
              subtitle={`ocupare totala ${occupancyRate}`}
              color="#1565c0"
              icon={<PetsOutlinedIcon />}
            />
            <StatCard
              title="Programari azi"
              value={todayAppointments.length}
              subtitle={`${scheduledTodayCount} inca programate`}
              color="#2e7d32"
              icon={<EventAvailableOutlinedIcon />}
            />
            <StatCard
              title="Programari luna"
              value={thisMonthAppointments.length}
              subtitle="toate programarile din luna curenta"
              color="#ef6c00"
              icon={<CalendarMonthOutlinedIcon />}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1.1fr 0.9fr" },
              gap: 3,
              mb: 3,
            }}
          >
            <SectionCard
              title="Programarile de azi"
              subtitle="ordinea zilei pentru activitatea curenta"
              action={
                <Button
                  size="small"
                  onClick={() => navigate("/staff/animals")}
                  endIcon={<ArrowForwardIosRoundedIcon sx={{ fontSize: 12 }} />}
                  sx={{
                    textTransform: "none",
                    color: RED,
                    fontWeight: 700,
                  }}
                >
                  Vezi animale
                </Button>
              }
            >
              {todayAppointments.length === 0 ? (
                <Typography sx={{ fontSize: "0.86rem", color: "#999" }}>
                  Nu ai programari setate pentru azi.
                </Typography>
              ) : (
                <Stack spacing={1.2}>
                  {todayAppointments.slice(0, 5).map((appointment) => {
                    const statusStyle = getStatusChipStyles(appointment.status);

                    return (
                      <Box
                        key={appointment.id}
                        sx={{
                          p: 1.5,
                          borderRadius: "14px",
                          backgroundColor: "#fffafa",
                          border: "1px solid #f6e4e4",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 1.5,
                            alignItems: "flex-start",
                          }}
                        >
                          <Box>
                            <Typography
                              sx={{ fontWeight: 800, fontSize: "0.92rem" }}
                            >
                              {appointment.Animal?.name || "Animal necunoscut"}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "0.78rem",
                                color: "#999",
                                mt: 0.4,
                              }}
                            >
                              {formatDate(appointment.date)} la{" "}
                              {appointment.hour || "-"}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "0.78rem",
                                color: "#666",
                                mt: 0.5,
                              }}
                            >
                              Camera: {appointment.Room?.room_number || "-"}
                            </Typography>
                          </Box>

                          <Chip
                            size="small"
                            label={appointment.status || "-"}
                            sx={{
                              backgroundColor: statusStyle.bg,
                              border: `1px solid ${statusStyle.border}`,
                              color: statusStyle.color,
                              fontWeight: 700,
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </SectionCard>

            <SectionCard
              title="Boxe cu incarcare mai mare"
              subtitle="utile pentru prioritizarea activitatii"
              action={
                <Button
                  size="small"
                  onClick={() => navigate("/staff/boxes")}
                  endIcon={<ArrowForwardIosRoundedIcon sx={{ fontSize: 12 }} />}
                  sx={{
                    textTransform: "none",
                    color: RED,
                    fontWeight: 700,
                  }}
                >
                  Vezi boxe
                </Button>
              }
            >
              {busiestBoxes.length === 0 ? (
                <Typography sx={{ fontSize: "0.86rem", color: "#999" }}>
                  Nu ai boxe atribuite momentan.
                </Typography>
              ) : (
                <Stack spacing={1.2}>
                  {busiestBoxes.map((boxItem) => {
                    const responsibles = responsiblesByBoxId[boxItem.id] || [];
                    const occupancy = boxItem.capacity
                      ? Math.round(
                          (boxItem.current_occupancy / boxItem.capacity) * 100,
                        )
                      : 0;

                    return (
                      <Box
                        key={boxItem.id}
                        sx={{
                          p: 1.5,
                          borderRadius: "14px",
                          backgroundColor: "#fff",
                          border: "1px solid #f0f0f0",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 1.5,
                            alignItems: "flex-start",
                          }}
                        >
                          <Box>
                            <Typography
                              sx={{ fontWeight: 800, fontSize: "0.92rem" }}
                            >
                              {boxItem.box_number}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "0.78rem",
                                color: "#666",
                                mt: 0.4,
                              }}
                            >
                              {boxItem.current_occupancy || 0} /{" "}
                              {boxItem.capacity || 0} locuri
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "0.76rem",
                                color: "#999",
                                mt: 0.5,
                              }}
                            >
                              {responsibles.length} responsabili asignati
                            </Typography>
                          </Box>

                          <Chip
                            size="small"
                            label={`${occupancy}% ocupat`}
                            sx={{
                              backgroundColor: "#fafafa",
                              border: "1px solid #ececec",
                              fontWeight: 700,
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </SectionCard>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
              gap: 3,
            }}
          >
            <SectionCard
              title="Animale din boxele tale"
              subtitle="primele animale gasite in zonele atribuite"
            >
              {recentAnimals.length === 0 ? (
                <Typography sx={{ fontSize: "0.86rem", color: "#999" }}>
                  Nu exista animale in boxele tale sau datele nu sunt
                  disponibile inca.
                </Typography>
              ) : (
                <Stack spacing={1.2}>
                  {recentAnimals.map((animal) => (
                    <Box
                      key={animal.id}
                      sx={{
                        p: 1.5,
                        borderRadius: "14px",
                        backgroundColor: "#fff",
                        border: "1px solid #f0f0f0",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 1.5,
                          alignItems: "flex-start",
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{ fontWeight: 800, fontSize: "0.92rem" }}
                          >
                            {animal.name}
                          </Typography>
                          <Typography
                            sx={{ fontSize: "0.78rem", color: "#666", mt: 0.4 }}
                          >
                            {animal.Species?.name || "-"} •{" "}
                            {animal.gender || "-"} • {animal.age ?? "-"} ani
                          </Typography>
                          <Typography
                            sx={{ fontSize: "0.76rem", color: "#999", mt: 0.5 }}
                          >
                            Boxa:{" "}
                            {animal.Boxes?.box_number ||
                              animal.Box?.box_number ||
                              "-"}
                          </Typography>
                        </Box>

                        <Button
                          size="small"
                          onClick={() =>
                            navigate(`/staff/animals/${animal.id}`)
                          }
                          sx={{
                            textTransform: "none",
                            color: RED,
                            fontWeight: 700,
                            minWidth: "fit-content",
                          }}
                        >
                          Detalii
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              )}
            </SectionCard>

            <SectionCard
              title="Rezumat rapid"
              subtitle="ce merita urmarit in tura curenta"
            >
              <Stack spacing={1.2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "14px",
                    backgroundColor: "#fff8f8",
                    border: "1px solid #ffe3e3",
                  }}
                >
                  <Typography sx={{ fontWeight: 800, fontSize: "0.9rem" }}>
                    Activitate azi
                  </Typography>
                  <Typography
                    sx={{ fontSize: "0.8rem", color: "#666", mt: 0.5 }}
                  >
                    Ai {todayAppointments.length} programari astazi si{" "}
                    {scheduledTodayCount} sunt inca planificate.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "14px",
                    backgroundColor: "#f8fbff",
                    border: "1px solid #dbeafe",
                  }}
                >
                  <Typography sx={{ fontWeight: 800, fontSize: "0.9rem" }}>
                    Boxe in grija ta
                  </Typography>
                  <Typography
                    sx={{ fontSize: "0.8rem", color: "#666", mt: 0.5 }}
                  >
                    Ai in responsabilitate {staffBoxes.length} boxe cu o ocupare
                    cumulata de {totalOccupancy} din {totalCapacity || 0}{" "}
                    locuri.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "14px",
                    backgroundColor: "#fffaf2",
                    border: "1px solid #ffe6bf",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <AccessTimeRoundedIcon
                      sx={{ fontSize: 18, color: "#ef6c00" }}
                    />
                    <Typography sx={{ fontWeight: 800, fontSize: "0.9rem" }}>
                      Luna curenta
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: "0.8rem", color: "#666" }}>
                    Sunt {thisMonthAppointments.length} programari alocate tie
                    in luna aceasta.
                  </Typography>
                </Box>
              </Stack>
            </SectionCard>
          </Box>
        </>
      )}
    </Box>
  );
}
