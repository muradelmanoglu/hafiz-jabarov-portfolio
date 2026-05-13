package com.hafiz.portfolio.repository;

import com.hafiz.portfolio.entity.ContactMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    Page<ContactMessage> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<ContactMessage> findByReadFalseOrderByCreatedAtDesc(Pageable pageable);
    long countByReadFalse();
}
