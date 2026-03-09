import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../sercives/axiosInstance";

export const fetchStaff = createAsyncThunk(
  "staff/fetchStaff",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/staff");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare încărcare staff",
      );
    }
  },
);

export const createStaff = createAsyncThunk(
  "staff/createStaff",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/staff", data);
      return response.data.staff;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare creare staff",
      );
    }
  },
);

export const updateStaff = createAsyncThunk(
  "staff/updateStaff",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/staff/${id}`, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare update staff",
      );
    }
  },
);

export const deleteStaff = createAsyncThunk(
  "staff/deleteStaff",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/staff/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare ștergere staff",
      );
    }
  },
);

const staffSlice = createSlice({
  name: "staff",
  initialState: {
    staff: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staff = action.payload;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createStaff.pending, (state) => {
        state.loading = true;
      })
      .addCase(createStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staff.push(action.payload);
      })
      .addCase(createStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateStaff.fulfilled, (state, action) => {
        const index = state.staff.findIndex((s) => s.id === action.payload.id);

        if (index !== -1) {
          state.staff[index] = action.payload;
        }
      })

      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.staff = state.staff.filter((s) => s.id !== action.payload);
      });
  },
});

export default staffSlice.reducer;
