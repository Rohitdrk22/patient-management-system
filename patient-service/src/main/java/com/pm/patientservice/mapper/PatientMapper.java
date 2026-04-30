package com.pm.patientservice.mapper;

import com.pm.patientservice.dto.PatientRequestDTO;
import com.pm.patientservice.dto.PatientResponseDTO;
import com.pm.patientservice.model.Patient;

import java.time.LocalDate;

public class PatientMapper {

    // ✅ MODEL → DTO
    public static PatientResponseDTO toDTO(Patient patient) {
        PatientResponseDTO dto = new PatientResponseDTO();

        dto.setId(patient.getId().toString());
        dto.setName(patient.getName());
        dto.setEmail(patient.getEmail());
        dto.setAddress(patient.getAddress());

        dto.setDateOfBirth(
                patient.getDateOfBirth() != null
                        ? patient.getDateOfBirth().toString()
                        : null
        );

        // ✅ IMPORTANT FIX (your bug was here)
        dto.setRegisteredDate(
                patient.getRegisteredDate() != null
                        ? patient.getRegisteredDate().toString()
                        : null
        );

        // ✅ NEW FIELDS
        dto.setCondition(patient.getCondition());

        dto.setStatus(
                patient.getStatus() != null
                        ? patient.getStatus().name()
                        : null
        );

        return dto;
    }

    // ✅ DTO → MODEL
    public static Patient toModel(PatientRequestDTO dto) {
        Patient patient = new Patient();

        patient.setName(dto.getName());
        patient.setEmail(dto.getEmail());
        patient.setAddress(dto.getAddress());

        // ✅ SAFE DATE PARSE
        if (dto.getDateOfBirth() != null) {
            patient.setDateOfBirth(LocalDate.parse(dto.getDateOfBirth()));
        }

        if (dto.getRegisteredDate() != null) {
            patient.setRegisteredDate(LocalDate.parse(dto.getRegisteredDate()));
        }

        // ✅ NEW FIELDS
        patient.setCondition(dto.getCondition());

        if (dto.getStatus() != null) {
            patient.setStatus(Patient.Status.valueOf(dto.getStatus()));
        }

        return patient;
    }
}