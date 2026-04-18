package com.pm.analytics_service.kafka;

import com.google.protobuf.InvalidProtocolBufferException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import patient.event.PatientEvent;

@Service
public class KafkaConsumer {

    private static final Logger log = LoggerFactory.getLogger(KafkaConsumer.class);

    @KafkaListener(topics = "patient", groupId = "analytics-service")
    public void consumeEvent(byte[] event){
        try {
            PatientEvent patientEvent = PatientEvent.parseFrom(event);

            System.out.println("===== DECODED EVENT =====");
            System.out.println("ID: " + patientEvent.getPatientId());
            System.out.println("Name: " + patientEvent.getName());
            System.out.println("Email: " + patientEvent.getEmail());
            System.out.println("Type: " + patientEvent.getEventType());


//            log.info("Received Patient Event: [PatientId={},PatientName={},PatientEmail={}]",
//                    patientEvent.getPatientId(),
//                    patientEvent.getName(),
//                    patientEvent.getEmail());

        } catch (InvalidProtocolBufferException e) {
            log.error("Error deserializing event {}", e.getMessage());
        }

    }
}