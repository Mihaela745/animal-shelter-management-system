import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleRouter from "./RoleRouter";

//pages
import LandingPage from "../pages/public/Landing/LandingPage";
import LoginPage from "../pages/public/auth/Login";
import RegisterPage from "../pages/public/auth/RegisterPage";
import ResetPasswordPage from "../pages/public/auth/ResetPasswordPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Routes>
  );
}
