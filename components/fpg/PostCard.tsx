
// import Link from "next/link";
// import type { Author, Category, Post } from "@/types/data";
// import {
//   authorForPost,
//   categoryForPost,
//   excerptWords,
//   postThumbnail,
// } from "@/lib/post-utils";
// import { CategoryBadge } from "@/components/fpg/CategoryBadge";
// import { PostMeta } from "@/components/fpg/PostMeta";

// type PostCardProps = {
//   post: Post;
//   authors: Author[];
//   categories: Category[];
//   variant: "one" | "two" | "three" | "floating";
//   titleTag?: "h1" | "h3" | "h4" | "h5" | "h6";
//   showExcerpt?: boolean;
//   thumbSize?: "thumb" | "medium" | "large";
//   cardLarge?: boolean;
//   showCategory?: boolean;
//   playButtonOnThumb?: boolean;
//   onDarkHero?: boolean;
//   heroGlass?: boolean;
//   className?: string;
//   style?: React.CSSProperties;
// };

// export function PostCard({
//   post,
//   authors,
//   categories,
//   variant,
//   titleTag: TitleTag = "h4",
//   showExcerpt = false,
//   thumbSize = "medium",
//   cardLarge = false,
//   showCategory,
//   playButtonOnThumb = false,
//   onDarkHero = false,
//   heroGlass = false,
//   className = "",
//   style,
// }: PostCardProps) {
//   const author = authorForPost(post, authors);
//   const category = categoryForPost(post, categories);
//   const catName = category?.name ?? post.categoryLabel ?? "Tech";
//   const catSlug = category?.slug ?? post.categorySlug ?? "tech-2";
//   const catColor = category?.color ?? post.categoryColor ?? "#ff5733";
//   const thumb = postThumbnail(
//     post,
//     thumbSize === "medium" ? "medium" : cardLarge ? "large" : thumbSize,
//   );

//   const imgClass =
//     cardLarge || thumbSize === "large"
//       ? "attachment-large size-large wp-post-image h-full w-full object-cover"
//       : thumbSize === "thumb"
//         ? "attachment-thumbnail size-thumbnail wp-post-image h-full w-full object-cover"
//         : "attachment-medium_large size-medium_large wp-post-image h-full w-full object-cover";

//   const titleLinkClass = onDarkHero || heroGlass
//     ? "text-white hover:text-[var(--primaryColor)]"
//     : variant === "floating"
//       ? "text-white hover:text-white/90"
//       : "text-[var(--titleColor)] hover:text-[var(--primaryColor)]";

//   const h1Class =
//     variant === "one" && TitleTag === "h1"
//       ? "text-2xl font-bold leading-tight sm:text-3xl lg:text-[2.5rem] lg:leading-[1.15]"
//       : variant === "floating"
//         ? "text-base font-bold leading-snug sm:text-lg"
//         : "";

//   let shell =
//     "fpg-card-style style-two flex flex-row items-center gap-3 border-0 p-3 shadow-[0_4px_30px_rgba(0,0,0,0.06)]";

//   if (variant === "one") {
//     shell =
//       "fpg-card-style style-one flex w-full max-w-[650px] flex-col items-start gap-4 border-0 border-b-0 py-6 shadow-none sm:py-8 lg:py-10";
//   } else if (variant === "three") {
//     shell =
//       "fpg-card-style style-three flex flex-row items-stretch gap-2.5 border-0 p-3";
//   } else if (variant === "floating") {
//     shell = cardLarge
//       ? "fpg-card-style style-floating card-large relative min-h-[280px] overflow-hidden rounded-xl border-0 p-0 sm:min-h-[300px]"
//       : "fpg-card-style style-floating relative min-h-[300px] overflow-hidden rounded-xl border-0 p-0 sm:min-h-[320px]";
//   }

//   if (heroGlass) {
//     shell +=
//       " rounded-xl border border-white/10 bg-white/[0.06] p-3 shadow-none backdrop-blur-md";
//   }

//   const showCatBadge = showCategory ?? true;

//   const thumbTwoClass = heroGlass
//     ? "h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-20"
//     : variant === "two"
//       ? "h-[72px] w-[72px] sm:h-20 sm:w-20"
//       : "w-full";

//   if (variant === "floating") {
//     return (
//       <div className={`${shell} ${className}`.trim()} style={style}>
//         <Link href={post.url} className="absolute inset-0 z-0 block">
//           <img
//             loading="lazy"
//             decoding="async"
//             src={thumb}
//             className="absolute inset-0 h-full w-full object-cover"
//             alt=""
//           />
//           <span className="thumb-overlay pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
//         </Link>
//         <div className="fpg-post-content absolute inset-x-0 bottom-0 z-[2] flex flex-col p-4 sm:p-5">
//           <div className="fpg-post-content-inner space-y-2">
//             {showCatBadge ? (
//               <CategoryBadge name={catName} slug={catSlug} color={catColor} />
//             ) : null}
//             <TitleTag className={`fpg-post-title ${h1Class}`}>
//               <Link href={post.url} className={`line-clamp-2 ${titleLinkClass}`}>
//                 {post.title}
//               </Link>
//             </TitleTag>
//           </div>
//           <PostMeta
//             author={author}
//             views={post.views}
//             dateISO={post.dateISO}
//             showDate
//             onDark
//           />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`${shell} ${className}`.trim()}>
//       {variant !== "one" ? (
//         <div
//           className={`fpg-post-thumb relative shrink-0 overflow-hidden rounded-sm${playButtonOnThumb ? " thumb-type-play_btn" : ""} ${thumbTwoClass}`}
//         >
//           <Link href={post.url} className="image-link block h-full w-full">
//             <img loading="lazy" decoding="async" src={thumb} className={imgClass} alt="" />
//           </Link>
//           {playButtonOnThumb ? (
//             <a
//               href={post.url}
//               className="fpg-play-btn absolute inset-0 flex items-center justify-center bg-black/25 text-white"
//               aria-label="Play"
//             >
//               <i className="ri-play-fill text-3xl drop-shadow-md" />
//             </a>
//           ) : null}
//         </div>
//       ) : null}
//       <div className="fpg-post-content flex min-w-0 flex-1 flex-col">
//         <div className="fpg-post-content-inner space-y-2">
//           {showCatBadge ? (
//             <CategoryBadge name={catName} slug={catSlug} color={catColor} />
//           ) : null}
//           <TitleTag className={`fpg-post-title font-semibold leading-snug ${h1Class}`}>
//             <Link href={post.url} className={`${titleLinkClass} transition-all duration-300`}>
//               {post.title}
//             </Link>
//           </TitleTag>
//           {showExcerpt ? (
//             <p
//               className={`fpg-post-excerpt line-clamp-3 text-sm ${onDarkHero ? "text-white/80" : "text-[var(--bodyColor)]"}`}
//             >
//               {excerptWords(post.excerpt || post.title)}
//             </p>
//           ) : null}
//         </div>
//         <PostMeta
//           author={author}
//           views={post.views}
//           dateISO={post.dateISO}
//           showDate={variant === "one" || variant === "three"}
//           onDark={onDarkHero || heroGlass}
//         />
//         {variant === "one" ? (
//           <div className="fpg-btn-wrapper mt-2 mb-2 sm:mb-4">
//             <Link
//               href={post.url}
//               className="inline-flex rounded-md bg-[var(--primaryColor)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
//             >
//               Read Article
//             </Link>
//           </div>
//         ) : null}
//       </div>
//     </div>
//   );
// }

export { PostCard } from "@/components/ui/PostCard";

