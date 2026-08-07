
export {
  ElementorParent as EParent,
  ElementorChild as EChild,
  ElementorInner as EInner,
  ElementorWidget as EWidget,
} from "@/components/ui/ElementorLayout";

// type ConProps = {
//   id: string;
//   className?: string;
//   dataSettings?: Record<string, unknown>;
//   style?: React.CSSProperties;
//   children: React.ReactNode;
// };

// function settingsAttr(settings?: Record<string, unknown>) {
//   if (!settings) return undefined;
//   return JSON.stringify(settings);
// }

// /* === FIX: dedupe class tokens so callers can safely pass "e-con e-child"
//    (as HomePageView does for c8545b8) without producing repeated classes
//    in the rendered DOM. === */
// function mergeClasses(...groups: string[]) {
//   const seen = new Set<string>();
//   for (const group of groups) {
//     for (const token of group.split(/\s+/)) {
//       if (token) seen.add(token);
//     }
//   }
//   return Array.from(seen).join(" ");
// }
// /* === END FIX === */

// export function EParent({ id, className = "", dataSettings, children }: ConProps) {
//   return (
//     <div
//       className={mergeClasses(
//         "elementor-element",
//         `elementor-element-${id}`,
//         "e-con e-parent",
//         className
//       )}
//       data-id={id}
//       data-element_type="container"
//       data-e-type="container"
//       data-settings={settingsAttr(dataSettings)}
//     >
//       {children}
//     </div>
//   );
// }

// export function EChild({ id, className = "", dataSettings, style, children }: ConProps) {
//   return (
//     <div
//       className={mergeClasses(
//         "elementor-element",
//         `elementor-element-${id}`,
//         "e-con e-child",
//         className
//       )}
//       data-id={id}
//       data-element_type="container"
//       data-e-type="container"
//       data-settings={settingsAttr(dataSettings)}
//       style={style}
//     >
//       {children}
//     </div>
//   );
// }

// export function EInner({
//   children,
//   className = "",
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) {
//   return <div className={`e-con-inner w-full bg-transparent ${className}`.trim()}>{children}</div>;
// }

// export function EWidget({
//   id,
//   widgetType,
//   className = "",
//   dataSettings,
//   bareContainer = false,
//   children,
// }: {
//   id: string;
//   widgetType: string;
//   className?: string;
//   dataSettings?: Record<string, unknown>;
//   /** Elementor heading widgets omit `.elementor-widget-container` in the mirror export. */
//   bareContainer?: boolean;
//   children: React.ReactNode;
// }) {
//   return (
//     <div
//       className={mergeClasses(
//         "elementor-element",
//         `elementor-element-${id}`,
//         "elementor-widget",
//         `elementor-widget-${widgetType}`,
//         className
//       )}
//       data-id={id}
//       data-element_type="widget"
//       data-e-type="widget"
//       data-widget_type={`${widgetType}.default`}
//       data-settings={settingsAttr(dataSettings)}
//     >
//       {bareContainer ? (
//         children
//       ) : (
//         <div className="elementor-widget-container">{children}</div>
//       )}
//     </div>
//   );
// }

