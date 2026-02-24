import { configureStore } from "@reduxjs/toolkit";
import animalsReducer from "../features/animals/animalsSlice";
import authReducer from "../features/auth/authSlice";
const store = configureStore({
  reducer: {
    animals: animalsReducer,
    auth: authReducer,
  },
});
export default store;
