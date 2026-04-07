// AuthContext — provides authentication state throughout the app
import { createContext, useContext, useState, useCallback } from "react";
import { storage } from "../utils/storage";
import { AUTH_STORAGE_KEY } from "../utils/constants";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => storage.get(AUTH_STORAGE_KEY));

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

  const isAuthenticated = !!auth?.token;

  return (
    <AuthContext.Provider value={{ auth, isAuthenticated, loginUser, logoutUser }}>
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
