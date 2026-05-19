package com.hafiz.portfolio.dto.request;

import com.hafiz.portfolio.entity.SiteSettings;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class SiteSettingsRequest {

    @NotBlank
    private String siteTitle;

    @NotBlank
    private String tagline;

    @NotBlank
    private String heroHeadline;

    @NotBlank
    private String heroSubheadline;

    @NotBlank
    @Size(max = 160)
    private String metaDescription;

    private SiteSettings.Availability availability;
    private String availabilityMessage;

    @NotBlank
    private String email;

    private String phone;
    private boolean phoneVisible;

    @NotBlank
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
