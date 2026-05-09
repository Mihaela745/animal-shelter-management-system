import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../sercives/axiosInstance";

export const fetchBoxes = createAsyncThunk(
  "boxes/fetchBoxes",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/boxes");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la încărcarea boxelor.",
      );
    }
  },
);

export const fetchBoxById = createAsyncThunk(
  "boxes/fetchBoxById",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/boxes/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la încărcarea boxei.",
      );
    }
  },
);

export const createBox = createAsyncThunk(
  "boxes/createBox",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/boxes", data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la crearea boxei",
      );
    }
  },
);

export const updateBox = createAsyncThunk(
  "boxes/updateBox",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/boxes/${id}`, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la actualizarea boxei",
      );
    }
  },
);

export const deleteBox = createAsyncThunk(
  "boxes/deleteBox",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/boxes/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la ștergerea boxei.",
      );
    }
  },
);

const boxesSlice = createSlice({
  name: "boxes",
  initialState: {
    boxes: [],
    selectedBox: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoxes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoxes.fulfilled, (state, action) => {
        state.loading = false;
        state.boxes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchBoxes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchBoxById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoxById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBox = action.payload;
      })
      .addCase(fetchBoxById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createBox.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBox.fulfilled, (state, action) => {
        state.loading = false;
        state.boxes.push(action.payload);
      })
      .addCase(createBox.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateBox.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBox.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.boxes.findIndex((box) => box.id === action.payload.id);
        if (index !== -1) {
          state.boxes[index] = action.payload;
        }

        if (state.selectedBox?.id === action.payload.id) {
          state.selectedBox = action.payload;
        }
      })
      .addCase(updateBox.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteBox.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBox.fulfilled, (state, action) => {
        state.loading = false;
        state.boxes = state.boxes.filter((box) => box.id !== action.payload);

        if (state.selectedBox?.id === action.payload) {
          state.selectedBox = null;
        }
      })
      .addCase(deleteBox.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default boxesSlice.reducer;
