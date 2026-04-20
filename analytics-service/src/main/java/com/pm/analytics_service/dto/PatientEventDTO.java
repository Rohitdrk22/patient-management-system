package com.pm.analytics_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PatientEventDTO {

    @JsonProperty
    private String patientId;

    @JsonProperty
    private String name;

    @JsonProperty
    private String email;

    @JsonProperty
    private String eventType;

    public PatientEventDTO(String patientId, String name, String email, String eventType) {
        this.patientId = patientId;
        this.name = name;
        this.email = email;
        this.eventType = eventType;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }
}