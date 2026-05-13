package com.hafiz.portfolio.repository;

import com.hafiz.portfolio.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByStatusOrderByOrderWeightAsc(Service.Status status);
    List<Service> findByFeaturedTrueAndStatusOrderByOrderWeightAsc(Service.Status status);
    Optional<Service> findBySlug(String slug);
}
