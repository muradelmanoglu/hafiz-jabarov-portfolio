package com.hafiz.portfolio.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ContactSubmissionRequest {

    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    private String company;

    @NotBlank
    private String projectType;

    private String budgetRange;

    @Size(max = 30)
    private String phone;

    @NotBlank
    @Size(min = 20, max = 1000)
    private String message;
}
