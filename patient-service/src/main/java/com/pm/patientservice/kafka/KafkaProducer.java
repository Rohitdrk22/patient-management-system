package com.pm.patientservice.kafka;

import com.pm.patientservice.enums.EventType;
import com.pm.patientservice.model.Patient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import patient.event.PatientEvent;

@Service
public class KafkaProducer {

    private static final Logger log = LoggerFactory.getLogger(KafkaProducer.class);
    private final KafkaTemplate<String, byte[]> kafkaTemplate;

    public KafkaProducer(KafkaTemplate<String, byte[]> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    // 🔥 Now using ENUM instead of String
    public void sendEvent(Patient patient, EventType eventType) {

        PatientEvent event = PatientEvent.newBuilder()
                .setPatientId(patient.getId().toString())
                .setName(patient.getName())
                .setEmail(patient.getEmail())
                .setEventType(eventType.name()) // 🔥 enum → string
                .build();

        log.info("📤 Sending {} event to Kafka: {}", eventType, event);

        try {
            kafkaTemplate.send("patient", event.toByteArray());
        } catch (Exception e) {
            log.error("❌ Error sending {} event: {}", eventType, event, e);
        }
    }
}