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
import java.util.concurrent.atomic.AtomicInteger;

@Component
@Slf4j
public class RateLimitFilter extends OncePerRequestFilter {

    @Value("${app.rate-limit.login.max-attempts:5}")
    private int loginMaxAttempts;

    @Value("${app.rate-limit.login.window-minutes:15}")
    private int loginWindowMinutes;

    @Value("${app.rate-limit.contact.max-attempts:5}")
    private int contactMaxAttempts;

    @Value("${app.rate-limit.contact.window-minutes:60}")
    private int contactWindowMinutes;

    @Value("${app.rate-limit.testimonial.max-attempts:3}")
    private int testimonialMaxAttempts;

    @Value("${app.rate-limit.testimonial.window-minutes:60}")
    private int testimonialWindowMinutes;

    private record AttemptRecord(int count, LocalDateTime windowStart) {}

    private final Map<String, AttemptRecord> loginAttempts = new ConcurrentHashMap<>();
    private final Map<String, AttemptRecord> contactAttempts = new ConcurrentHashMap<>();
    private final Map<String, AttemptRecord> testimonialAttempts = new ConcurrentHashMap<>();
    private final AtomicInteger requestCounter = new AtomicInteger(0);
    private static final int PRUNE_EVERY = 1000;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String method = request.getMethod();
        String uri = request.getRequestURI();

        if ("POST".equals(method) && uri.endsWith("/api/auth/login")) {
            String ip = getClientIp(request);
            pruneIfNeeded(loginAttempts, loginWindowMinutes);
            if (isRateLimited(ip, loginAttempts, loginMaxAttempts, loginWindowMinutes)) {
                log.warn("Login rate limit exceeded for IP: {}", ip);
                writeRateLimitResponse(response);
                return;
            }
        } else if ("POST".equals(method) && uri.endsWith("/api/public/contact")) {
            String ip = getClientIp(request);
            pruneIfNeeded(contactAttempts, contactWindowMinutes);
            if (isRateLimited(ip, contactAttempts, contactMaxAttempts, contactWindowMinutes)) {
                log.warn("Contact rate limit exceeded for IP: {}", ip);
                writeRateLimitResponse(response);
                return;
            }
        } else if ("POST".equals(method) && uri.endsWith("/api/public/testimonials")) {
            String ip = getClientIp(request);
            pruneIfNeeded(testimonialAttempts, testimonialWindowMinutes);
            if (isRateLimited(ip, testimonialAttempts, testimonialMaxAttempts, testimonialWindowMinutes)) {
                log.warn("Testimonial rate limit exceeded for IP: {}", ip);
                writeRateLimitResponse(response);
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isRateLimited(String ip, Map<String, AttemptRecord> attempts, int max, int windowMinutes) {
        LocalDateTime now = LocalDateTime.now();
        AttemptRecord record = attempts.get(ip);

        if (record == null || now.isAfter(record.windowStart().plusMinutes(windowMinutes))) {
            attempts.put(ip, new AttemptRecord(1, now));
            return false;
        }

        if (record.count() >= max) {
            return true;
        }

        attempts.put(ip, new AttemptRecord(record.count() + 1, record.windowStart()));
        return false;
    }

    private void pruneIfNeeded(Map<String, AttemptRecord> map, int windowMinutes) {
        if (requestCounter.incrementAndGet() % PRUNE_EVERY == 0) {
            LocalDateTime cutoff = LocalDateTime.now().minusMinutes(windowMinutes);
            map.entrySet().removeIf(e -> e.getValue().windowStart().isBefore(cutoff));
        }
    }

    private void writeRateLimitResponse(HttpServletResponse response) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType("application/json");
        response.getWriter().write("{\"success\":false,\"message\":\"Too many requests. Please try again later.\"}");
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            String[] parts = xForwardedFor.split(",");
            if (parts.length > 0) return parts[0].trim();
        }
        return request.getRemoteAddr();
    }
}
