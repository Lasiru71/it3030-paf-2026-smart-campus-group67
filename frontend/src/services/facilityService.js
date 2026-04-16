import axiosInstance from "./axiosInstance";

export const facilityService = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get("/api/resources");
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/resources/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching resource ${id}:`, error);
      return null;
    }
  },

  save: async (facility) => {
    try {
      if (facility.id) {
        const response = await axiosInstance.patch(`/api/resources/${facility.id}`, facility);
        return response.data;
      } else {
        const response = await axiosInstance.post("/api/resources", facility);
        return response.data;
      }
    } catch (error) {
      console.error("Error saving resource:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await axiosInstance.delete(`/api/resources/${id}`);
    } catch (error) {
      console.error(`Error deleting resource ${id}:`, error);
      throw error;
    }
  }
};
