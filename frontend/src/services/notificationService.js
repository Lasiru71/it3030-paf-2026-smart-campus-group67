import axiosInstance from "./axiosInstance";

/**
 * Fetch all notifications for the current user
 */
export const getNotifications = () => axiosInstance.get("/api/notifications");

/**
 * Get the count of unread notifications
 */
export const getUnreadCount = () => axiosInstance.get("/api/notifications/unread-count");

/**
 * Mark a specific notification as read
 * @param {string} id 
 */
export const markAsRead = (id) => axiosInstance.patch(`/api/notifications/${id}/read`);

/**
 * Mark all notifications for the user as read
 */
export const markAllAsRead = () => axiosInstance.patch("/api/notifications/read-all");

/**
 * Delete a specific notification
 * @param {string} id 
 */
export const deleteNotification = (id) => axiosInstance.delete(`/api/notifications/${id}`);

/**
 * Get aggregate notification statistics (Admin only)
 */
export const getNotificationStats = () => axiosInstance.get("/api/notifications/stats");
