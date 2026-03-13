package com.pm.patientservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class PatientServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(PatientServiceApplication.class, args);
	}

	@EventListener(ApplicationReadyEvent.class)
	public void startupMessage() {

		System.out.println();
		System.out.println("----------------------------------------------------");
		System.out.println("PMS MICROSERVICES RUNNING");
		System.out.println("Patient Service : http://localhost:4000");
		System.out.println("Billing Service : http://localhost:4001");
		System.out.println("GRPC Server     : localhost:9001");
		System.out.println("----------------------------------------------------");
		System.out.println();
	}

}
