package com.booking.booking_management.controller;

import com.booking.booking_management.model.Resource;
import com.booking.booking_management.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    @Autowired
    private ResourceRepository resourceRepository;

    @GetMapping
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Resource updateResource(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        return resourceRepository.findById(id).map(res -> {
            if (updates.containsKey("availableSpaces")) {
                res.setAvailableSpaces((Integer) updates.get("availableSpaces"));
            }
            if (updates.containsKey("status")) {
                String newStatus = (String) updates.get("status");
                res.setStatus(newStatus);
                // Rule: If set to Maintenance or Booked, available spaces must be 0
                if ("Maintenance".equals(newStatus) || "Booked".equals(newStatus)) {
                    res.setAvailableSpaces(0);
                }
            }
            if (updates.containsKey("availableSpaces") && !"Maintenance".equals(res.getStatus()) && !"Booked".equals(res.getStatus())) {
                res.setAvailableSpaces((Integer) updates.get("availableSpaces"));
            } else if (updates.containsKey("availableSpaces") && ("Maintenance".equals(res.getStatus()) || "Booked".equals(res.getStatus()))) {
                // If status is restricted, enforce 0 spaces regardless of request
                res.setAvailableSpaces(0);
            }
            return resourceRepository.save(res);
        }).orElseThrow(() -> new RuntimeException("Resource not found"));
    }
}
