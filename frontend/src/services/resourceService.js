import axiosInstance from "./axiosInstance";

export const resourceService = {
  getAllResources: async () => {
    const response = await axiosInstance.get("/api/resources");
    return response.data;
  },

  updateAvailableSpaces: async (id, spaces) => {
    const response = await axiosInstance.patch(`/api/resources/${id}`, { availableSpaces: spaces });
    return response.data;
  },

  updateResourceStatus: async (id, status) => {
    const response = await axiosInstance.patch(`/api/resources/${id}`, { status });
    return response.data;
  }
};
