import { EditorContainer } from "@/containers/EditorContainer";

export default async function EditorPage({ params }: { params: Promise<{ documentId: string }> }) {
  const { documentId } = await params;
  return <EditorContainer projectId={documentId} />;
}
