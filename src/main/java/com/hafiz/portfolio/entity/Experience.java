package com.hafiz.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "experiences")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    private String companyName;

    @Column(nullable = false)
    private String role;

    private String location;

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate endDate;

    @Builder.Default
    private boolean current = false;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @ElementCollection
    @CollectionTable(name = "experience_bullets", joinColumns = @JoinColumn(name = "experience_id"))
    @Column(name = "bullet")
    private List<String> bullets;

    private String companyUrl;

    @Builder.Default
    private int orderWeight = 0;

    @Column(columnDefinition = "TEXT")
    private String translations;
}
