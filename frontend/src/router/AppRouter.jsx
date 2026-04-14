// AppRouter — central routing configuration with role-based protection
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "../utils/constants";

import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ResourcesPage from "../pages/ResourcesPage";
import MyBookingsPage from "../pages/MyBookingsPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import DashboardPage from "../pages/DashboardPage";
import StudentDashboardPage from "../pages/StudentDashboardPage";
import StudentProfilePage from "../pages/StudentProfilePage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminProfilePage from "../pages/AdminProfilePage";
import TechnicianDashboardPage from "../pages/TechnicianDashboardPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import BookingPage from "../pages/BookingPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        <Route path={ROUTES.CONTACT} element={<ContactPage />} />
        <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />

        {/* Authenticated-only routes */}
        <Route
          path={ROUTES.RESOURCES}
          element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>}
        />
        <Route
          path={ROUTES.BOOKING}
          element={<ProtectedRoute><BookingPage /></ProtectedRoute>}
        />
        <Route
          path={ROUTES.MY_BOOKINGS}
          element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>}
        />

        {/* Smart dashboard redirect */}
        <Route
          path={ROUTES.DASHBOARD}
          element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
        />
        <Route
          path={ROUTES.STUDENT_DASHBOARD}
          element={<ProtectedRoute><StudentDashboardPage /></ProtectedRoute>}
        />
        <Route
          path={ROUTES.STUDENT_PROFILE}
          element={<ProtectedRoute><StudentProfilePage /></ProtectedRoute>}
        />

        {/* Admin-only routes */}
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN_PROFILE}
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Technician-only route */}
        <Route
          path={ROUTES.TECHNICIAN_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={["TECHNICIAN"]}>
              <TechnicianDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback — redirect unknown routes to home */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
