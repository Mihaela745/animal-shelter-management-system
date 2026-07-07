import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../sercives/axiosInstance";

export const fetchUserAppointments = createAsyncThunk(
  "appointments/fetchUser",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/appointments/me");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la încărcarea programărilor.",
      );
    }
  },
);

export const fetchAllAppointments = createAsyncThunk(
  "appointments/fetchAll",
  async (params = {}, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/appointments", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la încărcarea programărilor.",
      );
    }
  },
);

export const fetchAppointmentsByStaffId = createAsyncThunk(
  "appointments/fetchByStaffId",
  async (payload, thunkAPI) => {
    try {
      const staffId =
        typeof payload === "object" && payload !== null ? payload.staffId : payload;
      const params =
        typeof payload === "object" && payload !== null ? payload.params || {} : {};

      const response = await axiosInstance.get(`/appointments/staff/${staffId}`, {
        params,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la încărcarea programărilor personalului.",
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
        error.response?.data || "Eroare la crearea programării.",
      );
    }
  },
);

export const updateAppointmentStatus = createAsyncThunk(
  "appointments/updateStatus",
  async ({ id, status }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/appointments/${id}`, {
        status,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la actualizarea programării.",
      );
    }
  },
);

export const deleteAppointment = createAsyncThunk(
  "appointments/delete",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/appointments/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la ștergerea programării.",
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
        error.response?.data || "Eroare la încărcarea intervalelor disponibile.",
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
        error.response?.data || "Eroare la încărcarea calendarului.",
      );
    }
  },
);

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState: {
    appointments: [],
    selectedAppointment: null,
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

      .addCase(fetchAllAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAllAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAppointmentsByStaffId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentsByStaffId.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointmentsByStaffId.rejected, (state, action) => {
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

      .addCase(updateAppointmentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.appointments.findIndex(
          (appointment) => appointment.id === action.payload.id,
        );

        if (index !== -1) {
          state.appointments[index] = {
            ...state.appointments[index],
            ...action.payload,
          };
        }

        if (state.selectedAppointment?.id === action.payload.id) {
          state.selectedAppointment = {
            ...state.selectedAppointment,
            ...action.payload,
          };
        }
      })
      .addCase(updateAppointmentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = state.appointments.filter(
          (appointment) => appointment.id !== action.payload,
        );

        if (state.selectedAppointment?.id === action.payload) {
          state.selectedAppointment = null;
        }
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAvailableSlots.pending, (state) => {
        state.availableSlots = [];
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.availableSlots = action.payload;
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.availableSlots = [];
        state.error = action.payload;
      })

      .addCase(fetchCalendarAvailability.pending, (state) => {
        state.availableDates = [];
      })
      .addCase(fetchCalendarAvailability.fulfilled, (state, action) => {
        state.availableDates = action.payload;
      })
      .addCase(fetchCalendarAvailability.rejected, (state, action) => {
        state.availableDates = [];
        state.error = action.payload;
      });
  },
});

export default appointmentsSlice.reducer;
