import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../sercives/axiosInstance";

export const fetchSpecies = createAsyncThunk(
  "species/fetchSpecies",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/species");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la incarcarea speciilor",
      );
    }
  },
);

const speciesSlice = createSlice({
  name: "species",

  initialState: {
    species: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSpecies.fulfilled, (state, action) => {
        state.loading = false;
        state.species = action.payload;
      })

      .addCase(fetchSpecies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default speciesSlice.reducer;
