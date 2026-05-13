package com.hafiz.portfolio.repository;

import com.hafiz.portfolio.entity.ContactSubmission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactSubmissionRepository extends JpaRepository<ContactSubmission, Long> {
    Page<ContactSubmission> findByStatus(ContactSubmission.Status status, Pageable pageable);
    long countByStatus(ContactSubmission.Status status);
}
