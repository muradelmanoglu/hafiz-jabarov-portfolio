package com.hafiz.portfolio.dto.request;

import com.hafiz.portfolio.entity.CaseStudy;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
public class CaseStudyRequest {

    @NotBlank
    private String title;

    private String slug;
    private String externalUrl;
    private Long companyId;

    @NotBlank
    private String role;

    @NotNull
    private LocalDate startDate;

    private LocalDate endDate;
    private Integer teamSize;
    private String thumbnailUrl;
    private String heroImageUrl;

    @NotBlank
    private String summary;

    @NotBlank
    private String problem;

    @NotBlank
    private String myRole;

    @NotBlank
    private String approach;

    @NotBlank
    private String outcome;

    private String reflection;
    private List<CaseStudy.Metric> outcomeMetrics;
    private List<String> tools;
    private List<String> tags;

    @NotBlank
    private String domain;

    private boolean featured;
    private int orderWeight;
    private CaseStudy.Status status;
    private Map<String, Map<String, Object>> translations;
}
