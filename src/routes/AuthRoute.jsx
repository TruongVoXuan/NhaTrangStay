import { Navigate, Outlet } from "react-router-dom";

export default function AuthRoute() {
  const isAuthenticated = localStorage.getItem("authToken");

  const userString = localStorage.getItem("authUser");
  const user = JSON.parse(userString || "{}");

  const userRole = user?.role?.toUpperCase();

  if (isAuthenticated) {

    // ADMIN → dashboard
    if (userRole === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    // USER → home
    if (userRole === "USER") {
      return <Navigate to="/" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}