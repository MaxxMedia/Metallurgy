import { getApiBaseUrl } from "@/lib/auth/session";

export async function apiFetch<T>(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<{ data?: T; error?: string; status: number }> {
  try {
    const res = await fetch(`${getApiBaseUrl()}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(init?.headers ?? {}),
      },
    });
    const json = (await res.json().catch(() => null)) as T & { error?: string };
    if (!res.ok) {
      return {
        status: res.status,
        error:
          (json && typeof json === "object" && "error" in json && json.error) ||
          `Request failed (${res.status})`,
      };
    }
    return { status: res.status, data: json as T };
  } catch {
    return {
      status: 0,
      error: "Could not reach the API. Is metrology-backend running on port 4000?",
    };
  }
}
