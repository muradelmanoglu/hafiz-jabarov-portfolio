package com.hafiz.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TestimonialRequest {

    @NotBlank
    private String quote;

    @NotBlank
    private String authorName;

    @NotBlank
    private String authorTitle;

    private String authorCompany;
    private String authorPhotoUrl;
    private String linkedIn;

    @NotNull
    private LocalDate dateReceived;

    private boolean approved;
    private boolean featured;
    private int orderWeight;
}
