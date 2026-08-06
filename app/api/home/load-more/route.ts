import { NextResponse } from "next/server";
import { loadHomeFile, loadPostsFile } from "@/lib/data-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offset = Math.max(0, Number(searchParams.get("offset") ?? 0));
  const limit = Math.min(12, Math.max(1, Number(searchParams.get("limit") ?? 3)));

  const home = loadHomeFile();
  const ids = home.loadMore.postIds.slice(offset, offset + limit);
  const { posts } = loadPostsFile();

  const byId = new Map(posts.map((p) => [p.id, p]));
  const batch = ids
    .map((id) => byId.get(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const hasMore = offset + limit < home.loadMore.postIds.length;

  return NextResponse.json({ posts: batch, hasMore });
}
