package com.hafiz.portfolio.dto.request;

import com.hafiz.portfolio.entity.FAQ;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class FAQRequest {

    @NotBlank
    private String question;

    @NotBlank
    private String answer;

    @NotNull
    private FAQ.Category category;

    private int orderWeight;
    private List<FAQ.Page> visibleOn;
}
