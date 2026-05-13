package com.hafiz.portfolio.service;

import com.hafiz.portfolio.dto.request.CompanyRequest;
import com.hafiz.portfolio.entity.Company;
import com.hafiz.portfolio.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    public List<Company> getAll() {
        return companyRepository.findAllByOrderByNameAsc();
    }

    public Company getById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Company not found: " + id));
    }

    @Transactional
    public Company create(CompanyRequest req) {
        Company c = Company.builder()
                .name(req.getName())
                .location(req.getLocation())
                .logoUrl(req.getLogoUrl())
                .logoDarkUrl(req.getLogoDarkUrl())
                .website(req.getWebsite())
                .description(req.getDescription())
                .build();
        return companyRepository.save(c);
    }

    @Transactional
    public Company update(Long id, CompanyRequest req) {
        Company c = getById(id);
        c.setName(req.getName());
        c.setLocation(req.getLocation());
        c.setLogoUrl(req.getLogoUrl());
        c.setLogoDarkUrl(req.getLogoDarkUrl());
        c.setWebsite(req.getWebsite());
        c.setDescription(req.getDescription());
        return companyRepository.save(c);
    }

    @Transactional
    public void delete(Long id) {
        if (!companyRepository.existsById(id))
            throw new NoSuchElementException("Company not found: " + id);
        companyRepository.deleteById(id);
    }
}
