import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "@/components/layout/SiteShell";
import { loadSettingsFile } from "@/lib/data-store";
import { getHomePageAssets } from "@/lib/page-assets";

const settings = loadSettingsFile();
const { cssHref } = getHomePageAssets();

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
    <html
      lang={settings.locale}
      className="scheme-dark w-full overflow-x-hidden bg-black [color-scheme:dark]"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,400..700;1,400..700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/remixicon@4.6.0/fonts/remixicon.css"
        />
        <link rel="stylesheet" href={cssHref} />
      </head>
      <body className="m-0 w-full overflow-x-hidden bg-black p-0 font-[family-name:var(--bodyFont,'Inter_Tight',sans-serif)] text-[#ffffffe6] antialiased [color-scheme:dark]">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
