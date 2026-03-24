import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleRouter from "./RoleRouter";
import LandingPage from "../pages/public/Landing/LandingPage";
import LoginPage from "../pages/public/auth/Login";
import RegisterPage from "../pages/public/auth/RegisterPage";
import ResetPasswordPage from "../pages/public/auth/ResetPasswordPage";
import HomePage from "../pages/private/user/HomePage";
import UserLayout from "../layouts/UserLayout";
import DashboardPage from "../pages/private/user/DashboardPage";
import AnimalsPage from "../pages/private/user/AnimalsPage";
import ProfilePage from "../pages/private/user/ProfilePage";
import AnimalDetailsPage from "../pages/private/user/AnimalDetailsPage";
import AiMatchPage from "../pages/private/user/AIMatchPage";
import ManagerLayout from "../layouts/ManagerLayout";
import DashboardPageManager from "../pages/private/manager/DashboardPage";
import AnimalsPageManager from "../pages/private/manager/AnimalsPage";
import AnimalDetailsPageManager from "../pages/private/manager/AnimalDetailsPage";
import AddAnimalPage from "../pages/private/manager/AddAnimalPage";
import AnimalMedicalPage from "../pages/private/manager/MedicalFilePage";
import AdoptionRequestsPage from "../pages/private/manager/AdoptionRequestsPage";
import AppointmentsPage from "../pages/private/manager/AppointmentsPage";
import BoxAnimalsPage from "../pages/private/manager/BoxAnimalsPage";
import BoxesPage from "../pages/private/manager/BoxesPage";
import ManagerProfilePage from "../pages/private/manager/ProfilePage";
import StaffPage from "../pages/private/manager/StaffPage";
import UsersPage from "../pages/private/manager/UsersPage";
import VetLayout from "../layouts/VetLayout";
import VetDashboard from "../pages/private/vet/DashboardPage";
import VetProfile from "../pages/private/vet/ProfilePage";
import VetAnimalsPage from "../pages/private/vet/AnimalsPage";
import VetAnimalsDetails from "../pages/private/vet/AnimalDetails";
import VetBoxesPage from "../pages/private/vet/Boxes";
import VetBoxAnimalsPage from "../pages/private/vet/BoxAnimalsPage";
import VetAnimalMedicalPage from "../pages/private/vet/AnimalMedicalFile";
import VetAddMedicationPage from "../pages/private/vet/AddMedicationPage";
import CaretakerLayout from "../layouts/CaretakerLayout";
import CaretakerDashboardPage from "../pages/private/caretaker/DashboardPage";
import CaretakerProfilePage from "../pages/private/caretaker/ProfilePage"
import CaretakerAnimalsPage from "../pages/private/caretaker/AnimalsPage"
import CaretakerAnimalDetailsPage from "../pages/private/caretaker/AnimalDetailsPage"
import CaretakerMedicalFilePage from "../pages/private/caretaker/MedicalFilePage"
import CaretakerBoxesPage from "../pages/private/caretaker/BoxesPage"
import CaretakerBoxAnimalsPage from "../pages/private/caretaker/BoxAnimalsPage";
import CaretakerAppointmentsPage from "../pages/private/caretaker/AppointmentsPage";
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/user/home"
        element={
          <ProtectedRoute>
            <RoleRouter allowedRoles={["user"]}>
              <HomePage />
            </RoleRouter>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user"
        element={
          <ProtectedRoute>
            <RoleRouter allowedRoles={["user"]}>
              <UserLayout />
            </RoleRouter>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="animals" element={<AnimalsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="match" element={<AiMatchPage />} />
        <Route path="animals/:id" element={<AnimalDetailsPage />} />
      </Route>
      <Route
        path="/manager"
        element={
          <ProtectedRoute>
            <RoleRouter allowedRoles={["Manager"]}>
              <ManagerLayout />
            </RoleRouter>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPageManager />} />
        <Route path="animals" element={<AnimalsPageManager />} />{" "}
        <Route path="animals/add" element={<AddAnimalPage />} />
        <Route path="animals/:id" element={<AnimalDetailsPageManager />} />
        <Route
          path="animals/:animalId/medical/:fileId"
          element={<AnimalMedicalPage />}
        />
        <Route path="profile" element={<ManagerProfilePage />} />
        <Route path="requests" element={<AdoptionRequestsPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="boxes" element={<BoxesPage />} />
        <Route path="boxes/:id/animals" element={<BoxAnimalsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="staff" element={<StaffPage />} />
      </Route>
      <Route
        path="/vet"
        element={
          <ProtectedRoute>
            <RoleRouter allowedRoles={["Vet"]}>
              <VetLayout />
            </RoleRouter>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<VetDashboard />} />
        <Route path="profile" element={<VetProfile />} />
        <Route path="animals" element={<VetAnimalsPage />} />
        <Route path="animals/:id" element={<VetAnimalsDetails />} />
        <Route path="add-medication" element={<VetAddMedicationPage />} />
        <Route path="boxes" element={<VetBoxesPage />} />
        <Route path="boxes/:id/animals" element={<VetBoxAnimalsPage />} />
        <Route
          path="animals/:animalId/medical/:fileId"
          element={<VetAnimalMedicalPage />}
        />
      </Route>
      <Route
        path="/staff"
        element={
          <ProtectedRoute>
            <RoleRouter allowedRoles={["Caretaker"]}>
              <CaretakerLayout/>
            </RoleRouter>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<CaretakerDashboardPage/>} />
         <Route path="profile" element={<CaretakerProfilePage />} />
        <Route path="animals" element={<CaretakerAnimalsPage />} />
        <Route path="animals/:id" element={<CaretakerAnimalDetailsPage/>} />
        <Route path="appointments" element={<CaretakerAppointmentsPage />} />
        <Route path="boxes" element={<CaretakerBoxesPage />} />
        <Route path="boxes/:id/animals" element={<CaretakerBoxAnimalsPage />} /> 
        <Route
          path="animals/:animalId/medical/:fileId"
          element={<CaretakerMedicalFilePage/>}
        />
      </Route>
    </Routes>
  );
}
