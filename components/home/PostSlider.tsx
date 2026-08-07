"use client";

import { useEffect, useRef } from "react";
import type { Author, Category, Post } from "@/types/data";
import { PostCard } from "@/components/ui/PostCard";

type PostSliderProps = {
  posts: Post[];
  authors: Author[];
  categories: Category[];
};

export function PostSlider({ posts, authors, categories }: PostSliderProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const tryInit = () => {
      const Swiper = (
        window as Window & {
          Swiper?: new (
            el: string | HTMLElement,
            opts?: object,
          ) => { destroy: () => void };
        }
      ).Swiper;
      if (!Swiper) return;
      const el = root.querySelector<HTMLElement>(".fpg-post-slider.swiper");
      if (!el || el.dataset.swiperInitialized) return;
      el.dataset.swiperInitialized = "1";
      new Swiper(el, {
        slidesPerView: 4,
        spaceBetween: 24,
        loop: posts.length > 4,
        navigation: {
          nextEl: root.querySelector(".swiper-button-next"),
          prevEl: root.querySelector(".swiper-button-prev"),
        },
        breakpoints: {
          0: { slidesPerView: 1, spaceBetween: 16 },
          768: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
          1366: { slidesPerView: 4, spaceBetween: 24 },
        },
      });
    };

    tryInit();
    const t = window.setInterval(tryInit, 300);
    window.setTimeout(() => window.clearInterval(t), 12_000);
    return () => window.clearInterval(t);
  }, [posts]);

  return (
    <div
      ref={rootRef}
      className="elementor-element elementor-element-ad90ba2 elementor-widget elementor-widget-fpg-post-slider relative w-full"
      data-id="ad90ba2"
      data-element_type="widget"
      data-widget_type="fpg-post-slider.default"
    >
      <div className="elementor-widget-container">
        <div id="fpg-unique-slider-id-ad90ba2" className="fpg-unique-slider">
          <div className="fpg-post-slider swiper !overflow-visible" dir="ltr">
            <div className="swiper-wrapper items-stretch">
              {posts.map((post) => (
                <div key={post.id} className="swiper-slide !h-auto">
                  <PostCard
                    post={post}
                    authors={authors}
                    categories={categories}
                    variant="floating"
                    titleTag="h5"
                    className="h-full w-full"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              className="swiper-button-prev !left-0 !right-auto !mt-0 !h-10 !w-10 -translate-y-1/2 !text-2xl !text-[var(--titleColor)] after:!text-xl after:!content-['←']"
              aria-label="Previous"
            />
            <button
              type="button"
              className="swiper-button-next !left-auto !right-0 !mt-0 !h-10 !w-10 -translate-y-1/2 !text-2xl !text-[var(--titleColor)] after:!text-xl after:!content-['→']"
              aria-label="Next"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
