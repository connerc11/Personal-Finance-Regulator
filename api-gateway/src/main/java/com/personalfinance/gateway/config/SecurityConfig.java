// ...existing code...
package com.personalfinance.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            .authorizeExchange(exchanges -> exchanges
                .pathMatchers(HttpMethod.OPTIONS, "/api/**").permitAll()
                .pathMatchers("/api/**").authenticated()
                .anyExchange().permitAll()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt());
        return http.build();
    }

    // Debug: Force ReactiveJwtDecoder bean and log the secret
    @Bean
    public ReactiveJwtDecoder jwtDecoder(@Value("${spring.security.oauth2.resourceserver.jwt.secret-key:}") String secret) {
        org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger("JwtDebugLogger");
        log.info("[DEBUG] JWT secret-key property value: {} (length: {})", secret, secret != null ? secret.length() : 0);
        if (secret == null || secret.isEmpty()) {
            throw new IllegalStateException("JWT secret-key property is missing or empty!");
        }
        return NimbusReactiveJwtDecoder.withSecretKey(
            new javax.crypto.spec.SecretKeySpec(java.util.Base64.getDecoder().decode(secret), "HmacSHA256")
        ).build();
    }
}
