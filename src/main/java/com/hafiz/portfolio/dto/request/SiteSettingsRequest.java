package com.hafiz.portfolio.dto.request;

import com.hafiz.portfolio.entity.SiteSettings;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class SiteSettingsRequest {

    private String siteTitle;
    private String tagline;
    private String heroHeadline;

    @Size(max = 1000)
    private String heroSubheadline;

    @Size(max = 160)
    private String metaDescription;

    private SiteSettings.Availability availability;
    private String availabilityMessage;

    private String email;
    private String phone;
    private boolean phoneVisible;
    private String linkedIn;

    private String github;
    private String calendly;
    private String twitter;
    private String instagram;
    private String resumeUrl;
    private String logoUrl;
    private String faviconUrl;
    private String defaultOgImageUrl;
    private String copyrightText;
    private String colophonText;
    private String customSocialLinksJson;
    private String aboutTranslationsJson;
    private String aboutHeading;
    private String aboutP1;
    private String aboutP2;
    private String aboutP3;
    private List<SiteSettings.HeadlineMetric> headlineMetrics;
}
