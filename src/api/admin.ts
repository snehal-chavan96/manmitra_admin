import { apiFetch } from "./client";

export interface AuthResponse {
  token: string;
  admin?: any;
}

// ================= Dashboard aggregates =================
export async function getDashboardSummary() {
  return apiFetch(`/api/dashboard/summary`);
}

// ================= Crisis =================
export async function getActiveCrises() {
  return apiFetch(`/api/crisis/active`);
}

export async function createCrisisRecord(payload: any) {
  return apiFetch(`/api/crisis/create`, { method: 'POST', body: payload });
}

export async function adminLogin(email: string, password: string): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>("/api/admin/login", {
    method: "POST",
    body: { email, password },
  });
  if (data?.token) localStorage.setItem("token", data.token);
  return data;
}

export async function adminSignup(payload: { email: string; password: string; name?: string }): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>("/api/admin/signup", {
    method: "POST",
    body: payload,
  });
  if (data?.token) localStorage.setItem("token", data.token);
  return data;
}

export async function getVolunteers() {
  return apiFetch("/api/admin/volunteers");
}

export async function getTherapists() {
  return apiFetch("/api/admin/therapists");
}

export async function addVolunteer(payload: any) {
  return apiFetch("/api/admin/volunteer", { method: "POST", body: payload });
}

export async function addTherapist(payload: any) {
  return apiFetch("/api/admin/therapist", { method: "POST", body: payload });
}

export async function deleteVolunteer(id: string) {
  return apiFetch(`/api/admin/volunteer-del/${id}`, { method: "DELETE" });
}

export async function deleteTherapist(id: string) {
  return apiFetch(`/api/admin/therapist-del/${id}`, { method: "DELETE" });
}

export async function getPendingRequests() {
  return apiFetch("/api/admin/pending");
}

export async function updateTherapistStatus(id: string, payload: any) {
  return apiFetch(`/api/admin/therapist/${id}`, { method: "PATCH", body: payload });
}

export async function updateVolunteerStatus(id: string, payload: any) {
  return apiFetch(`/api/admin/volunteer/${id}`, { method: "PATCH", body: payload });
}

export interface AdminProfile {
  id: string;
  email: string;
  name?: string;
  institutionId?: string;
  role?: string;
  permissions?: string[];
}

export async function getAdminMe(): Promise<AdminProfile> {
  return apiFetch<AdminProfile>("/api/admin/me");
}

// ================= Analytics (Student) =================
export interface StudentAnalyticsResponse {
  // shape depends on backend controller; keep generic with index signature
  [key: string]: any;
}

export async function getStudentAnalytics(studentId: string): Promise<StudentAnalyticsResponse> {
  return apiFetch<StudentAnalyticsResponse>(`/api/analytics/student/${encodeURIComponent(studentId)}`);
}

export async function getStudentAnalyticsMe(): Promise<StudentAnalyticsResponse> {
  return apiFetch<StudentAnalyticsResponse>(`/api/analytics/student/me`);
}

export async function downloadStudentAnalyticsPdf(studentId: string): Promise<Blob> {
  const token = localStorage.getItem("mm_admin_token") || localStorage.getItem("token");
  const base = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000";
  const res = await fetch(`${base}/api/analytics/student/${encodeURIComponent(studentId)}/pdf`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `Failed to download PDF (${res.status})`);
  }
  return await res.blob();
}

export async function downloadStudentChatPdf(studentId: string): Promise<Blob> {
  const token = localStorage.getItem("mm_admin_token") || localStorage.getItem("token");
  const base = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000";
  const res = await fetch(`${base}/api/chat/student/${encodeURIComponent(studentId)}/pdf`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `Failed to download PDF (${res.status})`);
  }
  return await res.blob();
}
