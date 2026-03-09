import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../sercives/axiosInstance";

export const fetchBoxes = createAsyncThunk(
  "boxes/fetchBoxes",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/boxes");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la încărcarea boxelor",
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
        error.response?.data || "Eroare creare boxă",
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
        error.response?.data || "Eroare update boxă",
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
        error.response?.data || "Eroare ștergere boxă",
      );
    }
  },
);

const boxesSlice = createSlice({
  name: "boxes",
  initialState: {
    boxes: [],
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
        state.boxes = action.payload;
      })
      .addCase(fetchBoxes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createBox.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBox.fulfilled, (state, action) => {
        state.loading = false;
        state.boxes.push(action.payload);
      })
      .addCase(createBox.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateBox.fulfilled, (state, action) => {
        const index = state.boxes.findIndex((b) => b.id === action.payload.id);

        if (index !== -1) {
          state.boxes[index] = action.payload;
        }
      })

      .addCase(deleteBox.fulfilled, (state, action) => {
        state.boxes = state.boxes.filter((b) => b.id !== action.payload);
      });
  },
});

export default boxesSlice.reducer;
