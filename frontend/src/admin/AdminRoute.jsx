import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminRoute = ({ children }) => {
  const { adminUser } = useAdminAuth();

  if (!adminUser) {
    return <Navigate to="/admin-login" replace />;
  }

  // Allow both admin and store_manager
  if (adminUser.role !== "admin" && adminUser.role !== "store_manager") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;