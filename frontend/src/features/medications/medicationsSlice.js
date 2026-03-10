import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../sercives/axiosInstance";

export const fetchAllMedicalFiles = createAsyncThunk(
  "medicalFiles/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/medical-files");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare medical files",
      );
    }
  },
);

export const fetchMedicalFileById = createAsyncThunk(
  "medicalFiles/fetchById",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/medical-files/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare medical file",
      );
    }
  },
);

export const updateMedicalFile = createAsyncThunk(
  "medicalFiles/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/medical-files/${id}`, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare update medical file",
      );
    }
  },
);

const medicalFilesSlice = createSlice({
  name: "medicalFiles",
  initialState: {
    files: [],
    selectedFile: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchAllMedicalFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllMedicalFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(fetchAllMedicalFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMedicalFileById.fulfilled, (state, action) => {
        state.selectedFile = action.payload;
      })

      .addCase(updateMedicalFile.fulfilled, (state, action) => {
        state.selectedFile = action.payload;
      });
  },
});

export default medicalFilesSlice.reducer;
