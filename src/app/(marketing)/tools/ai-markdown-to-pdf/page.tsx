import type { Metadata } from "next";
import { ToolPage } from "@/components/marketing/tool-page";
import { pageMetadata } from "@/lib/site";
import { getTool } from "@/lib/tools";

const tool = getTool("ai-markdown-to-pdf");

export const metadata: Metadata = pageMetadata({ title: tool.metaTitle, description: tool.description, path: tool.path });

export default function Page() {
  return <ToolPage tool={tool} />;
}
