package com.personalfinance.budget.config;

import org.springframework.context.annotation.Bean;
import static org.springframework.security.config.Customizer.withDefaults;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import java.io.IOException;

@EnableWebSecurity
public class SecurityConfig {
    // Log all incoming requests for debugging
    @Bean
    public Filter requestLoggingFilter() {
        return new Filter() {
            private final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger("RequestLogger");
            @Override
            public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
                    throws IOException, ServletException {
                if (request instanceof HttpServletRequest req) {
                    log.info("[RequestLogger] {} {} from {}", req.getMethod(), req.getRequestURI(), req.getRemoteAddr());
                    // Log all headers for debugging
                    java.util.Enumeration<String> headerNames = req.getHeaderNames();
                    while (headerNames.hasMoreElements()) {
                        String header = headerNames.nextElement();
                        log.info("[RequestLogger] Header: {} = {}", header, req.getHeader(header));
                    }
                    // Log if OPTIONS (CORS preflight)
                    if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
                        log.info("[RequestLogger] CORS preflight detected for {}", req.getRequestURI());
                    }
                }
                chain.doFilter(request, response);
            }
        };
    }

    // Custom AuthenticationEntryPoint for detailed JWT error logging
    @Bean
    public AuthenticationEntryPoint jwtAuthenticationEntryPoint() {
        return (request, response, authException) -> {
            String token = request.getHeader("Authorization");
            org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger("JwtAuthLogger");
            log.error("[JWT] Authentication failed. Reason: {} | Token: {} | Path: {}", authException.getMessage(), token, request.getRequestURI(), authException);
            response.setStatus(401);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Unauthorized\",\"details\":\"" + authException.getMessage() + "\"}");
        };
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(withDefaults())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(org.springframework.security.config.http.SessionCreationPolicy.STATELESS))
            .formLogin(form -> form.disable())
            .authorizeRequests(auth -> auth
                .antMatchers(org.springframework.http.HttpMethod.OPTIONS, "/api/**").permitAll()
                .antMatchers("/api/budgets/**").authenticated()
                .anyRequest().permitAll()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {}))
            .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint()))
            .addFilterBefore(requestLoggingFilter(), org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    // CORS configuration for frontend access
    @Bean
    public org.springframework.web.servlet.config.annotation.WebMvcConfigurer corsConfigurer() {
        return new org.springframework.web.servlet.config.annotation.WebMvcConfigurer() {
            @Override
            public void addCorsMappings(org.springframework.web.servlet.config.annotation.CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:3000")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
                org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger("RequestLogger");
                log.info("[CORS] CORS mapping added for /api/** from http://localhost:3000 with credentials allowed");
            }
        };
    }

    // JwtDecoder bean for HMAC secret-based JWT validation
    @Bean
    public JwtDecoder jwtDecoder() {
        // Secret must match the one in application-dev.yml
        String secret = "Y1JqNmM2cFNWcXY5ckYyNGFKcGJEa0I3V1FyU3ZLdDhON2tMWTNxWGpIcjlYN0Z2TjJaZ05NeDVwSDBmUDBaQg==";
        return NimbusJwtDecoder.withSecretKey(
            new javax.crypto.spec.SecretKeySpec(java.util.Base64.getDecoder().decode(secret), "HmacSHA256")
        ).build();
    }
}
