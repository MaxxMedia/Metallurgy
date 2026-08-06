import { getAuthor } from "@/lib/authors";
import {
  getDayArchive,
  getMonthArchive,
  getYearArchive,
} from "@/lib/date-archives";
import { getCategory } from "@/lib/categories";
import { getPage } from "@/lib/pages";
import { getPost } from "@/lib/posts";
import { getTag } from "@/lib/tags";
import type { MirrorPagePayload, StaticPageSlug } from "@/lib/content/types";

function toPayload(
  meta: { title: string; bodyClass: string; cssHash: string; jsHash: string },
  mainHtml: string,
): MirrorPagePayload {
  return { ...meta, mainHtml };
}

export function loadStaticPage(slug: StaticPageSlug): MirrorPagePayload | null {
  const page = getPage(slug);
  if (!page) return null;
  return toPayload(page, page.mainHtml);
}

export function loadCategoryPage(slug: string): MirrorPagePayload | null {
  const category = getCategory(slug);
  if (!category) return null;
  return toPayload(category, category.mainHtml);
}

export function loadTagPage(slug: string): MirrorPagePayload | null {
  const tag = getTag(slug);
  if (!tag) return null;
  return toPayload(tag, tag.mainHtml);
}

export function loadAuthorPage(slug: string): MirrorPagePayload | null {
  const author = getAuthor(slug);
  if (!author) return null;
  return toPayload(author, author.mainHtml);
}

export function loadPostPage(
  month: string,
  day: string,
  slug: string,
): MirrorPagePayload | null {
  const post = getPost(month, day, slug);
  if (!post) return null;
  return toPayload(post, post.mainHtml);
}

export function loadYearArchivePage(year: string): MirrorPagePayload | null {
  const archive = getYearArchive(year);
  if (!archive) return null;
  return toPayload(archive, archive.mainHtml);
}

export function loadMonthArchivePage(
  year: string,
  month: string,
): MirrorPagePayload | null {
  const archive = getMonthArchive(year, month);
  if (!archive) return null;
  return toPayload(archive, archive.mainHtml);
}

export function loadDayArchivePage(
  year: string,
  month: string,
  day: string,
): MirrorPagePayload | null {
  const archive = getDayArchive(year, month, day);
  if (!archive) return null;
  return toPayload(archive, archive.mainHtml);
}
