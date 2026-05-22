package com.hafiz.portfolio.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SchemaMigration {

    private final JdbcTemplate jdbcTemplate;

    @EventListener(ApplicationReadyEvent.class)
    public void runMigrations() {
        dropConstraintIfExists("contact_submissions", "contact_submissions_budget_range_check");
        dropConstraintIfExists("contact_submissions", "contact_submissions_project_type_check");
    }

    private void dropConstraintIfExists(String table, String constraint) {
        try {
            int count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM information_schema.table_constraints " +
                "WHERE table_name = ? AND constraint_name = ?",
                Integer.class, table, constraint
            );
            if (count != null && count > 0) {
                jdbcTemplate.execute(
                    "ALTER TABLE " + table + " DROP CONSTRAINT IF EXISTS " + constraint
                );
                log.info("Dropped constraint {} from {}", constraint, table);
            }
        } catch (Exception e) {
            log.warn("Could not drop constraint {} from {}: {}", constraint, table, e.getMessage());
        }
    }
}
