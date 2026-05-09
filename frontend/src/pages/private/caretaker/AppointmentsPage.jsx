import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EventIcon from "@mui/icons-material/Event";
import PetsIcon from "@mui/icons-material/Pets";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ScheduleCalendar from "../../../components/appointments/ScheduleCalendar";
import {
  fetchAppointmentsByStaffId,
  updateAppointmentStatus,
} from "../../../features/appointments/appointmentsSlice";
import { fetchRooms } from "../../../features/rooms/roomsSlice";
import { fetchMyStaffProfile } from "../../../features/staff/staffSlice";
import { formatAppointmentStatus } from "../../../utils/labels";

const RED = "#a91111";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#fafafa",
    fontSize: "0.88rem",
    "& fieldset": { borderColor: "#ebebeb" },
    "&:hover fieldset": { borderColor: "#ccc" },
    "&.Mui-focused fieldset": { borderColor: RED, borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root": { fontSize: "0.88rem" },
  "& label.Mui-focused": { color: RED },
  "& .MuiInputBase-input": { py: "10px", px: "14px" },
};

function formatDate(dateValue) {
  if (!dateValue) {
    return "-";
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("ro-RO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getStatusStyles(status) {
  if (status === "Completed") {
    return { bg: "#f0fdf4", border: "#bbf7d0", color: "#166534" };
  }
  if (status === "Cancelled") {
    return { bg: "#fef2f2", border: "#fecaca", color: "#b91c1c" };
  }
  return { bg: "#eff6ff", border: "#bfdbfe", color: "#1d4ed8" };
}

function AppointmentCard({ appointment, onStatusChange, actionLoading }) {
  const statusStyle = getStatusStyles(appointment.status);

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: "16px",
        border: "1.5px solid #f0f0f0",
        p: 2.5,
        transition: "box-shadow 0.2s, transform 0.2s",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1.5,
          mb: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "0.95rem",
              color: "#1a1a1a",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {appointment.User?.username || "Utilizator necunoscut"}
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "#999", mt: 0.4 }}>
            {formatDate(appointment.date)} la {appointment.hour || "-"}
          </Typography>
        </Box>

        <Box
          sx={{
            px: 1,
            py: 0.3,
            borderRadius: "6px",
            backgroundColor: statusStyle.bg,
            border: `1px solid ${statusStyle.border}`,
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{ fontSize: "0.68rem", fontWeight: 700, color: statusStyle.color }}
          >
            {formatAppointmentStatus(appointment.status)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BadgeOutlinedIcon sx={{ fontSize: 14, color: "#bbb" }} />
          <Typography sx={{ fontSize: "0.78rem", color: "#666" }}>
            {appointment.User?.email || "-"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PetsIcon sx={{ fontSize: 14, color: "#bbb" }} />
          <Typography sx={{ fontSize: "0.78rem", color: "#666" }}>
            Animal: {appointment.Animal?.name || "-"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <MeetingRoomOutlinedIcon sx={{ fontSize: 14, color: "#bbb" }} />
          <Typography sx={{ fontSize: "0.78rem", color: "#666" }}>
            Camera: {appointment.Room?.room_number || "-"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PersonOutlineIcon sx={{ fontSize: 14, color: "#bbb" }} />
          <Typography sx={{ fontSize: "0.78rem", color: "#666" }}>
            Personal responsabil: {appointment.Staff?.name || "-"}
          </Typography>
        </Box>
      </Box>

      {appointment.status === "Scheduled" && (
        <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
          <Button
            size="small"
            startIcon={<CheckCircleOutlineIcon />}
            onClick={() => onStatusChange(appointment.id, "Completed")}
            disabled={actionLoading}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              color: "#166534",
              backgroundColor: "#f0fdf4",
              borderRadius: "10px",
              "&:hover": { backgroundColor: "#dcfce7" },
            }}
          >
            Finalizează
          </Button>

          <Button
            size="small"
            startIcon={<CancelOutlinedIcon />}
            onClick={() => onStatusChange(appointment.id, "Cancelled")}
            disabled={actionLoading}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              color: "#b91c1c",
              backgroundColor: "#fef2f2",
              borderRadius: "10px",
              "&:hover": { backgroundColor: "#fee2e2" },
            }}
          >
            Anulează
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default function AppointmentsPage() {
  const dispatch = useDispatch();
  const { appointments, loading } = useSelector((s) => s.appointments);
  const { rooms } = useSelector((s) => s.rooms);
  const { myProfile } = useSelector((s) => s.staff);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRoom, setFilterRoom] = useState("all");
  const [calendarStatus, setCalendarStatus] = useState("all");
  const [calendarMonthStart, setCalendarMonthStart] = useState(() =>
    startOfMonth(new Date()),
  );
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchMyStaffProfile());
    dispatch(fetchRooms());
  }, [dispatch]);

  useEffect(() => {
    if (!myProfile?.id) {
      return;
    }

    const startDate = format(calendarMonthStart, "yyyy-MM-dd");
    const endDate = format(endOfMonth(calendarMonthStart), "yyyy-MM-dd");

    dispatch(
      fetchAppointmentsByStaffId({
        staffId: myProfile.id,
        params: { startDate, endDate },
      }),
    );
  }, [calendarMonthStart, dispatch, myProfile?.id]);

  const normalizedAppointments = useMemo(
    () =>
      appointments.map((appointment) => ({
        ...appointment,
        User: appointment.User || appointment.Users || null,
        Animal: appointment.Animal || appointment.Animals || null,
        Room: appointment.Room || appointment.Rooms || null,
      })),
    [appointments],
  );

  const filteredAppointments = useMemo(
    () =>
      normalizedAppointments.filter((appointment) => {
        const searchValue = search.toLowerCase();
        const userMatch = (appointment.User?.username || "")
          .toLowerCase()
          .includes(searchValue);
        const animalMatch = (appointment.Animal?.name || "")
          .toLowerCase()
          .includes(searchValue);

        const statusMatch =
          filterStatus === "all" || appointment.status === filterStatus;
        const roomMatch =
          filterRoom === "all" ||
          String(appointment.room_id || appointment.Room?.id) === String(filterRoom);

        return (userMatch || animalMatch) && statusMatch && roomMatch;
      }),
    [filterRoom, filterStatus, normalizedAppointments, search],
  );

  const handleStatusChange = async (id, status) => {
    setActionLoading(true);
    await dispatch(updateAppointmentStatus({ id, status }));
    if (myProfile?.id) {
      const startDate = format(calendarMonthStart, "yyyy-MM-dd");
      const endDate = format(endOfMonth(calendarMonthStart), "yyyy-MM-dd");
      await dispatch(
        fetchAppointmentsByStaffId({
          staffId: myProfile.id,
          params: { startDate, endDate },
        }),
      );
    }
    setActionLoading(false);
  };

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2, md: 4 },
        pb: { xs: 10, sm: 4, md: 5 },
        maxWidth: 1200,
        mx: "auto",
        width: "100%",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: { xs: 2.5, md: 4 },
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                backgroundColor: RED,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <EventIcon sx={{ color: "white", fontSize: 18 }} />
            </Box>
            <Typography
              sx={{
                fontSize: "1.4rem",
                fontWeight: 800,
                color: "#1a1a1a",
                letterSpacing: "-0.5px",
              }}
            >
              Programările mele
            </Typography>
          </Box>
          <Typography sx={{ fontSize: "0.85rem", color: "#aaa", ml: "52px" }}>
            {normalizedAppointments.length} programări alocate ție în luna selectată
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: { xs: 2.5, md: 3 } }}>
        <ScheduleCalendar
          appointments={normalizedAppointments}
          title="Calendar lunar programări"
          subtitle="Vezi rapid programările tale și gestionează-le direct din calendar."
          monthStart={calendarMonthStart}
          onMonthStartChange={setCalendarMonthStart}
          statusFilter={calendarStatus}
          onStatusFilterChange={setCalendarStatus}
          staffFilter="all"
          onStaffFilterChange={() => {}}
          onStatusChange={handleStatusChange}
          actionLoading={actionLoading}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "minmax(0, 1.3fr) minmax(0, 1fr) minmax(0, 1fr)",
          },
          gap: 1.5,
          mb: { xs: 2, md: 3 },
          width: "100%",
        }}
      >
        <TextField
          placeholder="Caută după utilizator sau animal..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={fieldSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: "#ccc" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          sx={fieldSx}
        >
          <MenuItem value="all">Toate statusurile</MenuItem>
          <MenuItem value="Scheduled">Programată</MenuItem>
          <MenuItem value="Completed">Finalizată</MenuItem>
          <MenuItem value="Cancelled">Anulată</MenuItem>
        </TextField>

        <TextField
          select
          value={filterRoom}
          onChange={(e) => setFilterRoom(e.target.value)}
          sx={fieldSx}
        >
          <MenuItem value="all">Toate camerele</MenuItem>
          {rooms.map((room) => (
            <MenuItem key={room.id} value={String(room.id)}>
              {room.room_number}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: RED }} />
        </Box>
      ) : filteredAppointments.length === 0 ? (
        <Box
          sx={{
            py: 8,
            textAlign: "center",
            backgroundColor: "white",
            borderRadius: "16px",
            border: "1.5px dashed #e0e0e0",
          }}
        >
          <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#bbb" }}>
            Nicio programare găsită
          </Typography>
          <Typography sx={{ fontSize: "0.82rem", color: "#ccc", mt: 0.5 }}>
            Încearcă să schimbi filtrele selectate
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: { xs: 1.5, md: 2 },
            alignItems: "stretch",
          }}
        >
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onStatusChange={handleStatusChange}
              actionLoading={actionLoading}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
