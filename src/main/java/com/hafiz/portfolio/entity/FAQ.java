package com.hafiz.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "faqs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FAQ {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String question;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String answer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Builder.Default
    private int orderWeight = 0;

    @ElementCollection
    @CollectionTable(name = "faq_visible_on", joinColumns = @JoinColumn(name = "faq_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "page")
    private List<Page> visibleOn;

    @Column(columnDefinition = "TEXT")
    private String translations;

    public enum Category {
        GENERAL, SERVICES, PROCESS, PRICING
    }

    public enum Page {
        HOME, SERVICES, CONTACT
    }
}
