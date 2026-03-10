import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../sercives/axiosInstance";

export const fetchBreedsBySpecies = createAsyncThunk(
  "breedMetadata/fetchBySpecies",
  async (species, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/breed-metadata/species/${encodeURIComponent(species)}`,
      );
      return response.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare fetch rase",
      );
    }
  },
);

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
    breeds: [], 
    loading: false,
    breedsLoading: false,
    error: null,
  },
  reducers: {
    clearBreedMetadata: (state) => {
      state.metadata = null;
      state.breeds = [];
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
      })
      .addCase(fetchBreedsBySpecies.pending, (state) => {
        state.breedsLoading = true;
      })
      .addCase(fetchBreedsBySpecies.fulfilled, (state, action) => {
        state.breedsLoading = false;
        state.breeds = action.payload;
      })
      .addCase(fetchBreedsBySpecies.rejected, (state) => {
        state.breedsLoading = false;
      });
  },
});

export const { clearBreedMetadata } = breedMetadataSlice.actions;
export default breedMetadataSlice.reducer;
