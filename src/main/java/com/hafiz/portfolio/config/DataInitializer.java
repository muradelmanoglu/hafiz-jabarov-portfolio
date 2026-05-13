package com.hafiz.portfolio.config;

import com.hafiz.portfolio.entity.*;
import com.hafiz.portfolio.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SiteSettingsRepository siteSettingsRepository;
    private final CompanyRepository companyRepository;
    private final CaseStudyRepository caseStudyRepository;
    private final ServiceRepository serviceRepository;
    private final SkillRepository skillRepository;
    private final ExperienceRepository experienceRepository;
    private final EducationRepository educationRepository;
    private final TestimonialRepository testimonialRepository;
    private final FAQRepository faqRepository;

    @Value("${app.admin.default-username:admin}")
    private String defaultUsername;

    @Value("${app.admin.default-password:changeme123!}")
    private String defaultPassword;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedAdmin();
        seedSiteSettings();
        seedCompanies();
        seedCaseStudies();
        seedServices();
        seedSkills();
        seedExperience();
        seedEducation();
        seedTestimonials();
        seedFAQs();
    }

    private void seedAdmin() {
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .username(defaultUsername)
                    .password(passwordEncoder.encode(defaultPassword))
                    .email("admin@portfolio.local")
                    .role(User.Role.ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            log.warn("==========================================================");
            log.warn("Default admin created: username='{}'. CHANGE THE PASSWORD!", defaultUsername);
            log.warn("==========================================================");
        }
    }

    private void seedSiteSettings() {
        if (siteSettingsRepository.count() == 0) {
            SiteSettings settings = SiteSettings.builder()
                    .siteTitle("Hafiz Jabarov")
                    .tagline("Senior Project Manager & Digital Strategist")
                    .heroHeadline("I turn complex problems into shipped products")
                    .heroSubheadline("Senior PM with 7+ years delivering e-commerce, SaaS and fintech products from 0→1 and 1→scale.")
                    .metaDescription("Hafiz Jabarov — Senior Project Manager specialising in e-commerce delivery, agile transformation and cross-functional team leadership.")
                    .availability(SiteSettings.Availability.AVAILABLE)
                    .email("jabarovhafiz@gmail.com")
                    .linkedIn("https://linkedin.com/in/hafizjabarov")
                    .calendly("https://calendly.com/hafizjabarov")
                    .headlineMetrics(List.of(
                            new SiteSettings.HeadlineMetric("7+", "Years of PM experience", null),
                            new SiteSettings.HeadlineMetric("30+", "Products shipped", null),
                            new SiteSettings.HeadlineMetric("$50M+", "Revenue influenced", null),
                            new SiteSettings.HeadlineMetric("15+", "Cross-functional teams led", null)
                    ))
                    .build();
            siteSettingsRepository.save(settings);
            log.info("SiteSettings seeded.");
        }
    }

    private void seedCompanies() {
        if (companyRepository.count() == 0) {
            companyRepository.saveAll(List.of(
                    Company.builder()
                            .name("TechCorp Azerbaijan")
                            .location("Baku, Azerbaijan")
                            .website("https://techcorp.az")
                            .description("Leading technology company in Azerbaijan.")
                            .build(),
                    Company.builder()
                            .name("E-Commerce Hub")
                            .location("Baku, Azerbaijan")
                            .website("https://echub.az")
                            .description("Azerbaijan's fastest-growing e-commerce platform.")
                            .build()
            ));
            log.info("Companies seeded.");
        }
    }

    private void seedCaseStudies() {
        if (caseStudyRepository.count() == 0) {
            Company company = companyRepository.findAll().stream().findFirst().orElse(null);
            caseStudyRepository.saveAll(List.of(
                    CaseStudy.builder()
                            .title("Re-platforming E-Commerce Checkout")
                            .slug("replatforming-ecommerce-checkout")
                            .company(company)
                            .role("Lead Product Manager")
                            .startDate(LocalDate.of(2023, 1, 1))
                            .endDate(LocalDate.of(2023, 6, 30))
                            .teamSize(12)
                            .summary("Led a full checkout re-platform reducing cart abandonment by 22% and cutting load time from 4.2s to 1.1s.")
                            .problem("Legacy checkout had a 68% abandonment rate, 3 payment providers failing silently, and zero mobile optimisation.")
                            .myRole("Owned discovery, roadmap, sprint planning and stakeholder communication. Ran 40+ user interviews and managed 3 delivery pods.")
                            .approach("Phased migration: new payment gateway first, then UI overhaul, then A/B testing optimisation. Used RICE to prioritise.")
                            .outcome("Cart abandonment dropped 22%. Revenue up 18% MoM. Mobile conversion +31%. NPS went from 31 to 58.")
                            .outcomeMetrics(List.of(
                                    new CaseStudy.Metric("-22%", "Cart abandonment", null),
                                    new CaseStudy.Metric("+18% MoM", "Revenue uplift", null),
                                    new CaseStudy.Metric("+31%", "Mobile conversion", null),
                                    new CaseStudy.Metric("31 → 58", "NPS", null)
                            ))
                            .tools(List.of("Jira", "Figma", "Mixpanel", "Stripe", "Notion"))
                            .tags(List.of("E-Commerce", "Checkout", "Conversion Optimisation"))
                            .domain("E-Commerce")
                            .featured(true)
                            .orderWeight(1)
                            .status(CaseStudy.Status.PUBLISHED)
                            .publishedAt(LocalDateTime.now())
                            .build(),
                    CaseStudy.builder()
                            .title("Agile Transformation for 80-Person Engineering Org")
                            .slug("agile-transformation-engineering-org")
                            .company(company)
                            .role("Transformation Lead / Senior PM")
                            .startDate(LocalDate.of(2022, 3, 1))
                            .endDate(LocalDate.of(2022, 12, 31))
                            .teamSize(80)
                            .summary("Designed and executed a Scrum-at-scale rollout across 8 squads, cutting time-to-production by 40%.")
                            .problem("Waterfall releases every 6 months. Engineers had no product context. PM team was acting as project admins.")
                            .myRole("Defined the transformation roadmap, trained squad leads, introduced OKRs and ran retrospectives across all squads.")
                            .approach("Scaled Scrum with Spotify-model-inspired squad autonomy. Introduced Definition of Ready, automated CI/CD gates, and weekly PO syncs.")
                            .outcome("Time-to-production cut from 6 months to 3 weeks. Engineer satisfaction score up from 52% to 79%. 0 missed commitments in Q4.")
                            .outcomeMetrics(List.of(
                                    new CaseStudy.Metric("6 months → 3 weeks", "Time-to-production", null),
                                    new CaseStudy.Metric("52% → 79%", "Engineer satisfaction", null),
                                    new CaseStudy.Metric("0 in Q4", "Missed commitments", null)
                            ))
                            .tools(List.of("Jira", "Confluence", "Miro", "Slack", "Linear"))
                            .tags(List.of("Agile", "Scrum", "Transformation", "Leadership"))
                            .domain("Process & Delivery")
                            .featured(true)
                            .orderWeight(2)
                            .status(CaseStudy.Status.PUBLISHED)
                            .publishedAt(LocalDateTime.now())
                            .build()
            ));
            log.info("Case studies seeded.");
        }
    }

    private void seedServices() {
        if (serviceRepository.count() == 0) {
            serviceRepository.saveAll(List.of(
                    Service.builder()
                            .title("Fractional PM")
                            .slug("fractional-pm")
                            .icon("Briefcase")
                            .shortDescription("Senior PM capacity without the full-time cost. Embedded into your team 1–3 days/week.")
                            .longDescription("You get a senior PM who understands your business context, runs discovery, owns the roadmap and keeps delivery on track — without the 6-month hiring process.")
                            .deliverables(List.of("Roadmap ownership", "Sprint facilitation", "Stakeholder reporting", "Discovery & user research"))
                            .engagementDuration("3–6 months, extendable")
                            .startingRate("From $4,000/month")
                            .ctaText("Book a discovery call")
                            .featured(true)
                            .orderWeight(1)
                            .status(Service.Status.PUBLISHED)
                            .build(),
                    Service.builder()
                            .title("E-Commerce Delivery")
                            .slug("ecommerce-delivery")
                            .icon("ShoppingCart")
                            .shortDescription("End-to-end delivery of your e-commerce initiative, from problem definition to launch.")
                            .longDescription("Covers everything from checkout optimisation and payment integration to catalogue management and post-launch iteration. Proven process that shipped 10+ e-commerce products.")
                            .deliverables(List.of("Product roadmap", "UX & tech specs", "Vendor management", "Launch & iteration plan"))
                            .engagementDuration("2–4 months")
                            .startingRate("From $6,000")
                            .ctaText("Tell me about your project")
                            .featured(true)
                            .orderWeight(2)
                            .status(Service.Status.PUBLISHED)
                            .build(),
                    Service.builder()
                            .title("Delivery Audit")
                            .slug("delivery-audit")
                            .icon("Search")
                            .shortDescription("A two-week deep-dive into your delivery process. You'll leave with a prioritised fix list.")
                            .longDescription("I interview your team, review your Jira, sit in on ceremonies and map your value stream. The output is a frank assessment of what's slowing you down and a 90-day improvement plan.")
                            .deliverables(List.of("Delivery health scorecard", "Bottleneck analysis", "90-day improvement plan", "Team workshop"))
                            .engagementDuration("2 weeks")
                            .startingRate("From $2,500")
                            .ctaText("Book the audit")
                            .featured(false)
                            .orderWeight(3)
                            .status(Service.Status.PUBLISHED)
                            .build()
            ));
            log.info("Services seeded.");
        }
    }

    private void seedSkills() {
        if (skillRepository.count() == 0) {
            skillRepository.saveAll(List.of(
                    Skill.builder().name("Roadmapping").category(Skill.Category.PROJECT_MANAGEMENT).proficiency(Skill.Proficiency.EXPERT).yearsUsed(7).orderWeight(1).build(),
                    Skill.builder().name("Agile / Scrum").category(Skill.Category.PROJECT_MANAGEMENT).proficiency(Skill.Proficiency.EXPERT).yearsUsed(7).orderWeight(2).build(),
                    Skill.builder().name("Stakeholder Management").category(Skill.Category.PROJECT_MANAGEMENT).proficiency(Skill.Proficiency.EXPERT).yearsUsed(6).orderWeight(3).build(),
                    Skill.builder().name("OKR Facilitation").category(Skill.Category.PROJECT_MANAGEMENT).proficiency(Skill.Proficiency.PROFICIENT).yearsUsed(4).orderWeight(4).build(),
                    Skill.builder().name("PRD Writing").category(Skill.Category.DOCUMENTATION).proficiency(Skill.Proficiency.EXPERT).yearsUsed(7).orderWeight(1).build(),
                    Skill.builder().name("User Story Mapping").category(Skill.Category.DOCUMENTATION).proficiency(Skill.Proficiency.EXPERT).yearsUsed(6).orderWeight(2).build(),
                    Skill.builder().name("Mixpanel").category(Skill.Category.ANALYTICS).proficiency(Skill.Proficiency.PROFICIENT).yearsUsed(4).orderWeight(1).build(),
                    Skill.builder().name("Google Analytics 4").category(Skill.Category.ANALYTICS).proficiency(Skill.Proficiency.PROFICIENT).yearsUsed(3).orderWeight(2).build(),
                    Skill.builder().name("Figma").category(Skill.Category.DESIGN).proficiency(Skill.Proficiency.PROFICIENT).yearsUsed(5).orderWeight(1).build(),
                    Skill.builder().name("Jira").category(Skill.Category.TOOLS).proficiency(Skill.Proficiency.EXPERT).yearsUsed(7).orderWeight(1).build(),
                    Skill.builder().name("Notion").category(Skill.Category.TOOLS).proficiency(Skill.Proficiency.EXPERT).yearsUsed(5).orderWeight(2).build(),
                    Skill.builder().name("Linear").category(Skill.Category.TOOLS).proficiency(Skill.Proficiency.PROFICIENT).yearsUsed(2).orderWeight(3).build()
            ));
            log.info("Skills seeded.");
        }
    }

    private void seedExperience() {
        if (experienceRepository.count() == 0) {
            Company company1 = companyRepository.findAll().stream()
                    .filter(c -> c.getName().equals("TechCorp Azerbaijan")).findFirst().orElse(null);
            Company company2 = companyRepository.findAll().stream()
                    .filter(c -> c.getName().equals("E-Commerce Hub")).findFirst().orElse(null);

            experienceRepository.saveAll(List.of(
                    Experience.builder()
                            .company(company1)
                            .companyName("TechCorp Azerbaijan")
                            .role("Senior Product Manager")
                            .startDate(LocalDate.of(2021, 6, 1))
                            .summary("Led a portfolio of 4 products across web and mobile, owning roadmap, discovery and delivery.")
                            .bullets(List.of(
                                    "Shipped 3 major product releases on time and under budget",
                                    "Grew MAU from 120k to 340k in 18 months",
                                    "Built and mentored a 4-person PM team",
                                    "Introduced OKRs across the product org"
                            ))
                            .orderWeight(1)
                            .build(),
                    Experience.builder()
                            .company(company2)
                            .companyName("E-Commerce Hub")
                            .role("Product Manager")
                            .startDate(LocalDate.of(2019, 3, 1))
                            .endDate(LocalDate.of(2021, 5, 31))
                            .summary("Owned the checkout and payments domain for a marketplace with 2M+ buyers.")
                            .bullets(List.of(
                                    "Reduced checkout abandonment by 22% through iterative A/B testing",
                                    "Integrated 3 new payment providers with zero downtime",
                                    "Launched mobile app v2.0 with 4.7★ App Store rating"
                            ))
                            .orderWeight(2)
                            .build()
            ));
            log.info("Experience seeded.");
        }
    }

    private void seedEducation() {
        if (educationRepository.count() == 0) {
            educationRepository.saveAll(List.of(
                    Education.builder()
                            .institution("Azerbaijan State University of Economics")
                            .program("Bachelor of Business Administration")
                            .startDate(LocalDate.of(2013, 9, 1))
                            .endDate(LocalDate.of(2017, 6, 30))
                            .bullets(List.of("Graduated with honours", "Student council president 2015–2017"))
                            .orderWeight(1)
                            .build(),
                    Education.builder()
                            .institution("Product School")
                            .program("Product Management Certificate")
                            .startDate(LocalDate.of(2019, 1, 1))
                            .endDate(LocalDate.of(2019, 4, 30))
                            .bullets(List.of("Completed 16-week intensive PM programme", "Capstone: B2B SaaS onboarding redesign"))
                            .orderWeight(2)
                            .build()
            ));
            log.info("Education seeded.");
        }
    }

    private void seedTestimonials() {
        if (testimonialRepository.count() == 0) {
            testimonialRepository.saveAll(List.of(
                    Testimonial.builder()
                            .quote("Hafiz transformed our delivery culture. We went from shipping quarterly to weekly, and the team has never been more energised.")
                            .authorName("Anar Mammadov")
                            .authorTitle("CTO")
                            .authorCompany("TechCorp Azerbaijan")
                            .dateReceived(LocalDate.of(2024, 1, 15))
                            .approved(true)
                            .featured(true)
                            .build(),
                    Testimonial.builder()
                            .quote("The checkout re-platform Hafiz led directly contributed to our best-ever Black Friday. His ability to keep 12 people aligned while moving fast is genuinely rare.")
                            .authorName("Leyla Huseynova")
                            .authorTitle("Head of Product")
                            .authorCompany("E-Commerce Hub")
                            .dateReceived(LocalDate.of(2023, 7, 20))
                            .approved(true)
                            .featured(false)
                            .build()
            ));
            log.info("Testimonials seeded.");
        }
    }

    private void seedFAQs() {
        if (faqRepository.count() == 0) {
            faqRepository.saveAll(List.of(
                    FAQ.builder()
                            .question("What types of projects do you typically work on?")
                            .answer("I specialise in e-commerce, SaaS and marketplace products — particularly checkout, payments, and growth-stage scaling. I also take on agile transformation engagements for engineering orgs of 20–150 people.")
                            .category(FAQ.Category.GENERAL)
                            .visibleOn(List.of(FAQ.Page.HOME, FAQ.Page.SERVICES))
                            .orderWeight(1)
                            .build(),
                    FAQ.builder()
                            .question("How quickly can you start?")
                            .answer("Typically within 2 weeks of signing. I keep one slot open for fast-start engagements, so if you have an urgent need, mention it on the call.")
                            .category(FAQ.Category.PROCESS)
                            .visibleOn(List.of(FAQ.Page.HOME, FAQ.Page.CONTACT))
                            .orderWeight(2)
                            .build(),
                    FAQ.builder()
                            .question("Do you work remotely?")
                            .answer("Yes — all my engagements are remote-first, with optional on-site days for key milestones. I work across CET and GMT+4 time zones comfortably.")
                            .category(FAQ.Category.GENERAL)
                            .visibleOn(List.of(FAQ.Page.HOME))
                            .orderWeight(3)
                            .build(),
                    FAQ.builder()
                            .question("What does Fractional PM actually mean?")
                            .answer("You get a senior PM embedded in your team 1–3 days per week, rather than a full-time hire. You benefit from senior judgment and immediate capacity without the 3–6 month hiring cycle or the full-time salary.")
                            .category(FAQ.Category.SERVICES)
                            .visibleOn(List.of(FAQ.Page.SERVICES))
                            .orderWeight(1)
                            .build(),
                    FAQ.builder()
                            .question("What is your typical budget range?")
                            .answer("Fractional PM starts from $4,000/month. Project-based work starts from $2,500. I'm transparent about pricing on the first call — no surprises.")
                            .category(FAQ.Category.PRICING)
                            .visibleOn(List.of(FAQ.Page.SERVICES, FAQ.Page.CONTACT))
                            .orderWeight(1)
                            .build(),
                    FAQ.builder()
                            .question("How do I prepare for our first call?")
                            .answer("Think about: what the core challenge is, who the main stakeholders are, and what success looks like in 3 months. That's it. I'll guide the rest of the conversation.")
                            .category(FAQ.Category.PROCESS)
                            .visibleOn(List.of(FAQ.Page.CONTACT))
                            .orderWeight(1)
                            .build()
            ));
            log.info("FAQs seeded.");
        }
    }
}
