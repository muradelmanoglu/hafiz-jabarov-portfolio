package com.hafiz.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "services")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    private String icon;

    private String category;

    @Column(nullable = false, length = 120)
    private String shortDescription;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String longDescription;

    @ElementCollection
    @CollectionTable(name = "service_deliverables", joinColumns = @JoinColumn(name = "service_id"))
    @Column(name = "deliverable")
    private List<String> deliverables;

    @Column(nullable = false)
    private String engagementDuration;

    private String startingRate;

    @Builder.Default
    private boolean startingRateVisible = false;

    @Column(nullable = false)
    private String ctaText;

    @Builder.Default
    private int orderWeight = 0;

    @Builder.Default
    private boolean featured = false;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.PUBLISHED;

    public enum Status {
        DRAFT, PUBLISHED, ARCHIVED
    }
}
