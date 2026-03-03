import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";

import { createAdoptionRequest } from "../../features/adoptionRequests/adoptioRequestSlice";
import {
  createAppointment,
  fetchAvailableSlots,
  fetchCalendarAvailability,
} from "../../features/appointments/appointmentsSlice";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function AnimalActions({ animal }) {
  const dispatch = useDispatch();

  const { requests } = useSelector((state) => state.adoptionRequests);
  const { availableSlots, availableDates, creating } = useSelector(
    (state) => state.appointments,
  );

  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  const alreadyRequested = requests.some((r) => r.animal_id === animal.id);

  useEffect(() => {
    if (open) {
      dispatch(fetchCalendarAvailability({ animal_id: animal.id }));
    }
  }, [open, dispatch, animal.id]);

  useEffect(() => {
    if (!selectedDate) return;

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
    await dispatch(
      createAppointment({
        animal_id: animal.id,
        date: selectedDate.format("YYYY-MM-DD"),
        hour: selectedTime,
      }),
    );

    setOpen(false);
    setSelectedDate(null);
    setSelectedTime("");
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
              backgroundColor: "#f8bbd0",
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
              border: "2px solid #c2185b",
              backgroundColor: "#fde4ec",
              color: "#c2185b",
            },
          }}
        >
          Programează vizită
        </Button>
      </Stack>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
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
            color: "#c2185b",
            pb: 1, 
          }}
        >
          Programează vizită
        </DialogTitle>

        <DialogContent sx={{ minWidth: 300, pt: "1rem !important" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Alege data"
              value={selectedDate}
              onChange={setSelectedDate}
              shouldDisableDate={(date) =>
                !availableDates.includes(date.format("YYYY-MM-DD"))
              }
              sx={{ width: "100%" }}
            />
          </LocalizationProvider>

          <TextField
            select
            fullWidth
            label="Interval orar"
            sx={{ mt: 3 }}
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            disabled={!selectedDate}
          >
            {availableSlots.map((hour) => (
              <MenuItem key={hour} value={hour}>
                {hour}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpen(false)}
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
              background: "linear-gradient(135deg, #c2185b, #e91e63)",
              color: "white",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              px: 3, 
              "&:hover": {
                boxShadow: "0 8px 20px rgba(233, 30, 99, 0.4)",
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
