"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Lock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useGate } from "@/components/providers/gate-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, errorMessage, isApiError } from "@/lib/api/client";
import { useSession } from "@/lib/auth/session";
import { cloneSettings, TEMPLATES } from "@/lib/templates";
import { cn } from "@/lib/utils";

export function NewProjectDialogContainer({
  open,
  onOpenChange,
  initialMarkdown,
  initialName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMarkdown?: string;
  initialName?: string;
}) {
  const router = useRouter();
  const qc = useQueryClient();
  const gate = useGate();
  const { isPro } = useSession();
  const [name, setName] = useState(initialName ?? "");
  const [templateId, setTemplateId] = useState<string>(TEMPLATES[0].id);

  const create = useMutation({
    mutationFn: () => {
      const t = TEMPLATES.find((x) => x.id === templateId) ?? TEMPLATES[0];
      return api.projects.create({
        name: name.trim() || t.name,
        templateId: t.id,
        markdown: initialMarkdown ?? t.starterMarkdown,
        settings: cloneSettings(t.settings),
      });
    },
    onSuccess: ({ project }) => {
      void qc.invalidateQueries({ queryKey: ["projects"] });
      void qc.invalidateQueries({ queryKey: ["auth", "me"] });
      onOpenChange(false);
      router.push(`/editor/${project.id}`);
    },
    onError: (e) => {
      if (isApiError(e) && e.isQuotaExceeded) {
        onOpenChange(false);
        gate.requireUpgrade({ title: "Free includes one project", reason: "Upgrade to Pro for unlimited projects with version history.", quota: e.quota });
      } else if (isApiError(e) && e.isPlanRequired) {
        gate.requireUpgrade({ reason: "That template is part of DocFinish Pro." });
      } else toast.error("Couldn't create the project", { description: errorMessage(e) });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New document</DialogTitle>
          <DialogDescription>Pick a template to start from. You can change it any time in the editor.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="project-name">Name</Label>
          <Input id="project-name" value={name} maxLength={200} placeholder="Untitled document" onChange={(e) => setName(e.target.value)} />
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Template</legend>
          <div className="grid max-h-[46vh] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-4">
            {TEMPLATES.map((t) => {
              const locked = t.tier === "premium" && !isPro;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => (locked ? gate.requireUpgrade({ reason: `${t.name} is a premium template. Upgrade to use it in saved projects.` }) : setTemplateId(t.id))}
                  aria-pressed={templateId === t.id}
                  className={cn(
                    "group rounded-lg border bg-white p-2 text-left transition-shadow hover:shadow-md focus-visible:ring-[3px] focus-visible:ring-ring/40 focus-visible:outline-none",
                    templateId === t.id && "border-cobalt ring-2 ring-cobalt/30",
                  )}
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded bg-canvas">
                    <Image src={t.previewImage} alt="" fill sizes="160px" className="object-cover object-top" />
                    {locked && (
                      <Badge variant="pro" className="absolute top-1.5 right-1.5">
                        <Lock /> Pro
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 truncate text-[13px] font-medium">{t.name}</p>
                </button>
              );
            })}
          </div>
        </fieldset>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="accent" onClick={() => create.mutate()} disabled={create.isPending}>
            {create.isPending && <Loader2 className="animate-spin" />}
            Create document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
