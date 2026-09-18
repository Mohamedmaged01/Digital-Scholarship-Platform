import React, { useState } from 'react';
import { AdminAuditEntry } from './adminTypes';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  User, 
  Activity, 
  ArrowRight, 
  X,
  FileCode
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface AdminAuditLogProps {
  logs: AdminAuditEntry[];
}

export const AdminAuditLog: React.FC<AdminAuditLogProps> = ({ logs }) => {
  const { isRtl } = useLanguage();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [selectedEntry, setSelectedEntry] = useState<AdminAuditEntry | null>(null);

  const filteredLogs = logs.filter(entry => {
    const matchesSearch = 
      entry.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.targetEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.ipAddress.includes(searchQuery);

    const matchesAction = actionFilter === 'ALL' || entry.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  const getActionBadgeColor = (action: AdminAuditEntry['action']) => {
    switch (action) {
      case 'PUBLISH':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'CREATE':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'UPDATE':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'DELETE':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'ROLLBACK':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isRtl ? 'سجل الرقابة والتدقيق الأمني الشامل (Audit Logs)' : 'Immutable Audit Logs & Security Trace'}
            </h2>
            <p className="text-xs text-slate-500">
              {isRtl ? 'توثيق غير قابل للتعديل لجميع عمليات الإنشاء والتعديل والنشر واستعادة النسخ السابقة' : 'Tamper-evident activity logs recording actors, roles, IPs, and state diffs'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <Activity className="w-3.5 h-3.5 text-emerald-600" />
          <span>{filteredLogs.length} {isRtl ? 'سجل مدقق' : 'logged events'}</span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={isRtl ? 'بحث باسم المسؤول، الكيان المستهدف، التفاصيل، أو عنوان الـ IP...' : 'Search actor, entity, details, or IP...'}
            className={`w-full py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-[#005A36] ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">{isRtl ? 'نوع العملية:' : 'Action:'}</span>
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
          >
            <option value="ALL">{isRtl ? 'جميع العمليات' : 'All Actions'}</option>
            <option value="PUBLISH">PUBLISH</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="ROLLBACK">ROLLBACK</option>
          </select>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">{isRtl ? 'الوقت والتاريخ' : 'Timestamp'}</th>
                <th className="p-3.5">{isRtl ? 'المستخدم المنفذ والدور' : 'Actor & Role'}</th>
                <th className="p-3.5">{isRtl ? 'العملية' : 'Action'}</th>
                <th className="p-3.5">{isRtl ? 'الكيان المستهدف' : 'Target Entity'}</th>
                <th className="p-3.5">{isRtl ? 'التفاصيل' : 'Details'}</th>
                <th className="p-3.5 font-mono">{isRtl ? 'عنوان IP' : 'IP Address'}</th>
                <th className="p-3.5 text-center">{isRtl ? 'مقارنة (Diff)' : 'Diff'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map(entry => (
                <tr key={entry.id} className="hover:bg-slate-50/70 transition font-sans">
                  <td className="p-3.5 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                    {entry.timestamp}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="font-bold text-slate-900 block">{entry.actorName}</span>
                    <span className="text-[10px] font-mono text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">
                      {entry.actorRole}
                    </span>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-black border ${getActionBadgeColor(entry.action)}`}>
                      {entry.action}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-slate-800 whitespace-nowrap">
                    {entry.targetEntity}
                  </td>
                  <td className="p-3.5 text-slate-600 max-w-xs truncate" title={entry.details}>
                    {entry.details}
                  </td>
                  <td className="p-3.5 font-mono text-slate-400 text-[11px]">
                    {entry.ipAddress}
                  </td>
                  <td className="p-3.5 text-center">
                    {(entry.previousValue || entry.newValue) && (
                      <button
                        onClick={() => setSelectedEntry(entry)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                        title={isRtl ? 'عرض الفروقات' : 'View Diff'}
                      >
                        <FileCode className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'فحص' : 'Diff'}</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: DIFF VIEWER */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isRtl ? 'فحص التغييرات والمقارنة (Audit Diff Viewer)' : 'Audit State Diff Viewer'}
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  {selectedEntry.targetEntity} • {selectedEntry.timestamp}
                </span>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
                <span className="text-rose-700 font-bold block text-[11px]">
                  {isRtl ? '🔴 القيمة السابقة (Previous State):' : '🔴 Previous State:'}
                </span>
                <pre className="text-rose-900 whitespace-pre-wrap break-all text-xs">
                  {selectedEntry.previousValue || '(None / Created)'}
                </pre>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <span className="text-emerald-700 font-bold block text-[11px]">
                  {isRtl ? '🟢 القيمة الجديدة (New State):' : '🟢 New State:'}
                </span>
                <pre className="text-emerald-900 whitespace-pre-wrap break-all text-xs">
                  {selectedEntry.newValue || '(None / Deleted)'}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                {isRtl ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
