import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../sercives/axiosInstance";

export const fetchUserAdoptionRequests = createAsyncThunk(
  "adoptionRequests/fetchUser",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/adoption-requests/me");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Eroare cereri");
    }
  },
);
export const createAdoptionRequest = createAsyncThunk(
  "adoptionRequests/create",
  async ({ animal_id }, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/adoption-requests", {
        animal_id,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare cerere adopție",
      );
    }
  },
);
export const fetchAllAdoptionRequests = createAsyncThunk(
  "adoptionRequests/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/adoption-requests");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare cereri adopție",
      );
    }
  },
);
const adoptionRequestsSlice = createSlice({
  name: "adoptionRequests",
  initialState: {
    requests: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAdoptionRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAdoptionRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchUserAdoptionRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAdoptionRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdoptionRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requests.push(action.payload);
      })
      .addCase(createAdoptionRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllAdoptionRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllAdoptionRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchAllAdoptionRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      
  },
});

export default adoptionRequestsSlice.reducer;
