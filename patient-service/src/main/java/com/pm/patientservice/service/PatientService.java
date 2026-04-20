package com.pm.patientservice.service;

import com.pm.patientservice.dto.PatientRequestDTO;
import com.pm.patientservice.dto.PatientResponseDTO;
import com.pm.patientservice.enums.EventType;
import com.pm.patientservice.exception.EmailAlreadyExistsException;
import com.pm.patientservice.exception.PatientNotFoundException;
import com.pm.patientservice.grpc.BillingServiceGrpcClient;
import com.pm.patientservice.kafka.KafkaProducer;
import com.pm.patientservice.mapper.PatientMapper;
import com.pm.patientservice.model.Patient;
import com.pm.patientservice.repository.PatientRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final BillingServiceGrpcClient billingServiceGrpcClient;
    private final KafkaProducer kafkaProducer;

    public PatientService(PatientRepository patientRepository,
                          BillingServiceGrpcClient billingServiceGrpcClient,
                          KafkaProducer kafkaProducer) {
        this.patientRepository = patientRepository;
        this.billingServiceGrpcClient = billingServiceGrpcClient;
        this.kafkaProducer = kafkaProducer;
    }

    // ✅ GET ALL PATIENTS
    @Operation(summary = "Get all patient details")
    @ApiResponse(responseCode = "200", description = "Successfully fetched patients")
    public List<PatientResponseDTO> getPatients() {
        List<Patient> patients = patientRepository.findAll();
        return patients.stream().map(PatientMapper::toDTO).toList();
    }

    // ✅ CREATE PATIENT
    @Operation(
            summary = "Create new patient",
            description = "Creates a new patient record and publishes Kafka event"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Patient created"),
            @ApiResponse(responseCode = "409", description = "Email already exists")
    })
    public PatientResponseDTO createPatient(PatientRequestDTO patientRequestDTO) {

        if (patientRepository.existsByEmail(patientRequestDTO.getEmail())) {
            throw new EmailAlreadyExistsException(
                    "A patient with this email already exists: " + patientRequestDTO.getEmail()
            );
        }

        Patient newPatient = patientRepository.save(
                PatientMapper.toModel(patientRequestDTO)
        );

        // gRPC call
        billingServiceGrpcClient.createBillingAccount(
                newPatient.getId().toString(),
                newPatient.getName(),
                newPatient.getEmail()
        );

        // 🔥 Kafka CREATE event
        kafkaProducer.sendEvent(newPatient, EventType.PATIENT_CREATED);

        return PatientMapper.toDTO(newPatient);
    }

    // ✅ UPDATE PATIENT
    @Operation(summary = "Update patient details")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Patient updated"),
            @ApiResponse(responseCode = "404", description = "Patient not found"),
            @ApiResponse(responseCode = "409", description = "Email already exists")
    })
    public PatientResponseDTO updatePatient(UUID id, PatientRequestDTO patientRequestDTO) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() ->
                        new PatientNotFoundException("Patient not found with ID: " + id)
                );

        if (patientRepository.existsByEmailAndIdNot(patientRequestDTO.getEmail(), id)) {
            throw new EmailAlreadyExistsException(
                    "A patient with this email already exists: " + patientRequestDTO.getEmail()
            );
        }

        patient.setName(patientRequestDTO.getName());
        patient.setEmail(patientRequestDTO.getEmail());
        patient.setAddress(patientRequestDTO.getAddress());
        patient.setDateOfBirth(LocalDate.parse(patientRequestDTO.getDateOfBirth()));

        Patient updatedPatient = patientRepository.save(patient);

        return PatientMapper.toDTO(updatedPatient);
    }

    // ✅ DELETE PATIENT (🔥 FIXED WITH KAFKA)
    @Operation(
            summary = "Delete patient",
            description = "Deletes patient by ID and publishes Kafka delete event"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Patient deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Patient not found")
    })
    public void deletePatient(UUID id){

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() ->
                        new PatientNotFoundException("Patient not found with ID: " + id)
                );

        patientRepository.deleteById(id);

        // 🔥 THIS IS THE MISSING LINE
        kafkaProducer.sendEvent(patient, EventType.PATIENT_DELETED);
    }
}