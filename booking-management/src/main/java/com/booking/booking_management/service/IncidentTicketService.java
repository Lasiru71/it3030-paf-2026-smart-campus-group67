package com.booking.booking_management.service;

import com.booking.booking_management.dto.request.IncidentTicketRequest;
import com.booking.booking_management.enums.IncidentStatus;
import com.booking.booking_management.enums.Role;
import com.booking.booking_management.model.IncidentTicket;
import com.booking.booking_management.model.User;
import com.booking.booking_management.repository.IncidentTicketRepository;
import com.booking.booking_management.repository.UserRepository;
import com.booking.booking_management.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class IncidentTicketService {

    private final IncidentTicketRepository repository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final String uploadDir = "uploads/incidents";

    @Autowired
    public IncidentTicketService(IncidentTicketRepository repository, UserRepository userRepository, NotificationService notificationService) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    public IncidentTicket createTicket(IncidentTicketRequest request) {
        List<String> imageUrls = new ArrayList<>();
        
        if (request.getImages() != null) {
            for (MultipartFile file : request.getImages()) {
                if (file != null && !file.isEmpty()) {
                    String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                    Path targetPath = Paths.get(uploadDir).resolve(fileName);
                    try {
                        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
                        imageUrls.add("/api/incidents/images/" + fileName);
                    } catch (IOException e) {
                        throw new RuntimeException("Failed to store file: " + file.getOriginalFilename(), e);
                    }
                }
            }
        }

        IncidentTicket ticket = new IncidentTicket();
        ticket.setResource(request.getResource());
        ticket.setCategory(request.getCategory());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setContactInfo(request.getContactInfo());
        ticket.setStudentId(request.getStudentId());
        ticket.setImageUrls(imageUrls);
        ticket.setStatus(IncidentStatus.OPEN);

        IncidentTicket savedTicket = repository.save(ticket);
        
        // Trigger notification for student
        notificationService.createNotification(
                savedTicket.getStudentId(),
                "Ticket Created",
                "Your incident ticket for " + savedTicket.getResource() + " has been logged successfully.",
                "TICKET"
        );

        // Trigger notification for admins
        try {
            List<User> admins = userRepository.findByRole(Role.ADMIN);
            for (User admin : admins) {
                notificationService.createNotification(
                        admin.getEmail(),
                        "New Maintenance Ticket",
                        "A new maintenance ticket for " + savedTicket.getResource() + " has been submitted by " + savedTicket.getStudentId() + ".",
                        "TICKET"
                );
            }
        } catch (Exception e) {
            System.err.println("Failed to notify admins of ticket: " + e.getMessage());
        }

        return savedTicket;
    }

    public List<IncidentTicket> getStudentTickets(String studentId) {
        return repository.findByStudentId(studentId);
    }

    public List<IncidentTicket> getAllTickets() {
        return repository.findAll();
    }

    public IncidentTicket getTicketById(String id) {
        return repository.findById(id).orElse(null);
    }

    /**
     * Updated: Technicians are considered STAFF members in this system.
     */
    public List<User> getAllTechnicians() {
        return userRepository.findByRole(Role.STAFF);
    }

    public IncidentTicket assignTechnician(String ticketId, String technicianId, String technicianName) {
        IncidentTicket ticket = repository.findById(ticketId).orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setTechnicianId(technicianId);
        ticket.setTechnicianName(technicianName);
        ticket.setStatus(IncidentStatus.IN_PROGRESS);
        IncidentTicket savedTicket = repository.save(ticket);
        
        // Trigger notification
        notificationService.createNotification(
                savedTicket.getStudentId(),
                "Ticket Assigned",
                "Your ticket has been assigned to " + technicianName + ".",
                "TICKET"
        );

        return savedTicket;
    }

    public IncidentTicket updateStatus(String ticketId, IncidentStatus status, String rejectionReason) {
        IncidentTicket ticket = repository.findById(ticketId).orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setStatus(status);
        if (status == IncidentStatus.REJECTED && rejectionReason != null) {
            ticket.setRejectionReason(rejectionReason);
        }
        IncidentTicket savedTicket = repository.save(ticket);
        
        // Trigger notification
        notificationService.createNotification(
                savedTicket.getStudentId(),
                "Ticket Update",
                "Your ticket status has been updated to " + status.name() + ".",
                "TICKET"
        );

        return savedTicket;
    }
}
