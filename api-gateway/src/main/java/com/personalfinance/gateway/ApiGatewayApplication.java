package com.personalfinance.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import reactor.core.publisher.Mono;

@SpringBootApplication
@RestController
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @GetMapping("/")
    public Mono<String> welcome() {
        return Mono.just("Welcome to Personal Finance Regulator API Gateway");
    }

    @GetMapping("/fallback")
    public Mono<String> fallback() {
        return Mono.just("Service temporarily unavailable. Please try again later.");
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("swagger-ui", r -> r.path("/swagger-ui/**")
                        .uri("forward:/"))
                .route("api-docs", r -> r.path("/v3/api-docs/**")
                        .uri("forward:/"))
                .build();
    }

}
