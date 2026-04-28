import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const StoreManagerRoute = ({ children }) => {
  const { adminUser, isStoreManager } = useAdminAuth();

  if (!adminUser) {
    return <Navigate to="/admin-login" replace />;
  }

  if (!isStoreManager) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default StoreManagerRoute;