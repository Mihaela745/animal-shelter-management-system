import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../sercives/axiosInstance";

export const fetchPositions = createAsyncThunk(
  "positions/fetchPositions",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/positions");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la incarcarea pozitiilor",
      );
    }
  },
);

const positionsSlice = createSlice({
  name: "positions",
  initialState: {
    positions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPositions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPositions.fulfilled, (state, action) => {
        state.loading = false;
        state.positions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPositions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default positionsSlice.reducer;
