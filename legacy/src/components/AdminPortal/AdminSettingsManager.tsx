import React, { useState } from 'react';
import { SystemSettingsState } from './adminTypes';
import { 
  Settings, 
  Save, 
  AlertTriangle, 
  RefreshCw, 
  Globe, 
  Phone, 
  Mail, 
  Link2, 
  CheckCircle2, 
  ShieldAlert 
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface AdminSettingsManagerProps {
  settings: SystemSettingsState;
  onUpdateSettings: (newSettings: SystemSettingsState) => void;
  canManageSettings: boolean;
}

export const AdminSettingsManager: React.FC<AdminSettingsManagerProps> = ({
  settings,
  onUpdateSettings,
  canManageSettings
}) => {
  const { isRtl } = useLanguage();
  const [formData, setFormData] = useState<SystemSettingsState>({ ...settings });
  const [isPurgingCache, setIsPurgingCache] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageSettings) return;
    onUpdateSettings(formData);
    triggerToast(isRtl ? 'تم حفظ إعدادات النظام وتحديث المتغيرات بنجاح!' : 'Settings updated successfully!');
  };

  const handlePurgeCache = () => {
    if (!canManageSettings) return;
    setIsPurgingCache(true);
    setTimeout(() => {
      setIsPurgingCache(false);
      triggerToast(isRtl ? 'تم تفريغ ذاكرة التخزين المؤقت (CDN Cache Purged) بنجاح!' : 'CDN Cache purged successfully!');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-emerald-900 text-white font-bold text-sm shadow-2xl flex items-center gap-2 border border-emerald-500 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isRtl ? 'إعدادات المنصة والبنية التحتية (System & Infrastructure Settings)' : 'System & Infrastructure Settings'}
            </h2>
            <p className="text-xs text-slate-500">
              {isRtl ? 'الروابط الرسمية المعتمدة، وضع الصيانة، ومسح الذاكرة المؤقتة' : 'Configure official portal links, maintenance mode, and CDN cache'}
            </p>
          </div>
        </div>

        {canManageSettings && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePurgeCache}
              disabled={isPurgingCache}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPurgingCache ? 'animate-spin' : ''}`} />
              <span>{isRtl ? 'تفريغ الـ CDN Cache' : 'Purge Cache'}</span>
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-[#005A36] hover:bg-[#004328] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/20 cursor-pointer transition"
            >
              <Save className="w-4 h-4" />
              <span>{isRtl ? 'حفظ الإعدادات' : 'Save Settings'}</span>
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Card 1: Official Portal Integration */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
            <Link2 className="w-4 h-4 text-[#005A36]" />
            <span>{isRtl ? 'توجيه التقديم الرسمي (Official Portal Integration)' : 'Official Portal Integration'}</span>
          </h3>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              {isRtl ? 'رابط بوابة التقديم الرسمية المعتمدة:' : 'Official Application Portal URL:'}
            </label>
            <input
              type="url"
              required
              value={formData.officialApplicationUrl}
              onChange={e => setFormData({ ...formData, officialApplicationUrl: e.target.value })}
              disabled={!canManageSettings}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:border-[#005A36] focus:outline-hidden"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              {isRtl ? 'جميع أزرار "قدم الآن" في المنصة العامة توجه فورياً لهذا الرابط المعتمد.' : 'All "Apply Now" buttons redirect to this official endpoint.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">البريد الإلكتروني للدعم:</label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={e => setFormData({ ...formData, supportEmail: e.target.value })}
                disabled={!canManageSettings}
                className="w-full p-2 rounded-xl border border-slate-300 font-mono text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">الرقم الموحد المعتمد:</label>
              <input
                type="text"
                value={formData.hotlinePhone}
                onChange={e => setFormData({ ...formData, hotlinePhone: e.target.value })}
                disabled={!canManageSettings}
                className="w-full p-2 rounded-xl border border-slate-300 font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Security & Maintenance */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>{isRtl ? 'وضع الصيانة والتحكم بالنظام' : 'Maintenance & Availability'}</span>
          </h3>

          <div className={`p-4 rounded-xl border flex items-center justify-between ${formData.maintenanceMode ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
            <div>
              <span className="font-bold text-slate-900 block">
                {isRtl ? 'وضع الصيانة المجدولة (Maintenance Mode)' : 'Maintenance Mode'}
              </span>
              <span className="text-[11px] text-slate-500">
                {formData.maintenanceMode 
                  ? (isRtl ? 'تحذير: المنصة محجوبة حالياً للمستفيدين وتظهر شاشة الصيانة' : 'Warning: Public visitors currently see the maintenance page')
                  : (isRtl ? 'المنصة العامة تعمل بشكل طبيعي لجميع الزوار' : 'Platform is fully online and accessible')}
              </span>
            </div>

            <input
              type="checkbox"
              checked={formData.maintenanceMode}
              onChange={e => setFormData({ ...formData, maintenanceMode: e.target.checked })}
              disabled={!canManageSettings}
              className="w-5 h-5 rounded text-rose-600 cursor-pointer"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              مدة الاحتفاظ بذاكرة التخزين (Cache TTL بالثواني):
            </label>
            <input
              type="number"
              value={formData.cacheTtlSeconds}
              onChange={e => setFormData({ ...formData, cacheTtlSeconds: Number(e.target.value) })}
              disabled={!canManageSettings}
              className="w-full p-2 rounded-xl border border-slate-300 font-mono text-xs"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
