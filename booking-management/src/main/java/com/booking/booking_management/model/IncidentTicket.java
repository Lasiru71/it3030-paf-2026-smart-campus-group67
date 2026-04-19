package com.booking.booking_management.model;

import com.booking.booking_management.enums.IncidentPriority;
import com.booking.booking_management.enums.IncidentStatus;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Date;

@Document(collection = "incident_tickets")
public class IncidentTicket {

    @Id
    private String id;

    private String resource;

    private String category;

    private String description;

    private IncidentPriority priority;

    private String contactInfo;

    private List<String> imageUrls = new ArrayList<>();
    private String studentId;
    private String technicianId;
    private String technicianName;
    private String rejectionReason;
    private String resolutionNotes;
    private List<TicketComment> comments = new ArrayList<>();

    private IncidentStatus status;

    @CreatedDate
    private LocalDateTime createdAt;

    public IncidentTicket() {
    }

    public IncidentTicket(String id, String resource, String category, String description, IncidentPriority priority, String contactInfo, List<String> imageUrls, String studentId, String technicianId, String technicianName, String rejectionReason, IncidentStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.resource = resource;
        this.category = category;
        this.description = description;
        this.priority = priority;
        this.contactInfo = contactInfo;
        this.imageUrls = imageUrls;
        this.studentId = studentId;
        this.technicianId = technicianId;
        this.technicianName = technicianName;
        this.rejectionReason = rejectionReason;
        this.status = status;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getResource() {
        return resource;
    }

    public void setResource(String resource) {
        this.resource = resource;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public IncidentPriority getPriority() {
        return priority;
    }

    public void setPriority(IncidentPriority priority) {
        this.priority = priority;
    }

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public IncidentStatus getStatus() {
        return status;
    }

    public void setStatus(IncidentStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getTechnicianId() {
        return technicianId;
    }

    public void setTechnicianId(String technicianId) {
        this.technicianId = technicianId;
    }

    public String getTechnicianName() {
        return technicianName;
    }

    public void setTechnicianName(String technicianName) {
        this.technicianName = technicianName;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }

    public List<TicketComment> getComments() {
        return comments;
    }

    public void setComments(List<TicketComment> comments) {
        this.comments = comments;
    }

    // --- Inner Class for Comments ---
    public static class TicketComment {
        private String id;
        private String authorId;
        private String authorName;
        private String text;
        private String timestamp;

        public TicketComment() {}

        public TicketComment(String id, String authorId, String authorName, String text, String timestamp) {
            this.id = id;
            this.authorId = authorId;
            this.authorName = authorName;
            this.text = text;
            this.timestamp = timestamp;
        }

        public String getAuthorId() { return authorId; }
        public void setAuthorId(String authorId) { this.authorId = authorId; }
        public String getAuthorName() { return authorName; }
        public void setAuthorName(String authorName) { this.authorName = authorName; }
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
        public String getTimestamp() { return timestamp; }
        public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
    }
}
