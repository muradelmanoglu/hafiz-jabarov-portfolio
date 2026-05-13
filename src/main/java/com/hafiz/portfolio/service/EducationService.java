package com.hafiz.portfolio.service;

import com.hafiz.portfolio.dto.request.EducationRequest;
import com.hafiz.portfolio.entity.Education;
import com.hafiz.portfolio.repository.EducationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class EducationService {

    private final EducationRepository educationRepository;

    public List<Education> getAll() {
        return educationRepository.findAllByOrderByOrderWeightAsc();
    }

    public Education getById(Long id) {
        return educationRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Education not found: " + id));
    }

    @Transactional
    public Education create(EducationRequest req) {
        Education e = Education.builder()
                .institution(req.getInstitution())
                .location(req.getLocation())
                .program(req.getProgram())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .bullets(req.getBullets())
                .orderWeight(req.getOrderWeight())
                .build();
        return educationRepository.save(e);
    }

    @Transactional
    public Education update(Long id, EducationRequest req) {
        Education e = getById(id);
        e.setInstitution(req.getInstitution());
        e.setLocation(req.getLocation());
        e.setProgram(req.getProgram());
        e.setStartDate(req.getStartDate());
        e.setEndDate(req.getEndDate());
        e.setBullets(req.getBullets());
        e.setOrderWeight(req.getOrderWeight());
        return educationRepository.save(e);
    }

    @Transactional
    public void delete(Long id) {
        if (!educationRepository.existsById(id))
            throw new NoSuchElementException("Education not found: " + id);
        educationRepository.deleteById(id);
    }
}
