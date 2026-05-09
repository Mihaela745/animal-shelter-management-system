import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ro } from "date-fns/locale";
import { formatAppointmentStatus } from "../../utils/labels";

const RED = "#a91111";
const DAY_NAMES = ["Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă", "Duminică"];

function getStatusPalette(status) {
  if (status === "Completed") {
    return {
      background: "#dff7ea",
      border: "#a7e3c0",
      text: "#166534",
    };
  }

  if (status === "Cancelled") {
    return {
      background: "#fee2e2",
      border: "#fecaca",
      text: "#b91c1c",
    };
  }

  return {
    background: "#e8f0fe",
    border: "#bfdbfe",
    text: "#1d4ed8",
  };
}

function normalizeDateValue(dateValue) {
  if (!dateValue) {
    return null;
  }

  if (dateValue instanceof Date) {
    return dateValue;
  }

  if (typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return parseISO(`${dateValue}T00:00:00`);
  }

  return new Date(dateValue);
}

function AppointmentPreview({ appointment, onClick }) {
  const palette = getStatusPalette(appointment.status);

  return (
    <Box
      onClick={onClick}
      sx={{
        p: 0.85,
        borderRadius: "12px",
        backgroundColor: palette.background,
        border: `1px solid ${palette.border}`,
        cursor: "pointer",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
        },
      }}
    >
      <Typography
        sx={{
          fontWeight: 800,
          fontSize: "0.76rem",
          color: "#1f1f1f",
          lineHeight: 1.2,
        }}
      >
        {`${appointment.hour?.slice(0, 5) || "--:--"} · ${
          appointment.Animal?.name || "Animal necunoscut"
        }`}
      </Typography>
      <Typography sx={{ fontSize: "0.7rem", color: "#656565", mt: 0.35 }}>
        {appointment.Staff?.name || "Personal nedefinit"}
      </Typography>
    </Box>
  );
}

export default function ScheduleCalendar({
  appointments,
  title,
  subtitle,
  monthStart: controlledMonthStart,
  onMonthStartChange,
  statusFilter,
  onStatusFilterChange,
  staffFilter,
  onStaffFilterChange,
  staffOptions = [],
  allowStaffFilter = false,
  onStatusChange,
  actionLoading = false,
}) {
  const [internalMonthStart, setInternalMonthStart] = useState(() =>
    startOfMonth(new Date()),
  );
  const monthStart = controlledMonthStart || internalMonthStart;
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDayAppointments, setSelectedDayAppointments] = useState([]);
  const [selectedDayDate, setSelectedDayDate] = useState(null);

  const setMonthStart = onMonthStartChange || setInternalMonthStart;

  const filteredAppointments = useMemo(
    () =>
      appointments.filter((appointment) => {
        const statusMatch =
          statusFilter === "all" || appointment.status === statusFilter;
        const staffMatch =
          !allowStaffFilter ||
          staffFilter === "all" ||
          String(appointment.staff_id || appointment.Staff?.id) === String(staffFilter);

        return statusMatch && staffMatch;
      }),
    [allowStaffFilter, appointments, staffFilter, statusFilter],
  );

  const monthDays = useMemo(() => {
    const calendarStart = startOfWeek(startOfMonth(monthStart), { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1 });

    return eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd,
    });
  }, [monthStart]);

  const appointmentsByDay = useMemo(() => {
    const entries = new Map();

    filteredAppointments.forEach((appointment) => {
      const date = normalizeDateValue(appointment.date);
      if (!date) {
        return;
      }

      const key = format(date, "yyyy-MM-dd");
      const current = entries.get(key) || [];
      current.push(appointment);
      current.sort((first, second) =>
        (first.hour || "").localeCompare(second.hour || ""),
      );
      entries.set(key, current);
    });

    return entries;
  }, [filteredAppointments]);

  const visibleCount = filteredAppointments.filter((appointment) => {
    const date = normalizeDateValue(appointment.date);
    return date && isSameMonth(date, monthStart);
  }).length;

  const handleCloseDialog = () => setSelectedAppointment(null);
  const handleCloseDayDialog = () => {
    setSelectedDayAppointments([]);
    setSelectedDayDate(null);
  };

  const openDayAppointments = (day, dayAppointments) => {
    setSelectedDayDate(day);
    setSelectedDayAppointments(dayAppointments);
  };

  return (
    <>
      <Paper
        sx={{
          borderRadius: "20px",
          border: "1px solid #efefef",
          overflow: "hidden",
          boxShadow: "0 10px 32px rgba(0,0,0,0.04)",
        }}
      >
        <Box
          sx={{
            p: { xs: 2, md: 2.5 },
            borderBottom: "1px solid #f2f2f2",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 0.7 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "12px",
                  backgroundColor: "#fff1f1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CalendarMonthRoundedIcon sx={{ color: RED }} />
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: "1.05rem" }}>
                {title}
              </Typography>
            </Box>
            <Typography sx={{ color: "#868686", fontSize: "0.88rem" }}>
              {subtitle}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
            <TextField
              select
              size="small"
              value={statusFilter}
              onChange={(event) => onStatusFilterChange(event.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="all">Toate statusurile</MenuItem>
              <MenuItem value="Scheduled">Programată</MenuItem>
              <MenuItem value="Completed">Finalizată</MenuItem>
              <MenuItem value="Cancelled">Anulată</MenuItem>
            </TextField>

            {allowStaffFilter && (
              <TextField
                select
                size="small"
                value={staffFilter}
                onChange={(event) => onStaffFilterChange(event.target.value)}
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="all">Tot personalul</MenuItem>
                {staffOptions.map((member) => (
                  <MenuItem key={member.id} value={String(member.id)}>
                    {member.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Stack>
        </Box>

        <Box sx={{ p: { xs: 2, md: 2.5 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
              mb: 2,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title="Luna anterioară">
                <IconButton onClick={() => setMonthStart((current) => subMonths(current, 1))}>
                  <ChevronLeftRoundedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Luna următoare">
                <IconButton onClick={() => setMonthStart((current) => addMonths(current, 1))}>
                  <ChevronRightRoundedIcon />
                </IconButton>
              </Tooltip>
            </Stack>

            <Typography sx={{ fontWeight: 800, color: "#333", textTransform: "capitalize" }}>
              {format(monthStart, "MMMM yyyy", { locale: ro })}
            </Typography>

            <Typography sx={{ color: "#8d8d8d", fontSize: "0.86rem" }}>
              {visibleCount} programări în luna selectată
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
              border: "1px solid #ececec",
              borderRadius: "18px",
              overflow: "hidden",
              backgroundColor: "white",
            }}
          >
            {DAY_NAMES.map((dayName) => (
              <Box
                key={dayName}
                sx={{
                  p: 1.2,
                  borderBottom: "1px solid #ececec",
                  backgroundColor: "#fafafa",
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontWeight: 800, fontSize: "0.84rem" }}>
                  {dayName}
                </Typography>
              </Box>
            ))}

            {monthDays.map((day, index) => {
              const appointmentsForDay = appointmentsByDay.get(format(day, "yyyy-MM-dd")) || [];
              const isCurrentMonth = isSameMonth(day, monthStart);
              const extraCount = Math.max(appointmentsForDay.length - 3, 0);

              return (
                <Box
                  key={day.toISOString()}
                  sx={{
                    minHeight: { xs: 118, md: 150 },
                    p: 1,
                    borderRight: index % 7 !== 6 ? "1px solid #ececec" : "none",
                    borderBottom:
                      index < monthDays.length - 7 ? "1px solid #ececec" : "none",
                    backgroundColor: isSameDay(day, new Date())
                      ? "#fff8f8"
                      : isCurrentMonth
                        ? "#fff"
                        : "#fcfcfc",
                    opacity: isCurrentMonth ? 1 : 0.55,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "0.83rem",
                      color: isSameDay(day, new Date()) ? RED : "#555",
                      mb: 1,
                    }}
                  >
                    {format(day, "d")}
                  </Typography>

                  <Stack spacing={0.7}>
                    {appointmentsForDay.slice(0, 3).map((appointment) => (
                      <AppointmentPreview
                        key={appointment.id}
                        appointment={appointment}
                        onClick={() => setSelectedAppointment(appointment)}
                      />
                    ))}

                    {extraCount > 0 ? (
                      <Button
                        onClick={() => openDayAppointments(day, appointmentsForDay)}
                        sx={{
                          justifyContent: "flex-start",
                          px: 0,
                          py: 0.2,
                          minWidth: 0,
                          textTransform: "none",
                          fontSize: "0.72rem",
                          color: "#8a8a8a",
                          fontWeight: 700,
                          "&:hover": {
                            backgroundColor: "transparent",
                            color: RED,
                          },
                        }}
                      >
                        +{extraCount} alte programări
                      </Button>
                    ) : null}
                  </Stack>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Paper>

      <Dialog
        open={Boolean(selectedDayDate)}
        onClose={handleCloseDayDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "20px",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {selectedDayDate
            ? `Toate programările din ${format(selectedDayDate, "d MMMM yyyy", {
                locale: ro,
              })}`
            : "Programări"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1}>
            {selectedDayAppointments.map((appointment) => (
              <AppointmentPreview
                key={appointment.id}
                appointment={appointment}
                onClick={() => {
                  setSelectedAppointment(appointment);
                  handleCloseDayDialog();
                }}
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDayDialog} sx={{ textTransform: "none", fontWeight: 700 }}>
            Închide
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(selectedAppointment)}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "20px",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Detalii programare</DialogTitle>
        <DialogContent dividers>
          {selectedAppointment && (
            <Stack spacing={1.4}>
              <Typography sx={{ fontWeight: 800, fontSize: "1.05rem" }}>
                {selectedAppointment.Animal?.name || "Animal necunoscut"}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center">
                <PersonOutlineRoundedIcon sx={{ color: "#9a9a9a", fontSize: 18 }} />
                <Typography>{selectedAppointment.User?.username || "-"}</Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <BadgeOutlinedIcon sx={{ color: "#9a9a9a", fontSize: 18 }} />
                <Typography>{selectedAppointment.Staff?.name || "-"}</Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <MeetingRoomRoundedIcon sx={{ color: "#9a9a9a", fontSize: 18 }} />
                <Typography>Camera {selectedAppointment.Room?.room_number || "-"}</Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarMonthRoundedIcon sx={{ color: "#9a9a9a", fontSize: 18 }} />
                <Typography>
                  {format(normalizeDateValue(selectedAppointment.date), "EEEE, d MMMM yyyy", {
                    locale: ro,
                  })}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <AccessTimeRoundedIcon sx={{ color: "#9a9a9a", fontSize: 18 }} />
                <Typography>{selectedAppointment.hour?.slice(0, 5) || "-"}</Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <PetsRoundedIcon sx={{ color: "#9a9a9a", fontSize: 18 }} />
                <Typography>
                  Status: {formatAppointmentStatus(selectedAppointment.status)}
                </Typography>
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          {selectedAppointment?.status === "Scheduled" && onStatusChange ? (
            <>
              <Button
                startIcon={<CheckCircleOutlineIcon />}
                onClick={async () => {
                  await onStatusChange(selectedAppointment.id, "Completed");
                  handleCloseDialog();
                }}
                disabled={actionLoading}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  color: "#166534",
                }}
              >
                Finalizează
              </Button>
              <Button
                startIcon={<CancelOutlinedIcon />}
                onClick={async () => {
                  await onStatusChange(selectedAppointment.id, "Cancelled");
                  handleCloseDialog();
                }}
                disabled={actionLoading}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  color: "#b91c1c",
                }}
              >
                Anulează
              </Button>
              <Divider flexItem orientation="vertical" />
            </>
          ) : null}
          <Button onClick={handleCloseDialog} sx={{ textTransform: "none", fontWeight: 700 }}>
            Închide
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
