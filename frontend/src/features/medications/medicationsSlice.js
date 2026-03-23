import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../sercives/axiosInstance";

export const createMedication = createAsyncThunk(
  "medications/create",
  async ({ medicalFileId, data }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        `/medical-files/${medicalFileId}/medications`,
        data,
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare creare medicatie",
      );
    }
  },
);

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

export const fetchMedicationById = createAsyncThunk(
  "medications/fetchById",
  async ({ medicalFileId, id }, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/medical-files/${medicalFileId}/medications/${id}`,
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare medicatie",
      );
    }
  },
);

export const updateMedication = createAsyncThunk(
  "medications/update",
  async ({ medicalFileId, id, data }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(
        `/medical-files/${medicalFileId}/medications/${id}`,
        data,
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare actualizare medicatie",
      );
    }
  },
);

export const deleteMedication = createAsyncThunk(
  "medications/delete",
  async ({ medicalFileId, id }, thunkAPI) => {
    try {
      await axiosInstance.delete(`/medical-files/${medicalFileId}/medications/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare stergere medicatie",
      );
    }
  },
);

const medicationsSlice = createSlice({
  name: "medications",
  initialState: {
    medications: [],
    selectedMedication: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedMedication: (state) => {
      state.selectedMedication = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMedication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMedication.fulfilled, (state, action) => {
        state.loading = false;
        state.medications.push(action.payload);
        state.selectedMedication = action.payload;
      })
      .addCase(createMedication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMedicationsByFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicationsByFile.fulfilled, (state, action) => {
        state.loading = false;
        state.medications = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchMedicationsByFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchMedicationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMedication = action.payload;
      })
      .addCase(fetchMedicationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateMedication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMedication.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.medications.findIndex(
          (medication) => medication.id === action.payload.id,
        );

        if (index !== -1) {
          state.medications[index] = {
            ...state.medications[index],
            ...action.payload,
          };
        }

        if (state.selectedMedication?.id === action.payload.id) {
          state.selectedMedication = {
            ...state.selectedMedication,
            ...action.payload,
          };
        } else {
          state.selectedMedication = action.payload;
        }
      })
      .addCase(updateMedication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteMedication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMedication.fulfilled, (state, action) => {
        state.loading = false;
        state.medications = state.medications.filter(
          (medication) => medication.id !== action.payload,
        );

        if (state.selectedMedication?.id === action.payload) {
          state.selectedMedication = null;
        }
      })
      .addCase(deleteMedication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedMedication } = medicationsSlice.actions;
export default medicationsSlice.reducer;
