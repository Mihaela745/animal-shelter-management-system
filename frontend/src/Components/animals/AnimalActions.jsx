import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createAdoptionRequest } from "../../features/adoptionRequests/adoptionRequestsSlice";
import {
  createAppointment,
  fetchAvailableSlots,
  fetchCalendarAvailability,
} from "../../features/appointments/appointmentsSlice";

function normalizeErrorMessage(error) {
  if (!error) {
    return "Programarea nu a putut fi creată.";
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error?.message === "string") {
    return error.message;
  }

  return "Programarea nu a putut fi creată.";
}

export default function AnimalActions({ animal }) {
  const dispatch = useDispatch();

  const { requests } = useSelector((state) => state.adoptionRequests);
  const { availableSlots, availableDates, creating } = useSelector(
    (state) => state.appointments,
  );

  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentError, setAppointmentError] = useState("");

  const alreadyRequested = requests.some((request) => request.animal_id === animal.id);

  useEffect(() => {
    if (open) {
      setAppointmentError("");
      dispatch(fetchCalendarAvailability({ animal_id: animal.id }));
    }
  }, [open, dispatch, animal.id]);

  useEffect(() => {
    if (!selectedDate) return;

    setAppointmentError("");
    dispatch(
      fetchAvailableSlots({
        animal_id: animal.id,
        date: selectedDate.format("YYYY-MM-DD"),
      }),
    );
  }, [selectedDate, dispatch, animal.id]);

  const handleAdoption = async () => {
    await dispatch(createAdoptionRequest({ animal_id: animal.id }));
  };

  const handleCreateAppointment = async () => {
    setAppointmentError("");

    const result = await dispatch(
      createAppointment({
        animal_id: animal.id,
        date: selectedDate.format("YYYY-MM-DD"),
        hour: selectedTime,
      }),
    );

    if (createAppointment.fulfilled.match(result)) {
      setOpen(false);
      setSelectedDate(null);
      setSelectedTime("");
      return;
    }

    setAppointmentError(normalizeErrorMessage(result.payload));
  };

  const handleCloseDialog = () => {
    if (creating) {
      return;
    }

    setOpen(false);
    setSelectedDate(null);
    setSelectedTime("");
    setAppointmentError("");
  };

  return (
    <Box mt={3}>
      <Stack spacing={2} alignItems="flex-start">
        <Button
          variant="contained"
          fullWidth
          disabled={animal.status !== "Available" || alreadyRequested}
          onClick={handleAdoption}
          sx={{
            backgroundColor: "#a91111",
            color: "white",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "12px",
            padding: "0.3rem",
            transition: "all 0.25s ease",
            maxWidth: "350px",
            "&:hover": {
              backgroundColor: "#8a0d0d",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(169, 17, 17, 0.3)",
            },
            "&.Mui-disabled": {
              backgroundColor: "#d8aaaa",
              color: "#fff",
            },
          }}
        >
          {alreadyRequested ? "Cerere trimisă" : "Trimite cerere adopție"}
        </Button>

        <Button
          variant="outlined"
          fullWidth
          disabled={animal.status !== "Available"}
          onClick={() => setOpen(true)}
          sx={{
            border: "2px solid #a91111",
            color: "#a91111",
            fontWeight: 600,
            borderRadius: "12px",
            textTransform: "none",
            padding: "0.3rem",
            transition: "all 0.25s ease",
            maxWidth: "350px",
            "&:hover": {
              border: "2px solid #8a0d0d",
              backgroundColor: "#fff0f0",
              color: "#8a0d0d",
            },
          }}
        >
          Programează vizită
        </Button>
      </Stack>

      <Dialog
        open={open}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: "18px",
            padding: "1rem",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: "#a91111",
            pb: 1,
          }}
        >
          Programează vizită
        </DialogTitle>

        <DialogContent sx={{ minWidth: 300, pt: "1rem !important" }}>
          <Stack spacing={2}>
            {appointmentError ? (
              <Alert severity="error" sx={{ borderRadius: "12px" }}>
                {appointmentError}
              </Alert>
            ) : null}

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Alege data"
                value={selectedDate}
                onChange={setSelectedDate}
                shouldDisableDate={(date) =>
                  !availableDates.includes(date.format("YYYY-MM-DD"))
                }
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#a91111",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#a91111",
                  },
                }}
              />
            </LocalizationProvider>

            <TextField
              select
              fullWidth
              label="Interval orar"
              sx={{
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#a91111",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#a91111",
                },
              }}
              value={selectedTime}
              onChange={(e) => {
                setSelectedTime(e.target.value);
                setAppointmentError("");
              }}
              disabled={!selectedDate}
              helperText={
                selectedDate && availableSlots.length === 0
                  ? "Nu mai există intervale disponibile pentru data selectată."
                  : " "
              }
            >
              {availableSlots.map((hour) => (
                <MenuItem key={hour} value={hour}>
                  {hour}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: "text.secondary",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Anulează
          </Button>

          <Button
            variant="contained"
            disabled={!selectedDate || !selectedTime || creating}
            onClick={handleCreateAppointment}
            sx={{
              background: "linear-gradient(135deg, #8f1111, #c53a1c)",
              color: "white",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              "&:hover": {
                background: "linear-gradient(135deg, #7d0d0d, #a92c16)",
                boxShadow: "0 8px 20px rgba(169, 17, 17, 0.35)",
              },
            }}
          >
            Confirmă
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
