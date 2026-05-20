import { Navigate } from "react-router-dom";

export default function RoleBasedRoute({ allowedRoles, children }) {
  const token = localStorage.getItem("authToken");

  const userString = localStorage.getItem("authUser");
  const user = JSON.parse(userString || "{}");

  const normalizeRole = (role) => {
    if (!role) return "";
    return role.replace("ROLE_", "").toUpperCase();
  };

  const userRole = normalizeRole(user.role);
  const allowed = (allowedRoles || []).map(normalizeRole);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowed.length && !allowed.includes(userRole)) {
    console.log("❌ ROLE FAIL:", user.role);
    return <Navigate to="/forbidden" replace />;
  }

  return children; // 👈 QUAN TRỌNG
}