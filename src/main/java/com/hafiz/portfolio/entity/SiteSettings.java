package com.hafiz.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "site_settings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SiteSettings {

    @Id
    @Builder.Default
    private Long id = 1L;

    @Column(nullable = false)
    private String siteTitle;

    @Column(nullable = false)
    private String tagline;

    @Column(nullable = false)
    private String heroHeadline;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String heroSubheadline;

    @Column(length = 160, nullable = false)
    private String metaDescription;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Availability availability = Availability.AVAILABLE;

    private String availabilityMessage;

    @Builder.Default
    private LocalDateTime availabilityUpdatedAt = LocalDateTime.now();

    @Column(nullable = false)
    private String email;

    private String phone;

    @Builder.Default
    private boolean phoneVisible = false;

    @Column(nullable = false)
    private String linkedIn;

    private String github;
    private String calendly;
    private String twitter;
    private String instagram;
    @Column(columnDefinition = "TEXT")
    private String resumeUrl;

    @Column(columnDefinition = "TEXT")
    private String contactProjectTypesJson;

    @Column(columnDefinition = "TEXT")
    private String contactBudgetRangesJson;

    @Column(columnDefinition = "TEXT")
    private String logoUrl;

    @Column(columnDefinition = "TEXT")
    private String faviconUrl;

    @Column(columnDefinition = "TEXT")
    private String defaultOgImageUrl;

    private String copyrightText;
    private String colophonText;

    @Column(columnDefinition = "TEXT")
    private String customSocialLinksJson;

    @Column(columnDefinition = "TEXT")
    private String settingsTranslationsJson;

    @Column(columnDefinition = "TEXT")
    private String aboutTranslationsJson;

    @Column(columnDefinition = "TEXT")
    private String aboutHeading;

    @Column(columnDefinition = "TEXT")
    private String aboutP1;

    @Column(columnDefinition = "TEXT")
    private String aboutP2;

    @Column(columnDefinition = "TEXT")
    private String aboutP3;

    @ElementCollection
    @CollectionTable(name = "site_headline_metrics", joinColumns = @JoinColumn(name = "site_settings_id"))
    private List<HeadlineMetric> headlineMetrics;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        this.availabilityUpdatedAt = LocalDateTime.now();
    }

    public enum Availability {
        AVAILABLE, SELECTIVE, CLOSED
    }

    @Embeddable
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class HeadlineMetric {
        private String value;
        private String label;
        private String context;
    }
}
