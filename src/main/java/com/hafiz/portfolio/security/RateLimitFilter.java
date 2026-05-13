package com.hafiz.portfolio.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
public class RateLimitFilter extends OncePerRequestFilter {

    @Value("${app.rate-limit.login.max-attempts:5}")
    private int maxAttempts;

    @Value("${app.rate-limit.login.window-minutes:15}")
    private int windowMinutes;

    private record AttemptRecord(int count, LocalDateTime windowStart) {}

    private final Map<String, AttemptRecord> attempts = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        if ("POST".equals(request.getMethod()) && request.getRequestURI().endsWith("/api/auth/login")) {
            String ip = getClientIp(request);
            if (isRateLimited(ip)) {
                log.warn("Rate limit exceeded for IP: {}", ip);
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Too many login attempts. Please try again later.\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isRateLimited(String ip) {
        LocalDateTime now = LocalDateTime.now();
        AttemptRecord record = attempts.get(ip);

        if (record == null || now.isAfter(record.windowStart().plusMinutes(windowMinutes))) {
            attempts.put(ip, new AttemptRecord(1, now));
            return false;
        }

        if (record.count() >= maxAttempts) {
            return true;
        }

        attempts.put(ip, new AttemptRecord(record.count() + 1, record.windowStart()));
        return false;
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
