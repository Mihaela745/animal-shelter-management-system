import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../sercives/axiosInstance";

export const fetchAnimals = createAsyncThunk(
  "animals/fetchAnimals",
  async (params = {}, thunkAPI) => {
    try {
      const cleanParams = {};
      Object.entries(params).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          cleanParams[key] = value;
        }
      });
      const query = new URLSearchParams(cleanParams).toString();
      const response = await axiosInstance.get(`/animals?${query}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "A apărut o eroare la încărcarea animalelor.",
      );
    }
  },
);

export const fetchAnimalById = createAsyncThunk(
  "animals/fetchById",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/animals/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la încărcarea animalului.",
      );
    }
  },
);

export const createAnimal = createAsyncThunk(
  "animals/createAnimal",
  async (animalData, thunkAPI) => {
    try {
      const formData = new FormData();
      Object.entries(animalData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          formData.append(key, value);
        }
      });
      const response = await axiosInstance.post("/animals", formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la crearea animalului.",
      );
    }
  },
);

export const updateAnimal = createAsyncThunk(
  "animals/updateAnimal",
  async ({ id, data }, thunkAPI) => {
    try {
      const isFormData = data instanceof FormData;

      const response = await axiosInstance.put(`/animals/${id}`, data, {
        headers: isFormData
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la actualizarea animalului.",
      );
    }
  },
);

export const deleteAnimal = createAsyncThunk(
  "animals/deleteAnimal",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/animals/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Eroare la ștergerea animalului.",
      );
    }
  },
);

const animalsSlice = createSlice({
  name: "animals",
  initialState: {
    animals: [],
    loading: false,
    error: null,
    selectedAnimal: null,
    total: 0,
    totalPages: 1,
    currentPage: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnimals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnimals.fulfilled, (state, action) => {
        state.loading = false;
        state.animals = action.payload.animals;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchAnimals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAnimalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnimalById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAnimal = action.payload;
      })
      .addCase(fetchAnimalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAnimal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAnimal.fulfilled, (state, action) => {
        state.loading = false;
        state.animals.unshift(action.payload);
      })
      .addCase(createAnimal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAnimal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAnimal.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.animals.findIndex(
          (a) => a.id === action.payload.id,
        );
        if (index !== -1) {
          state.animals[index] = action.payload;
        }
        state.selectedAnimal = action.payload;
      })
      .addCase(updateAnimal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAnimal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAnimal.fulfilled, (state, action) => {
        state.loading = false;
        state.animals = state.animals.filter((a) => a.id !== action.payload);
        if (state.selectedAnimal?.id === action.payload) {
          state.selectedAnimal = null;
        }
      })
      .addCase(deleteAnimal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default animalsSlice.reducer;
