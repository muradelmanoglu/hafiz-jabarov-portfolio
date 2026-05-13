package com.hafiz.portfolio.repository;

import com.hafiz.portfolio.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findAllByOrderByDisplayOrderAscCreatedAtDesc();
    List<Project> findByFeaturedTrueOrderByDisplayOrderAsc();
}
