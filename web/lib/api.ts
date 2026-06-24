/** API base: direct backend URL when set, otherwise same-origin /api proxy (E2E + local dev). */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export function apiUrl(path: string): string {
  return API_BASE ? `${API_BASE}${path}` : `/api${path}`;
}
