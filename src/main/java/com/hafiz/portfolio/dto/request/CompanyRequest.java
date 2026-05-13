package com.hafiz.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CompanyRequest {

    @NotBlank
    private String name;

    private String location;
    private String logoUrl;
    private String logoDarkUrl;
    private String website;
    private String description;
}
