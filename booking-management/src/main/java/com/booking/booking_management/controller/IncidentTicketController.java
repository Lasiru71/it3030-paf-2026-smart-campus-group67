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

import java.net.MalformedURLException;
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

    @GetMapping("/images/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        Path filePath = Paths.get("uploads/incidents").resolve(filename);
        try {
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
