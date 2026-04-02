package com.pm.apigateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Value("${patient.service.url}")
    private String patientServiceUrl;

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("patient", r -> r
                        .path("/api/patients/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri(patientServiceUrl))
                .build();
    }
}
