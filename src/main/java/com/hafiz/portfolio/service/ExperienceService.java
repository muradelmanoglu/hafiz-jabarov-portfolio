package com.hafiz.portfolio.service;

import com.hafiz.portfolio.dto.request.ExperienceRequest;
import com.hafiz.portfolio.entity.Company;
import com.hafiz.portfolio.entity.Experience;
import com.hafiz.portfolio.repository.CompanyRepository;
import com.hafiz.portfolio.repository.ExperienceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ExperienceService {

    private final ExperienceRepository experienceRepository;
    private final CompanyRepository companyRepository;

    public List<Experience> getAll() {
        return experienceRepository.findAllByOrderByOrderWeightAscStartDateDesc();
    }

    public Experience getById(Long id) {
        return experienceRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Experience not found: " + id));
    }

    @Transactional
    public Experience create(ExperienceRequest req) {
        Experience e = Experience.builder()
                .company(resolveCompany(req.getCompanyId()))
                .companyName(req.getCompanyName())
                .role(req.getRole())
                .location(req.getLocation())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .current(req.isCurrent())
                .summary(req.getSummary())
                .bullets(req.getBullets())
                .companyUrl(req.getCompanyUrl())
                .orderWeight(req.getOrderWeight())
                .build();
        return experienceRepository.save(e);
    }

    @Transactional
    public Experience update(Long id, ExperienceRequest req) {
        Experience e = getById(id);
        e.setCompany(resolveCompany(req.getCompanyId()));
        e.setCompanyName(req.getCompanyName());
        e.setRole(req.getRole());
        e.setLocation(req.getLocation());
        e.setStartDate(req.getStartDate());
        e.setEndDate(req.getEndDate());
        e.setCurrent(req.isCurrent());
        e.setSummary(req.getSummary());
        e.setBullets(req.getBullets());
        e.setCompanyUrl(req.getCompanyUrl());
        e.setOrderWeight(req.getOrderWeight());
        return experienceRepository.save(e);
    }

    @Transactional
    public void delete(Long id) {
        if (!experienceRepository.existsById(id))
            throw new NoSuchElementException("Experience not found: " + id);
        experienceRepository.deleteById(id);
    }

    private Company resolveCompany(Long companyId) {
        if (companyId == null) return null;
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new NoSuchElementException("Company not found: " + companyId));
    }
}
