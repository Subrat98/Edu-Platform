import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useTranslation } from "@/features/i18n/languageStore";
import type { AdminNavGroup } from "./adminNavConfig";
import { cn } from "@/lib/utils";

interface AdminBreadcrumbsProps {
  groups: AdminNavGroup[];
  className?: string;
}

export function AdminBreadcrumbs({ groups, className }: AdminBreadcrumbsProps) {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  // Find matching group and item
  let matchedGroup: AdminNavGroup | undefined;
  let matchedItem: AdminNavGroup["items"][number] | undefined;

  for (const group of groups) {
    const item = group.items.find((it) =>
      it.end ? pathname === it.path : pathname.startsWith(it.path)
    );
    if (item) {
      matchedGroup = group;
      matchedItem = item;
      break;
    }
  }

  // Base portal root based on route
  const isNaacRoute = pathname.startsWith("/admin/naac");
  const isPortal = pathname.startsWith("/portal");
  const rootHref = isPortal ? "/portal" : "/admin";
  const rootLabel = isPortal ? "Portal" : "Admin";

  // Friendly short label for mobile
  const shortGroupName = isNaacRoute
    ? "NAAC"
    : matchedGroup
    ? t(matchedGroup.label).split(" ")[0]
    : "Home";

  return (
    <Breadcrumb className={cn("min-w-0 flex-1", className)}>
      <BreadcrumbList className="flex items-center gap-1 sm:gap-1.5 text-xs text-muted-foreground overflow-hidden">
        {/* Desktop Root */}
        <BreadcrumbItem className="hidden sm:inline-flex shrink-0">
          <BreadcrumbLink asChild>
            <Link to={rootHref} className="hover:text-foreground transition-colors">
              {rootLabel}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Group on Tablets/Desktop */}
        {matchedGroup && (
          <>
            <BreadcrumbSeparator className="hidden sm:inline-flex shrink-0" />
            <BreadcrumbItem className="hidden md:inline-flex shrink-0">
              {isNaacRoute ? (
                <BreadcrumbLink asChild>
                  <Link to="/admin/naac" className="hover:text-foreground transition-colors">
                    {t(matchedGroup.label)}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <span className="text-muted-foreground">{t(matchedGroup.label)}</span>
              )}
            </BreadcrumbItem>
          </>
        )}

        {/* Mobile Group Prefix (compact) */}
        {matchedGroup && matchedItem && matchedItem.path !== "/admin/naac" && (
          <>
            <BreadcrumbItem className="inline-flex md:hidden shrink-0">
              <span className="text-[11px] font-medium text-muted-foreground/80">
                {shortGroupName}
              </span>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="inline-flex md:hidden shrink-0 text-muted-foreground/50" />
          </>
        )}

        {/* Current Leaf Page */}
        {matchedItem ? (
          <BreadcrumbItem className="min-w-0">
            <BreadcrumbPage className="font-semibold text-foreground text-xs sm:text-sm truncate block max-w-[130px] xs:max-w-[170px] sm:max-w-[240px] lg:max-w-none">
              {t(matchedItem.label)}
            </BreadcrumbPage>
          </BreadcrumbItem>
        ) : (
          <BreadcrumbItem className="min-w-0">
            <BreadcrumbPage className="font-semibold text-foreground text-xs sm:text-sm truncate block">
              Overview
            </BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
