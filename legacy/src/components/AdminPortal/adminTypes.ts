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

export interface AdminUser {
  id: string;
  nameAr: string;
  nameEn: string;
  email: string;
  role: AdminRole;
  department: string;
  status: 'active' | 'inactive';
  lastActive: string;
  avatarUrl?: string;
}

export type PageBlockType = 
  | 'Hero'
  | 'Text'
  | 'Image'
  | 'Video'
  | 'Cards'
  | 'Tracks'
  | 'Universities'
  | 'FAQ'
  | 'Timeline'
  | 'Statistics'
  | 'CTA'
  | 'Gallery'
  | 'Documents'
  | 'Links';

export interface PageBlock {
  id: string;
  type: PageBlockType;
  title: string;
  content: string;
  order: number;
  config: Record<string, any>;
  isVisible: boolean;
}

export interface CmsPageVersion {
  versionId: string;
  savedAt: string;
  savedBy: string;
  comment: string;
  blocks: PageBlock[];
}

export interface CmsPage {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  status: 'draft' | 'published' | 'archived';
  blocks: PageBlock[];
  versions: CmsPageVersion[];
  lastUpdated: string;
  author: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  fileSize: string;
  fileType: 'image/jpeg' | 'image/png' | 'image/webp' | 'application/pdf';
  extension: 'jpg' | 'png' | 'webp' | 'pdf';
  altTextAr: string;
  altTextEn: string;
  uploadedAt: string;
  uploadedBy: string;
  dimensions?: string;
}

export interface NewsArticle {
  id: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  category: 'announcement' | 'admission_cycle' | 'guidelines' | 'partnership';
  status: 'draft' | 'published' | 'archived';
  publishedAt: string;
  author: string;
  imageUrl: string;
}

export interface ScholarshipCountry {
  id: string;
  nameAr: string;
  nameEn: string;
  code: string;
  flag: string;
  region: 'Americas' | 'Europe' | 'Asia-Pacific' | 'Middle East';
  approvedUniversitiesCount: number;
  culturalMissionCity: string;
  status: 'active' | 'inactive';
}

export interface AdminAuditEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: AdminRole;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH' | 'ROLLBACK';
  targetEntity: string;
  details: string;
  ipAddress: string;
  previousValue?: string;
  newValue?: string;
}

export interface SystemSettingsState {
  siteTitleAr: string;
  siteTitleEn: string;
  maintenanceMode: boolean;
  officialApplicationUrl: string;
  supportEmail: string;
  hotlinePhone: string;
  allowPublicAiChat: boolean;
  cacheTtlSeconds: number;
}
