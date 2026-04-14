import axiosInstance from "./axiosInstance";

export const bookingService = {
  // Create a new booking
  createBooking: async (bookingData) => {
    const response = await axiosInstance.post("/api/bookings", bookingData);
    return response.data;
  },
  
  // Get all bookings (for user/admin views)
  getAllBookings: async () => {
    const response = await axiosInstance.get("/api/bookings");
    return response.data;
  },

  // Update booking status
  updateBookingStatus: async (id, status) => {
    const response = await axiosInstance.patch(`/api/bookings/${id}/status`, { status });
    return response.data;
  }
};
