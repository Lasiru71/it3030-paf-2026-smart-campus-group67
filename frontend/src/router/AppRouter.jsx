// AppRouter — central routing configuration
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "../utils/constants";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ResourcesPage from "../pages/ResourcesPage";
import MyBookingsPage from "../pages/MyBookingsPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
        <Route path={ROUTES.RESOURCES} element={<ResourcesPage />} />
        <Route path={ROUTES.MY_BOOKINGS} element={<MyBookingsPage />} />
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        <Route path={ROUTES.CONTACT} element={<ContactPage />} />
        {/* Fallback — redirect unknown routes to home */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
