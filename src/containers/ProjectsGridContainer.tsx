"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { api, errorMessage } from "@/lib/api/client";
import type { ProjectSummary } from "@/lib/api/types";
import { getTemplate } from "@/lib/templates";
import { relativeTime } from "@/lib/utils";
import { EmptyState, ErrorState } from "@/components/app/page-header";

export function useProjects() {
  return useQuery({ queryKey: ["projects"], queryFn: () => api.projects.list() });
}

export function ProjectsGridContainer({ limit, onCreate }: { limit?: number; onCreate: () => void }) {
  const q = useProjects();
  const qc = useQueryClient();
  const [toDelete, setToDelete] = useState<ProjectSummary | null>(null);

  const del = useMutation({
    mutationFn: (id: string) => api.projects.remove(id),
    onSuccess: () => {
      toast.success("Project deleted");
      setToDelete(null);
      void qc.invalidateQueries({ queryKey: ["projects"] });
      void qc.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: (e) => toast.error("Couldn't delete the project", { description: errorMessage(e) }),
  });

  if (q.isPending) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading projects">
        {Array.from({ length: limit ?? 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    );
  }
  if (q.isError) return <ErrorState message={errorMessage(q.error)} onRetry={() => void q.refetch()} />;

  const projects = limit ? q.data.projects.slice(0, limit) : q.data.projects;
  if (projects.length === 0) {
    return (
      <EmptyState
        icon={<FileText />}
        title="No documents yet"
        description="Start from a template, or paste Markdown from Claude or ChatGPT and make it client-ready."
        action={
          <Button variant="accent" onClick={onCreate}>
            Create your first document
          </Button>
        }
      />
    );
  }

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <li key={p.id} className="group relative flex flex-col rounded-xl border bg-white p-5 shadow-[0_1px_2px_rgba(20,22,26,0.04)] transition-shadow hover:shadow-md">
            <Link href={`/editor/${p.id}`} className="absolute inset-0 rounded-xl focus-visible:ring-[3px] focus-visible:ring-ring/40 focus-visible:outline-none" aria-label={`Open ${p.name}`} />
            <p className="text-[11px] font-medium tracking-wider text-cobalt uppercase">{getTemplate(p.templateId)?.name ?? p.templateId}</p>
            <h3 className="mt-1.5 line-clamp-2 font-display text-lg leading-snug text-navy">{p.name}</h3>
            <p className="mt-2 line-clamp-3 flex-1 text-[13px] text-muted-foreground">{p.excerpt || "Empty document"}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>Edited {relativeTime(p.updatedAt)}</span>
              <Button
                variant="ghost"
                size="icon-sm"
                className="relative z-10 text-muted-foreground hover:text-destructive"
                aria-label={`Delete ${p.name}`}
                onClick={() => setToDelete(p)}
              >
                <Trash2 />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <Dialog open={!!toDelete} onOpenChange={(o) => !o && !del.isPending && setToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this project?</DialogTitle>
            <DialogDescription>
              “{toDelete?.name}” and its version history will be permanently deleted. Exported PDFs you already downloaded aren&apos;t affected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setToDelete(null)} disabled={del.isPending}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => toDelete && del.mutate(toDelete.id)} disabled={del.isPending}>
              {del.isPending && <Loader2 className="animate-spin" />}
              Delete project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
