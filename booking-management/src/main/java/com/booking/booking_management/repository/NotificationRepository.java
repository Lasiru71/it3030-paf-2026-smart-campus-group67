package com.booking.booking_management.repository;

import com.booking.booking_management.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByRecipientEmailOrderByCreatedAtDesc(String recipientEmail);
    long countByRecipientEmailAndReadFalse(String recipientEmail);
    long countByRead(boolean read);
    long countByType(String type);
}
