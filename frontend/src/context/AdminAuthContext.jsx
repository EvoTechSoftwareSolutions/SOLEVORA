import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5001/api";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  // STATE
  const [adminUser, setAdminUser] = useState(() => {
    const stored = localStorage.getItem("adminUser");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  // SYNC AXIOS TOKEN

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);


  // MULTI-TAB SYNC 

  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === "token" || event.key === "adminUser") {
        if (!event.newValue) {
          setAdminUser(null);
          setToken(null);
        }
      }
    };

    window.addEventListener("storage", syncLogout);

    return () => {
      window.removeEventListener("storage", syncLogout);
    };
  }, []);

  const role = adminUser?.role || null;

  const isAdmin = role === "admin";
  const isStoreManager = role === "store_manager";

  const roleName =
    isAdmin ? "System Admin" :
    isStoreManager ? "Store Manager" :
    null;

  const permissions = {
    canViewDashboard: isAdmin || isStoreManager,
    canManageProducts: isAdmin || isStoreManager,
    canManagePromoCodes: isAdmin || isStoreManager,
    canViewOrders: isAdmin || isStoreManager,
    canManageCustomers: isAdmin || isStoreManager,
    canViewMessages: isAdmin || isStoreManager,
    canViewInventory: isAdmin || isStoreManager,
    canViewAnalytics: isAdmin, // 📊 restricted
    canManageSettings: isAdmin,  // ⚙️ restricted
    canManageStaff: isAdmin,     // 👥 restricted
    canViewSecurity: isAdmin,    // 🔒 restricted
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post("/user/login", {
        email,
        password,
      });

      const { user, token } = res.data;

      localStorage.setItem("adminUser", JSON.stringify(user));
      localStorage.setItem("token", token);

      setAdminUser(user);
      setToken(token);

      return {
        success: true,
        user,
        token,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("token");

    setAdminUser(null);
    setToken(null);

    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        token,
        login,
        logout,
        isAdmin,
        isStoreManager,
        roleName,
        permissions,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);

export default AdminAuthContext;