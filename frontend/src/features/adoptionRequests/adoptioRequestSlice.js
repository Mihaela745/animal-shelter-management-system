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
      });
  },
});

export default adoptionRequestsSlice.reducer;
