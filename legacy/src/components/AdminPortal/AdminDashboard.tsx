import React, { useState } from 'react';
import { 
  BarChart3, 
  Layers, 
  Award, 
  Building2, 
  Globe2, 
  HelpCircle, 
  Newspaper, 
  Image as ImageIcon, 
  Bot, 
  Users, 
  ShieldCheck, 
  Settings, 
  TrendingUp, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  Lock,
  ArrowRight,
  Sparkles,
  LogOut
} from 'lucide-react';
import { Track, University, User } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { AdminAuthUser, AdminAuthService } from '../../services/adminAuthService';

// Sub-modules
import { AdminRole, AdminUser, CmsPage, MediaFile, NewsArticle, SystemSettingsState, AdminAuditEntry } from './adminTypes';
import { 
  ADMIN_ROLE_PERMISSIONS, 
  INITIAL_ADMIN_USERS, 
  INITIAL_COUNTRIES, 
  INITIAL_NEWS, 
  INITIAL_MEDIA, 
  INITIAL_CMS_PAGES, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_SETTINGS 
} from './adminData';

import { AdminPageBuilder } from './AdminPageBuilder';
import { AdminMediaLibrary } from './AdminMediaLibrary';
import { AdminTracksManager } from './AdminTracksManager';
import { AdminFaqManager } from './AdminFaqManager';
import { AdminNewsManager } from './AdminNewsManager';
import { AdminAiManager } from './AdminAiManager';
import { AdminUsersManager } from './AdminUsersManager';
import { AdminAuditLog } from './AdminAuditLog';
import { AdminSettingsManager } from './AdminSettingsManager';
import { FAQ_DATABASE } from '../../data/scholarshipCatalog';

interface AdminDashboardProps {
  currentUser: User;
  adminUser?: AdminAuthUser | null;
  onLogout?: () => void;
  tracks: Track[];
  universities: University[];
  onPreviewTrack?: (trackId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  adminUser,
  onLogout,
  tracks: initialTracks,
  universities,
  onPreviewTrack
}) => {
  const { isRtl } = useLanguage();

  // Active Admin Role State (Synchronized with logged in admin, or fast test switch)
  const [activeRole, setActiveRole] = useState<AdminRole>(adminUser?.role || 'SUPER_ADMIN');

  // Active Section
  const [activeSection, setActiveSection] = useState<string>('statistics');

  // CMS State
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [cmsPages, setCmsPages] = useState<CmsPage[]>(INITIAL_CMS_PAGES);
  const [mediaList, setMediaList] = useState<MediaFile[]>(INITIAL_MEDIA);
  const [newsList, setNewsList] = useState<NewsArticle[]>(INITIAL_NEWS);
  const [faqsList, setFaqsList] = useState(FAQ_DATABASE);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [auditLogs, setAuditLogs] = useState<AdminAuditEntry[]>(INITIAL_AUDIT_LOGS);
  const [systemSettings, setSystemSettings] = useState<SystemSettingsState>(INITIAL_SETTINGS);

  // RBAC Permission Check for current active role
  const permissions = ADMIN_ROLE_PERMISSIONS[activeRole];
  const isSectionAllowed = permissions?.allowedSections.includes(activeSection);

  // Helper to record audit log
  const logAuditEvent = (
    action: AdminAuditEntry['action'],
    targetEntity: string,
    details: string,
    previousValue?: string,
    newValue?: string
  ) => {
    const newEntry: AdminAuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actorName: currentUser.nameAr || 'المشرف العام',
      actorRole: activeRole,
      action,
      targetEntity,
      details,
      ipAddress: '10.240.12.88',
      previousValue,
      newValue
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  // Handlers
  const handleSavePage = (updatedPage: CmsPage, actionType: 'SAVE_DRAFT' | 'PUBLISH' | 'ROLLBACK') => {
    setCmsPages(prev => prev.map(p => p.id === updatedPage.id ? updatedPage : p));
    logAuditEvent(
      actionType === 'SAVE_DRAFT' ? 'UPDATE' : actionType === 'PUBLISH' ? 'PUBLISH' : 'ROLLBACK',
      `صفحة: ${updatedPage.titleAr}`,
      actionType === 'PUBLISH' ? 'نشر رسمي للنسخة على المنصة' : 'حفظ تعديلات المسودة'
    );
  };

  const handleUpdateTracks = (newTracks: Track[]) => {
    setTracks(newTracks);
    logAuditEvent('UPDATE', 'مسارات الابتعاث', 'تعديل شروط أو ترتيب مسارات الابتعاث الاستراتيجية');
  };

  const handleAddMedia = (newMedia: MediaFile) => {
    setMediaList(prev => [newMedia, ...prev]);
    logAuditEvent('CREATE', `وسائط: ${newMedia.name}`, `رفع ملف رقمي (${newMedia.fileSize}) بنجاح`);
  };

  const handleDeleteMedia = (mediaId: string) => {
    const item = mediaList.find(m => m.id === mediaId);
    setMediaList(prev => prev.filter(m => m.id !== mediaId));
    logAuditEvent('DELETE', `وسائط: ${item?.name || mediaId}`, 'حذف ملف رقمي من مكتبة الوسائط');
  };

  const handleUpdateMedia = (updatedMedia: MediaFile) => {
    setMediaList(prev => prev.map(m => m.id === updatedMedia.id ? updatedMedia : m));
    logAuditEvent('UPDATE', `وسائط: ${updatedMedia.name}`, 'تحديث النصوص البديلة للوصولية');
  };

  const handleUpdateUserRole = (userId: string, newRole: AdminRole) => {
    const user = adminUsers.find(u => u.id === userId);
    setAdminUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    logAuditEvent(
      'UPDATE', 
      `مستخدم: ${user?.nameAr}`, 
      `تعديل الصلاحية الوظيفية إلى ${newRole}`,
      user?.role,
      newRole
    );
  };

  const handleUpdateSettings = (newSettings: SystemSettingsState) => {
    setSystemSettings(newSettings);
    logAuditEvent('UPDATE', 'إعدادات النظام', 'تحديث إعدادات البنية التحتية ووضع الصيانة');
  };

  // Nav Sections
  const navItems = [
    { id: 'statistics', labelAr: 'لوحة المؤشرات والإحصائيات', labelEn: 'Overview & KPIs', icon: BarChart3 },
    { id: 'tracks', labelAr: 'مسارات الابتعاث (Tracks)', labelEn: 'Scholarship Tracks', icon: Award },
    { id: 'universities', labelAr: 'الجامعات والتخصصات', labelEn: 'Universities & Majors', icon: Building2 },
    { id: 'countries', labelAr: 'دول الابتعاث والملحقيات', labelEn: 'Countries & Missions', icon: Globe2 },
    { id: 'faqs', labelAr: 'الأسئلة الشائعة (FAQ)', labelEn: 'FAQs & Inquiries', icon: HelpCircle },
    { id: 'news', labelAr: 'الأخبار والإعلانات', labelEn: 'News & Announcements', icon: Newspaper },
    { id: 'pages', labelAr: 'منشئ ومحرر الصفحات', labelEn: 'CMS Page Builder', icon: Layers },
    { id: 'media', labelAr: 'مكتبة الوسائط الرقمية', labelEn: 'Media Library', icon: ImageIcon },
    { id: 'ai', labelAr: 'إعدادات الذكاء الاصطناعي', labelEn: 'AI & Bot Control', icon: Bot },
    { id: 'users', labelAr: 'المستخدمون ومصفوفة الصلاحيات', labelEn: 'RBAC Users & Roles', icon: Users },
    { id: 'audit', labelAr: 'سجل التدقيق الأمني (Audit Logs)', labelEn: 'Audit & Activity Logs', icon: ShieldCheck },
    { id: 'settings', labelAr: 'إعدادات المنصة والنظام', labelEn: 'System Settings', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Active Role Indicator */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-4 border border-slate-700/60">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {isRtl ? 'بوابة الإشراف والتحكم الموحدة' : 'Unified Admin Portal'}
            </span>
            <span className="text-xs text-slate-400 font-mono">Ministry of Education CMS</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-2">
            {isRtl ? 'منصة إدارة وتخصيص محتوى الابتعاث' : 'Scholarship Content & Policy Management'}
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            {isRtl 
              ? 'إدارة المسارات الاستراتيجية، الجامعات الموصى بها، النشر الرقمي، ضبط محرك الذكاء الاصطناعي، ومراقبة سجلات التدقيق الأمني.' 
              : 'Enterprise CMS for managing tracks, verified universities, digital publishing, AI engine, and immutable audit logs.'}
          </p>
        </div>

        {/* Current Active Role Badge & Logout */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  {adminUser?.fullNameAr || currentUser.nameAr || 'المشرف العام'}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                  {activeRole}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {adminUser?.department || permissions?.labelAr}
              </span>
            </div>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              title={isRtl ? 'تسجيل الخروج من لوحة الإدارة' : 'Sign Out of Admin'}
              className="p-3.5 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 transition cursor-pointer flex items-center gap-2 text-xs font-bold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{isRtl ? 'تسجيل الخروج' : 'Logout'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Admin Layout: Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs h-fit">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-2">
            {isRtl ? 'أقسام لوحة التحكم' : 'Control Sections'}
          </span>

          {navItems.map(item => {
            const Icon = item.icon;
            const isAllowed = permissions?.allowedSections.includes(item.id);
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full p-3 rounded-2xl flex items-center justify-between text-xs font-bold transition cursor-pointer ${
                  isActive 
                    ? 'bg-[#005A36] text-white shadow-md shadow-emerald-950/20' 
                    : isAllowed 
                      ? 'text-slate-700 hover:bg-slate-50 hover:text-slate-900' 
                      : 'text-slate-400 opacity-60 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{isRtl ? item.labelAr : item.labelEn}</span>
                </div>

                {!isAllowed && (
                  <Lock className="w-3.5 h-3.5 text-slate-400" title={isRtl ? 'غير مصرح بهذا الدور' : 'Restricted'} />
                )}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {/* Permission Gate */}
          {!isSectionAllowed ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-xs text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {isRtl ? 'عفواً، لا تملك صلاحية الوصول لهذا القسم' : 'Access Restricted'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {isRtl 
                  ? `دورك الإداري الحالي (${activeRole} - ${permissions?.labelAr}) غير مخول بالدخول إلى قسم (${activeSection}). يمكنك التبديل إلى دور SUPER_ADMIN من إدارة المستخدمين لاختبار كافة الصلاحيات.`
                  : `Your role (${activeRole}) does not have permission to access (${activeSection}).`}
              </p>
              <button
                onClick={() => setActiveSection('users')}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                {isRtl ? 'الانتقال إلى مصفوفة الصلاحيات (RBAC)' : 'Go to RBAC Matrix'}
              </button>
            </div>
          ) : (
            <>
              {/* 1. OVERVIEW & KPIS */}
              {activeSection === 'statistics' && (
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                      <span className="text-[11px] font-bold text-slate-500">{isRtl ? 'المقاعد المخصصة' : 'Total Quota'}</span>
                      <div className="text-2xl font-black text-slate-900">
                        {tracks.reduce((acc, t) => acc + t.allocatedSeats, 0).toLocaleString()}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {isRtl ? 'مستهدفات رؤية 2030' : 'Vision 2030 Target'}
                      </span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                      <span className="text-[11px] font-bold text-slate-500">{isRtl ? 'المسارات الاستراتيجية' : 'Active Tracks'}</span>
                      <div className="text-2xl font-black text-[#005A36]">
                        {tracks.filter(t => t.isActive).length} / {tracks.length}
                      </div>
                      <span className="text-[10px] text-slate-400">{isRtl ? 'مسارات معتمدة' : 'Accredited Tracks'}</span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                      <span className="text-[11px] font-bold text-slate-500">{isRtl ? 'الجامعات المعتمدة' : 'Accredited Universities'}</span>
                      <div className="text-2xl font-black text-indigo-700">
                        {universities.length}
                      </div>
                      <span className="text-[10px] text-slate-400">{isRtl ? 'عبر 18 دولة حول العالم' : 'Across 18 Countries'}</span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                      <span className="text-[11px] font-bold text-slate-500">{isRtl ? 'زوار المنصة هذا الشهر' : 'Monthly Visitors'}</span>
                      <div className="text-2xl font-black text-purple-700">
                        342,850
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold">{isRtl ? '+18.4% نمو إقبال' : '+18.4% Growth'}</span>
                    </div>
                  </div>

                  {/* Summary of Platform Content */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#005A36]" />
                      <span>{isRtl ? 'حالة جاهزية المحتوى الرقمي المتاح للعامة' : 'Public Digital Content Health'}</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-800 block">الصفحات المنشورة</span>
                        <div className="text-xl font-bold text-slate-900 font-mono">
                          {cmsPages.filter(p => p.status === 'published').length} / {cmsPages.length}
                        </div>
                        <p className="text-[11px] text-slate-500">تم نشرها ومتاحة للزوار على البوابة</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-800 block">الأسئلة الشائعة النشطة</span>
                        <div className="text-xl font-bold text-slate-900 font-mono">
                          {faqsList.length}
                        </div>
                        <p className="text-[11px] text-slate-500">إجابات رسمية مصنفة تدعم الشات بوت</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-800 block">الوسائط المرفوعة والمفحوصة</span>
                        <div className="text-xl font-bold text-slate-900 font-mono">
                          {mediaList.length}
                        </div>
                        <p className="text-[11px] text-slate-500">مفحوصة أمنياً ومجهزة بالنصوص البديلة</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. TRACKS MANAGER */}
              {activeSection === 'tracks' && (
                <AdminTracksManager
                  tracks={tracks}
                  onUpdateTracks={handleUpdateTracks}
                  canEdit={permissions?.canEdit}
                  onPreviewTrack={id => onPreviewTrack && onPreviewTrack(id)}
                />
              )}

              {/* 3. UNIVERSITIES & MAJORS */}
              {activeSection === 'universities' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {isRtl ? 'دليل الجامعات العالمية والتخصصات المعتمدة' : 'Accredited Universities & Majors'}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {isRtl ? 'استعراض الجامعات المصنفة عالمياً حسب المسارات الأكاديمية' : 'Curated list of world-ranked universities eligible for scholarship tracks'}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-mono text-xs font-bold">
                      {universities.length} {isRtl ? 'جامعة' : 'Universities'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {universities.map(u => (
                      <div key={u.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">{u.nameAr}</span>
                          <span className="text-[11px] text-slate-500 font-mono">{u.nameEn} • {u.country}</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-[#005A36] font-mono font-bold text-xs">
                          Rank #{u.ranking}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. COUNTRIES */}
              {activeSection === 'countries' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <h2 className="text-lg font-bold text-slate-900">
                    {isRtl ? 'دول الابتعاث والملحقيات الثقافية' : 'Scholarship Host Countries & Missions'}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {INITIAL_COUNTRIES.map(c => (
                      <div key={c.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{c.flag}</span>
                            <div>
                              <h4 className="text-xs font-bold text-slate-900">{c.nameAr}</h4>
                              <span className="text-[10px] text-slate-400 font-mono">{c.nameEn}</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
                            {c.region}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 flex justify-between border-t border-slate-100 pt-2">
                          <span>الملحقية: {c.culturalMissionCity}</span>
                          <span className="font-bold text-[#005A36]">{c.approvedUniversitiesCount} جامعة معتمدة</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. FAQS */}
              {activeSection === 'faqs' && (
                <AdminFaqManager
                  faqs={faqsList}
                  onUpdateFaqs={setFaqsList}
                  canEdit={permissions?.canEdit}
                />
              )}

              {/* 6. NEWS */}
              {activeSection === 'news' && (
                <AdminNewsManager
                  articles={newsList}
                  onUpdateArticles={setNewsList}
                  canEdit={permissions?.canEdit}
                  canPublish={permissions?.canPublish}
                />
              )}

              {/* 7. CMS PAGE BUILDER */}
              {activeSection === 'pages' && (
                <AdminPageBuilder
                  pages={cmsPages}
                  onSavePage={handleSavePage}
                  canEdit={permissions?.canEdit}
                  canPublish={permissions?.canPublish}
                />
              )}

              {/* 8. MEDIA LIBRARY */}
              {activeSection === 'media' && (
                <AdminMediaLibrary
                  mediaList={mediaList}
                  onAddMedia={handleAddMedia}
                  onDeleteMedia={handleDeleteMedia}
                  onUpdateMedia={handleUpdateMedia}
                  canEdit={permissions?.canEdit}
                />
              )}

              {/* 9. AI MANAGER */}
              {activeSection === 'ai' && (
                <AdminAiManager
                  canEdit={permissions?.canEdit}
                />
              )}

              {/* 10. USERS & RBAC */}
              {activeSection === 'users' && (
                <AdminUsersManager
                  users={adminUsers}
                  activeRole={activeRole}
                  onSwitchRole={setActiveRole}
                  onUpdateUserRole={handleUpdateUserRole}
                  canManageUsers={permissions?.canManageUsers}
                />
              )}

              {/* 11. AUDIT LOGS */}
              {activeSection === 'audit' && (
                <AdminAuditLog
                  logs={auditLogs}
                />
              )}

              {/* 12. SETTINGS */}
              {activeSection === 'settings' && (
                <AdminSettingsManager
                  settings={systemSettings}
                  onUpdateSettings={handleUpdateSettings}
                  canManageSettings={permissions?.canManageSettings}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
