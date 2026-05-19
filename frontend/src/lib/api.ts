import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get(ACCESS_TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
let failedQueue: Array<{ resolve: (v: string) => void; reject: (e: unknown) => void }> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)))
  failedQueue = []
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = Cookies.get(REFRESH_TOKEN_KEY)
      if (!refreshToken) {
        clearTokens()
        window.location.href = `/${process.env.NEXT_PUBLIC_ADMIN_PATH}/login`
        return Promise.reject(error)
      }
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }
      originalRequest._retry = true
      isRefreshing = true
      try {
        const { data } = await axios.post('/api/auth/refresh', { refreshToken })
        const newToken = data.data.accessToken
        setTokens(newToken, data.data.refreshToken)
        processQueue(null, newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        clearTokens()
        window.location.href = `/${process.env.NEXT_PUBLIC_ADMIN_PATH}/login`
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export function setTokens(accessToken: string, refreshToken: string) {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 1 / 96, sameSite: 'strict' })
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 7, sameSite: 'strict' })
}

export function clearTokens() {
  Cookies.remove(ACCESS_TOKEN_KEY)
  Cookies.remove(REFRESH_TOKEN_KEY)
}

export function getAccessToken(): string | undefined {
  return Cookies.get(ACCESS_TOKEN_KEY)
}

// ─── API Wrapper ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SiteSettings {
  id: number
  siteTitle: string
  tagline: string
  heroHeadline: string
  heroSubheadline: string
  metaDescription: string
  availability: 'AVAILABLE' | 'SELECTIVE' | 'CLOSED'
  availabilityMessage?: string
  email: string
  phone?: string
  phoneVisible: boolean
  linkedIn: string
  github?: string
  calendly?: string
  twitter?: string
  resumeUrl?: string
  logoUrl?: string
  faviconUrl?: string
  defaultOgImageUrl?: string
  copyrightText?: string
  colophonText?: string
  headlineMetrics?: HeadlineMetric[]
}

export interface HeadlineMetric {
  value: string
  label: string
  context?: string
}

export interface Company {
  id: number
  name: string
  location?: string
  logoUrl?: string
  logoDarkUrl?: string
  website?: string
  description?: string
}

export interface Metric {
  label: string
  value: string
}

export interface CaseStudy {
  id: number
  title: string
  slug: string
  externalUrl?: string
  company?: Company
  role: string
  startDate: string
  endDate?: string
  teamSize?: number
  thumbnailUrl?: string
  heroImageUrl?: string
  summary: string
  problem?: string
  myRole?: string
  approach?: string
  outcome?: string
  reflection?: string
  outcomeMetrics?: Metric[]
  tools?: string[]
  tags?: string[]
  domain?: string
  featured: boolean
  orderWeight: number
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  publishedAt?: string
  translations?: Record<string, Record<string, unknown>>
}

export interface PortfolioService {
  id: number
  title: string
  slug: string
  icon: string
  shortDescription: string
  longDescription: string
  deliverables?: string[]
  engagementDuration: string
  startingRate?: string
  startingRateVisible: boolean
  ctaText: string
  orderWeight: number
  featured: boolean
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
}

export interface Skill {
  id: number
  name: string
  category: 'PROJECT_MANAGEMENT' | 'DOCUMENTATION' | 'ANALYTICS' | 'DESIGN' | 'SEO' | 'TOOLS' | 'OTHER'
  proficiency: 'FAMILIAR' | 'PROFICIENT' | 'EXPERT'
  yearsUsed?: number
  iconUrl?: string
  orderWeight: number
}

export interface Experience {
  id: number
  company?: Company
  companyName: string
  role: string
  location?: string
  startDate: string
  endDate?: string
  current: boolean
  summary?: string
  bullets?: string[]
  companyUrl?: string
  orderWeight: number
  translations?: Record<string, Record<string, unknown>>
}

export interface Education {
  id: number
  institution: string
  location?: string
  program: string
  startDate: string
  endDate?: string
  bullets?: string[]
  orderWeight: number
  translations?: Record<string, Record<string, unknown>>
}

export interface Testimonial {
  id: number
  quote: string
  authorName: string
  authorTitle: string
  authorCompany?: string
  authorPhotoUrl?: string
  linkedIn?: string
  dateReceived: string
  approved: boolean
  featured: boolean
  orderWeight: number
}

export interface FAQ {
  id: number
  question: string
  answer: string
  category: 'GENERAL' | 'SERVICES' | 'PROCESS' | 'PRICING'
  orderWeight: number
  visibleOn: Array<'HOME' | 'SERVICES' | 'CONTACT'>
}

export interface ContactSubmission {
  id: number
  name: string
  email: string
  company?: string
  projectType: string
  budgetRange?: string
  message: string
  status: 'NEW' | 'READ' | 'REPLIED' | 'SPAM' | 'ARCHIVED'
  notes?: string
  ipAddress?: string
  userAgent?: string
  referrer?: string
  submittedAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}

export interface ContactFormData {
  name: string
  email: string
  company?: string
  projectType: string
  budgetRange?: string
  message: string
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const publicApi = {
  getSettings: () =>
    api.get<ApiResponse<SiteSettings>>('/public/settings'),

  getCaseStudies: (lang?: string) =>
    api.get<ApiResponse<CaseStudy[]>>(`/public/case-studies${lang ? `?lang=${lang}` : ''}`),

  getFeaturedCaseStudies: () =>
    api.get<ApiResponse<CaseStudy[]>>('/public/case-studies/featured'),

  getCaseStudy: (slug: string, lang?: string) =>
    api.get<ApiResponse<CaseStudy>>(`/public/case-studies/${slug}${lang ? `?lang=${lang}` : ''}`),

  getServices: () =>
    api.get<ApiResponse<PortfolioService[]>>('/public/services'),

  getSkills: () =>
    api.get<ApiResponse<Skill[]>>('/public/skills'),

  getExperience: (lang?: string) =>
    api.get<ApiResponse<Experience[]>>(`/public/experience${lang ? `?lang=${lang}` : ''}`),

  getEducation: (lang?: string) =>
    api.get<ApiResponse<Education[]>>(`/public/education${lang ? `?lang=${lang}` : ''}`),

  getTestimonials: () =>
    api.get<ApiResponse<Testimonial[]>>('/public/testimonials'),

  getFeaturedTestimonial: () =>
    api.get<ApiResponse<Testimonial | null>>('/public/testimonials/featured'),

  getFAQs: (page?: 'HOME' | 'SERVICES' | 'CONTACT') =>
    api.get<ApiResponse<FAQ[]>>('/public/faqs', { params: page ? { page } : {} }),

  getCompanies: () =>
    api.get<ApiResponse<Company[]>>('/public/companies'),

  submitContact: (data: ContactFormData) =>
    api.post<ApiResponse<void>>('/public/contact', data),
}

// ─── Admin API ────────────────────────────────────────────────────────────────

export const adminApi = {
  // Auth
  login: (username: string, password: string) =>
    api.post<ApiResponse<AuthTokens>>('/auth/login', { username, password }),
  logout: () =>
    api.post<ApiResponse<void>>('/auth/logout'),

  // Stats
  getStats: () =>
    api.get<ApiResponse<Record<string, number>>>('/admin/stats'),

  // Case Studies
  getCaseStudies: () =>
    api.get<ApiResponse<CaseStudy[]>>('/admin/case-studies'),
  getCaseStudy: (id: number) =>
    api.get<ApiResponse<CaseStudy>>(`/admin/case-studies/${id}`),
  createCaseStudy: (data: Partial<CaseStudy>) =>
    api.post<ApiResponse<CaseStudy>>('/admin/case-studies', data),
  updateCaseStudy: (id: number, data: Partial<CaseStudy>) =>
    api.put<ApiResponse<CaseStudy>>(`/admin/case-studies/${id}`, data),
  deleteCaseStudy: (id: number) =>
    api.delete<ApiResponse<void>>(`/admin/case-studies/${id}`),

  // Services
  getServices: () =>
    api.get<ApiResponse<PortfolioService[]>>('/admin/services'),
  getService: (id: number) =>
    api.get<ApiResponse<PortfolioService>>(`/admin/services/${id}`),
  createService: (data: Partial<PortfolioService>) =>
    api.post<ApiResponse<PortfolioService>>('/admin/services', data),
  updateService: (id: number, data: Partial<PortfolioService>) =>
    api.put<ApiResponse<PortfolioService>>(`/admin/services/${id}`, data),
  deleteService: (id: number) =>
    api.delete<ApiResponse<void>>(`/admin/services/${id}`),

  // Skills
  createSkill: (data: Partial<Skill>) =>
    api.post<ApiResponse<Skill>>('/admin/skills', data),
  updateSkill: (id: number, data: Partial<Skill>) =>
    api.put<ApiResponse<Skill>>(`/admin/skills/${id}`, data),
  deleteSkill: (id: number) =>
    api.delete<ApiResponse<void>>(`/admin/skills/${id}`),

  // Experience
  createExperience: (data: Partial<Experience>) =>
    api.post<ApiResponse<Experience>>('/admin/experience', data),
  updateExperience: (id: number, data: Partial<Experience>) =>
    api.put<ApiResponse<Experience>>(`/admin/experience/${id}`, data),
  deleteExperience: (id: number) =>
    api.delete<ApiResponse<void>>(`/admin/experience/${id}`),

  // Education
  getEducation: () =>
    api.get<ApiResponse<Education[]>>('/admin/education'),
  createEducation: (data: Partial<Education>) =>
    api.post<ApiResponse<Education>>('/admin/education', data),
  updateEducation: (id: number, data: Partial<Education>) =>
    api.put<ApiResponse<Education>>(`/admin/education/${id}`, data),
  deleteEducation: (id: number) =>
    api.delete<ApiResponse<void>>(`/admin/education/${id}`),

  // Testimonials
  getTestimonials: () =>
    api.get<ApiResponse<Testimonial[]>>('/admin/testimonials'),
  createTestimonial: (data: Partial<Testimonial>) =>
    api.post<ApiResponse<Testimonial>>('/admin/testimonials', data),
  updateTestimonial: (id: number, data: Partial<Testimonial>) =>
    api.put<ApiResponse<Testimonial>>(`/admin/testimonials/${id}`, data),
  approveTestimonial: (id: number) =>
    api.patch<ApiResponse<Testimonial>>(`/admin/testimonials/${id}/approve`),
  deleteTestimonial: (id: number) =>
    api.delete<ApiResponse<void>>(`/admin/testimonials/${id}`),

  // FAQs
  getFAQs: () =>
    api.get<ApiResponse<FAQ[]>>('/admin/faqs'),
  createFAQ: (data: Partial<FAQ>) =>
    api.post<ApiResponse<FAQ>>('/admin/faqs', data),
  updateFAQ: (id: number, data: Partial<FAQ>) =>
    api.put<ApiResponse<FAQ>>(`/admin/faqs/${id}`, data),
  deleteFAQ: (id: number) =>
    api.delete<ApiResponse<void>>(`/admin/faqs/${id}`),

  // Companies
  getCompanies: () =>
    api.get<ApiResponse<Company[]>>('/admin/companies'),
  getCompany: (id: number) =>
    api.get<ApiResponse<Company>>(`/admin/companies/${id}`),
  createCompany: (data: Partial<Company>) =>
    api.post<ApiResponse<Company>>('/admin/companies', data),
  updateCompany: (id: number, data: Partial<Company>) =>
    api.put<ApiResponse<Company>>(`/admin/companies/${id}`, data),
  deleteCompany: (id: number) =>
    api.delete<ApiResponse<void>>(`/admin/companies/${id}`),

  // Site Settings
  getSettings: () =>
    api.get<ApiResponse<SiteSettings>>('/admin/settings'),
  updateSettings: (data: Partial<SiteSettings>) =>
    api.put<ApiResponse<SiteSettings>>('/admin/settings', data),

  // Submissions
  getSubmissions: (page = 0, size = 20, status?: string) =>
    api.get<ApiResponse<PageResponse<ContactSubmission>>>('/admin/submissions', {
      params: { page, size, ...(status ? { status } : {}) },
    }),
  getSubmission: (id: number) =>
    api.get<ApiResponse<ContactSubmission>>(`/admin/submissions/${id}`),
  updateSubmissionStatus: (id: number, status: string) =>
    api.patch<ApiResponse<ContactSubmission>>(`/admin/submissions/${id}/status`, null, {
      params: { status },
    }),
  addSubmissionNote: (id: number, note: string) =>
    api.patch<ApiResponse<ContactSubmission>>(`/admin/submissions/${id}/note`, { note }),
  deleteSubmission: (id: number) =>
    api.delete<ApiResponse<void>>(`/admin/submissions/${id}`),
}
