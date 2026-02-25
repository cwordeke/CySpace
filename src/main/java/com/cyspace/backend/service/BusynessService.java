package com.cyspace.backend.service;

import com.cyspace.backend.model.RecLocation;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

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

    public RecLocation getLibraryData() {
        String libraryUrl = "https://www.lib.iastate.edu/libapi/libcaphours_json";

        try {
            String rawJson = restTemplate.getForObject(libraryUrl, String.class);

            ObjectMapper mapper = new ObjectMapper();

            JsonNode root = mapper.readTree(rawJson);

            JsonNode densityNode = root.path("locations").path("parks").path("density");

            String name = densityNode.path("name").asText();
            int currentCount = densityNode.path("current_count").asInt();
            int capacity = densityNode.path("capacity").asInt();

            RecLocation library = new RecLocation();
            library.setFacilityName("Parks Library");
            library.setLocationName(name);
            library.setLastCount(currentCount);
            library.setTotalCapacity(capacity);

            return library;

        } catch (Exception e) {
            System.out.println("Something went wrong fetching the library data: " + e.getMessage());
            return null;
        }
    }
}