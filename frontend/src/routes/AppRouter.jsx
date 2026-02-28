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
import MatchPage from "../pages/private/user/MatchPage";
import ProfilePage from "../pages/private/user/ProfilePage";

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
        <Route path="match" element={<MatchPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}
