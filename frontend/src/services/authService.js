// Auth API service methods
import axiosInstance from "./axiosInstance";

/**
 * Register a new user
 * @param {{ fullName: string, email: string, password: string, role: string }} data
 */
export const signup = (data) => axiosInstance.post("/api/auth/signup", data);

/**
 * Login with email and password
 * @param {{ email: string, password: string }} data
 */
export const login = (data) => axiosInstance.post("/api/auth/login", data);
