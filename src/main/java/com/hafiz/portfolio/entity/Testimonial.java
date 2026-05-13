package com.hafiz.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "testimonials")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Testimonial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String quote;

    @Column(nullable = false)
    private String authorName;

    @Column(nullable = false)
    private String authorTitle;

    private String authorCompany;
    private String authorPhotoUrl;
    private String linkedIn;

    @Column(nullable = false)
    private LocalDate dateReceived;

    @Builder.Default
    private boolean approved = false;

    @Builder.Default
    private boolean featured = false;

    @Builder.Default
    private int orderWeight = 0;
}
