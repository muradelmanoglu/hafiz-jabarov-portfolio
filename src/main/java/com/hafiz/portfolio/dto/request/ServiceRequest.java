package com.hafiz.portfolio.dto.request;

import com.hafiz.portfolio.entity.Service;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class ServiceRequest {

    @NotBlank
    private String title;

    private String slug;

    private String icon;

    private String category;

    @NotBlank
    @Size(max = 120)
    private String shortDescription;

    @NotBlank
    private String longDescription;

    private List<String> deliverables;

    @NotBlank
    private String engagementDuration;

    private String startingRate;
    private boolean startingRateVisible;

    @NotBlank
    private String ctaText;

    private int orderWeight;
    private boolean featured;
    private Service.Status status;
    private Map<String, Map<String, Object>> translations;
}
