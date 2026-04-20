package com.pm.analytics_service.kafka;

import com.google.protobuf.InvalidProtocolBufferException;
import com.pm.analytics_service.dto.PatientEventDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import patient.event.PatientEvent;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class KafkaConsumer {

    private static final Logger log = LoggerFactory.getLogger(KafkaConsumer.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @KafkaListener(topics = "patient", groupId = "analytics-service")
    public void consumeEvent(byte[] event){
        try {
            PatientEvent patientEvent = PatientEvent.parseFrom(event);
            PatientEventDTO dto = new PatientEventDTO(
                    patientEvent.getPatientId(),
                    patientEvent.getName(),
                    patientEvent.getEmail(),
                    patientEvent.getEventType()
            );

            System.out.println("===== DECODED EVENT =====");
            System.out.println("ID: " + dto.getPatientId());
            System.out.println("Name: " + dto.getName());
            System.out.println("Email: " + dto.getEmail());
            System.out.println("Type: " + dto.getEventType());

            // 🔥 SEND EVENT TO FRONTEND
            messagingTemplate.convertAndSend("/topic/patient-events", dto);

            log.info("Event sent to WebSocket");

//            log.info("Received Patient Event: [PatientId={},PatientName={},PatientEmail={}]",
//                    patientEvent.getPatientId(),
//                    patientEvent.getName(),
//                    patientEvent.getEmail());




        } catch (InvalidProtocolBufferException e) {
            log.error("Error deserializing event {}", e.getMessage());
        }

    }
}