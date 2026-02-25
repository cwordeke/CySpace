package com.cyspace.backend.controller;

import com.cyspace.backend.model.RecLocation;
import com.cyspace.backend.service.BusynessService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class LocationController {

    private final BusynessService busynessService;

    public LocationController(BusynessService busynessService) {
        this.busynessService = busynessService;
    }

    @GetMapping(value = "/api/locations", produces = "application/json")
    public List<RecLocation> getAllLocations() {

        List<RecLocation> allLocations = new ArrayList<>();

        // Fetch gym data
        List<RecLocation> gyms = busynessService.getGymData();
        if (gyms != null) {
            allLocations.addAll(gyms);
        }

        // Fetch library data
        RecLocation library = busynessService.getLibraryData();
        if (library != null) {
            allLocations.add(library);
        }

        return allLocations;
    }
}