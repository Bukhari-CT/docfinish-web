import type { DocumentSettings } from "@/lib/api/types";

export const GUEST_DRAFT_KEY = "docfinish:guest-draft:v1";

export interface GuestDraft {
  markdown: string;
  settings: DocumentSettings;
  templateId: string;
  updatedAt: string;
}

export function loadGuestDraft(): GuestDraft | null {
  try {
    const raw = window.localStorage.getItem(GUEST_DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Partial<GuestDraft>;
    if (typeof d.markdown !== "string" || !d.settings || typeof d.templateId !== "string") return null;
    return d as GuestDraft;
  } catch {
    return null;
  }
}

export function saveGuestDraft(d: Omit<GuestDraft, "updatedAt">): boolean {
  try {
    window.localStorage.setItem(GUEST_DRAFT_KEY, JSON.stringify({ ...d, updatedAt: new Date().toISOString() }));
    return true;
  } catch {
    // Quota exceeded (e.g. a large logo data URL) or storage disabled.
    return false;
  }
}

export function clearGuestDraft() {
  try {
    window.localStorage.removeItem(GUEST_DRAFT_KEY);
  } catch {
    /* ignore */
  }
}
