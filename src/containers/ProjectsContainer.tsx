"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { NewProjectDialogContainer } from "@/containers/NewProjectDialogContainer";
import { PageHeader } from "@/components/app/page-header";
import { ProjectsGridContainer } from "@/containers/ProjectsGridContainer";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/session";

export function ProjectsContainer() {
  const [open, setOpen] = useState(false);
  const { entitlements } = useSession();
  return (
    <>
      <PageHeader
        title="Projects"
        description={entitlements?.maxProjects ? `Your free plan includes ${entitlements.maxProjects} saved project. Pro removes the limit.` : "Every document you've saved, with autosave and version history."}
        actions={
          <Button variant="accent" onClick={() => setOpen(true)}>
            <Plus /> New document
          </Button>
        }
      />
      <ProjectsGridContainer onCreate={() => setOpen(true)} />
      {open && <NewProjectDialogContainer open={open} onOpenChange={setOpen} />}
    </>
  );
}
