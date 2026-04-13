// AuthContext — provides authentication state and role helpers throughout the app
import { createContext, useContext, useState, useCallback } from "react";
import { storage } from "../utils/storage";
import { AUTH_STORAGE_KEY } from "../utils/constants";
import { getRoleFromToken, isTokenExpired } from "../utils/jwt";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = storage.get(AUTH_STORAGE_KEY);
    // Auto-clear expired sessions on load
    if (stored?.token && isTokenExpired(stored.token)) {
      storage.remove(AUTH_STORAGE_KEY);
      return null;
    }
    return stored;
  });

  // Save auth data to state and localStorage
  const loginUser = useCallback((data) => {
    storage.set(AUTH_STORAGE_KEY, data);
    setAuth(data);
  }, []);

  // Clear auth data from state and localStorage
  const logoutUser = useCallback(() => {
    storage.remove(AUTH_STORAGE_KEY);
    setAuth(null);
  }, []);

  const isAuthenticated = !!auth?.token && !isTokenExpired(auth.token);

  // Derive role from the JWT token directly — no extra API call needed
  const userRole = isAuthenticated ? getRoleFromToken(auth.token) : null;

  // Convenience role booleans for easy use in components
  const isAdmin = userRole === "ADMIN";
  const isTechnician = userRole === "TECHNICIAN";
  const isStaff = userRole === "STAFF";
  const isUser = userRole === "USER";

  return (
    <AuthContext.Provider
      value={{
        auth,
        isAuthenticated,
        loginUser,
        logoutUser,
        userRole,
        isAdmin,
        isTechnician,
        isStaff,
        isUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume auth context
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export default AuthContext;
