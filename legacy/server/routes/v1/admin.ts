import { Router, Request, Response } from 'express';
import { DatabaseService } from '../../core/database';
import { generateToken } from '../../core/securityUtils';
import { authRateLimiter, sendApiResponse, sendApiError } from '../../middleware/security';
import { authMiddleware, requireAdminAuth, requirePermission } from '../../middleware/auth';
import { ADMIN_ROLE_PERMISSIONS } from '../../../src/components/AdminPortal/adminData';
import { AdminRole, AdminPermission } from '../../../src/types';

export const adminRouter = Router();

/**
 * 1. Admin Authentication Endpoint (POST /api/v1/admin/auth/login)
 * Strictly for Ministry Admin Staff. Real password verification & rate limiting.
 */
adminRouter.post('/auth/login', authRateLimiter, async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const identifier = username || email;

    if (!identifier || !password) {
      return sendApiError(
        res, 
        400, 
        'MISSING_CREDENTIALS', 
        'يرجى إدخال اسم المستخدم أو البريد الإلكتروني وكلمة المرور'
      );
    }

    const authResult = DatabaseService.authenticateAdmin(identifier, password);

    if (!authResult.success || !authResult.user) {
      return sendApiError(
        res, 
        401, 
        'AUTH_FAILED', 
        authResult.error || 'فشل التحقق من بيانات الدخول الإداري'
      );
    }

    const user = authResult.user;
    const token = generateToken(user.id, user.role, user.permissions);

    // Provide complete profile, permissions and authorized navigation sections
    const roleMeta = ADMIN_ROLE_PERMISSIONS[user.role as AdminRole] || {
      labelAr: user.role,
      labelEn: user.role,
      allowedSections: ['statistics']
    };

    return sendApiResponse(res, 200, {
      token,
      user: {
        id: user.id,
        username: user.username,
        fullNameAr: user.fullNameAr,
        fullNameEn: user.fullNameEn,
        email: user.email,
        role: user.role,
        roleLabelAr: roleMeta.labelAr,
        roleLabelEn: roleMeta.labelEn,
        department: user.department || 'وكالة الوزارة للابتعاث',
        avatarUrl: user.avatarUrl,
        permissions: user.permissions,
        allowedSections: roleMeta.allowedSections,
        lastLogin: user.lastLogin
      },
      expiresInSeconds: 86400 // 24 hours
    });
  } catch (err: any) {
    return sendApiError(res, 500, 'SERVER_ERROR', err.message || 'حدث خطأ غير متوقع في خادم المصادقة');
  }
});

/**
 * 2. Get Current Authenticated Admin Profile & Active Permissions (GET /api/v1/admin/auth/me)
 */
adminRouter.get('/auth/me', authMiddleware, requireAdminAuth, (req: Request, res: Response) => {
  const user = req.user!;
  const adminUser = DatabaseService.getAdminUserById(user.id);
  const role = (adminUser?.role || user.adminRole || 'VIEWER') as AdminRole;
  const roleMeta = ADMIN_ROLE_PERMISSIONS[role] || {
    labelAr: role,
    labelEn: role,
    allowedSections: ['statistics']
  };

  return sendApiResponse(res, 200, {
    id: user.id,
    username: adminUser?.username || user.id,
    fullNameAr: adminUser?.fullNameAr || user.fullName,
    fullNameEn: adminUser?.fullNameEn || '',
    email: user.email,
    role: role,
    roleLabelAr: roleMeta.labelAr,
    roleLabelEn: roleMeta.labelEn,
    department: adminUser?.department || user.department || 'وكالة الوزارة للابتعاث',
    avatarUrl: adminUser?.avatarUrl,
    permissions: adminUser?.permissions || user.permissions || [],
    allowedSections: roleMeta.allowedSections,
    lastLogin: adminUser?.lastLogin || new Date().toISOString()
  });
});

/**
 * 3. Logout endpoint (audit logging + client state invalidation)
 */
adminRouter.post('/auth/logout', authMiddleware, (req: Request, res: Response) => {
  if (req.user && req.user.adminRole) {
    DatabaseService.recordAudit({
      actorId: req.user.id,
      actorName: req.user.fullName,
      actorRole: req.user.adminRole,
      action: 'LOGIN',
      entityType: 'SETTINGS',
      entityId: req.user.id,
      ipAddress: req.ip || '127.0.0.1',
      changesSummary: `تسجيل خروج إداري للمستخدم ${req.user.fullName}`
    });
  }
  return sendApiResponse(res, 200, { message: 'تم تسجيل الخروج الإداري بنجاح' });
});

/**
 * 4. Get All Admin Users (Protected by users:manage or SUPER_ADMIN)
 */
adminRouter.get('/users', authMiddleware, requireAdminAuth, requirePermission('users:manage'), (req: Request, res: Response) => {
  const users = DatabaseService.getAdminUsers();
  return sendApiResponse(res, 200, users);
});

/**
 * 5. Get Audit Logs (Protected by audit:read)
 */
adminRouter.get('/audit-logs', authMiddleware, requireAdminAuth, requirePermission('audit:read'), (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
  const logs = DatabaseService.getAuditLogs(limit);
  return sendApiResponse(res, 200, logs);
});

/**
 * 6. Get Permissions Reference Matrix & Pre-configured Staff accounts for preview
 */
adminRouter.get('/permissions-matrix', (req: Request, res: Response) => {
  return sendApiResponse(res, 200, {
    roles: ADMIN_ROLE_PERMISSIONS,
    availablePermissions: [
      { id: 'pages:write', labelAr: 'إدارة وتعديل صفحات الموقع ونشرها' },
      { id: 'tracks:write', labelAr: 'إدارة وتعديل مسارات الابتعاث وشروطها' },
      { id: 'universities:write', labelAr: 'إدارة الجامعات المصنفة والتخصصات' },
      { id: 'faqs:write', labelAr: 'إدارة الأسئلة الشائعة وتصنيفاتها' },
      { id: 'news:write', labelAr: 'تحرير ونشر الأخبار والإعلانات الصحفية' },
      { id: 'media:write', labelAr: 'رفع وإدارة مكتبة الوسائط والمستندات' },
      { id: 'seo:write', labelAr: 'ضبط إعدادات محركات البحث والكلمات المفتاحية' },
      { id: 'ai:write', labelAr: 'تدريب وضبط محرك المستشار الذكي وقواعد البيانات' },
      { id: 'users:manage', labelAr: 'إدارة المستخدمين الإداريين ومصفوفة الصلاحيات' },
      { id: 'settings:write', labelAr: 'تعديل الإعدادات العامة للمنصة ووضع الصيانة' },
      { id: 'audit:read', labelAr: 'استعراض سجل التدقيق الأمني والأحداث' },
      { id: 'backup:manage', labelAr: 'تصدير واستعادة النسخ الاحتياطية' }
    ]
  });
});

/**
 * Helper to retrieve current actor for audit logging
 */
function getActor(req: Request) {
  const user = req.user!;
  const admin = DatabaseService.getAdminUserById(user.id);
  if (admin) return admin;
  return {
    id: user.id,
    username: user.id,
    fullNameAr: user.fullName || 'مشرف إداري',
    fullNameEn: '',
    email: user.email,
    role: (user.adminRole || 'SUPER_ADMIN') as AdminRole,
    permissions: user.permissions || [],
    isActive: true
  };
}

// ============================================================================
// 7. Users Management (CRUD) - Protected by users:manage
// ============================================================================
adminRouter.post('/users', authMiddleware, requireAdminAuth, requirePermission('users:manage'), (req: Request, res: Response) => {
  try {
    const { username, fullNameAr, fullNameEn, email, role, department, permissions, plainPassword } = req.body;
    if (!username || !fullNameAr || !email || !role) {
      return sendApiError(res, 400, 'VALIDATION_ERROR', 'يرجى تقديم كافة الحقول الإلزامية للمستخدم الإداري');
    }
    const actor = getActor(req);
    const newUser = DatabaseService.createAdminUser({
      username,
      fullNameAr,
      fullNameEn: fullNameEn || '',
      email,
      role: role as AdminRole,
      department: department || 'وكالة الابتعاث',
      permissions: permissions || (ADMIN_ROLE_PERMISSIONS[role as AdminRole]?.allowedSections ? [] : []),
      plainPassword: plainPassword || 'Kasp@2030!'
    }, actor);
    return sendApiResponse(res, 201, newUser);
  } catch (err: any) {
    return sendApiError(res, 500, 'SERVER_ERROR', err.message);
  }
});

adminRouter.put('/users/:id', authMiddleware, requireAdminAuth, requirePermission('users:manage'), (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const updated = DatabaseService.updateAdminUser(req.params.id, req.body, actor);
    if (!updated) {
      return sendApiError(res, 404, 'NOT_FOUND', 'المستخدم الإداري غير موجود');
    }
    return sendApiResponse(res, 200, updated);
  } catch (err: any) {
    return sendApiError(res, 500, 'SERVER_ERROR', err.message);
  }
});

adminRouter.delete('/users/:id', authMiddleware, requireAdminAuth, requirePermission('users:manage'), (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const success = DatabaseService.deleteAdminUser(req.params.id, actor);
    if (!success) {
      return sendApiError(res, 404, 'NOT_FOUND', 'المستخدم الإداري غير موجود أو تم حذفه مسبقاً');
    }
    return sendApiResponse(res, 200, { success: true, message: 'تم حذف حساب المستخدم بنجاح' });
  } catch (err: any) {
    return sendApiError(res, 400, 'OPERATION_DENIED', err.message);
  }
});

// ============================================================================
// 8. Tracks Management (CRUD) - Protected by tracks:write
// ============================================================================
adminRouter.get('/tracks', authMiddleware, requireAdminAuth, (req: Request, res: Response) => {
  return sendApiResponse(res, 200, DatabaseService.getAllTracks(false));
});

adminRouter.post('/tracks', authMiddleware, requireAdminAuth, requirePermission('tracks:write'), (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const track = DatabaseService.createTrack(req.body, actor);
    return sendApiResponse(res, 201, track);
  } catch (err: any) {
    return sendApiError(res, 400, 'CREATION_FAILED', err.message);
  }
});

adminRouter.put('/tracks/:id', authMiddleware, requireAdminAuth, requirePermission('tracks:write'), (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const track = DatabaseService.updateTrack(req.params.id, req.body, actor);
    if (!track) return sendApiError(res, 404, 'NOT_FOUND', 'المسار غير موجود');
    return sendApiResponse(res, 200, track);
  } catch (err: any) {
    return sendApiError(res, 400, 'UPDATE_FAILED', err.message);
  }
});

adminRouter.delete('/tracks/:id', authMiddleware, requireAdminAuth, requirePermission('tracks:write'), (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const success = DatabaseService.deleteTrack(req.params.id, actor);
    if (!success) return sendApiError(res, 404, 'NOT_FOUND', 'المسار غير موجود');
    return sendApiResponse(res, 200, { success: true });
  } catch (err: any) {
    return sendApiError(res, 400, 'DELETE_FAILED', err.message);
  }
});

// ============================================================================
// 9. Universities Management (CRUD) - Protected by universities:write
// ============================================================================
adminRouter.get('/universities', authMiddleware, requireAdminAuth, (req: Request, res: Response) => {
  return sendApiResponse(res, 200, DatabaseService.getUniversities());
});

adminRouter.post('/universities', authMiddleware, requireAdminAuth, requirePermission('universities:write'), (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const uni = DatabaseService.createUniversity(req.body, actor);
    return sendApiResponse(res, 201, uni);
  } catch (err: any) {
    return sendApiError(res, 400, 'CREATION_FAILED', err.message);
  }
});

adminRouter.put('/universities/:id', authMiddleware, requireAdminAuth, requirePermission('universities:write'), (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const uni = DatabaseService.updateUniversity(req.params.id, req.body, actor);
    if (!uni) return sendApiError(res, 404, 'NOT_FOUND', 'الجامعة غير موجودة');
    return sendApiResponse(res, 200, uni);
  } catch (err: any) {
    return sendApiError(res, 400, 'UPDATE_FAILED', err.message);
  }
});

adminRouter.delete('/universities/:id', authMiddleware, requireAdminAuth, requirePermission('universities:write'), (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const success = DatabaseService.deleteUniversity(req.params.id, actor);
    if (!success) return sendApiError(res, 404, 'NOT_FOUND', 'الجامعة غير موجودة');
    return sendApiResponse(res, 200, { success: true });
  } catch (err: any) {
    return sendApiError(res, 400, 'DELETE_FAILED', err.message);
  }
});

// ============================================================================
// 10. FAQs Management (CRUD) - Protected by faqs:write
// ============================================================================
adminRouter.get('/faqs', authMiddleware, requireAdminAuth, (req: Request, res: Response) => {
  return sendApiResponse(res, 200, DatabaseService.getFaqs());
});

adminRouter.post('/faqs', authMiddleware, requireAdminAuth, requirePermission('faqs:write'), (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const faq = DatabaseService.createFaq(req.body, actor);
    return sendApiResponse(res, 201, faq);
  } catch (err: any) {
    return sendApiError(res, 400, 'CREATION_FAILED', err.message);
  }
});

adminRouter.put('/faqs/:id', authMiddleware, requireAdminAuth, requirePermission('faqs:write'), (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const faq = DatabaseService.updateFaq(req.params.id, req.body, actor);
    if (!faq) return sendApiError(res, 404, 'NOT_FOUND', 'السؤال الشائع غير موجود');
    return sendApiResponse(res, 200, faq);
  } catch (err: any) {
    return sendApiError(res, 400, 'UPDATE_FAILED', err.message);
  }
});

adminRouter.delete('/faqs/:id', authMiddleware, requireAdminAuth, requirePermission('faqs:write'), (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const success = DatabaseService.deleteFaq(req.params.id, actor);
    if (!success) return sendApiError(res, 404, 'NOT_FOUND', 'السؤال الشائع غير موجود');
    return sendApiResponse(res, 200, { success: true });
  } catch (err: any) {
    return sendApiError(res, 400, 'DELETE_FAILED', err.message);
  }
});

// ============================================================================
// 11. News Management (CRUD) - Protected by news:write
// ============================================================================
adminRouter.get('/news', authMiddleware, requireAdminAuth, (req: Request, res: Response) => {
  return sendApiResponse(res, 200, DatabaseService.getNews(false));
});

adminRouter.post('/news', authMiddleware, requireAdminAuth, requirePermission('news:write'), (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const news = DatabaseService.createNews(req.body, actor);
    return sendApiResponse(res, 201, news);
  } catch (err: any) {
    return sendApiError(res, 400, 'CREATION_FAILED', err.message);
  }
});

adminRouter.put('/news/:id', authMiddleware, requireAdminAuth, requirePermission('news:write'), (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const news = DatabaseService.updateNews(req.params.id, req.body, actor);
    if (!news) return sendApiError(res, 404, 'NOT_FOUND', 'الخبر غير موجود');
    return sendApiResponse(res, 200, news);
  } catch (err: any) {
    return sendApiError(res, 400, 'UPDATE_FAILED', err.message);
  }
});

adminRouter.delete('/news/:id', authMiddleware, requireAdminAuth, requirePermission('news:write'), (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const success = DatabaseService.deleteNews(req.params.id, actor);
    if (!success) return sendApiError(res, 404, 'NOT_FOUND', 'الخبر غير موجود');
    return sendApiResponse(res, 200, { success: true });
  } catch (err: any) {
    return sendApiError(res, 400, 'DELETE_FAILED', err.message);
  }
});

// ============================================================================
// 12. Media Library Management - Protected by media:write
// ============================================================================
adminRouter.get('/media', authMiddleware, requireAdminAuth, (req: Request, res: Response) => {
  return sendApiResponse(res, 200, DatabaseService.getMediaLibrary());
});

adminRouter.post('/media', authMiddleware, requireAdminAuth, requirePermission('media:write'), (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const item = DatabaseService.addMedia(req.body, actor);
    return sendApiResponse(res, 201, item);
  } catch (err: any) {
    return sendApiError(res, 400, 'UPLOAD_FAILED', err.message);
  }
});

adminRouter.delete('/media/:id', authMiddleware, requireAdminAuth, requirePermission('media:write'), (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const success = DatabaseService.deleteMedia(req.params.id, actor);
    if (!success) return sendApiError(res, 404, 'NOT_FOUND', 'الملف غير موجود');
    return sendApiResponse(res, 200, { success: true });
  } catch (err: any) {
    return sendApiError(res, 400, 'DELETE_FAILED', err.message);
  }
});

// ============================================================================
// 13. CMS Page Builder & Version Control - Protected by pages:write
// ============================================================================
adminRouter.get('/cms/blocks', authMiddleware, requireAdminAuth, (req: Request, res: Response) => {
  return sendApiResponse(res, 200, DatabaseService.getPageBlocks());
});

adminRouter.put('/cms/blocks/:id', authMiddleware, requireAdminAuth, requirePermission('pages:write'), (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const block = DatabaseService.updatePageBlock(req.params.id, req.body, actor);
    if (!block) return sendApiError(res, 404, 'NOT_FOUND', 'عنصر الصفحة غير موجود');
    return sendApiResponse(res, 200, block);
  } catch (err: any) {
    return sendApiError(res, 400, 'UPDATE_FAILED', err.message);
  }
});

adminRouter.post('/cms/reorder', authMiddleware, requireAdminAuth, requirePermission('pages:write'), (req: Request, res: Response) => {
  try {
    const { blockIds } = req.body;
    if (!Array.isArray(blockIds)) {
      return sendApiError(res, 400, 'INVALID_PAYLOAD', 'يجب إرسال مصفوفة معرفات العناصر');
    }
    const actor = getActor(req);
    const updatedBlocks = DatabaseService.reorderPageBlocks(blockIds, actor);
    return sendApiResponse(res, 200, updatedBlocks);
  } catch (err: any) {
    return sendApiError(res, 400, 'REORDER_FAILED', err.message);
  }
});

adminRouter.get('/cms/versions', authMiddleware, requireAdminAuth, (req: Request, res: Response) => {
  return sendApiResponse(res, 200, DatabaseService.getPageVersions());
});

adminRouter.post('/cms/versions', authMiddleware, requireAdminAuth, requirePermission('pages:write'), (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const { versionName, description } = req.body;
    const version = DatabaseService.createPageVersion(versionName || 'نسخة احتياطية يدوية', description || '', actor);
    return sendApiResponse(res, 201, version);
  } catch (err: any) {
    return sendApiError(res, 400, 'VERSION_CREATE_FAILED', err.message);
  }
});

adminRouter.post('/cms/versions/:id/restore', authMiddleware, requireAdminAuth, requirePermission('pages:write'), (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const success = DatabaseService.restorePageVersion(req.params.id, actor);
    if (!success) return sendApiError(res, 404, 'NOT_FOUND', 'إصدار النسخة غير موجود');
    return sendApiResponse(res, 200, { success: true, message: 'تم استعادة إصدار الصفحة بنجاح' });
  } catch (err: any) {
    return sendApiError(res, 400, 'RESTORE_FAILED', err.message);
  }
});

// ============================================================================
// 14. AI System Config & Unanswered Questions - Protected by ai:write
// ============================================================================
adminRouter.get('/ai/config', authMiddleware, requireAdminAuth, (req: Request, res: Response) => {
  return sendApiResponse(res, 200, DatabaseService.getAiConfig());
});

adminRouter.put('/ai/config', authMiddleware, requireAdminAuth, requirePermission('ai:write'), (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const config = DatabaseService.updateAiConfig(req.body, actor);
    return sendApiResponse(res, 200, config);
  } catch (err: any) {
    return sendApiError(res, 400, 'UPDATE_FAILED', err.message);
  }
});

adminRouter.get('/ai/unanswered', authMiddleware, requireAdminAuth, requirePermission('ai:write'), (req: Request, res: Response) => {
  return sendApiResponse(res, 200, DatabaseService.getUnansweredQuestions());
});

adminRouter.post('/ai/unanswered/:id/answer', authMiddleware, requireAdminAuth, requirePermission('ai:write'), (req: Request, res: Response) => {
  try {
    const { answer } = req.body;
    if (!answer || !answer.trim()) {
      return sendApiError(res, 400, 'VALIDATION_ERROR', 'يرجى كتابة الإجابة الرسمية للسؤال');
    }
    const actor = getActor(req);
    const result = DatabaseService.answerUnansweredQuestion(req.params.id, answer.trim(), actor);
    if (!result) return sendApiError(res, 404, 'NOT_FOUND', 'السؤال غير موجود');
    return sendApiResponse(res, 200, result);
  } catch (err: any) {
    return sendApiError(res, 400, 'OPERATION_FAILED', err.message);
  }
});

// ============================================================================
// 15. Site Settings - Protected by settings:write
// ============================================================================
adminRouter.get('/settings', authMiddleware, requireAdminAuth, (req: Request, res: Response) => {
  return sendApiResponse(res, 200, DatabaseService.getSiteSettings());
});

adminRouter.put('/settings', authMiddleware, requireAdminAuth, requirePermission('settings:write'), (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const settings = DatabaseService.updateSiteSettings(req.body, actor);
    return sendApiResponse(res, 200, settings);
  } catch (err: any) {
    return sendApiError(res, 400, 'UPDATE_FAILED', err.message);
  }
});

// ============================================================================
// 16. Analytics & Audit Overview
// ============================================================================
adminRouter.get('/analytics', authMiddleware, requireAdminAuth, (req: Request, res: Response) => {
  return sendApiResponse(res, 200, DatabaseService.getAnalytics());
});

// ============================================================================
// 17. Backup & Export / Restore - Protected by backup:manage
// ============================================================================
adminRouter.get('/backup/export', authMiddleware, requireAdminAuth, requirePermission('backup:manage'), (req: Request, res: Response) => {
  return sendApiResponse(res, 200, DatabaseService.exportFullBackup());
});

adminRouter.post('/backup/import', authMiddleware, requireAdminAuth, requirePermission('backup:manage'), (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const success = DatabaseService.importBackup(req.body, actor);
    if (!success) {
      return sendApiError(res, 400, 'IMPORT_FAILED', 'ملف النسخة الاحتياطية غير صالح أو تالف');
    }
    return sendApiResponse(res, 200, { success: true, message: 'تم استيراد واستعادة قاعدة البيانات بنجاح' });
  } catch (err: any) {
    return sendApiError(res, 500, 'IMPORT_ERROR', err.message);
  }
});
