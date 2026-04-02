import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../sercives/axiosInstance";

export const searchAnimalAI = createAsyncThunk(
  "aiMatch/searchAnimalAI",
  async (description, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/ai/search", {
        description,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "AI search failed",
      );
    }
  },
);

const aiMatchSlice = createSlice({
  name: "aiMatch",
  initialState: {
    messages: [],
    results: [],
    loading: false,
    error: null,
  },
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({
        type: "user",
        text: action.payload,
      });
    },

    addAiLoading: (state) => {
      state.messages.push({
        type: "ai_loading",
      });
    },

    resetChat: (state) => {
      state.messages = [];
      state.results = [];
      state.error = null;
      state.loading = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(searchAnimalAI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(searchAnimalAI.fulfilled, (state, action) => {
        state.loading = false;

        state.messages.pop(); 

        state.messages.push({
          type: "ai_results",
          results: action.payload.results,
        });

        state.results = action.payload.results;
      })

      .addCase(searchAnimalAI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        if (
          state.messages.length > 0 &&
          state.messages[state.messages.length - 1].type === "ai_loading"
        ) {
          state.messages.pop();
        }
        state.messages.push({
          type: "ai_error",
          text:
            action.payload?.message ||
            "Promptul oferit nu este valid pentru cautarea AI.",
        });
      });
  },
});

export const { addUserMessage, addAiLoading, resetChat } = aiMatchSlice.actions;

export default aiMatchSlice.reducer;
