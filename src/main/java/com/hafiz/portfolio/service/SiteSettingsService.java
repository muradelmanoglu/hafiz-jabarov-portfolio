package com.hafiz.portfolio.service;

import com.hafiz.portfolio.dto.request.SiteSettingsRequest;
import com.hafiz.portfolio.entity.SiteSettings;
import com.hafiz.portfolio.repository.SiteSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SiteSettingsService {

    private final SiteSettingsRepository siteSettingsRepository;

    public SiteSettings get() {
        return siteSettingsRepository.findById(1L)
                .orElseGet(this::createDefault);
    }

    @Transactional
    public SiteSettings update(SiteSettingsRequest req) {
        SiteSettings s = get();
        if (req.getSiteTitle() != null) s.setSiteTitle(req.getSiteTitle());
        if (req.getTagline() != null) s.setTagline(req.getTagline());
        if (req.getHeroHeadline() != null) s.setHeroHeadline(req.getHeroHeadline());
        if (req.getHeroSubheadline() != null) s.setHeroSubheadline(req.getHeroSubheadline());
        if (req.getMetaDescription() != null) s.setMetaDescription(req.getMetaDescription());
        if (req.getAvailability() != null) s.setAvailability(req.getAvailability());
        s.setAvailabilityMessage(req.getAvailabilityMessage());
        if (req.getEmail() != null) s.setEmail(req.getEmail());
        s.setPhone(req.getPhone());
        s.setPhoneVisible(req.isPhoneVisible());
        if (req.getLinkedIn() != null) s.setLinkedIn(req.getLinkedIn());
        s.setGithub(req.getGithub());
        s.setCalendly(req.getCalendly());
        s.setTwitter(req.getTwitter());
        s.setInstagram(req.getInstagram());
        s.setResumeUrl(req.getResumeUrl());
        s.setLogoUrl(req.getLogoUrl());
        s.setFaviconUrl(req.getFaviconUrl());
        s.setDefaultOgImageUrl(req.getDefaultOgImageUrl());
        s.setCopyrightText(req.getCopyrightText());
        s.setColophonText(req.getColophonText());
        s.setCustomSocialLinksJson(req.getCustomSocialLinksJson());
        s.setAboutTranslationsJson(req.getAboutTranslationsJson());
        s.setAboutHeading(req.getAboutHeading());
        s.setAboutP1(req.getAboutP1());
        s.setAboutP2(req.getAboutP2());
        s.setAboutP3(req.getAboutP3());
        if (req.getHeadlineMetrics() != null) s.setHeadlineMetrics(req.getHeadlineMetrics());
        return siteSettingsRepository.save(s);
    }

    private SiteSettings createDefault() {
        SiteSettings s = SiteSettings.builder()
                .id(1L)
                .siteTitle("Hafiz Jabarov")
                .tagline("Project Manager turning strategy into shipped outcomes.")
                .heroHeadline("Hey there, I'm Hafiz Jabarov.")
                .heroSubheadline("Project Manager turning strategy into shipped outcomes. From Senior Product Designer to PM — bridging design thinking with delivery excellence.")
                .metaDescription("Hafiz Jabarov — Project Manager with expertise in e-commerce, SaaS, and enterprise platforms.")
                .availability(SiteSettings.Availability.AVAILABLE)
                .email("jabarovhafiz@gmail.com")
                .linkedIn("https://linkedin.com/in/hafizjabarov")
                .copyrightText("© 2025 Hafiz Jabarov. All rights reserved.")
                .colophonText("Built with Next.js & Spring Boot")
                .build();
        return siteSettingsRepository.save(s);
    }
}
