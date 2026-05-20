package com.hafiz.portfolio.service;

import com.hafiz.portfolio.entity.ContactSubmission;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.email.notification-to}")
    private String notificationTo;

    @Value("${app.email.from}")
    private String fromAddress;

    @Async
    public void sendNewSubmissionNotification(ContactSubmission sub) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(fromAddress);
            msg.setTo(notificationTo);
            msg.setSubject("New contact form submission from " + sub.getName());
            msg.setText(buildNotificationText(sub));
            mailSender.send(msg);
            log.info("Notification email sent for submission id={}", sub.getId());
        } catch (Exception e) {
            log.error("Failed to send notification email for submission id={}: {}", sub.getId(), e.getMessage());
        }
    }

    private String buildNotificationText(ContactSubmission sub) {
        return """
                New contact form submission received:

                Name:         %s
                Email:        %s
                Company:      %s
                Project Type: %s
                Budget Range: %s

                Message:
                %s

                ---
                Submitted at: %s
                IP Address:   %s
                """.formatted(
                sub.getName(),
                sub.getEmail(),
                sub.getCompany() != null ? sub.getCompany() : "—",
                sub.getProjectType(),
                sub.getBudgetRange() != null ? sub.getBudgetRange() : "—",
                sub.getMessage(),
                sub.getSubmittedAt(),
                sub.getIpAddress()
        );
    }
}
