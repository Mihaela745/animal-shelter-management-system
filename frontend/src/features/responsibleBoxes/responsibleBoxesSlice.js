import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../sercives/axiosInstance";

export const fetchResponsibleBoxes = createAsyncThunk(
  "responsibleBoxes/fetchResponsibleBoxes",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/responsibilities");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la incarcarea responsabilitatilor",
      );
    }
  },
);

export const fetchResponsiblesByBoxId = createAsyncThunk(
  "responsibleBoxes/fetchResponsiblesByBoxId",
  async (boxId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/responsibilities/boxes/${boxId}`);
      return { boxId, responsibles: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la incarcarea responsabililor boxei",
      );
    }
  },
);

export const fetchBoxesByStaffId = createAsyncThunk(
  "responsibleBoxes/fetchBoxesByStaffId",
  async (staffId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/responsibilities/staff/${staffId}`);
      return { staffId, boxes: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la incarcarea boxelor responsabilului",
      );
    }
  },
);

export const createResponsibleBox = createAsyncThunk(
  "responsibleBoxes/createResponsibleBox",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/responsibilities", data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la asignarea responsabilului",
      );
    }
  },
);

export const deleteResponsibleBox = createAsyncThunk(
  "responsibleBoxes/deleteResponsibleBox",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/responsibilities/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la stergerea responsabilitatii",
      );
    }
  },
);

const responsibleBoxesSlice = createSlice({
  name: "responsibleBoxes",
  initialState: {
    responsibleBoxes: [],
    boxResponsibles: [],
    responsiblesByBoxId: {},
    staffBoxes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResponsibleBoxes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResponsibleBoxes.fulfilled, (state, action) => {
        state.loading = false;
        state.responsibleBoxes = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchResponsibleBoxes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchResponsiblesByBoxId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResponsiblesByBoxId.fulfilled, (state, action) => {
        state.loading = false;
        state.boxResponsibles = Array.isArray(action.payload.responsibles)
          ? action.payload.responsibles
          : [];
        state.responsiblesByBoxId[action.payload.boxId] = state.boxResponsibles;
      })
      .addCase(fetchResponsiblesByBoxId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchBoxesByStaffId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoxesByStaffId.fulfilled, (state, action) => {
        state.loading = false;
        state.staffBoxes = Array.isArray(action.payload.boxes)
          ? action.payload.boxes
          : [];
      })
      .addCase(fetchBoxesByStaffId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createResponsibleBox.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createResponsibleBox.fulfilled, (state, action) => {
        state.loading = false;
        state.responsibleBoxes.push(action.payload);
      })
      .addCase(createResponsibleBox.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteResponsibleBox.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteResponsibleBox.fulfilled, (state, action) => {
        state.loading = false;
        state.responsibleBoxes = state.responsibleBoxes.filter(
          (item) => item.id !== action.payload,
        );
        state.boxResponsibles = state.boxResponsibles.filter(
          (item) => item.id !== action.payload,
        );
        Object.keys(state.responsiblesByBoxId).forEach((boxId) => {
          state.responsiblesByBoxId[boxId] = state.responsiblesByBoxId[
            boxId
          ].filter((item) => item.id !== action.payload);
        });
        state.staffBoxes = state.staffBoxes.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteResponsibleBox.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default responsibleBoxesSlice.reducer;
