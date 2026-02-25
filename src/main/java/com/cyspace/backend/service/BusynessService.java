package com.cyspace.backend.service;

import com.cyspace.backend.model.RecLocation;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Service
public class BusynessService {

    private final RestTemplate restTemplate = new RestTemplate();

    public List<RecLocation> getGymData() {
        String gymApiUrl = "https://goboardapi.azurewebsites.net/api/FacilityCount/GetCountsByAccount?AccountAPIKey=ac397d06-97b7-49d4-b657-b8e45b4acabe";

        try {
            RecLocation[] locations = restTemplate.getForObject(gymApiUrl, RecLocation[].class);

            if (locations != null) {
                return Arrays.asList(locations);
            }
        } catch (Exception e) {
            System.out.println("Something went wrong fetching the gym data: " + e.getMessage());
        }

        return List.of();
    }
}