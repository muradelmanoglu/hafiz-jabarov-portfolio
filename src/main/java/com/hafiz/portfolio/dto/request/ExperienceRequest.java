package com.hafiz.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
public class ExperienceRequest {

    private Long companyId;
    private String companyName;

    @NotBlank
    private String role;

    private String location;

    @NotNull
    private LocalDate startDate;

    private LocalDate endDate;
    private boolean current;
    private String summary;
    private List<String> bullets;
    private String companyUrl;
    private int orderWeight;
    private Map<String, Map<String, Object>> translations;
}
