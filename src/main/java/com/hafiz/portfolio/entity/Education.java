package com.hafiz.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "education")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String institution;

    private String location;

    @Column(nullable = false)
    private String program;

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate endDate;

    @ElementCollection
    @CollectionTable(name = "education_bullets", joinColumns = @JoinColumn(name = "education_id"))
    @Column(name = "bullet")
    private List<String> bullets;

    @Builder.Default
    private int orderWeight = 0;

    @Column(columnDefinition = "TEXT")
    private String translations;
}
