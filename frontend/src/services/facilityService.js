import axiosInstance from "./axiosInstance";

const DEFAULT_RESOURCES = [
  {
    id: "f1",
    name: "University Gymnasium",
    category: "Sports Facility",
    capacity: 40,
    availableSpaces: 40,
    location: "Arts Pavillion, Basement",
    status: "Available",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "f2",
    name: "University Swimming Pool",
    category: "Sports Facility",
    capacity: 40,
    availableSpaces: 0,
    location: "Arts Pavillion, Basement",
    status: "Maintenance",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "f3",
    name: "Seminar Halls",
    category: "L Halls",
    capacity: 80,
    availableSpaces: 80,
    location: "G Block, Level 10",
    status: "Available",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop"
  }
];

export const facilityService = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get("/api/resources");
      const data = Array.isArray(response.data) ? response.data : [];
      return data.length > 0 ? data : DEFAULT_RESOURCES;
    } catch (error) {
      console.error("Error fetching resources:", error);
      return DEFAULT_RESOURCES;
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
