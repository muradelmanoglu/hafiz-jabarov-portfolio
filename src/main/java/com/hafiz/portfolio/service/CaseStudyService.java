package com.hafiz.portfolio.service;

import com.hafiz.portfolio.dto.request.CaseStudyRequest;
import com.hafiz.portfolio.entity.CaseStudy;
import com.hafiz.portfolio.entity.Company;
import com.hafiz.portfolio.repository.CaseStudyRepository;
import com.hafiz.portfolio.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class CaseStudyService {

    private final CaseStudyRepository caseStudyRepository;
    private final CompanyRepository companyRepository;

    public List<CaseStudy> getAllPublished() {
        return caseStudyRepository.findByStatusOrderByOrderWeightAscPublishedAtDesc(CaseStudy.Status.PUBLISHED);
    }

    public List<CaseStudy> getAll() {
        return caseStudyRepository.findAll();
    }

    public List<CaseStudy> getFeatured() {
        return caseStudyRepository.findByFeaturedTrueAndStatusOrderByOrderWeightAsc(CaseStudy.Status.PUBLISHED);
    }

    public CaseStudy getBySlug(String slug) {
        return caseStudyRepository.findBySlug(slug)
                .orElseThrow(() -> new NoSuchElementException("Case study not found: " + slug));
    }

    public CaseStudy getById(Long id) {
        return caseStudyRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Case study not found: " + id));
    }

    @Transactional
    public CaseStudy create(CaseStudyRequest req) {
        String slug = req.getSlug() != null && !req.getSlug().isBlank()
                ? req.getSlug() : toSlug(req.getTitle());

        CaseStudy cs = CaseStudy.builder()
                .title(req.getTitle())
                .slug(slug)
                .externalUrl(req.getExternalUrl())
                .company(resolveCompany(req.getCompanyId()))
                .role(req.getRole())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .teamSize(req.getTeamSize())
                .thumbnailUrl(req.getThumbnailUrl())
                .heroImageUrl(req.getHeroImageUrl())
                .summary(req.getSummary())
                .problem(req.getProblem())
                .myRole(req.getMyRole())
                .approach(req.getApproach())
                .outcome(req.getOutcome())
                .reflection(req.getReflection())
                .outcomeMetrics(req.getOutcomeMetrics())
                .tools(req.getTools())
                .tags(req.getTags())
                .domain(req.getDomain())
                .featured(req.isFeatured())
                .orderWeight(req.getOrderWeight())
                .status(req.getStatus() != null ? req.getStatus() : CaseStudy.Status.DRAFT)
                .publishedAt(req.getStatus() == CaseStudy.Status.PUBLISHED ? LocalDateTime.now() : null)
                .build();
        return caseStudyRepository.save(cs);
    }

    @Transactional
    public CaseStudy update(Long id, CaseStudyRequest req) {
        CaseStudy cs = getById(id);
        cs.setTitle(req.getTitle());
        if (req.getSlug() != null && !req.getSlug().isBlank()) cs.setSlug(req.getSlug());
        cs.setExternalUrl(req.getExternalUrl());
        cs.setCompany(resolveCompany(req.getCompanyId()));
        cs.setRole(req.getRole());
        cs.setStartDate(req.getStartDate());
        cs.setEndDate(req.getEndDate());
        cs.setTeamSize(req.getTeamSize());
        cs.setThumbnailUrl(req.getThumbnailUrl());
        cs.setHeroImageUrl(req.getHeroImageUrl());
        cs.setSummary(req.getSummary());
        cs.setProblem(req.getProblem());
        cs.setMyRole(req.getMyRole());
        cs.setApproach(req.getApproach());
        cs.setOutcome(req.getOutcome());
        cs.setReflection(req.getReflection());
        cs.setOutcomeMetrics(req.getOutcomeMetrics());
        cs.setTools(req.getTools());
        cs.setTags(req.getTags());
        cs.setDomain(req.getDomain());
        cs.setFeatured(req.isFeatured());
        cs.setOrderWeight(req.getOrderWeight());
        if (req.getStatus() != null) {
            if (req.getStatus() == CaseStudy.Status.PUBLISHED && cs.getPublishedAt() == null) {
                cs.setPublishedAt(LocalDateTime.now());
            }
            cs.setStatus(req.getStatus());
        }
        return caseStudyRepository.save(cs);
    }

    @Transactional
    public void delete(Long id) {
        if (!caseStudyRepository.existsById(id))
            throw new NoSuchElementException("Case study not found: " + id);
        caseStudyRepository.deleteById(id);
    }

    private Company resolveCompany(Long companyId) {
        if (companyId == null) return null;
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new NoSuchElementException("Company not found: " + companyId));
    }

    private String toSlug(String text) {
        String slug = Normalizer.normalize(text, Normalizer.Form.NFD)
                .replaceAll("[^\\p{ASCII}]", "")
                .toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .trim()
                .replaceAll("\\s+", "-");
        if (caseStudyRepository.existsBySlug(slug)) {
            slug = slug + "-" + System.currentTimeMillis();
        }
        return slug;
    }
}
