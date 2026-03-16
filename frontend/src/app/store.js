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
import medicationsReducer from "../features/medications/medicationsSlice";
import medicalFilesReducer from "../features/medicalFiles/medicalFilesSlice";
import positionsReducer from "../features/positions/positionsSlice";
import responsibleBoxesReducer from "../features/responsibleBoxes/responsibleBoxesSlice";
import roomsReducer from "../features/rooms/roomsSlice";
import speciesReducer from "../features/species/speciesSlice";
import usersReducer from "../features/users/usersSlice";
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
    medications: medicationsReducer,
    medicalFiles: medicalFilesReducer,
    positions: positionsReducer,
    responsibleBoxes: responsibleBoxesReducer,
    rooms: roomsReducer,
    species: speciesReducer,
    users: usersReducer,
  },
});
export default store;
