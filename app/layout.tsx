import type { Metadata } from "next";
import "@/styles/globals.css";
import { SiteShell } from "@/components/layout/SiteShell";
import { loadSettingsFile } from "@/lib/data-store";

const settings = loadSettingsFile();

export const metadata: Metadata = {
  title: settings.siteName,
  description: settings.tagline,
  icons: {
    icon: [
      { url: settings.favicon, sizes: "32x32" },
      {
        url: "/wp-content/uploads/sites/32/2025/11/favicon02-300x300.png",
        sizes: "192x192",
      },
    ],
    apple: "/wp-content/uploads/sites/32/2025/11/favicon02-300x300.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={settings.locale}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/remixicon@4.6.0/fonts/remixicon.css"
        />
      </head>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
