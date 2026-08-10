"use client";

interface ContentBlock {
  id: string;
  type: "paragraph" | "heading" | "image" | "gallery" | "quote";
  content?: string;
  level?: 1 | 2 | 3;
  text?: string;
  url?: string;
  imageUrl?: string;
  caption?: string;
  alt?: string;
  images?: Array<string | { url: string; caption?: string }>;
  columns?: 2 | 3 | 4;
  quote?: string;
  author?: string;
}

interface Props {
  blocks: ContentBlock[];
}

export function PostBlockRenderer({ blocks }: Props) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100 text-base leading-relaxed">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return (
              <div
                key={block.id || i}
                className="prose prose-lg max-w-none dark:prose-invert [&_p]:mb-4 [&_p]:leading-relaxed [&_a]:text-[#0073ff] [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: block.content || "" }}
              />
            );

          case "heading": {
            const HeadingTag = block.level === 1 ? "h1" : block.level === 3 ? "h3" : "h2";
            const headingClasses =
              block.level === 1
                ? "text-3xl md:text-4xl font-extrabold my-6 text-gray-900 dark:text-white leading-tight border-b border-gray-200 dark:border-gray-800 pb-3"
                : block.level === 3
                ? "text-xl font-bold my-4 text-gray-900 dark:text-white"
                : "text-2xl font-bold my-5 text-gray-900 dark:text-white";

            return (
              <HeadingTag key={block.id || i} className={headingClasses}>
                {block.text}
              </HeadingTag>
            );
          }

          case "image": {
            const imgSrc = block.imageUrl || block.url;
            if (!imgSrc) return null;
            return (
              <figure key={block.id || i} className="my-8 space-y-2">
                <div className="overflow-hidden rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
                  <img
                    src={imgSrc}
                    alt={block.alt || block.caption || "Article image"}
                    className="w-full object-cover max-h-[600px] transition-transform hover:scale-[1.01]"
                  />
                </div>
                {block.caption && (
                  <figcaption className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 italic">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          case "gallery": {
            const cols =
              block.columns === 2
                ? "grid-cols-1 sm:grid-cols-2"
                : block.columns === 4
                ? "grid-cols-2 md:grid-cols-4"
                : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";

            return (
              <div key={block.id || i} className={`grid gap-4 my-8 ${cols}`}>
                {block.images?.map((imgItem, idx) => {
                  const url = typeof imgItem === "string" ? imgItem : imgItem.url;
                  const cap = typeof imgItem === "string" ? undefined : imgItem.caption;
                  if (!url) return null;

                  return (
                    <div
                      key={idx}
                      className="overflow-hidden rounded-xl shadow-md border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800"
                    >
                      <img
                        src={url}
                        alt={cap || `Gallery image ${idx + 1}`}
                        className="w-full h-52 object-cover transition-transform duration-300 hover:scale-105"
                      />
                      {cap && (
                        <p className="p-2 text-[11px] font-medium text-gray-500 text-center truncate">
                          {cap}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          }

          case "quote":
            return (
              <blockquote
                key={block.id || i}
                className="my-8 border-l-4 border-[#0073ff] bg-gradient-to-r from-blue-500/10 to-transparent p-6 rounded-r-2xl italic font-serif text-lg text-gray-800 dark:text-gray-200 shadow-sm"
              >
                <p className="mb-2 leading-relaxed">"{block.quote || block.content}"</p>
                {block.author && (
                  <cite className="block text-xs font-sans font-bold not-italic text-[#0073ff] uppercase tracking-wider">
                    — {block.author}
                  </cite>
                )}
              </blockquote>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
