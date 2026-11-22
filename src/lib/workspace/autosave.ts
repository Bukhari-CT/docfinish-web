"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, isApiError } from "@/lib/api/client";
import type { DocumentSettings, Project } from "@/lib/api/types";

export type SaveStatus = "saved" | "saving" | "dirty" | "offline" | "conflict" | "error";

export interface AutosaveDoc {
  name: string;
  templateId: string;
  markdown: string;
  settings: DocumentSettings;
}

const DEBOUNCE_MS = 1500;
const RETRY_STEPS = [3000, 6000, 12000, 24000, 30000];

/**
 * Debounced PATCH /projects/:id with optimistic concurrency (baseVersion).
 * Retries with backoff while offline; surfaces 409 conflicts for the user to resolve.
 */
export function useAutosave({
  projectId,
  doc,
  initialVersion,
  enabled,
  onError,
}: {
  projectId: string;
  doc: AutosaveDoc | null;
  initialVersion: number | null;
  enabled: boolean;
  onError?: (e: unknown) => void;
}) {
  const [status, setStatus] = useState<SaveStatus>("saved");
  const [conflict, setConflict] = useState<Project | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const version = useRef<number | null>(initialVersion);
  const lastSaved = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retry = useRef(0);
  const inFlight = useRef(false);
  const latest = useRef<AutosaveDoc | null>(doc);
  const onErrorRef = useRef(onError);
  latest.current = doc;
  onErrorRef.current = onError;

  // Baseline: whatever we loaded is considered saved.
  useEffect(() => {
    if (initialVersion !== null && version.current === null) version.current = initialVersion;
  }, [initialVersion]);

  const markBaseline = useCallback((d: AutosaveDoc, v: number) => {
    lastSaved.current = JSON.stringify(d);
    version.current = v;
    setStatus("saved");
  }, []);

  const save = useCallback(
    async (opts: { snapshot?: boolean; force?: boolean } = {}) => {
      const d = latest.current;
      if (!d || version.current === null) return;
      const serialized = JSON.stringify(d);
      if (!opts.snapshot && !opts.force && serialized === lastSaved.current) {
        setStatus("saved");
        return;
      }
      if (inFlight.current) {
        // Try again shortly after the in-flight request settles.
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => void save(opts), 400);
        return;
      }
      inFlight.current = true;
      setStatus("saving");
      try {
        const { project } = await api.projects.update(projectId, {
          ...d,
          baseVersion: version.current,
          ...(opts.snapshot ? { snapshot: true } : {}),
        });
        version.current = project.version;
        lastSaved.current = serialized;
        retry.current = 0;
        setLastSavedAt(new Date());
        setStatus(JSON.stringify(latest.current) === serialized ? "saved" : "dirty");
      } catch (e) {
        if (isApiError(e) && e.isConflict && e.details.current) {
          setConflict(e.details.current as Project);
          setStatus("conflict");
        } else if (isApiError(e) && (e.isNetworkError || e.status >= 500 || e.code === "RATE_LIMITED")) {
          setStatus("offline");
          const delay = RETRY_STEPS[Math.min(retry.current, RETRY_STEPS.length - 1)];
          retry.current++;
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(() => void save(opts), e.retryAfter ? e.retryAfter * 1000 : delay);
        } else {
          setStatus("error");
          onErrorRef.current?.(e);
        }
      } finally {
        inFlight.current = false;
      }
    },
    [projectId],
  );

  // Debounce on every change.
  const serializedDoc = doc ? JSON.stringify(doc) : null;
  useEffect(() => {
    if (!enabled || serializedDoc === null || lastSaved.current === null) return;
    if (serializedDoc === lastSaved.current) return;
    if (status === "conflict") return;
    setStatus((s) => (s === "offline" ? s : "dirty"));
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void save(), DEBOUNCE_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- status read intentionally without re-triggering
  }, [serializedDoc, enabled, save]);

  // Retry immediately when the browser comes back online.
  useEffect(() => {
    const onOnline = () => {
      if (status === "offline") void save();
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [status, save]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    const handler = (ev: BeforeUnloadEvent) => {
      if (status === "dirty" || status === "saving" || status === "offline" || status === "conflict") {
        ev.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [status]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  /** Resolve a conflict by overwriting the server copy with ours. */
  const keepMine = useCallback(() => {
    if (!conflict) return;
    version.current = conflict.version;
    setConflict(null);
    void save({ force: true });
  }, [conflict, save]);

  /** Resolve a conflict by taking the server copy (caller replaces local state). */
  const takeTheirs = useCallback(() => {
    if (!conflict) return null;
    const c = conflict;
    markBaseline({ name: c.name, templateId: c.templateId, markdown: c.markdown, settings: c.settings }, c.version);
    setConflict(null);
    return c;
  }, [conflict, markBaseline]);

  return { status, conflict, lastSavedAt, save, markBaseline, keepMine, takeTheirs };
}
