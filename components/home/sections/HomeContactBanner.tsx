import Link from "next/link";
import { HOME_BANNER } from "@/lib/post-utils";
import {
  ElementorChild,
  ElementorInner,
  ElementorParent,
  ElementorWidget,
} from "@/components/ui/ElementorLayout";

export function HomeContactBanner() {
  return (
    <ElementorParent id="1a4b570" className="e-con-boxed e-flex w-full bg-transparent py-4">
      <ElementorInner>
        <ElementorChild id="60d6d46" className="e-con-full e-flex">
          <ElementorWidget id="008612d" widgetType="image">
            <Link href="/contact">
              <img
                loading="lazy"
                decoding="async"
                width={1430}
                height={236}
                src={HOME_BANNER}
                className="attachment-full size-full wp-image-6925 block h-auto w-full"
                alt="Contact us"
              />
            </Link>
          </ElementorWidget>
        </ElementorChild>
      </ElementorInner>
    </ElementorParent>
  );
}
