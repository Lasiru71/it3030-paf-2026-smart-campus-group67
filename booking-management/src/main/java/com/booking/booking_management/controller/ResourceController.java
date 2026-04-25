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

    @GetMapping("/{id}")
    public Resource getResourceById(@PathVariable String id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Resource createResource(@RequestBody Resource resource) {
        // Default status if null
        if (resource.getStatus() == null) {
            resource.setStatus("Available");
        }
        // Enforce rule on creation too
        if ("Maintenance".equals(resource.getStatus()) || "Booked".equals(resource.getStatus())) {
            resource.setAvailableSpaces(0);
        }
        return resourceRepository.save(resource);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Resource updateResource(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        return resourceRepository.findById(id).map(res -> {
            // Apply updates from the map
            if (updates.containsKey("name")) res.setName((String) updates.get("name"));
            if (updates.containsKey("category")) res.setCategory((String) updates.get("category"));
            if (updates.containsKey("location")) res.setLocation((String) updates.get("location"));
            if (updates.containsKey("status")) res.setStatus((String) updates.get("status"));
            if (updates.containsKey("image")) res.setImage((String) updates.get("image"));
            if (updates.containsKey("description")) res.setDescription((String) updates.get("description"));
            if (updates.containsKey("amenities")) res.setAmenities((List<String>) updates.get("amenities"));
            if (updates.containsKey("rules")) res.setRules((List<String>) updates.get("rules"));
            
            if (updates.containsKey("capacity")) {
                Object cap = updates.get("capacity");
                if (cap instanceof Number) res.setCapacity(((Number) cap).intValue());
            }
            
            if (updates.containsKey("availableSpaces")) {
                Object spaces = updates.get("availableSpaces");
                if (spaces instanceof Number) res.setAvailableSpaces(((Number) spaces).intValue());
            }

            // Rule Enforcement: If status is Maintenance or Booked, available spaces must be 0
            if ("Maintenance".equals(res.getStatus()) || "Booked".equals(res.getStatus())) {
                res.setAvailableSpaces(0);
            }
            
            return resourceRepository.save(res);
        }).orElseThrow(() -> new RuntimeException("Resource not found"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteResource(@PathVariable String id) {
        resourceRepository.deleteById(id);
    }
}
