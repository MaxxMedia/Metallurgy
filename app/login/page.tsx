import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ElementorMirrorPageView } from "@/components/pages/ElementorMirrorPageView";
import { LoginFormBridge } from "@/components/auth/LoginFormBridge";
import { RegisterFormBridge } from "@/components/auth/RegisterFormBridge";
import { ContentThemeLayout } from "@/components/layout/ContentThemeLayout";

import { loadPagesFile } from "@/lib/data-store";
import { reactNotFoundMetadata, reactPageMetadata } from "@/lib/content/react/metadata";

const SLUG = "login";

export function generateMetadata(): Metadata {
  const page = loadPagesFile().pages.find((p) => p.slug === SLUG);
  if (!page) return reactNotFoundMetadata();
  return reactPageMetadata(page.title);
}

export default function LoginPage() {
  const page = loadPagesFile().pages.find((p) => p.slug === SLUG);
  if (!page) notFound();

  return (
    <ContentThemeLayout
      bodyClass={page.bodyClass ?? ""}
      cssHash={page.cssHash}
      jsHash={page.jsHash}
    >
      {page.bodyHtml ? (
        <ElementorMirrorPageView bodyHtml={page.bodyHtml} />
      ) : null}
      <LoginFormBridge />
      <RegisterFormBridge />
    </ContentThemeLayout>
  );
}
