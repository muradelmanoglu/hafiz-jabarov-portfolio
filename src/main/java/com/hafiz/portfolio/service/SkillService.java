package com.hafiz.portfolio.service;

import com.hafiz.portfolio.dto.request.SkillRequest;
import com.hafiz.portfolio.entity.Skill;
import com.hafiz.portfolio.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;

    public List<Skill> getAll() {
        return skillRepository.findAllByOrderByCategoryAscOrderWeightAsc();
    }

    public Skill getById(Long id) {
        return skillRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Skill not found: " + id));
    }

    @Transactional
    public Skill create(SkillRequest req) {
        Skill skill = Skill.builder()
                .name(req.getName())
                .category(req.getCategory())
                .proficiency(req.getProficiency())
                .yearsUsed(req.getYearsUsed())
                .iconUrl(req.getIconUrl())
                .customCategory(req.getCustomCategory())
                .orderWeight(req.getOrderWeight())
                .build();
        return skillRepository.save(skill);
    }

    @Transactional
    public Skill update(Long id, SkillRequest req) {
        Skill skill = getById(id);
        skill.setName(req.getName());
        skill.setCategory(req.getCategory());
        skill.setProficiency(req.getProficiency());
        skill.setYearsUsed(req.getYearsUsed());
        skill.setIconUrl(req.getIconUrl());
        skill.setCustomCategory(req.getCustomCategory());
        skill.setOrderWeight(req.getOrderWeight());
        return skillRepository.save(skill);
    }

    @Transactional
    public void delete(Long id) {
        if (!skillRepository.existsById(id))
            throw new NoSuchElementException("Skill not found: " + id);
        skillRepository.deleteById(id);
    }
}
