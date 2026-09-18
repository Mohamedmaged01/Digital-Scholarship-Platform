import { AdminRole, AdminPermission } from '../types';

export interface AdminAuthUser {
  id: string;
  username: string;
  fullNameAr: string;
  fullNameEn: string;
  email: string;
  role: AdminRole;
  roleLabelAr: string;
  roleLabelEn: string;
  department: string;
  avatarUrl?: string;
  permissions: AdminPermission[];
  allowedSections: string[];
  lastLogin: string;
}

export interface AdminLoginResponse {
  token: string;
  user: AdminAuthUser;
  expiresInSeconds: number;
}

const ADMIN_TOKEN_KEY = 'kasp_admin_jwt_token';
const ADMIN_USER_KEY = 'kasp_admin_session_user';

export const AdminAuthService = {
  getToken(): string | null {
    try {
      return localStorage.getItem(ADMIN_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  getCurrentUser(): AdminAuthUser | null {
    try {
      const data = localStorage.getItem(ADMIN_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setSession(token: string, user: AdminAuthUser): void {
    try {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save admin session', e);
    }
  },

  clearSession(): void {
    try {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
    } catch (e) {
      console.error('Failed to clear admin session', e);
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  },

  async login(identifier: string, password: string): Promise<AdminLoginResponse> {
    const res = await fetch('/api/v1/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: identifier,
        password
      })
    });

    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.error?.message || 'فشل تسجيل الدخول الإداري');
    }

    const authData: AdminLoginResponse = body.data;
    this.setSession(authData.token, authData.user);
    return authData;
  },

  async fetchMe(): Promise<AdminAuthUser | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await fetch('/api/v1/admin/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const body = await res.json();
      if (res.ok && body.success && body.data) {
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(body.data));
        return body.data;
      } else {
        this.clearSession();
        return null;
      }
    } catch {
      return this.getCurrentUser();
    }
  },

  async logout(): Promise<void> {
    const token = this.getToken();
    try {
      if (token) {
        await fetch('/api/v1/admin/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (e) {
      console.warn('Logout request failed', e);
    } finally {
      this.clearSession();
    }
  }
};
