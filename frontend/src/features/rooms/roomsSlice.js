import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../sercives/axiosInstance";

export const fetchRooms = createAsyncThunk(
  "rooms/fetchRooms",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/rooms");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la incarcarea camerelor",
      );
    }
  },
);

export const fetchRoomById = createAsyncThunk(
  "rooms/fetchRoomById",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/rooms/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la incarcarea camerei",
      );
    }
  },
);

export const createRoom = createAsyncThunk(
  "rooms/createRoom",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/rooms", data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la crearea camerei",
      );
    }
  },
);

export const updateRoom = createAsyncThunk(
  "rooms/updateRoom",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/rooms/${id}`, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la actualizarea camerei",
      );
    }
  },
);

export const deleteRoom = createAsyncThunk(
  "rooms/deleteRoom",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/rooms/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la stergerea camerei",
      );
    }
  },
);

const roomsSlice = createSlice({
  name: "rooms",
  initialState: {
    rooms: [],
    selectedRoom: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchRoomById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoomById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRoom = action.payload;
      })
      .addCase(fetchRoomById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms.push(action.payload);
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.rooms.findIndex((room) => room.id === action.payload.id);
        if (index !== -1) {
          state.rooms[index] = action.payload;
        }
        if (state.selectedRoom?.id === action.payload.id) {
          state.selectedRoom = action.payload;
        }
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = state.rooms.filter((room) => room.id !== action.payload);
        if (state.selectedRoom?.id === action.payload) {
          state.selectedRoom = null;
        }
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default roomsSlice.reducer;
