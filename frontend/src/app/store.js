import { configureStore } from "@reduxjs/toolkit";
import animalsReducer from "../features/animals/animalsSlice";
import authReducer from "../features/auth/authSlice";
import adoptionRequestsReducer from "../features/adoptionRequests/adoptioRequestSlice";
import appointmentsReducer from "../features/appointments/appointmentsSlice";
const store = configureStore({
  reducer: {
    animals: animalsReducer,
    auth: authReducer,
    adoptionRequests: adoptionRequestsReducer,
    appointments: appointmentsReducer,
  },
});
export default store;
