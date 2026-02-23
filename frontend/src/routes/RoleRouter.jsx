import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RoleRouter({ children, allowedRoles }) {
  const user = useSelector((state) => state.auth);
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
