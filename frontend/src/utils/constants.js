// App-wide constants

export const APP_NAME = "CampusReserve";

export const BASE_URL = "http://localhost:8081";

export const AUTH_STORAGE_KEY = "campus_reserve_auth";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  RESOURCES: "/resources",
  RESOURCE_DETAIL: "/resources/:resourceId",
  BOOKING: "/booking/:resourceId",
  MY_BOOKINGS: "/my-bookings",
  INDIVIDUAL_BOOKINGS: "/individual-bookings",
  MY_INDIVIDUAL_HISTORY: "/my-individual-bookings",
  ABOUT: "/about",
  CONTACT: "/contact",
  MAKE_TICKET: "/make-ticket",
  DASHBOARD: "/dashboard",
  STUDENT_DASHBOARD: "/student-dashboard",
  STUDENT_PROFILE: "/profile",
  ADMIN_DASHBOARD: "/admin",
  ADMIN_PROFILE: "/admin/profile",
  STAFF_DASHBOARD: "/staff",
  STAFF_HISTORY: "/staff/history",
  TRACK_TICKET: "/track-ticket",
  UNAUTHORIZED: "/unauthorized",
};
