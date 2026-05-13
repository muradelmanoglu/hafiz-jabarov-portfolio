package com.hafiz.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ProjectRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private List<String> technologies;
    private String githubUrl;
    private String liveUrl;
    private String imageUrl;
    private boolean featured;
    private LocalDate completedAt;
    private int displayOrder;
}
