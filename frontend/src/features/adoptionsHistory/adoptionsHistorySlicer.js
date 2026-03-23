import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../sercives/axiosInstance";

export const fetchUserAdoptions = createAsyncThunk(
  "adoptions/fetchUser",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/adoptions/me");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare istoric adopții",
      );
    }
  },
);

export const fetchAllAdoptions = createAsyncThunk(
  "adoptions/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/adoptions");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Eroare adopții");
    }
  },
);

export const fetchAdoptionById = createAsyncThunk(
  "adoptions/fetchById",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/adoptions/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare adoptie",
      );
    }
  },
);

export const deleteAdoption = createAsyncThunk(
  "adoptions/delete",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/adoptions/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare ștergere adopție",
      );
    }
  },
);

const adoptionsSlice = createSlice({
  name: "adoptions",
  initialState: {
    adoptions: [],
    selectedAdoption: null,
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAdoptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAdoptions.fulfilled, (state, action) => {
        state.loading = false;
        state.adoptions = action.payload;
      })
      .addCase(fetchUserAdoptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllAdoptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAdoptions.fulfilled, (state, action) => {
        state.loading = false;
        state.adoptions = action.payload;
      })
      .addCase(fetchAllAdoptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAdoptionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdoptionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAdoption = action.payload;
      })
      .addCase(fetchAdoptionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteAdoption.fulfilled, (state, action) => {
        state.adoptions = state.adoptions.filter(
          (a) => a.id !== action.payload,
        );

        if (state.selectedAdoption?.id === action.payload) {
          state.selectedAdoption = null;
        }
      });
  },
});

export default adoptionsSlice.reducer;
