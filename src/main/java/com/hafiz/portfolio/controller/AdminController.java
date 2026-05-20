package com.hafiz.portfolio.controller;

import com.hafiz.portfolio.dto.request.*;
import com.hafiz.portfolio.dto.response.ApiResponse;
import com.hafiz.portfolio.entity.*;
import com.hafiz.portfolio.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final CaseStudyService caseStudyService;
    private final PortfolioServiceService portfolioServiceService;
    private final SkillService skillService;
    private final ExperienceService experienceService;
    private final EducationService educationService;
    private final TestimonialService testimonialService;
    private final FAQService faqService;
    private final CompanyService companyService;
    private final SiteSettingsService siteSettingsService;
    private final ContactSubmissionService contactSubmissionService;

    // ─── Dashboard Stats ─────────────────────────────────────────────────────

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        Map<String, Object> stats = Map.of(
                "newSubmissions", contactSubmissionService.countNew(),
                "totalCaseStudies", caseStudyService.getAll().size(),
                "totalServices", portfolioServiceService.getAll().size(),
                "totalSkills", skillService.getAll().size(),
                "totalExperience", experienceService.getAll().size(),
                "totalTestimonials", testimonialService.getAll().size(),
                "totalCompanies", companyService.getAll().size()
        );
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // ─── Case Studies ─────────────────────────────────────────────────────────

    @GetMapping("/case-studies")
    public ResponseEntity<ApiResponse<List<CaseStudy>>> getAllCaseStudies() {
        return ResponseEntity.ok(ApiResponse.success(caseStudyService.getAll()));
    }

    @GetMapping("/case-studies/{id}")
    public ResponseEntity<ApiResponse<CaseStudy>> getCaseStudy(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(caseStudyService.getById(id)));
    }

    @PostMapping("/case-studies")
    public ResponseEntity<ApiResponse<CaseStudy>> createCaseStudy(@Valid @RequestBody CaseStudyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Case study created", caseStudyService.create(request)));
    }

    @PutMapping("/case-studies/{id}")
    public ResponseEntity<ApiResponse<CaseStudy>> updateCaseStudy(@PathVariable Long id,
                                                                    @Valid @RequestBody CaseStudyRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Case study updated", caseStudyService.update(id, request)));
    }

    @DeleteMapping("/case-studies/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCaseStudy(@PathVariable Long id) {
        caseStudyService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Case study deleted"));
    }

    // ─── Services ─────────────────────────────────────────────────────────────

    @GetMapping("/services")
    public ResponseEntity<ApiResponse<List<Service>>> getAllServices() {
        return ResponseEntity.ok(ApiResponse.success(portfolioServiceService.getAll()));
    }

    @GetMapping("/services/{id}")
    public ResponseEntity<ApiResponse<Service>> getService(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(portfolioServiceService.getById(id)));
    }

    @PostMapping("/services")
    public ResponseEntity<ApiResponse<Service>> createService(@Valid @RequestBody ServiceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Service created", portfolioServiceService.create(request)));
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<ApiResponse<Service>> updateService(@PathVariable Long id,
                                                               @Valid @RequestBody ServiceRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Service updated", portfolioServiceService.update(id, request)));
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteService(@PathVariable Long id) {
        portfolioServiceService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Service deleted"));
    }

    // ─── Skills ───────────────────────────────────────────────────────────────

    @GetMapping("/skills")
    public ResponseEntity<ApiResponse<List<Skill>>> getAllSkills() {
        return ResponseEntity.ok(ApiResponse.success(skillService.getAll()));
    }

    @PostMapping("/skills")
    public ResponseEntity<ApiResponse<Skill>> createSkill(@Valid @RequestBody SkillRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Skill created", skillService.create(request)));
    }

    @PutMapping("/skills/{id}")
    public ResponseEntity<ApiResponse<Skill>> updateSkill(@PathVariable Long id,
                                                           @Valid @RequestBody SkillRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Skill updated", skillService.update(id, request)));
    }

    @DeleteMapping("/skills/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSkill(@PathVariable Long id) {
        skillService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Skill deleted"));
    }

    // ─── Experience ───────────────────────────────────────────────────────────

    @GetMapping("/experience")
    public ResponseEntity<ApiResponse<List<Experience>>> getAllExperience() {
        return ResponseEntity.ok(ApiResponse.success(experienceService.getAll()));
    }

    @PostMapping("/experience")
    public ResponseEntity<ApiResponse<Experience>> createExperience(@Valid @RequestBody ExperienceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Experience created", experienceService.create(request)));
    }

    @PutMapping("/experience/{id}")
    public ResponseEntity<ApiResponse<Experience>> updateExperience(@PathVariable Long id,
                                                                     @Valid @RequestBody ExperienceRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Experience updated", experienceService.update(id, request)));
    }

    @DeleteMapping("/experience/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExperience(@PathVariable Long id) {
        experienceService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Experience deleted"));
    }

    // ─── Education ────────────────────────────────────────────────────────────

    @GetMapping("/education")
    public ResponseEntity<ApiResponse<List<Education>>> getAllEducation() {
        return ResponseEntity.ok(ApiResponse.success(educationService.getAll()));
    }

    @PostMapping("/education")
    public ResponseEntity<ApiResponse<Education>> createEducation(@Valid @RequestBody EducationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Education created", educationService.create(request)));
    }

    @PutMapping("/education/{id}")
    public ResponseEntity<ApiResponse<Education>> updateEducation(@PathVariable Long id,
                                                                   @Valid @RequestBody EducationRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Education updated", educationService.update(id, request)));
    }

    @DeleteMapping("/education/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEducation(@PathVariable Long id) {
        educationService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Education deleted"));
    }

    // ─── Testimonials ─────────────────────────────────────────────────────────

    @GetMapping("/testimonials")
    public ResponseEntity<ApiResponse<List<Testimonial>>> getAllTestimonials() {
        return ResponseEntity.ok(ApiResponse.success(testimonialService.getAll()));
    }

    @PostMapping("/testimonials")
    public ResponseEntity<ApiResponse<Testimonial>> createTestimonial(@Valid @RequestBody TestimonialRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Testimonial created", testimonialService.create(request)));
    }

    @PutMapping("/testimonials/{id}")
    public ResponseEntity<ApiResponse<Testimonial>> updateTestimonial(@PathVariable Long id,
                                                                        @Valid @RequestBody TestimonialRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Testimonial updated", testimonialService.update(id, request)));
    }

    @PatchMapping("/testimonials/{id}/approve")
    public ResponseEntity<ApiResponse<Testimonial>> approveTestimonial(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Testimonial approved", testimonialService.approve(id)));
    }

    @DeleteMapping("/testimonials/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTestimonial(@PathVariable Long id) {
        testimonialService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Testimonial deleted"));
    }

    // ─── FAQs ─────────────────────────────────────────────────────────────────

    @GetMapping("/faqs")
    public ResponseEntity<ApiResponse<List<FAQ>>> getAllFAQs() {
        return ResponseEntity.ok(ApiResponse.success(faqService.getAll()));
    }

    @PostMapping("/faqs")
    public ResponseEntity<ApiResponse<FAQ>> createFAQ(@Valid @RequestBody FAQRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("FAQ created", faqService.create(request)));
    }

    @PutMapping("/faqs/{id}")
    public ResponseEntity<ApiResponse<FAQ>> updateFAQ(@PathVariable Long id,
                                                       @Valid @RequestBody FAQRequest request) {
        return ResponseEntity.ok(ApiResponse.success("FAQ updated", faqService.update(id, request)));
    }

    @DeleteMapping("/faqs/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFAQ(@PathVariable Long id) {
        faqService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("FAQ deleted"));
    }

    // ─── Companies ────────────────────────────────────────────────────────────

    @GetMapping("/companies")
    public ResponseEntity<ApiResponse<List<Company>>> getAllCompanies() {
        return ResponseEntity.ok(ApiResponse.success(companyService.getAll()));
    }

    @GetMapping("/companies/{id}")
    public ResponseEntity<ApiResponse<Company>> getCompany(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(companyService.getById(id)));
    }

    @PostMapping("/companies")
    public ResponseEntity<ApiResponse<Company>> createCompany(@Valid @RequestBody CompanyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Company created", companyService.create(request)));
    }

    @PutMapping("/companies/{id}")
    public ResponseEntity<ApiResponse<Company>> updateCompany(@PathVariable Long id,
                                                               @Valid @RequestBody CompanyRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Company updated", companyService.update(id, request)));
    }

    @DeleteMapping("/companies/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCompany(@PathVariable Long id) {
        companyService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Company deleted"));
    }

    // ─── Site Settings ────────────────────────────────────────────────────────

    @GetMapping("/settings")
    public ResponseEntity<ApiResponse<SiteSettings>> getSettings() {
        return ResponseEntity.ok(ApiResponse.success(siteSettingsService.get()));
    }

    @PutMapping("/settings")
    public ResponseEntity<ApiResponse<SiteSettings>> updateSettings(@Valid @RequestBody SiteSettingsRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Settings updated", siteSettingsService.update(request)));
    }

    // ─── Contact Submissions ──────────────────────────────────────────────────

    @GetMapping("/submissions")
    public ResponseEntity<ApiResponse<Page<ContactSubmission>>> getSubmissions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) ContactSubmission.Status status) {

        PageRequest pageable = PageRequest.of(page, size, Sort.by("submittedAt").descending());
        Page<ContactSubmission> result = status != null
                ? contactSubmissionService.getByStatus(status, pageable)
                : contactSubmissionService.getAll(pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/submissions/{id}")
    public ResponseEntity<ApiResponse<ContactSubmission>> getSubmission(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(contactSubmissionService.getById(id)));
    }

    @PatchMapping("/submissions/{id}/status")
    public ResponseEntity<ApiResponse<ContactSubmission>> updateSubmissionStatus(
            @PathVariable Long id,
            @RequestParam ContactSubmission.Status status) {
        return ResponseEntity.ok(ApiResponse.success("Status updated",
                contactSubmissionService.updateStatus(id, status)));
    }

    @PatchMapping("/submissions/{id}/note")
    public ResponseEntity<ApiResponse<ContactSubmission>> addSubmissionNote(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String note = body.getOrDefault("note", "");
        return ResponseEntity.ok(ApiResponse.success("Note added",
                contactSubmissionService.addNote(id, note)));
    }

    @DeleteMapping("/submissions/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSubmission(@PathVariable Long id) {
        contactSubmissionService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Submission deleted"));
    }
}
