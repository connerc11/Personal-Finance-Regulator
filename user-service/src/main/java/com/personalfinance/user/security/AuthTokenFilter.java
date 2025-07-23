package com.personalfinance.user.security;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AuthTokenFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // Log all request headers for debugging
            logger.info("[AuthTokenFilter] Request Headers:");
            java.util.Enumeration<String> headerNames = request.getHeaderNames();
            while (headerNames.hasMoreElements()) {
                String headerName = headerNames.nextElement();
                logger.info("    {}: {}", headerName, request.getHeader(headerName));
            }

            String headerAuth = request.getHeader("Authorization");
            logger.info("[AuthTokenFilter] Incoming Authorization header: {}", headerAuth);
            String jwt = parseJwt(request);
            logger.info("[AuthTokenFilter] Parsed JWT: {}", jwt);
            if (jwt != null) {
                boolean valid = jwtUtils.validateJwtToken(jwt);
                logger.info("[AuthTokenFilter] JWT validation result: {}", valid);
                if (valid) {
                    String username = jwtUtils.getUserNameFromJwtToken(jwt);
                    logger.info("[AuthTokenFilter] Username from JWT: {}", username);
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.info("[AuthTokenFilter] Authentication set for user: {}", username);
                } else {
                    logger.warn("[AuthTokenFilter] JWT token is invalid.");
                }
            } else {
                logger.warn("[AuthTokenFilter] No JWT token found in Authorization header.");
            }
            logger.info("[AuthTokenFilter] SecurityContext authentication: {}", SecurityContextHolder.getContext().getAuthentication());
        } catch (Exception e) {
            logger.error("[AuthTokenFilter] Cannot set user authentication: {}", e);
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }

        return null;
    }
}
