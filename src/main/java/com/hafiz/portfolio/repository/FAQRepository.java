package com.hafiz.portfolio.repository;

import com.hafiz.portfolio.entity.FAQ;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FAQRepository extends JpaRepository<FAQ, Long> {
    List<FAQ> findAllByOrderByOrderWeightAsc();
    List<FAQ> findByVisibleOnContainingOrderByOrderWeightAsc(FAQ.Page page);
}
