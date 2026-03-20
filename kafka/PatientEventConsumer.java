package com.pm.billingservice.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import patient.event.PatientEvent;

@Component
public class PatientEventConsumer {

    @KafkaListener(topics = "patient", groupId = "billing-group")
    public void consume(byte[] message) {
        try {
            PatientEvent event = PatientEvent.parseFrom(message);

            System.out.println("===== DECODED EVENT =====");
            System.out.println("ID: " + event.getPatientId());
            System.out.println("Name: " + event.getName());
            System.out.println("Email: " + event.getEmail());
            System.out.println("Type: " + event.getEventType());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}