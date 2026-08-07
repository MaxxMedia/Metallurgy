"use client";

import { useEffect, useState } from "react";
import type { Author, Category, Post } from "@/types/data";
import { PostCard } from "@/components/fpg/PostCard";

type PostSliderProps = {
  posts: Post[];
  authors: Author[];
  categories: Category[];
};

const VISIBLE = 4;
const GAP = 24; // px, matches gap-6
const AUTOPLAY_MS = 3500;
const TRANSITION_MS = 500;

export function PostSlider({ posts, authors, categories }: PostSliderProps) {
  const looped = posts.length > VISIBLE;
  const slides = looped ? [...posts, ...posts.slice(0, VISIBLE)] : posts;

  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    if (!looped) return;
    const timer = window.setInterval(() => {
      setAnimate(true);
      setIndex((prev) => prev + 1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [looped]);

  useEffect(() => {
    if (!looped) return;
    if (index === posts.length) {
      const reset = window.setTimeout(() => {
        setAnimate(false);
        setIndex(0);
      }, TRANSITION_MS);
      return () => window.clearTimeout(reset);
    }
  }, [index, looped, posts.length]);

  const slideWidth = `calc((100% - ${(VISIBLE - 1) * GAP}px) / ${VISIBLE} + ${GAP}px)`;

  return (
    <div
      className="elementor-element elementor-element-ad90ba2 elementor-widget elementor-widget-fpg-post-slider relative w-full"
      data-id="ad90ba2"
      data-element_type="widget"
      data-widget_type="fpg-post-slider.default"
    >
      <div className="elementor-widget-container">
        <div id="fpg-unique-slider-id-ad90ba2" className="fpg-unique-slider">
          <div className="fpg-post-slider swiper" dir="ltr">
            <div className="overflow-hidden">
              <div
                className="flex items-stretch gap-6"
                style={{
                  transform: `translateX(calc(-1 * ${index} * ${slideWidth}))`,
                  transition: animate ? "transform 0.5s ease" : "none",
                }}
              >
                {slides.map((post, i) => (
                  <div
                    key={`${post.id}-${i}`}
                    className="shrink-0 basis-full sm:basis-[calc((100%-24px)/2)] lg:basis-[calc((100%-48px)/3)] xl:basis-[calc((100%-72px)/4)]"
                  >
                    <PostCard
                      post={post}
                      authors={authors}
                      categories={categories}
                      variant="floating"
                      titleTag="h5"
                      className="w-full"
                      style={{ height: 520 }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}