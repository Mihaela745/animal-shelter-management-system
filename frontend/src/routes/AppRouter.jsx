import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleRouter from "./RoleRouter";
//pages
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
      </Route>
    </Routes>
  );
}
