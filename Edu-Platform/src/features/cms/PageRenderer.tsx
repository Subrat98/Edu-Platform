import { sectionRegistry } from "./sectionRegistry";
import type { Page } from "@/types";

/**
 * Renders a Page's Section[] through the shared section registry, sorted
 * by order. Unknown section types are silently skipped (matching the
 * source spec's "unknown types or invalid configuration are rejected"
 * rule) rather than crashing the page.
 */
export function PageRenderer({ page }: { page: Page }) {
  const sorted = [...page.sections].sort((a, b) => a.order - b.order);
  return (
    <>
      {sorted.map((section) => {
        if (section.hidden) return null;
        const Component = sectionRegistry[section.type];
        if (!Component) return null;
        return <Component key={section.id} {...section.props} />;
      })}
    </>
  );
}
