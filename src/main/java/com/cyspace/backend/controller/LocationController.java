package com.cyspace.backend.controller;

import com.cyspace.backend.model.RecLocation;
import com.cyspace.backend.service.BusynessService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class LocationController {
    private final BusynessService busynessService;

    public LocationController(BusynessService busynessService) {
        this.busynessService = busynessService;
    }

    @GetMapping(value = "/api/gyms", produces = "application/json")
    public List<RecLocation> getGymBusyness() {
        return busynessService.getGymData();
    }
}