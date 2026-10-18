import { upload as uploadBlob } from '@vercel/blob/client';
// Thin client for the Next.js route-handler API.
const TOKEN_KEY = 'lgd_admin_token';

export const getToken = (): string => {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
};

export const setToken = (token: string) => {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage unavailable: session simply won't persist across reloads
  }
};

export class ApiError extends Error {
  status: number;
  code: string;
  maxMb?: number;
  constructor(status: number, code: string, maxMb?: number) {
    super(code);
    this.status = status;
    this.code = code;
    this.maxMb = maxMb;
  }
}

async function request<T>(method: string, path: string, body?: unknown, auth = false): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) headers['Authorization'] = `Bearer ${getToken()}`;

  let res: Response;
  try {
    res = await fetch(path, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiError(0, 'network');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, (data && data.error) || 'error', data && data.maxMb);
  return data as T;
}

export type AdminCollection = 'gallery' | 'media' | 'campaigns' | 'reviews' | 'messages' | 'donations' | 'members';

export const api = {
  // public
  getPublic: () => request<any>('GET', '/api/public'),
  sendMessage: (b: unknown) => request<any>('POST', '/api/messages', b),
  sendDonation: (b: unknown) => request<any>('POST', '/api/donations', b),
  sendMember: (b: unknown) => request<any>('POST', '/api/members', b),
  sendReview: (b: unknown) => request<any>('POST', '/api/reviews', b),

  // admin
  login: (password: string) => request<{ token: string }>('POST', '/api/admin/login', { password }),
  getAdminState: () => request<any>('GET', '/api/admin/state', undefined, true),
  saveSettings: (b: unknown) => request<any>('PUT', '/api/admin/settings', b, true),
  create: (col: 'gallery' | 'media' | 'campaigns', b: unknown) => request<any>('POST', `/api/admin/${col}`, b, true),
  patch: (col: 'campaigns' | 'reviews' | 'messages' | 'donations', id: string, b: unknown) =>
    request<any>('PATCH', `/api/admin/${col}/${id}`, b, true),
  remove: (col: AdminCollection, id: string) => request<any>('DELETE', `/api/admin/${col}/${id}`, undefined, true),

  // Direct browser-to-Blob upload avoids Vercel Functions' 4.5 MB request-body limit.
  upload: async (file: File, kind: 'image' | 'video' | 'pdf', onProgress?: (pct: number) => void): Promise<string> => {
    const allowed = kind === 'image'
      ? ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      : kind === 'video'
        ? ['video/mp4', 'video/webm', 'video/quicktime']
        : ['application/pdf'];
    if (!allowed.includes(file.type)) throw new ApiError(400, 'invalid_type');
    const blob = await uploadBlob(`gloire/${kind}/${file.name}`, file, {
      access: 'public',
      handleUploadUrl: '/api/admin/upload',
      clientPayload: JSON.stringify({ token: getToken(), kind }),
      multipart: kind === 'video' && file.size > 5 * 1024 * 1024,
      onUploadProgress: (event) => onProgress?.(event.percentage)
    });
    return blob.url;
  }
};
