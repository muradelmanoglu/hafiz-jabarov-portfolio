package com.hafiz.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PublicTestimonialRequest {

    @NotBlank
    @Size(min = 20, max = 1000)
    private String quote;

    @NotBlank
    @Size(max = 100)
    private String authorName;

    @NotBlank
    @Size(max = 100)
    private String authorTitle;

    @Size(max = 100)
    private String authorCompany;

    @Size(max = 255)
    private String linkedIn;
}
