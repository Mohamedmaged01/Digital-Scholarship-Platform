// ============================================================================
// Unified Digital Scholarship Platform (منصة الابتعاث الرقمية الموحدة)
// Public Information Architecture & Admin CMS Type Definitions
// ============================================================================

// ----------------------------------------------------------------------------
// 1. RBAC & Administrative Staff (NO Student Login)
// ----------------------------------------------------------------------------
export type AdminRole = 
  | 'SUPER_ADMIN'
  | 'CONTENT_MANAGER'
  | 'SCHOLARSHIP_MANAGER'
  | 'UNIVERSITY_MANAGER'
  | 'FAQ_MANAGER'
  | 'MEDIA_MANAGER'
  | 'SEO_MANAGER'
  | 'AI_MANAGER'
  | 'EDITOR'
  | 'VIEWER';

export type AdminPermission =
  | 'pages:write'
  | 'tracks:write'
  | 'universities:write'
  | 'faqs:write'
  | 'news:write'
  | 'media:write'
  | 'seo:write'
  | 'ai:write'
  | 'users:manage'
  | 'settings:write'
  | 'audit:read'
  | 'backup:manage';

export interface AdminUser {
  id: string;
  username: string;
  fullNameAr: string;
  fullNameEn: string;
  email: string;
  role: AdminRole;
  permissions: AdminPermission[];
  department?: string;
  avatarUrl?: string;
  isActive: boolean;
  lastLogin: string;
  passwordHash?: string;
  failedAttempts?: number;
  lockUntil?: number;
}

// ----------------------------------------------------------------------------
// 2. Scholarship Tracks (The 6 National Tracks)
// ----------------------------------------------------------------------------
export type TrackCode = 'PIONEERS' | 'IMDAD' | 'RD' | 'EXCELLENCE' | 'HEALTHCARE' | 'WAAED' | 'HEALTH' | 'WAED';

export interface TrackRequirementItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  isMandatory: boolean;
}

export interface TrackMajorItem {
  id: string;
  nameAr: string;
  nameEn: string;
  sectorAr: string;
  sectorEn: string;
}

export interface Track {
  id: string;
  slug?: string;
  code: TrackCode;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  objectiveAr?: string;
  objectiveEn?: string;
  badgeColor: string;
  minGpa: number; // e.g. 4.5 on 5.0 scale
  maxAge: number;
  requiredDegrees?: ('Bachelor' | 'Master' | 'PhD' | 'Fellowship' | 'Training')[];
  requiredDegree?: any;
  requiredIelts: number;
  requiredToefl: number;
  topUniversitiesRankLimit: number;
  targetSectors: string[];
  targetSectorsEn?: string[];
  allocatedSeats: number;
  filledSeats?: number;
  featuredImageUrl?: string;
  iconName?: string;
  features: string[];
  featuresEn?: string[];
  requirements?: TrackRequirementItem[];
  targetMajorsList?: TrackMajorItem[];
  eligibleCountries?: string[];
  sortOrder?: number;
  isPublished?: boolean;
  officialApplyUrl?: string;
  [key: string]: any;
}

// ----------------------------------------------------------------------------
// 3. Universities, Countries, Majors & Degrees
// ----------------------------------------------------------------------------
export interface CountryInfo {
  code: string;
  nameAr: string;
  nameEn: string;
  flagEmoji: string;
  regionAr: string;
  regionEn: string;
  approvedUniversitiesCount: number;
  primaryLanguage: string;
  visaOverviewAr: string;
  visaOverviewEn: string;
  culturalMissionCityAr: string;
  culturalMissionCityEn: string;
  imageUrl?: string;
  isPopular?: boolean;
  [key: string]: any;
}

export interface UniversityMajor {
  id: string;
  nameAr: string;
  nameEn: string;
  facultyAr: string;
  facultyEn: string;
  degreeLevel: 'Bachelor' | 'Master' | 'PhD' | 'Fellowship';
  trackCodes: TrackCode[];
  isStem: boolean;
}

export interface University {
  id: string;
  nameAr: string;
  nameEn: string;
  country: string;
  countryEn: string;
  countryCode: string;
  city: string;
  cityEn?: string;
  qsRank: number;
  theRank?: number;
  accreditedTracks: string[]; // Track IDs
  topMajorsAr: string[];
  topMajorsEn: string[];
  degreesAvailable: ('Bachelor' | 'Master' | 'PhD' | 'Fellowship')[];
  minIelts: number;
  minToefl: number;
  logoUrl?: string;
  imageUrl?: string;
  websiteUrl: string;
  acceptanceRate?: string;
  culturalMissionId?: string;
  isFeatured?: boolean;
  isTop30?: boolean;
  isTop100?: boolean;
  [key: string]: any;
}

// ----------------------------------------------------------------------------
// 4. Scholarship Journey Steps
// ----------------------------------------------------------------------------
export interface JourneyStep {
  stepNumber: number;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  iconName: string;
  guidelinesAr: string[];
  guidelinesEn: string[];
  relatedActionTextAr?: string;
  relatedActionTextEn?: string;
  isExternalLink?: boolean;
  actionUrl?: string;
}

// ----------------------------------------------------------------------------
// 5. FAQs & Categories
// ----------------------------------------------------------------------------
export type FaqCategory = 
  | 'all'
  | 'general'
  | 'tracks' 
  | 'requirements' 
  | 'universities' 
  | 'documents' 
  | 'official_channels' 
  | 'travel_prep'
  | 'admission'
  | 'nomination'
  | 'post_nomination'
  | 'services';

export interface FaqItem {
  id: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  category: FaqCategory;
  relatedTrackId?: string;
  relatedCountryCode?: string;
  sortOrder?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
  tags: string[];
}

// ----------------------------------------------------------------------------
// 6. News & Announcements
// ----------------------------------------------------------------------------
export interface NewsArticle {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  contentAr: string;
  contentEn: string;
  category: 'announcement' | 'admission' | 'event' | 'strategy';
  publishDate: string;
  authorAr: string;
  authorEn: string;
  imageUrl: string;
  isFeatured: boolean;
  status: 'draft' | 'published' | 'archived';
  readTimeMinutes: number;
}

// ----------------------------------------------------------------------------
// 7. Guides & Instructions
// ----------------------------------------------------------------------------
export interface GuideArticle {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  category: 'admission_prep' | 'language_tests' | 'visa_guide' | 'safeer_guide';
  readTimeMinutes: number;
  summaryAr: string;
  summaryEn: string;
  stepsCount: number;
  downloadUrl?: string;
  isOfficial: boolean;
}

// ----------------------------------------------------------------------------
// 8. Official Platforms & External Links
// ----------------------------------------------------------------------------
export interface OfficialPlatformLink {
  id: string;
  nameAr: string;
  nameEn: string;
  organizationAr: string;
  organizationEn: string;
  descriptionAr: string;
  descriptionEn: string;
  url: string;
  badgeAr: string;
  badgeEn: string;
  iconName: string;
  isVerified: boolean;
  sortOrder: number;
}

// ----------------------------------------------------------------------------
// 9. AI Scholarship Finder & AI Assistant
// ----------------------------------------------------------------------------
export interface AiFinderInputs {
  currentStage: string;
  targetDegree: 'Bachelor' | 'Master' | 'PhD' | 'Fellowship' | '';
  fieldOfInterest: string;
  specialization: string;
  preferredCountry: string;
  hasAdmissionLetter: 'yes' | 'no' | 'in_progress';
  languageProficiency: 'fluent' | 'intermediate' | 'beginner';
  gpaEstimated: number;
  careerVision: string;
}

export interface TrackRecommendationResult {
  track: Track;
  matchScore: number; // 0 - 100
  recommendationReasonAr: string;
  recommendationReasonEn: string;
  keyConditionsToReviewAr: string[];
  keyConditionsToReviewEn: string[];
  suggestedUniversities: { name: string; rank: number; country: string }[];
  suggestedMajors: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestedPrompts?: string[];
  suggestedActions?: string[];
  referencedLinks?: { label: string; url: string }[];
  [key: string]: any;
}

// ----------------------------------------------------------------------------
// 10. CMS Page Builder & Versioning
// ----------------------------------------------------------------------------
export type PageBlockType = 
  | 'hero'
  | 'quick_services'
  | 'tracks'
  | 'journey'
  | 'strategy'
  | 'ai_finder'
  | 'universities'
  | 'countries'
  | 'faq'
  | 'news'
  | 'official_links'
  | 'cta'
  | 'rich_text'
  | 'stats_counter';

export interface PageBlock {
  id: string;
  type: PageBlockType;
  titleAr: string;
  titleEn: string;
  subtitleAr?: string;
  subtitleEn?: string;
  contentAr?: string;
  contentEn?: string;
  config: Record<string, any>;
  sortOrder: number;
  isEnabled: boolean;
}

export interface PageVersion {
  id: string;
  pageSlug: string;
  versionNumber: number;
  title: string;
  blocks: PageBlock[];
  createdBy: string;
  createdAt: string;
  status: 'draft' | 'published' | 'archived';
  changelogNotes?: string;
}

// ----------------------------------------------------------------------------
// 11. Media Library
// ----------------------------------------------------------------------------
export interface MediaItem {
  id: string;
  fileName?: string;
  filename?: string;
  originalName?: string;
  fileUrl?: string;
  url?: string;
  fileSizeFormatted?: string;
  sizeBytes?: number;
  mimeType?: string;
  folder?: 'banners' | 'tracks' | 'universities' | 'documents' | 'logos' | string;
  altTextAr?: string;
  altTextEn?: string;
  titleAr?: string;
  titleEn?: string;
  uploadedAt?: string;
  createdAt?: string;
  [key: string]: any;
}

// ----------------------------------------------------------------------------
// 12. SEO Management
// ----------------------------------------------------------------------------
export interface SeoMetadata {
  pageSlug: string;
  metaTitleAr: string;
  metaTitleEn: string;
  metaDescAr: string;
  metaDescEn: string;
  keywordsAr: string[];
  keywordsEn: string[];
  canonicalUrl: string;
  ogImage: string;
  structuredDataJson?: string;
  [key: string]: any;
}

export type SeoSettings = SeoMetadata;

// ----------------------------------------------------------------------------
// 13. Audit Log
// ----------------------------------------------------------------------------
export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: AdminRole;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH' | 'RESTORE' | 'LOGIN' | 'EXPORT' | 'SETTINGS_CHANGE';
  entityType: 'TRACK' | 'UNIVERSITY' | 'FAQ' | 'PAGE' | 'NEWS' | 'MEDIA' | 'SETTINGS' | 'OFFICIAL_LINK';
  entityId: string;
  ipAddress: string;
  userAgent?: string;
  changesSummary: string;
  changesBefore?: Record<string, any>;
  changesAfter?: Record<string, any>;
}

// ----------------------------------------------------------------------------
// 14. Site Settings & Analytics
// ----------------------------------------------------------------------------
export interface SiteSettings {
  siteNameAr: string;
  siteNameEn: string;
  taglineAr: string;
  taglineEn: string;
  primaryColor: string;
  contactEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
  officialApplyPortalUrl: string;
  vision2030Url: string;
  moePortalUrl: string;
  socialLinks: {
    xTwitter: string;
    youtube: string;
    linkedin: string;
    instagram: string;
  };
  announcementBanner?: {
    isActive: boolean;
    textAr: string;
    textEn: string;
    actionUrl?: string;
  };
}

export interface PlatformAnalytics {
  totalVisitors: number;
  todayVisitors: number;
  activeNow: number;
  tracksViews: Record<string, number>;
  topUniversitiesSearched: { name: string; count: number }[];
  topSearchQueries: { query: string; hits: number }[];
  aiFinderUsageCount: number;
  aiAssistantConversationsCount: number;
  deviceBreakdown: { desktop: number; mobile: number; tablet: number };
  languageBreakdown: { arabic: number; english: number };
}

// ----------------------------------------------------------------------------
// 15. Compatibility Layer
// ----------------------------------------------------------------------------
export type UserRole = 'applicant' | 'supervisor' | 'admin' | 'donor';

export interface User {
  id: string;
  nationalId?: string;
  fullName: string;
  fullNameEn?: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  assignedMission?: string;
  culturalMission?: string;
  organization?: string;
  dateOfBirth?: string;
  [key: string]: any;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'info' | 'success' | 'warning' | 'alert' | 'ai' | 'appointment' | string;
  isRead: boolean;
  createdAt: string;
  [key: string]: any;
}

export interface Appointment {
  id: string;
  userId?: string;
  userName?: string;
  userNationalId?: string;
  missionId?: string;
  missionName?: string;
  date?: string;
  timeSlot?: string;
  advisorName?: string;
  topic?: string;
  subject?: string;
  description?: string;
  preferredDate?: string;
  preferredTime?: string;
  assignedSupervisorId?: string;
  assignedSupervisorName?: string;
  location?: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  meetingLink?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface Application {
  id: string;
  applicationNumber: string;
  userId: string;
  userName?: string;
  nationalId?: string;
  userNationalId?: string;
  userEmail?: string;
  userPhone?: string;
  userGpa?: number;
  userIelts?: number;
  trackId: string;
  trackCode?: string;
  universityId?: string;
  universityName: string;
  major?: string;
  degree?: string;
  degreeLevel?: string;
  country?: string;
  gpa?: number;
  ieltsScore?: number;
  status?: 'submitted' | 'under_review' | 'nominated' | 'approved' | 'rejected' | 'decision_issued' | string;
  applicationStatus?: string;
  progressPercentage?: number;
  financialGuaranteeIssued?: boolean;
  supervisorNotes?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface CulturalMission {
  id: string;
  countryCode?: string;
  countryNameAr?: string;
  countryNameEn?: string;
  countryAr?: string;
  countryEn?: string;
  cityAr?: string;
  cityEn?: string;
  attacheNameAr?: string;
  attacheNameEn?: string;
  email?: string;
  phone?: string;
  emergencyPhone?: string;
  addressAr?: string;
  addressEn?: string;
  websiteUrl?: string;
  workingHoursAr?: string;
  workingHoursEn?: string;
  activeScholarsCount?: number;
  [key: string]: any;
}

export interface UserGuideStep {
  id?: string;
  stepNumber: number;
  titleAr: string;
  titleEn?: string;
  summaryAr?: string;
  summaryEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  detailsAr?: string[];
  detailsEn?: string[];
  tipsAr?: string[] | string;
  tipsEn?: string[] | string;
  requiredDocsAr?: string[];
  requiredDocsEn?: string[];
  iconName: string;
  [key: string]: any;
}

export interface ExtractedAIData {
  applicantName?: string;
  universityName?: string;
  major?: string;
  degreeLevel?: string;
  country?: string;
  academicYear?: string;
  isUnconditional?: boolean;
  rawText?: string;
  confidenceScore?: number;
  [key: string]: any;
}

export interface TrackRecommendation extends Partial<TrackRecommendationResult> {
  trackId?: string;
  trackName?: string;
  [key: string]: any;
}

export interface AIProcessingLog {
  id: string;
  timestamp: string;
  fileProcessed: string;
  status: 'success' | 'failed' | 'processing';
  modelUsed: string;
  extractedFieldsCount: number;
  processingTimeMs: number;
}

