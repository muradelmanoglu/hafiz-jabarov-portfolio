package com.hafiz.portfolio.repository;

import com.hafiz.portfolio.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findAllByOrderByCategoryAscOrderWeightAsc();
    List<Skill> findByCategoryOrderByOrderWeightAsc(Skill.Category category);
}
