import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../sercives/axiosInstance";

export const fetchUserAppointments = createAsyncThunk(
  "appointments/fetchUser",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/appointments/me");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare programări",
      );
    }
  },
);

export const createAppointment = createAsyncThunk(
  "appointments/create",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/appointments", data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare creare programare",
      );
    }
  },
);

export const fetchAvailableSlots = createAsyncThunk(
  "appointments/fetchAvailableSlots",
  async ({ animal_id, date }, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/appointments/availability", {
        params: { animal_id, date },
      });
      return response.data.availableHours;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare sloturi disponibile",
      );
    }
  },
);

export const fetchCalendarAvailability = createAsyncThunk(
  "appointments/fetchCalendarAvailability",
  async ({ animal_id }, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        "/appointments/calendar-availability",
        { params: { animal_id } },
      );
      return response.data.availableDates;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare calendar",
      );
    }
  },
);

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState: {
    appointments: [],
    availableSlots: [],
    availableDates: [],
    loading: false,
    creating: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchUserAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAppointment.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.creating = false;
        state.appointments.push(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.availableSlots = action.payload;
      })
      .addCase(fetchCalendarAvailability.fulfilled, (state, action) => {
        state.availableDates = action.payload;
      });
  },
});

export default appointmentsSlice.reducer;
