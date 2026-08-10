const STORAGE_KEY = "metrology_auth_session";

export type AuthUser = {
  id: number;
  email: string;
  role: string;
  username?: string;
  permissions?: string[];
};

export type AuthSession = {
  token: string;
  user: AuthUser;
  permissions: string[];
};

export function getApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:4000"
  );
}

export function readSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function writeSession(session: AuthSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function isAdminRole(role: string | undefined): boolean {
  const r = role?.toLowerCase();
  return r === "admin" || r === "super_admin" || r === "sub_admin";
}

export function dashboardPathForRole(role: string | undefined): string {
  const r = role?.toLowerCase();
  if (isAdminRole(r)) return "/admin";
  if (r === "recruiter") return "/recruiter";
  if (r === "candidate") return "/dashboard";
  return "/dashboard";
}
