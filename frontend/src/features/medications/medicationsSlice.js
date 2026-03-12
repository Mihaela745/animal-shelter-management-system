import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../sercives/axiosInstance";

export const fetchMedicationsByFile = createAsyncThunk(
  "medications/fetchByFile",
  async (medicalFileId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/medical-files/${medicalFileId}/medications`,
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare medicatii",
      );
    }
  },
);

const medicationsSlice = createSlice({
  name: "medications",
  initialState: {
    medications: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicationsByFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMedicationsByFile.fulfilled, (state, action) => {
        state.loading = false;
        state.medications = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchMedicationsByFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default medicationsSlice.reducer;
