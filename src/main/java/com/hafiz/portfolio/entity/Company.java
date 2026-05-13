package com.hafiz.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "companies")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String location;
    private String logoUrl;
    private String logoDarkUrl;
    private String website;

    @Column(columnDefinition = "TEXT")
    private String description;
}
