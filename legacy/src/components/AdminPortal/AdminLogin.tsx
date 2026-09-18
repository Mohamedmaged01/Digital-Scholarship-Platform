import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  User, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Building2, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  Clock, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { AdminAuthService, AdminAuthUser } from '../../services/adminAuthService';
import { AdminRole } from '../../types';
import { ADMIN_ROLE_PERMISSIONS } from './adminData';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminAuthUser) => void;
  onBackToHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToHome
}) => {
  const { isRtl } = useLanguage();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'login' | 'matrix'>('login');

  // Pre-set demo accounts for development / audit review
  const demoAccounts: { role: AdminRole; username: string; labelAr: string; name: string }[] = [
    { role: 'SUPER_ADMIN', username: 'super.admin', labelAr: 'المشرف العام (صلاحيات كاملة)', name: 'د. عبدالإله الغامدي' },
    { role: 'CONTENT_MANAGER', username: 'content.lead', labelAr: 'مدير المحتوى والصفحات', name: 'أ. فهد الدوسري' },
    { role: 'SCHOLARSHIP_MANAGER', username: 'tracks.manager', labelAr: 'مدير المسارات والشروط', name: 'د. سارة التميمي' },
    { role: 'UNIVERSITY_MANAGER', username: 'uni.manager', labelAr: 'مدير الجامعات والتصنيف', name: 'م. راشد المري' },
    { role: 'AI_MANAGER', username: 'ai.director', labelAr: 'مدير الذكاء الاصطناعي', name: 'م. نوف الشهراني' },
    { role: 'VIEWER', username: 'viewer.auditor', labelAr: 'مراقب / مدقق (قراءة فقط)', name: 'أ. منيرة العجمي' }
  ];

  const handleSelectDemo = (user: string) => {
    setUsername(user);
    setPassword('Admin@Kasp2026!');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password) {
      setErrorMessage(isRtl ? 'يرجى إدخال اسم المستخدم أو البريد وكلمة المرور' : 'Please provide username/email and password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await AdminAuthService.login(username.trim(), password);
      onLoginSuccess(response.user);
    } catch (err: any) {
      setErrorMessage(err.message || (isRtl ? 'فشل التحقق من بيانات الدخول الإداري' : 'Login failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Top Breadcrumb & Return to Public Portal */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#005A36] bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs hover:border-[#005A36]/40 transition cursor-pointer"
        >
          <ArrowRight className={`w-4 h-4 ${isRtl ? '' : 'rotate-180'}`} />
          <span>{isRtl ? 'العودة إلى البوابة التعريفية للعموم' : 'Return to Public Scholarship Portal'}</span>
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{isRtl ? 'منطقة إدارية مخصصة لمنسوبي الوزارة فقط' : 'Ministry Staff & Administrators Only'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Login Card (Left/Center) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          
          {/* Header Bar */}
          <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-[#003822] p-6 text-white relative">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-emerald-400">
                <Lock className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono tracking-widest text-emerald-300 uppercase px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30">
                RBAC Security v2.4
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black mt-4 text-white">
              {isRtl ? 'تسجيل الدخول الإداري الموحد' : 'Unified Administrative Access'}
            </h1>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {isRtl 
                ? 'لوحة إدارة منصة برنامج خادم الحرمين الشريفين للابتعاث (KASP Admin Portal). مخصص لموظفي الوزارة والمشرفين الأكاديميين.' 
                : 'Ministry of Education administrative portal. Authorized personnel only.'}
            </p>
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-8 space-y-6">

            {/* Public Student Redirection Notice */}
            <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3">
              <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-emerald-950">
                  {isRtl ? 'تنبيه للمتقدمين والطلاب:' : 'Note for Scholarship Applicants:'}
                </p>
                <p className="text-emerald-800 mt-0.5">
                  {isRtl 
                    ? 'هذا النموذج مخصص لمشرفي وموظفي الوزارة فقط. للتقديم على الابتعاث، يرجى التوجه للمنصة الرسمية.' 
                    : 'This login is for administrators only. Students must apply via the official MOE portal.'}
                </p>
                <a
                  href="https://kasp.moe.gov.sa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#005A36] hover:underline mt-1.5"
                >
                  <span>{isRtl ? 'الانتقال إلى منصة التقديم الرسمية' : 'Go to Official Application Portal'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-rose-900">{isRtl ? 'تعذر إتمام الدخول الإداري' : 'Access Denied'}</h4>
                  <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username / Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isRtl ? 'اسم المستخدم أو البريد الإداري الوزاري (@moe.gov.sa)' : 'Username or Ministry Email'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder={isRtl ? 'super.admin أو admin.kasp@moe.gov.sa' : 'super.admin or admin@moe.gov.sa'}
                    className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#005A36] focus:ring-2 focus:ring-[#005A36]/20 text-xs font-medium text-slate-900 placeholder:text-slate-400 transition"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isRtl ? 'كلمة المرور المشفرة' : 'Secure Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full ps-10 pe-11 py-2.5 rounded-xl border border-slate-300 focus:border-[#005A36] focus:ring-2 focus:ring-[#005A36]/20 text-xs font-medium text-slate-900 placeholder:text-slate-400 transition"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 end-0 pe-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Assistance */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#005A36] border-slate-300 focus:ring-[#005A36]"
                  />
                  <span>{isRtl ? 'تذكر بيانات الجلسة الإدارية' : 'Remember admin session'}</span>
                </label>

                <span className="text-slate-400 text-[11px]">
                  {isRtl ? 'حماية مشددة (Deny by Default)' : 'Deny by Default RBAC'}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#005A36] hover:bg-[#00482B] text-white font-bold text-xs shadow-md shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{isRtl ? 'جارٍ التحقق من الصلاحيات وتوليد التوكن...' : 'Verifying RBAC token...'}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isRtl ? 'الدخول إلى لوحة التحكم الإدارية' : 'Sign in to Admin Dashboard'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Development Stage Notice */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{isRtl ? 'المصادقة: تشفير PBKDF2/SHA-512' : 'PBKDF2/SHA-512 Security'}</span>
              </span>
              <span className="font-mono text-[11px] text-slate-400">Port 3000 / Session TTL: 24h</span>
            </div>

          </div>
        </div>

        {/* Right Column: Fast Demo Access & Development Permission Preview (Master Prompt Requirements) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Fast Quick-Switch Accounts Card (Development & Testing Helper) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <h3 className="text-xs font-bold text-slate-900">
                  {isRtl ? 'حسابات التجربة والاختبار (مرحلة التطوير)' : 'Quick Test Credentials'}
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-[#005A36] font-bold">
                Dev Preview
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {isRtl 
                ? 'انقر على أي حساب لاختبار مصفوفة الصلاحيات الخاصة به وتعبئة النموذج تلقائيًا. كلمة المرور الموحدة:' 
                : 'Click any role to populate credentials for testing. Default password:'}
              <code className="mx-1 px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-slate-800 font-bold">Admin@Kasp2026!</code>
            </p>

            <div className="space-y-2 pt-1">
              {demoAccounts.map(account => {
                const isCurrentSelected = username === account.username;
                return (
                  <button
                    key={account.role}
                    type="button"
                    onClick={() => handleSelectDemo(account.username)}
                    className={`w-full text-start p-2.5 rounded-xl border text-xs transition flex items-center justify-between cursor-pointer ${
                      isCurrentSelected
                        ? 'border-[#005A36] bg-emerald-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{account.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {account.role}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">{account.labelAr}</span>
                    </div>

                    <span className="text-[11px] font-bold text-[#005A36] shrink-0">
                      {isRtl ? 'اختيار' : 'Select'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Temporary Permission Preview Card (Mandated by MASTER PROMPT for design phase) */}
          <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white">
                  {isRtl ? 'بطاقة استعراض الصلاحيات (معاينة مؤقتة)' : 'Permission Preview Card'}
                </h4>
              </div>
              <span className="text-[10px] text-amber-300 font-mono bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                مؤقت للتطوير
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isRtl 
                ? 'تساعد هذه البطاقة مهندسي النظام على معاينة حدود الوصول والتنقل الديناميكي قبل وبعد تسجيل الدخول الفعلي.' 
                : 'Visualizes role-based navigation and permissions matrix for active verification.'}
            </p>

            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">{isRtl ? 'الحساب المحدد حاليًا:' : 'Selected User:'}</span>
                <span className="font-mono text-emerald-300 font-bold">{username || 'لم يتم التحديد'}</span>
              </div>
              
              {username && demoAccounts.find(d => d.username === username) && (
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">
                    {isRtl ? 'الأقسام المسموح له بالوصول إليها:' : 'Permitted Dashboard Sections:'}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {ADMIN_ROLE_PERMISSIONS[demoAccounts.find(d => d.username === username)!.role]?.allowedSections.map(s => (
                      <span key={s} className="px-1.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-700/50 text-[10px] text-emerald-300 font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
              <span>{isRtl ? 'التحقق البرمجي: خادم Express + JWT' : 'Security: Express backend + JWT'}</span>
              <span className="text-emerald-400">Deny by Default</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
