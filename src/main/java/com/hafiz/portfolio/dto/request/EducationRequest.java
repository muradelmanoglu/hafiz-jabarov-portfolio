package com.hafiz.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
public class EducationRequest {

    @NotBlank
    private String institution;

    private String location;

    @NotBlank
    private String program;

    @NotNull
    private LocalDate startDate;

    private LocalDate endDate;
    private List<String> bullets;
    private int orderWeight;
    private Map<String, Map<String, Object>> translations;
}
