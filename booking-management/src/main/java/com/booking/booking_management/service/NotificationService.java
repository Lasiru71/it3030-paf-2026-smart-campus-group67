package com.booking.booking_management.service;

import com.booking.booking_management.model.Notification;
import com.booking.booking_management.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification createNotification(String email, String title, String message, String type) {
        Notification notification = new Notification(email, title, message, type);
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForUser(String email) {
        return notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(email);
    }

    public long getUnreadCount(String email) {
        return notificationRepository.countByRecipientEmailAndReadFalse(email);
    }

    public void markAsRead(String id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    public void markAllAsRead(String email) {
        List<Notification> unread = notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(email);
        for (Notification n : unread) {
            if (!n.isRead()) {
                n.setRead(true);
            }
        }
        notificationRepository.saveAll(unread);
    }

    public void deleteNotification(String id) {
        notificationRepository.deleteById(id);
    }

    public java.util.Map<String, Object> getNotificationStats() {
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("total", notificationRepository.count());
        stats.put("read", notificationRepository.countByRead(true));
        stats.put("unread", notificationRepository.countByRead(false));
        stats.put("bookingCount", notificationRepository.countByType("BOOKING"));
        stats.put("ticketCount", notificationRepository.countByType("TICKET"));
        return stats;
    }
}
