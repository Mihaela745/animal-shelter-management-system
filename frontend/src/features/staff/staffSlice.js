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

export const fetchStaffById = createAsyncThunk(
  "staff/fetchStaffById",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/staff/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare încărcare membru staff",
      );
    }
  },
);

export const fetchMyStaffProfile = createAsyncThunk(
  "staff/fetchMyStaffProfile",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/staff/me");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare încărcare profil",
      );
    }
  },
);

export const updateMyStaffProfile = createAsyncThunk(
  "staff/updateMyStaffProfile",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.put("/staff/me", data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare actualizare profil",
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
    selectedStaff: null,
    myProfile: null,
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

      .addCase(fetchStaffById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStaff = action.payload;
      })
      .addCase(fetchStaffById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMyStaffProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyStaffProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.myProfile = action.payload;
      })
      .addCase(fetchMyStaffProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateMyStaffProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMyStaffProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.myProfile = action.payload;

        const index = state.staff.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.staff[index] = {
            ...state.staff[index],
            ...action.payload,
          };
        }

        if (state.selectedStaff?.id === action.payload.id) {
          state.selectedStaff = {
            ...state.selectedStaff,
            ...action.payload,
          };
        }
      })
      .addCase(updateMyStaffProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staff.push(action.payload);
      })
      .addCase(createStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStaff.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.staff.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.staff[index] = action.payload;
        }

        if (state.selectedStaff?.id === action.payload.id) {
          state.selectedStaff = action.payload;
        }

        if (state.myProfile?.id === action.payload.id) {
          state.myProfile = action.payload;
        }
      })
      .addCase(updateStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staff = state.staff.filter((s) => s.id !== action.payload);

        if (state.selectedStaff?.id === action.payload) {
          state.selectedStaff = null;
        }

        if (state.myProfile?.id === action.payload) {
          state.myProfile = null;
        }
      })
      .addCase(deleteStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default staffSlice.reducer;
