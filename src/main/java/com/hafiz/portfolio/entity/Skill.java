package com.hafiz.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skills")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Category category;

    @Enumerated(EnumType.STRING)
    private Proficiency proficiency;

    private Integer yearsUsed;
    private String iconUrl;

    private String customCategory;

    @Builder.Default
    private int orderWeight = 0;

    public enum Category {
        PROJECT_MANAGEMENT, DOCUMENTATION, ANALYTICS, DESIGN, SEO, TOOLS, OTHER
    }

    public enum Proficiency {
        FAMILIAR, PROFICIENT, EXPERT
    }
}
