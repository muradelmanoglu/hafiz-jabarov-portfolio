package com.hafiz.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "uploaded_files")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UploadedFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String originalName;

    @Column(nullable = false)
    private String contentType;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String base64Data;

    @Builder.Default
    private LocalDateTime uploadedAt = LocalDateTime.now();
}
