package com.booking.booking_management.controller;

import com.booking.booking_management.dto.request.IncidentTicketRequest;
import com.booking.booking_management.enums.IncidentStatus;
import com.booking.booking_management.model.IncidentTicket;
import com.booking.booking_management.model.User;
import com.booking.booking_management.service.IncidentTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "http://localhost:5173")
public class IncidentTicketController {

    private final IncidentTicketService service;

    @Autowired
    public IncidentTicketController(IncidentTicketService service) {
        this.service = service;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<IncidentTicket> createTicket(@ModelAttribute IncidentTicketRequest request) {
        IncidentTicket ticket = service.createTicket(request);
        return new ResponseEntity<>(ticket, HttpStatus.CREATED);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<IncidentTicket>> getStudentTickets(@PathVariable String studentId) {
        return ResponseEntity.ok(service.getStudentTickets(studentId));
    }

    @GetMapping("/technician/{technicianId}")
    public ResponseEntity<List<IncidentTicket>> getTechnicianTickets(@PathVariable String technicianId) {
        return ResponseEntity.ok(service.getTechnicianTickets(technicianId));
    }

    @GetMapping
    public ResponseEntity<List<IncidentTicket>> getAllTickets() {
        return ResponseEntity.ok(service.getAllTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentTicket> getTicketById(@PathVariable String id) {
        IncidentTicket ticket = service.getTicketById(id);
        if (ticket == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ticket);
    }

    @GetMapping("/technicians")
    public ResponseEntity<List<User>> getAllTechnicians() {
        return ResponseEntity.ok(service.getAllTechnicians());
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<IncidentTicket> assignTechnician(
            @PathVariable String id,
            @RequestParam String technicianId,
            @RequestParam String technicianName) {
        return ResponseEntity.ok(service.assignTechnician(id, technicianId, technicianName));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<IncidentTicket> updateStatus(
            @PathVariable String id,
            @RequestParam IncidentStatus status,
            @RequestParam(required = false) String rejectionReason) {
        return ResponseEntity.ok(service.updateStatus(id, status, rejectionReason));
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<IncidentTicket> resolveTicket(
            @PathVariable String id,
            @RequestParam String notes) {
        return ResponseEntity.ok(service.resolveTicket(id, notes));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<IncidentTicket> addComment(
            @PathVariable String id,
            @RequestBody IncidentTicket.TicketComment comment) {
        return ResponseEntity.ok(service.addComment(id, comment));
    }

    @PatchMapping("/{id}/comments/{commentId}")
    public ResponseEntity<IncidentTicket> updateComment(
            @PathVariable String id,
            @PathVariable String commentId,
            @RequestParam String userId,
            @RequestBody String newText) {
        return ResponseEntity.ok(service.updateComment(id, commentId, userId, newText));
    }

    @DeleteMapping("/{id}/comments/{commentId}")
    public ResponseEntity<IncidentTicket> deleteComment(
            @PathVariable String id,
            @PathVariable String commentId,
            @RequestParam String userId,
            @RequestParam boolean isAdmin) {
        return ResponseEntity.ok(service.deleteComment(id, commentId, userId, isAdmin));
    }

    @GetMapping("/images/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            // Robust path resolution: check multiple levels for 'uploads' folder
            Path currentPath = Paths.get("").toAbsolutePath();
            Path rootLocation = currentPath.resolve("uploads/incidents").normalize();
            
            if (!Files.exists(rootLocation)) {
                // If not found in current dir, check the booking-management subfolder (common in multi-module projects)
                rootLocation = currentPath.resolve("booking-management/uploads/incidents").normalize();
            }
            
            Path filePath = rootLocation.resolve(filename).normalize();

            if (!filePath.startsWith(rootLocation)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                // Dynamically determine content type
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .body(resource);
            } else {
                System.err.println("File not found or not readable: " + filePath);
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            System.err.println("Malformed URL for file: " + filename + " - " + e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            System.err.println("Error reading file: " + filename + " - " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
