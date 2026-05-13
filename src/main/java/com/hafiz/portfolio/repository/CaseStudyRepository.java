package com.hafiz.portfolio.repository;

import com.hafiz.portfolio.entity.CaseStudy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CaseStudyRepository extends JpaRepository<CaseStudy, Long> {
    List<CaseStudy> findByStatusOrderByOrderWeightAscPublishedAtDesc(CaseStudy.Status status);
    List<CaseStudy> findByFeaturedTrueAndStatusOrderByOrderWeightAsc(CaseStudy.Status status);
    Optional<CaseStudy> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
