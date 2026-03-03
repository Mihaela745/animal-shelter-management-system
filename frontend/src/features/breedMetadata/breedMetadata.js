import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../sercives/axiosInstance";

export const fetchBreedMetadata = createAsyncThunk(
  "breedMetadata/fetchByName",
  async (breedName, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/breed-metadata/${encodeURIComponent(breedName)}`,
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare metadata rasă",
      );
    }
  },
);

const breedMetadataSlice = createSlice({
  name: "breedMetadata",
  initialState: {
    metadata: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearBreedMetadata: (state) => {
      state.metadata = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBreedMetadata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBreedMetadata.fulfilled, (state, action) => {
        state.loading = false;
        state.metadata = action.payload;
      })
      .addCase(fetchBreedMetadata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBreedMetadata } = breedMetadataSlice.actions;
export default breedMetadataSlice.reducer;