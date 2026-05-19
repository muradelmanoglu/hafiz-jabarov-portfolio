package com.hafiz.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "case_studies")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CaseStudy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    private String externalUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate endDate;
    private Integer teamSize;
    private String thumbnailUrl;
    private String heroImageUrl;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String summary;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String problem;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String myRole;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String approach;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String outcome;

    @Column(columnDefinition = "TEXT")
    private String reflection;

    @ElementCollection
    @CollectionTable(name = "case_study_outcome_metrics", joinColumns = @JoinColumn(name = "case_study_id"))
    private List<Metric> outcomeMetrics;

    @ElementCollection
    @CollectionTable(name = "case_study_tools", joinColumns = @JoinColumn(name = "case_study_id"))
    @Column(name = "tool")
    private List<String> tools;

    @ElementCollection
    @CollectionTable(name = "case_study_tags", joinColumns = @JoinColumn(name = "case_study_id"))
    @Column(name = "tag")
    private List<String> tags;

    @Column(nullable = false)
    private String domain;

    @Builder.Default
    private boolean featured = false;

    @Builder.Default
    private int orderWeight = 0;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.DRAFT;

    private LocalDateTime publishedAt;

    @Column(columnDefinition = "TEXT")
    private String translations;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum Status {
        DRAFT, PUBLISHED, ARCHIVED
    }

    @Embeddable
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class Metric {
        private String value;
        private String label;
        private String context;
    }
}
