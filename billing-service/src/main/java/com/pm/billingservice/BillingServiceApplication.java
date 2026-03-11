package com.pm.billingservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BillingServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(BillingServiceApplication.class, args);

		System.out.println("Billing Service is running on port: 4001");
		System.out.println("GRPC Server is running on port: 9001");
	}

}
