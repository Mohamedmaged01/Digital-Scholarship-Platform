import React, { useState } from 'react';
import { AdminRole, AdminUser } from './adminTypes';
import { ADMIN_ROLE_PERMISSIONS } from './adminData';
import { 
  Users, 
  ShieldCheck, 
  Check, 
  X, 
  Edit2, 
  UserPlus, 
  Lock, 
  Key, 
  RefreshCw 
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface AdminUsersManagerProps {
  users: AdminUser[];
  activeRole: AdminRole;
  onSwitchRole: (role: AdminRole) => void;
  onUpdateUserRole: (userId: string, newRole: AdminRole) => void;
  canManageUsers: boolean;
}

export const AdminUsersManager: React.FC<AdminUsersManagerProps> = ({
  users,
  activeRole,
  onSwitchRole,
  onUpdateUserRole,
  canManageUsers
}) => {
  const { isRtl } = useLanguage();
  const [activeTab, setActiveTab] = useState<'users' | 'matrix'>('users');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const rolesList: AdminRole[] = [
    'SUPER_ADMIN',
    'CONTENT_MANAGER',
    'SCHOLARSHIP_MANAGER',
    'UNIVERSITY_MANAGER',
    'FAQ_MANAGER',
    'MEDIA_MANAGER',
    'SEO_MANAGER',
    'AI_MANAGER',
    'EDITOR',
    'VIEWER'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {isRtl ? 'إدارة المستخدمين والأدوار الإدارية (RBAC Control)' : 'Admin Users & RBAC Permissions Matrix'}
          </h2>
          <p className="text-xs text-slate-500">
            {isRtl ? 'تحديد وتخصيص صلاحيات الوصول والتحكم لـ 10 أدوار وظيفية معتمدة بالوزارة' : 'Granular Role-Based Access Control matrix across 10 official ministry roles'}
          </p>
        </div>

        {/* Fast Switch Role Bar for Testing (Mandated by Section 16) */}
        <div className="flex items-center gap-2 bg-indigo-50/70 p-2 rounded-xl border border-indigo-200">
          <Key className="w-4 h-4 text-indigo-700 shrink-0" />
          <span className="text-xs font-bold text-indigo-900">
            {isRtl ? 'اختبار الصلاحية الحالية:' : 'Active Test Role:'}
          </span>
          <select
            value={activeRole}
            onChange={e => onSwitchRole(e.target.value as AdminRole)}
            className="px-2.5 py-1 text-xs font-bold font-mono rounded-lg border border-indigo-300 bg-white text-indigo-900"
          >
            {rolesList.map(r => (
              <option key={r} value={r}>
                {r} ({ADMIN_ROLE_PERMISSIONS[r]?.labelAr})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'users' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
        >
          {isRtl ? 'قائمة المسؤولين والمشرفين' : 'Admin Staff List'}
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'matrix' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
        >
          {isRtl ? 'مصفوفة الصلاحيات (10 أدوار)' : 'Permission Matrix (10 Roles)'}
        </button>
      </div>

      {/* 1. USERS LIST */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">{isRtl ? 'المسؤول' : 'Staff Member'}</th>
                  <th className="p-3.5">{isRtl ? 'الإدارة / القسم' : 'Department'}</th>
                  <th className="p-3.5">{isRtl ? 'الدور الوظيفي' : 'Role'}</th>
                  <th className="p-3.5">{isRtl ? 'الحالة' : 'Status'}</th>
                  <th className="p-3.5">{isRtl ? 'آخر نشاط' : 'Last Active'}</th>
                  <th className="p-3.5 text-center">{isRtl ? 'تعديل الدور' : 'Edit Role'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#005A36] font-bold flex items-center justify-center text-xs">
                          {u.nameAr.slice(0, 1)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{u.nameAr}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-700">{u.department}</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold font-mono text-[11px] border border-indigo-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {u.status === 'active' ? (isRtl ? 'نشط' : 'Active') : (isRtl ? 'معطل' : 'Inactive')}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 text-[11px]">{u.lastActive}</td>
                    <td className="p-3.5 text-center">
                      {canManageUsers ? (
                        <select
                          value={u.role}
                          onChange={e => onUpdateUserRole(u.id, e.target.value as AdminRole)}
                          className="p-1.5 rounded-lg border border-slate-300 text-[11px] font-bold bg-white text-slate-800 cursor-pointer"
                        >
                          {rolesList.map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. PERMISSION MATRIX */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">{isRtl ? 'الدور الإداري' : 'Role'}</th>
                  <th className="p-3">{isRtl ? 'الأقسام المسموحة' : 'Allowed Sections'}</th>
                  <th className="p-3 text-center">{isRtl ? 'تعديل (Edit)' : 'Edit'}</th>
                  <th className="p-3 text-center">{isRtl ? 'نشر (Publish)' : 'Publish'}</th>
                  <th className="p-3 text-center">{isRtl ? 'إدارة المستخدمين' : 'Manage Users'}</th>
                  <th className="p-3 text-center">{isRtl ? 'إعدادات النظام' : 'System Settings'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rolesList.map(r => {
                  const perm = ADMIN_ROLE_PERMISSIONS[r];
                  return (
                    <tr key={r} className={`hover:bg-slate-50 transition ${activeRole === r ? 'bg-indigo-50/50' : ''}`}>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">{r}</span>
                          {activeRole === r && (
                            <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[9px] font-bold">
                              {isRtl ? 'أنت هنا' : 'Active'}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 block">{perm?.labelAr}</span>
                      </td>
                      <td className="p-3 text-slate-600 max-w-md">
                        <div className="flex flex-wrap gap-1">
                          {perm?.allowedSections.map(s => (
                            <span key={s} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        {perm?.canEdit ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                      </td>
                      <td className="p-3 text-center">
                        {perm?.canPublish ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                      </td>
                      <td className="p-3 text-center">
                        {perm?.canManageUsers ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                      </td>
                      <td className="p-3 text-center">
                        {perm?.canManageSettings ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
