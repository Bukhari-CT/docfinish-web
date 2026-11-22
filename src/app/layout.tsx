import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers/query-provider";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Turn AI Markdown into client-ready PDFs and Google Docs`,
    template: `%s · ${SITE_NAME}`,
  },
  description: `${SITE_TAGLINE} Add your brand, headers, footers, and page numbers in seconds.`,
  applicationName: SITE_NAME,
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0f1b2d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fontVariables} h-full`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
