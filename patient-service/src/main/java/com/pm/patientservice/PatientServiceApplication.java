package com.pm.patientservice;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class PatientServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(PatientServiceApplication.class, args);
	}

	@Bean
	CommandLineRunner runner() {
		return args -> {
			System.out.println();
			System.out.println("----------------------------------------------------");
			System.out.println("PMS MICROSERVICES RUNNING");
			System.out.println("Patient Service : http://localhost:4000/patients");
			System.out.println("Billing Service : http://localhost:4001");
			System.out.println("GRPC Server     : http://localhost:9001");
			System.out.println("Kafka Server    : http://localhost:9092");
			System.out.println("Kafka Server    : http://localhost:9094");
			System.out.println("----------------------------------------------------");
			System.out.println();
		};
	}
}
