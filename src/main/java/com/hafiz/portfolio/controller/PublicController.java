package com.hafiz.portfolio.controller;

import com.hafiz.portfolio.dto.request.ContactSubmissionRequest;
import com.hafiz.portfolio.dto.response.ApiResponse;
import com.hafiz.portfolio.entity.*;
import com.hafiz.portfolio.service.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final CaseStudyService caseStudyService;
    private final PortfolioServiceService portfolioServiceService;
    private final SkillService skillService;
    private final ExperienceService experienceService;
    private final EducationService educationService;
    private final TestimonialService testimonialService;
    private final FAQService faqService;
    private final SiteSettingsService siteSettingsService;
    private final ContactSubmissionService contactSubmissionService;
    private final CompanyService companyService;

    // ─── Site Settings ───────────────────────────────────────────────────────

    @GetMapping("/settings")
    public ResponseEntity<ApiResponse<SiteSettings>> getSettings() {
        return ResponseEntity.ok(ApiResponse.success(siteSettingsService.get()));
    }

    // ─── Case Studies ────────────────────────────────────────────────────────

    @GetMapping("/case-studies")
    public ResponseEntity<ApiResponse<List<CaseStudy>>> getCaseStudies() {
        return ResponseEntity.ok(ApiResponse.success(caseStudyService.getAllPublished()));
    }

    @GetMapping("/case-studies/featured")
    public ResponseEntity<ApiResponse<List<CaseStudy>>> getFeaturedCaseStudies() {
        return ResponseEntity.ok(ApiResponse.success(caseStudyService.getFeatured()));
    }

    @GetMapping("/case-studies/{slug}")
    public ResponseEntity<ApiResponse<CaseStudy>> getCaseStudy(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(caseStudyService.getBySlug(slug)));
    }

    // ─── Services ────────────────────────────────────────────────────────────

    @GetMapping("/services")
    public ResponseEntity<ApiResponse<List<Service>>> getServices() {
        return ResponseEntity.ok(ApiResponse.success(portfolioServiceService.getAllPublished()));
    }

    // ─── Skills ──────────────────────────────────────────────────────────────

    @GetMapping("/skills")
    public ResponseEntity<ApiResponse<List<Skill>>> getSkills() {
        return ResponseEntity.ok(ApiResponse.success(skillService.getAll()));
    }

    // ─── Experience ──────────────────────────────────────────────────────────

    @GetMapping("/experience")
    public ResponseEntity<ApiResponse<List<Experience>>> getExperience() {
        return ResponseEntity.ok(ApiResponse.success(experienceService.getAll()));
    }

    // ─── Education ───────────────────────────────────────────────────────────

    @GetMapping("/education")
    public ResponseEntity<ApiResponse<List<Education>>> getEducation() {
        return ResponseEntity.ok(ApiResponse.success(educationService.getAll()));
    }

    // ─── Testimonials ────────────────────────────────────────────────────────

    @GetMapping("/testimonials")
    public ResponseEntity<ApiResponse<List<Testimonial>>> getTestimonials() {
        return ResponseEntity.ok(ApiResponse.success(testimonialService.getApproved()));
    }

    @GetMapping("/testimonials/featured")
    public ResponseEntity<ApiResponse<Testimonial>> getFeaturedTestimonial() {
        return testimonialService.getFeatured()
                .map(t -> ResponseEntity.ok(ApiResponse.success(t)))
                .orElse(ResponseEntity.ok(ApiResponse.success(null)));
    }

    // ─── FAQs ────────────────────────────────────────────────────────────────

    @GetMapping("/faqs")
    public ResponseEntity<ApiResponse<List<FAQ>>> getFAQs(
            @RequestParam(required = false) FAQ.Page page) {
        List<FAQ> faqs = page != null ? faqService.getByPage(page) : faqService.getAll();
        return ResponseEntity.ok(ApiResponse.success(faqs));
    }

    // ─── Companies ───────────────────────────────────────────────────────────

    @GetMapping("/companies")
    public ResponseEntity<ApiResponse<List<Company>>> getCompanies() {
        return ResponseEntity.ok(ApiResponse.success(companyService.getAll()));
    }

    // ─── Contact ─────────────────────────────────────────────────────────────

    @PostMapping("/contact")
    public ResponseEntity<ApiResponse<Void>> submitContact(
            @Valid @RequestBody ContactSubmissionRequest request,
            HttpServletRequest httpRequest) {
        contactSubmissionService.submit(request, httpRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Your message has been sent successfully!"));
    }
}
