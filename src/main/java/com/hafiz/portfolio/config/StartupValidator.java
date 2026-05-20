package com.hafiz.portfolio.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class StartupValidator implements ApplicationRunner {

    @Value("${spring.datasource.password}")
    private String dbPassword;

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.admin.default-password}")
    private String adminPassword;

    @Override
    public void run(ApplicationArguments args) {
        if ("2005".equals(dbPassword)) {
            log.warn("SECURITY WARNING: Default database password is in use. Set DB_PASSWORD env var before deploying to production.");
        }
        if ("changeme123!".equals(adminPassword)) {
            log.warn("SECURITY WARNING: Default admin password is in use. Set ADMIN_PASSWORD env var before deploying to production.");
        }
        if (jwtSecret.startsWith("X7fK2mP9")) {
            log.warn("SECURITY WARNING: Default JWT secret is in use. Set JWT_SECRET env var before deploying to production.");
        }
    }
}
