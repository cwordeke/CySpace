package com.cyspace.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class RecLocation {

    @JsonProperty("FacilityName")
    private String facilityName;

    @JsonProperty("LocationName")
    private String locationName;

    @JsonProperty("LastCount")
    private int lastCount;

    @JsonProperty("TotalCapacity")
    private int totalCapacity;

    public String getFacilityName() { return facilityName; }
    public String getLocationName() { return locationName; }
    public int getLastCount() { return lastCount; }
    public int getTotalCapacity() { return totalCapacity; }

    public void setFacilityName(String facilityName) { this.facilityName = facilityName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }
    public void setLastCount(int lastCount) { this.lastCount = lastCount; }
    public void setTotalCapacity(int totalCapacity) { this.totalCapacity = totalCapacity; }
}