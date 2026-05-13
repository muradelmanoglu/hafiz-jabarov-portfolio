package com.hafiz.portfolio.dto.request;

import com.hafiz.portfolio.entity.ContactSubmission;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotNull
    private ContactSubmission.ProjectType projectType;

    private ContactSubmission.BudgetRange budgetRange;

    @NotBlank
    @Size(min = 20, max = 1000)
    private String message;
}
