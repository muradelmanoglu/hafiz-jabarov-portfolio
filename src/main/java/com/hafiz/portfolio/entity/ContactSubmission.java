package com.hafiz.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "contact_submissions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ContactSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    private String company;

    @Column(nullable = false)
    private String projectType;

    private String budgetRange;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime submittedAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.NEW;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private String ipAddress;
    private String userAgent;
    private String referrer;

    public enum Status {
        NEW, READ, REPLIED, SPAM, ARCHIVED
    }
}
