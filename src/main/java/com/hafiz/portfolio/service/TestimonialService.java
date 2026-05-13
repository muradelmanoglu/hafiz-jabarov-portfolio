package com.hafiz.portfolio.service;

import com.hafiz.portfolio.dto.request.TestimonialRequest;
import com.hafiz.portfolio.entity.Testimonial;
import com.hafiz.portfolio.repository.TestimonialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TestimonialService {

    private final TestimonialRepository testimonialRepository;

    public List<Testimonial> getApproved() {
        return testimonialRepository.findByApprovedTrueOrderByOrderWeightAsc();
    }

    public Optional<Testimonial> getFeatured() {
        return testimonialRepository.findFirstByApprovedTrueAndFeaturedTrue();
    }

    public List<Testimonial> getAll() {
        return testimonialRepository.findAllByOrderByOrderWeightAsc();
    }

    public Testimonial getById(Long id) {
        return testimonialRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Testimonial not found: " + id));
    }

    @Transactional
    public Testimonial create(TestimonialRequest req) {
        Testimonial t = Testimonial.builder()
                .quote(req.getQuote())
                .authorName(req.getAuthorName())
                .authorTitle(req.getAuthorTitle())
                .authorCompany(req.getAuthorCompany())
                .authorPhotoUrl(req.getAuthorPhotoUrl())
                .linkedIn(req.getLinkedIn())
                .dateReceived(req.getDateReceived())
                .approved(req.isApproved())
                .featured(req.isFeatured())
                .orderWeight(req.getOrderWeight())
                .build();
        return testimonialRepository.save(t);
    }

    @Transactional
    public Testimonial update(Long id, TestimonialRequest req) {
        Testimonial t = getById(id);
        t.setQuote(req.getQuote());
        t.setAuthorName(req.getAuthorName());
        t.setAuthorTitle(req.getAuthorTitle());
        t.setAuthorCompany(req.getAuthorCompany());
        t.setAuthorPhotoUrl(req.getAuthorPhotoUrl());
        t.setLinkedIn(req.getLinkedIn());
        t.setDateReceived(req.getDateReceived());
        t.setApproved(req.isApproved());
        t.setFeatured(req.isFeatured());
        t.setOrderWeight(req.getOrderWeight());
        return testimonialRepository.save(t);
    }

    @Transactional
    public Testimonial approve(Long id) {
        Testimonial t = getById(id);
        t.setApproved(true);
        return testimonialRepository.save(t);
    }

    @Transactional
    public void delete(Long id) {
        if (!testimonialRepository.existsById(id))
            throw new NoSuchElementException("Testimonial not found: " + id);
        testimonialRepository.deleteById(id);
    }
}
