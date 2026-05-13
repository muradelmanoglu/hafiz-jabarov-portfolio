package com.hafiz.portfolio.service;

import com.hafiz.portfolio.dto.request.ContactSubmissionRequest;
import com.hafiz.portfolio.entity.ContactSubmission;
import com.hafiz.portfolio.repository.ContactSubmissionRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ContactSubmissionService {

    private final ContactSubmissionRepository submissionRepository;
    private final EmailService emailService;

    @Transactional
    public ContactSubmission submit(ContactSubmissionRequest req, HttpServletRequest httpRequest) {
        ContactSubmission sub = ContactSubmission.builder()
                .name(req.getName())
                .email(req.getEmail())
                .company(req.getCompany())
                .projectType(req.getProjectType())
                .budgetRange(req.getBudgetRange())
                .message(req.getMessage())
                .status(ContactSubmission.Status.NEW)
                .ipAddress(getClientIp(httpRequest))
                .userAgent(httpRequest.getHeader("User-Agent"))
                .referrer(httpRequest.getHeader("Referer"))
                .build();

        ContactSubmission saved = submissionRepository.save(sub);
        emailService.sendNewSubmissionNotification(saved);
        return saved;
    }

    public Page<ContactSubmission> getAll(Pageable pageable) {
        return submissionRepository.findAll(pageable);
    }

    public Page<ContactSubmission> getByStatus(ContactSubmission.Status status, Pageable pageable) {
        return submissionRepository.findByStatus(status, pageable);
    }

    public long countNew() {
        return submissionRepository.countByStatus(ContactSubmission.Status.NEW);
    }

    @Transactional
    public ContactSubmission updateStatus(Long id, ContactSubmission.Status status) {
        ContactSubmission sub = getById(id);
        sub.setStatus(status);
        return submissionRepository.save(sub);
    }

    @Transactional
    public ContactSubmission addNote(Long id, String note) {
        ContactSubmission sub = getById(id);
        sub.setNotes(note);
        return submissionRepository.save(sub);
    }

    @Transactional
    public void delete(Long id) {
        if (!submissionRepository.existsById(id))
            throw new NoSuchElementException("Submission not found: " + id);
        submissionRepository.deleteById(id);
    }

    public ContactSubmission getById(Long id) {
        return submissionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Submission not found: " + id));
    }

    private String getClientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) return xff.split(",")[0].trim();
        return request.getRemoteAddr();
    }
}
