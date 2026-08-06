import type { Category } from "@/types/data";
import {
  HOME_EXPLORE_CATEGORY_SLUGS,
  categoryCardImage,
} from "@/lib/category-images";
import { EChild, EWidget } from "@/components/home/elementor/ElementorCon";

type HomeExploreCategoriesProps = {
  categories: Category[];
};

export function HomeExploreCategories({ categories }: HomeExploreCategoriesProps) {
  const exploreCategories = HOME_EXPLORE_CATEGORY_SLUGS.map((slug) =>
    categories.find((c) => c.slug === slug),
  ).filter((c): c is Category => Boolean(c));

  return (
    <EChild
      id="e1af41a"
      className="e-con-full e-flex"
      dataSettings={{ background_background: "classic" }}
    >
        <EWidget id="5957a87" widgetType="heading" bareContainer>
          <h4 className="elementor-heading-title elementor-size-default">
            Explore Categories
          </h4>
        </EWidget>
        <EWidget id="0bbdd89" widgetType="fpg-post-categories">
          <div className="fpg-post-categories fpg-post-categories-two">
            {exploreCategories.map((cat) => {
              const image = categoryCardImage(cat.slug, cat.image);
              return (
                <a
                  key={cat.id}
                  href={cat.url}
                  className="fpg-cat-item "
                  style={
                    {
                      "--fpgCatItemImage": `url(${image})`,
                    } as React.CSSProperties
                  }
                >
                  <div className="fpg-cat-content">
                    <div className="fpg-cat-text-wrapper">
                      <h6 className="fpg-cat-title">{cat.name}</h6>
                      <span className="fpg-cat-count"> ({cat.postCount}) </span>
                    </div>
                    <div className="fpg-cat-btn">
                      <span>
                        <i className="ri-arrow-right-line" />
                        <i className="ri-arrow-right-line" />
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </EWidget>
    </EChild>
  );
}
