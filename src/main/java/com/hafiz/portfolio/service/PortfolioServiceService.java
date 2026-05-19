package com.hafiz.portfolio.service;

import com.hafiz.portfolio.dto.request.ServiceRequest;
import com.hafiz.portfolio.entity.Service;
import com.hafiz.portfolio.repository.ServiceRepository;
import com.hafiz.portfolio.util.TranslationHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class PortfolioServiceService {

    private final ServiceRepository serviceRepository;

    public List<Service> getAllPublished() {
        return serviceRepository.findByStatusOrderByOrderWeightAsc(Service.Status.PUBLISHED);
    }

    @Transactional(readOnly = true)
    public List<Service> getAllPublished(String lang) {
        List<Service> list = getAllPublished();
        if (lang != null && !lang.equals("en")) list.forEach(s -> applyTranslations(s, lang));
        return list;
    }

    private void applyTranslations(Service s, String lang) {
        Map<String, Map<String, Object>> t = TranslationHelper.parse(s.getTranslations());
        s.setShortDescription(TranslationHelper.str(t, lang, "shortDescription", s.getShortDescription()));
        s.setLongDescription(TranslationHelper.str(t, lang, "longDescription", s.getLongDescription()));
        s.setCtaText(TranslationHelper.str(t, lang, "ctaText", s.getCtaText()));
    }

    public List<Service> getAll() {
        return serviceRepository.findAll();
    }

    public Service getById(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Service not found: " + id));
    }

    @Transactional
    public Service create(ServiceRequest req) {
        Service s = Service.builder()
                .title(req.getTitle())
                .slug(req.getSlug() != null ? req.getSlug() : toSlug(req.getTitle()))
                .icon(req.getIcon())
                .category(req.getCategory())
                .shortDescription(req.getShortDescription())
                .longDescription(req.getLongDescription())
                .deliverables(req.getDeliverables())
                .engagementDuration(req.getEngagementDuration())
                .startingRate(req.getStartingRate())
                .startingRateVisible(req.isStartingRateVisible())
                .ctaText(req.getCtaText())
                .orderWeight(req.getOrderWeight())
                .featured(req.isFeatured())
                .status(req.getStatus() != null ? req.getStatus() : Service.Status.PUBLISHED)
                .translations(TranslationHelper.serialize(req.getTranslations()))
                .build();
        return serviceRepository.save(s);
    }

    @Transactional
    public Service update(Long id, ServiceRequest req) {
        Service s = getById(id);
        s.setTitle(req.getTitle());
        if (req.getSlug() != null && !req.getSlug().isBlank()) s.setSlug(req.getSlug());
        s.setIcon(req.getIcon());
        s.setCategory(req.getCategory());
        s.setShortDescription(req.getShortDescription());
        s.setLongDescription(req.getLongDescription());
        s.setDeliverables(req.getDeliverables());
        s.setEngagementDuration(req.getEngagementDuration());
        s.setStartingRate(req.getStartingRate());
        s.setStartingRateVisible(req.isStartingRateVisible());
        s.setCtaText(req.getCtaText());
        s.setOrderWeight(req.getOrderWeight());
        s.setFeatured(req.isFeatured());
        if (req.getStatus() != null) s.setStatus(req.getStatus());
        s.setTranslations(TranslationHelper.serialize(req.getTranslations()));
        return serviceRepository.save(s);
    }

    @Transactional
    public void delete(Long id) {
        if (!serviceRepository.existsById(id))
            throw new NoSuchElementException("Service not found: " + id);
        serviceRepository.deleteById(id);
    }

    private String toSlug(String text) {
        return text.toLowerCase().replaceAll("[^a-z0-9\\s-]", "").trim().replaceAll("\\s+", "-");
    }
}
