"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { DocumentWorkspace } from "@/components/workspace/document-workspace";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api, errorMessage, isApiError } from "@/lib/api/client";

export function EditorContainer({ projectId }: { projectId: string }) {
  const q = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => api.projects.get(projectId),
    // The workspace owns the live copy after load; don't refetch over the user's edits.
    staleTime: Infinity,
    gcTime: 0,
    retry: (n, e) => !(isApiError(e) && (e.status === 404 || e.status === 403)) && n < 1,
  });

  if (q.isPending) {
    return (
      <div className="flex h-full flex-col" role="status" aria-label="Loading document">
        <Skeleton className="h-12 rounded-none" />
        <div className="grid flex-1 grid-cols-2 gap-px bg-border">
          <Skeleton className="rounded-none" />
          <Skeleton className="rounded-none bg-canvas" />
        </div>
      </div>
    );
  }

  if (q.isError) {
    const missing = isApiError(q.error) && (q.error.status === 404 || q.error.status === 403);
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="font-display text-2xl text-navy">{missing ? "We couldn't find that document" : "Couldn't open the document"}</h1>
        <p className="max-w-sm text-sm text-muted-foreground">{missing ? "It may have been deleted, or it belongs to a different account." : errorMessage(q.error)}</p>
        <div className="flex gap-2">
          {!missing && <Button onClick={() => void q.refetch()}>Try again</Button>}
          <Button asChild variant={missing ? "default" : "outline"}>
            <Link href="/projects">Back to projects</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <DocumentWorkspace key={q.data.project.id} mode="project" project={q.data.project} className="h-full" />;
}
