package com.hafiz.portfolio.service;

import com.hafiz.portfolio.dto.request.ProjectRequest;
import com.hafiz.portfolio.entity.Project;
import com.hafiz.portfolio.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public List<Project> getAll() {
        return projectRepository.findAllByOrderByDisplayOrderAscCreatedAtDesc();
    }

    public List<Project> getFeatured() {
        return projectRepository.findByFeaturedTrueOrderByDisplayOrderAsc();
    }

    public Project getById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Project not found with id: " + id));
    }

    @Transactional
    public Project create(ProjectRequest request) {
        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .technologies(request.getTechnologies())
                .githubUrl(request.getGithubUrl())
                .liveUrl(request.getLiveUrl())
                .imageUrl(request.getImageUrl())
                .featured(request.isFeatured())
                .completedAt(request.getCompletedAt())
                .displayOrder(request.getDisplayOrder())
                .build();
        return projectRepository.save(project);
    }

    @Transactional
    public Project update(Long id, ProjectRequest request) {
        Project project = getById(id);
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setTechnologies(request.getTechnologies());
        project.setGithubUrl(request.getGithubUrl());
        project.setLiveUrl(request.getLiveUrl());
        project.setImageUrl(request.getImageUrl());
        project.setFeatured(request.isFeatured());
        project.setCompletedAt(request.getCompletedAt());
        project.setDisplayOrder(request.getDisplayOrder());
        return projectRepository.save(project);
    }

    @Transactional
    public void delete(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new NoSuchElementException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }
}
