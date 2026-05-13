package com.hafiz.portfolio.repository;

import com.hafiz.portfolio.entity.Testimonial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TestimonialRepository extends JpaRepository<Testimonial, Long> {
    List<Testimonial> findByApprovedTrueOrderByOrderWeightAsc();
    Optional<Testimonial> findFirstByApprovedTrueAndFeaturedTrue();
    List<Testimonial> findAllByOrderByOrderWeightAsc();
}
