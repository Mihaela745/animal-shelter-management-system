import { configureStore } from "@reduxjs/toolkit";
import animalsReducer from "../features/animals/animalsSlice";
import authReducer from "../features/auth/authSlice";
import adoptionRequestsReducer from "../features/adoptionRequests/adoptionRequestsSlice";
import appointmentsReducer from "../features/appointments/appointmentsSlice";
import breedMetadataReducer from "../features/breedMetadata/breedMetadata";
import aiMatchReducer from "../features/AIMatch/AiMatchSlice";
import adoptionHistory from "../features/adoptionsHistory/adoptionsHistorySlicer";
import boxesReducer from "../features/boxes/boxesSlice";
import staffReducer from "../features/staff/staffSlice";
const store = configureStore({
  reducer: {
    animals: animalsReducer,
    auth: authReducer,
    adoptionRequests: adoptionRequestsReducer,
    appointments: appointmentsReducer,
    breedMetadata: breedMetadataReducer,
    aiMatch: aiMatchReducer,
    adoptionHistory: adoptionHistory,
    boxes: boxesReducer,
    staff: staffReducer,
  },
});
export default store;
