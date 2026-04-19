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
import MakeTicketPage from "../pages/MakeTicketPage";
import DashboardPage from "../pages/DashboardPage";
import StudentDashboardPage from "../pages/StudentDashboardPage";
import StudentProfilePage from "../pages/StudentProfilePage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminProfilePage from "../pages/AdminProfilePage";
import StaffDashboardPage from "../pages/StaffDashboardPage";
import TrackTicketPage from "../pages/TrackTicketPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import BookingPage from "../pages/BookingPage";
import IndividualBookingPage from "../pages/IndividualBookingPage";
import MyIndividualHistoryPage from "../pages/MyIndividualHistoryPage";
import FacilityDetailPage from "../pages/FacilityDetailPage";

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
          path={ROUTES.RESOURCE_DETAIL}
          element={<ProtectedRoute><FacilityDetailPage /></ProtectedRoute>}
        />
        <Route
          path={ROUTES.BOOKING}
          element={<ProtectedRoute><BookingPage /></ProtectedRoute>}
        />
        <Route
          path={ROUTES.MY_BOOKINGS}
          element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>}
        />
        <Route
          path={ROUTES.INDIVIDUAL_BOOKINGS}
          element={<ProtectedRoute><IndividualBookingPage /></ProtectedRoute>}
        />
        <Route
          path={ROUTES.MY_INDIVIDUAL_HISTORY}
          element={<ProtectedRoute><MyIndividualHistoryPage /></ProtectedRoute>}
        />
        <Route
          path={ROUTES.MAKE_TICKET}
          element={<ProtectedRoute><MakeTicketPage /></ProtectedRoute>}
        />
        <Route
          path={ROUTES.TRACK_TICKET}
          element={<ProtectedRoute><TrackTicketPage /></ProtectedRoute>}
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

        {/* Staff-only route */}
        <Route
          path={ROUTES.STAFF_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={["TECHNICIAN", "STAFF"]}>
              <StaffDashboardPage />
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
