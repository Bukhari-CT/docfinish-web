import { describe, expect, it } from "vitest";
import { safeNext } from "@/lib/auth/session";

describe("safeNext (open-redirect guard)", () => {
  it("allows same-origin paths", () => {
    expect(safeNext("/editor/abc?x=1")).toBe("/editor/abc?x=1");
  });
  it.each(["https://evil.com", "//evil.com", "/\\evil.com", "javascript:alert(1)", "", null, undefined])("rejects %s", (v) => {
    expect(safeNext(v as string | null | undefined)).toBe("/dashboard");
  });
});
