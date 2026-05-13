package com.hafiz.portfolio.dto.request;

import com.hafiz.portfolio.entity.Skill;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SkillRequest {

    @NotBlank
    private String name;

    @NotNull
    private Skill.Category category;

    private Skill.Proficiency proficiency;
    private Integer yearsUsed;
    private String iconUrl;
    private int orderWeight;
}
