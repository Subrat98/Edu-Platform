import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import {
  Menu,
  Moon,
  Sun,
  ChevronDown,
  RotateCcw,
  LogIn,
  LogOut,
  GraduationCap,
  Landmark,
  Search,
  Award,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  FileCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { AvatarInitials } from "@/components/common/AvatarInitials";
import { Container } from "@/components/common/Container";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { useInstitutionStore } from "@/features/institutions/institutionStore";
import { useAuthStore } from "@/features/auth/authStore";
import { ROLE_LABELS } from "@/types";
import { navMenuService } from "@/features/content/navMenuService";
import { queryKeys } from "@/lib/queryKeys";
import { resetDemoData } from "@/lib/resetDemoData";
import { cn } from "@/lib/utils";
import { LanguageDropdown } from "@/components/common/LanguageDropdown";
import { useTranslation } from "@/features/i18n/languageStore";
import { UniversitySearchDialog } from "@/components/common/UniversitySearchDialog";
import {
  setTextZoomPercent,
  setTextZoom,
  getStoredTextZoom,
  getStoredTextZoomPercent,
  TEXT_ZOOM_OPTIONS,
  type TextZoomLevel,
} from "@/lib/accessibility";
import { useLiveSiteContent } from "@/features/content/siteContentService";

export function Header() {
  const { institutionId, institution } = useInstitutionData();
  const setInstitution = useInstitutionStore((s) => s.setInstitution);
  const visibility = useInstitutionStore((s) => s.visibility);
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<TextZoomLevel>(getStoredTextZoom);
  const [zoomPercent, setZoomPercent] = useState<number>(getStoredTextZoomPercent);
  const { t } = useTranslation();

  const isChildActive = (childPath?: string) => {
    if (!childPath) return false;
    const current = location.pathname;

    // 1. Exact match
    if (current === childPath) return true;

    // 2. Institution home exact match
    if (childPath === `/${institutionId}` || childPath === "/") {
      return current === childPath || (childPath === "/" && current === `/${institutionId}`);
    }

    // 3. Alias match between /college/{section}/x and /college/x
    if (childPath.startsWith(`/${institutionId}/about/`)) {
      const alias = childPath.replace(`/${institutionId}/about/`, `/${institutionId}/`);
      if (current === alias) return true;
    }
    if (current.startsWith(`/${institutionId}/about/`)) {
      const alias = current.replace(`/${institutionId}/about/`, `/${institutionId}/`);
      if (alias === childPath) return true;
    }
    if (childPath.startsWith(`/${institutionId}/administration/`)) {
      const alias = childPath.replace(`/${institutionId}/administration/`, `/${institutionId}/`);
      if (current === alias) return true;
    }
    if (current.startsWith(`/${institutionId}/administration/`)) {
      const alias = current.replace(`/${institutionId}/administration/`, `/${institutionId}/`);
      if (alias === childPath) return true;
    }
    if (childPath.startsWith(`/${institutionId}/admissions/`)) {
      const alias = childPath.replace(`/${institutionId}/admissions/`, `/${institutionId}/`);
      if (current === alias) return true;
    }
    if (current.startsWith(`/${institutionId}/admissions/`)) {
      const alias = current.replace(`/${institutionId}/admissions/`, `/${institutionId}/`);
      if (alias === childPath) return true;
    }
    if (childPath.startsWith(`/${institutionId}/research/`)) {
      const alias = childPath.replace(`/${institutionId}/research/`, `/${institutionId}/`);
      if (current === alias) return true;
    }
    if (current.startsWith(`/${institutionId}/research/`)) {
      const alias = current.replace(`/${institutionId}/research/`, `/${institutionId}/`);
      if (alias === childPath) return true;
    }
    if (childPath.startsWith(`/${institutionId}/grievance/`)) {
      const alias = childPath.replace(`/${institutionId}/grievance/`, `/${institutionId}/`);
      if (current === alias) return true;
    }
    if (current.startsWith(`/${institutionId}/grievance/`)) {
      const alias = current.replace(`/${institutionId}/grievance/`, `/${institutionId}/`);
      if (alias === childPath) return true;
    }
    if (childPath.startsWith(`/${institutionId}/alumni/`)) {
      const alias = childPath.replace(`/${institutionId}/alumni/`, `/${institutionId}/`);
      if (current === alias) return true;
    }
    if (current.startsWith(`/${institutionId}/alumni/`)) {
      const alias = current.replace(`/${institutionId}/alumni/`, `/${institutionId}/`);
      if (alias === childPath) return true;
    }

    // 4. Sub-path match (e.g. /college/departments/physics matches /college/departments)
    // Avoid section roots like /college/about, /college/administration, /college/admissions, /college/research, /college/grievance, /college/alumni matching specific sibling subpages
    if (
      childPath !== `/${institutionId}/about` &&
      childPath !== `/${institutionId}/administration` &&
      childPath !== `/${institutionId}/admissions` &&
      childPath !== `/${institutionId}/research` &&
      childPath !== `/${institutionId}/grievance` &&
      childPath !== `/${institutionId}/alumni` &&
      childPath !== `/${institutionId}` &&
      childPath !== "/" &&
      current.startsWith(`${childPath}/`)
    ) {
      return true;
    }

    return false;
  };

  const isItemActive = (item: { path?: string; children?: { path: string }[] }) => {
    const current = location.pathname;
    // Highlight parent if any child is active
    if (item.children && item.children.length > 0) {
      if (item.children.some((child) => isChildActive(child.path))) {
        return true;
      }
    }
    // Standalone top-level nav item
    if (item.path) {
      if (current === item.path) return true;
      if (item.path === `/${institutionId}` || item.path === "/") {
        return current === item.path || (item.path === "/" && current === `/${institutionId}`);
      }
      if (current.startsWith(`${item.path}/`)) {
        return true;
      }
    }
    return false;
  };

  // Keyboard shortcut listener (Cmd/Ctrl + K) for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleZoomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ percent: number; level: TextZoomLevel } | TextZoomLevel>;
      if (customEvent.detail) {
        if (typeof customEvent.detail === "object" && typeof customEvent.detail.percent === "number") {
          setZoomPercent(customEvent.detail.percent);
          setZoomLevel(customEvent.detail.level);
        } else if (typeof customEvent.detail === "string") {
          setZoomLevel(customEvent.detail as TextZoomLevel);
          setZoomPercent(getStoredTextZoomPercent());
        }
      }
    };
    window.addEventListener("eduplatform_text_zoom_changed", handleZoomEvent);
    return () => window.removeEventListener("eduplatform_text_zoom_changed", handleZoomEvent);
  }, []);

  const handleZoom = (lvl: TextZoomLevel) => {
    if (lvl === "normal") {
      setTextZoomPercent(100);
      setZoomPercent(100);
      setZoomLevel("normal");
    } else if (lvl === "small") {
      const next = zoomPercent > 90 ? 90 : Math.max(80, zoomPercent - 10);
      setTextZoomPercent(next);
      setZoomPercent(next);
      setZoomLevel("small");
    } else if (lvl === "medium") {
      const next = zoomPercent < 115 ? 115 : Math.min(150, zoomPercent + 15);
      setTextZoomPercent(next);
      setZoomPercent(next);
      setZoomLevel("medium");
    }
  };

  const { data: menu } = useQuery({
    queryKey: queryKeys.navMenu(institutionId),
    queryFn: () => navMenuService.get(institutionId),
  });

  function handleLogout() {
    logout();
    navigate(`/auth/login?institution=${institutionId}`);
  }

  const isCollege = institutionId === "college";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-card shadow-sm">
        {/* Skip to Main Content (GIGW / Accessibility) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md font-bold text-xs shadow-lg"
        >
          Skip to main content
        </a>

        {/* Tier 1: Accessibility & Utility Bar (GIGW 3.0 Compliance) */}
        <div className="bg-primary text-white border-b border-white/10 text-xs">
          <Container className="flex h-9 items-center justify-between gap-2">
            {/* Left: GIGW Accessibility Toolbar */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden md:inline-block text-[11px] font-medium text-white/80">
                {isCollege ? "Government of Odisha Higher Education" : "School & Mass Education · CBSE Affiliated (1998)"}
              </span>

              {/* Text Size Scaling Controls: -A, A, A+ */}
              <div className="flex items-center rounded-md bg-white/20 p-0.5 shadow-xs" title="Text Resizing: -A (90%) | A (100%) | A+ (115%)">
                <span className="text-[10px] font-bold px-1.5 opacity-90 hidden sm:inline">Text:</span>
                {TEXT_ZOOM_OPTIONS.map((opt) => {
                  const isActive =
                    opt.level === "normal"
                      ? zoomPercent === 100
                      : opt.level === "small"
                      ? zoomPercent < 100
                      : zoomPercent > 100;
                  return (
                    <button
                      key={opt.level}
                      type="button"
                      onClick={() => handleZoom(opt.level)}
                      className={cn(
                        "px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-extrabold rounded transition-all",
                        isActive ? "bg-white text-primary shadow-xs font-black" : "text-white/80 hover:text-white hover:bg-white/20"
                      )}
                      aria-label={opt.description}
                      title={opt.description}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {/* Contrast / Dark Theme Toggle */}
              <button
                type="button"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="flex items-center gap-1 rounded bg-white/10 px-2 py-0.5 text-[11px] hover:bg-white/20 transition-colors"
                aria-label="Toggle light/dark contrast"
                title="Toggle High Contrast Mode"
              >
                {resolvedTheme === "dark" ? <Sun className="size-3 text-amber-300" /> : <Moon className="size-3" />}
                <span className="hidden sm:inline">{resolvedTheme === "dark" ? "Light" : "Contrast"}</span>
              </button>

              {/* Screen Reader Page Shortcut */}
              <Link
                to={isCollege ? "/college/disclosure" : "/school/about"}
                className="hidden lg:inline-flex items-center gap-1 text-[11px] text-white/80 hover:text-white underline decoration-white/40"
              >
                <span>Screen Reader Access</span>
              </Link>
            </div>

            {/* Right: Quick Search, Wing Switcher, Language & Reset */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Filtered Search Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white hover:bg-white/25 transition-colors"
                title="Site-wide Search (Ctrl+K)"
              >
                <Search className="size-3" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden sm:inline-block px-1 text-[9px] font-mono bg-white/20 rounded">⌘K</kbd>
              </button>

              {/* Wing toggle — School / College (Shown if both wings visible) */}
              {(visibility?.school ?? true) && (visibility?.college ?? true) ? (
                <div className="flex items-center rounded-full border border-white/25 bg-white/10 p-0.5">
                  {(["school", "college"] as const).map((wing) => (
                    <button
                      key={wing}
                      type="button"
                      onClick={() => {
                        setInstitution(wing);
                        navigate(`/${wing}`);
                      }}
                      className={cn(
                        "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize transition-all",
                        institutionId === wing
                          ? "bg-white text-primary shadow-sm"
                          : "text-white/80 hover:text-white",
                      )}
                    >
                      {wing === "school" ? (
                        <GraduationCap className="size-3" />
                      ) : (
                        <img src="/college-logo.png" alt="" className="size-3.5 object-contain inline-block rounded-full" />
                      )}
                      {wing === "school" ? t("school") : t("college")}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-1 rounded-full border border-white/25 bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  {(visibility?.college ?? isCollege) ? (
                    <img src="/college-logo.png" alt="" className="size-3.5 object-contain inline-block rounded-full" />
                  ) : (
                    <GraduationCap className="size-3" />
                  )}
                  <span>{(visibility?.college ?? isCollege) ? t("college") : t("school")}</span>
                </div>
              )}

              {/* Language Dropdown (English / Odia) */}
              <LanguageDropdown variant="light" />

              {/* Reset Demo */}
              <button
                type="button"
                onClick={resetDemoData}
                className="hidden sm:flex items-center gap-1 rounded-full px-2 py-0.5 hover:bg-white/15 text-[11px]"
                title="Reset local demo database"
              >
                <RotateCcw className="size-3" />
                <span>{t("resetDemo")}</span>
              </button>
            </div>
          </Container>
        </div>

        {/* Tier 2: E-Services Quick-Access Strip (College) */}
        {isCollege && (
          <div className="hidden md:block bg-muted/60 border-b border-border/60 py-1 text-[11px]">
            <Container className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-muted-foreground font-semibold">
                <span className="uppercase tracking-wider text-[10px] text-primary">Quick E-Services:</span>
              </div>
              <div className="flex items-center gap-3 overflow-x-auto text-foreground/90">
                <Link to="/college/admissions" className="hover:text-primary font-medium flex items-center gap-1">
                  <span>e-Admission</span>
                </Link>
                <span className="text-muted-foreground/40">·</span>
                <Link to="/college/examination-cell" className="hover:text-primary font-medium">
                  <span>Results & Exams</span>
                </Link>
                <span className="text-muted-foreground/40">·</span>
                <Link to="/college/grievance" className="hover:text-primary font-medium text-emerald-600 dark:text-emerald-400">
                  <span>e-Pratikar Grievance</span>
                </Link>
                <span className="text-muted-foreground/40">·</span>
                <Link to="/college/library" className="hover:text-primary font-medium">
                  <span>Library OPAC (EBSCO)</span>
                </Link>
                <span className="text-muted-foreground/40">·</span>
                <Link to="/college/admissions" className="hover:text-primary font-medium flex items-center gap-1 text-primary">
                  <CreditCard className="size-3" />
                  <span>Online Fee Payment</span>
                </Link>
                <span className="text-muted-foreground/40">·</span>
                <Link to="/college/virtual-tour" className="hover:text-primary font-medium">
                  <span>Virtual Tour</span>
                </Link>
                <span className="text-muted-foreground/40">·</span>
                <a href="https://samarth.edu.in" target="_blank" rel="noreferrer" className="hover:text-primary font-medium text-muted-foreground flex items-center gap-0.5">
                  <span>Samarth ERP</span>
                  <ExternalLink className="size-2.5" />
                </a>
              </div>
            </Container>
          </div>
        )}

        {/* Tier 2: School Transparency & Services Quick Strip (Section 4.2 / CBSE Mandate) */}
        {!isCollege && (
          <div className="hidden md:block bg-muted/60 border-b border-border/60 py-1 text-[11px]">
            <Container className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link
                  to="/school/mandatory-disclosure"
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-black text-[10px] uppercase bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shadow-xs"
                >
                  <FileCheck2 className="size-3" />
                  <span>Mandatory Public Disclosure (Appendix IX)</span>
                </Link>
              </div>
              <div className="flex items-center gap-3 overflow-x-auto text-foreground/90">
                <Link to="/school/admissions" className="hover:text-primary font-medium flex items-center gap-1 text-primary">
                  <span>Admissions 2026-27 (RTE 25%)</span>
                </Link>
                <span className="text-muted-foreground/40">·</span>
                <Link to="/school/results" className="hover:text-primary font-medium">
                  <span>Board Results (X & XII)</span>
                </Link>
                <span className="text-muted-foreground/40">·</span>
                <Link to="/school/academics" className="hover:text-primary font-medium">
                  <span>Academic Calendar</span>
                </Link>
                <span className="text-muted-foreground/40">·</span>
                <Link to="/school/student-life" className="hover:text-primary font-medium">
                  <span>PM-POSHAN Meal</span>
                </Link>
                <span className="text-muted-foreground/40">·</span>
                <Link to="/school/grievance" className="hover:text-primary font-medium text-emerald-600 dark:text-emerald-400">
                  <span>Grievance (Childline 1098)</span>
                </Link>
                <span className="text-muted-foreground/40">·</span>
                <Link to="/school/alumni" className="hover:text-primary font-medium text-amber-600 dark:text-amber-400">
                  <span>Mo School Abhiyan</span>
                </Link>
              </div>
            </Container>
          </div>
        )}

        {/* Tier 3: Institutional Brand & Accreditation Banner */}
        <Container className="flex h-20 items-center justify-between gap-4 py-2">
          {(() => {
            const siteContent = useLiveSiteContent(institutionId);
            const activeLogoUrl = siteContent.branding?.logoUrl || institution?.theme.logoUrl || "/college-logo.png";
            const activeName = siteContent.branding?.institutionName || institution?.name || (isCollege ? "Our College" : "Our School");
            const activeTagline = siteContent.branding?.tagline || (isCollege ? "Our College · Estd. 2026" : (institution?.tagline ?? "Where every child learns to shine"));
            const activeAffiliation = siteContent.branding?.affiliationBadge || (institution?.affiliation ?? (isCollege ? "Autonomous College · NAAC A+" : "CBSE Affiliation No. 3330123"));

            return (
              <Link to={`/${institutionId}`} className="flex min-w-0 shrink items-center gap-3">
                {activeLogoUrl ? (
                  <img
                    src={activeLogoUrl}
                    alt={activeName}
                    className="size-14 shrink-0 rounded-xl object-contain drop-shadow-sm"
                  />
                ) : (
                  <div className="relative size-12 shrink-0 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white shadow-md border border-white/20">
                    {isCollege ? (
                      <Landmark className="size-6 text-white" />
                    ) : (
                      <GraduationCap className="size-6 text-white" />
                    )}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-foreground block truncate text-base sm:text-lg font-bold leading-tight">
                      {activeName}
                    </span>
                  </div>
                  <span className="text-xs text-primary font-semibold block truncate">
                    {activeTagline}
                  </span>
                  <span className="text-[11px] text-muted-foreground hidden sm:block truncate">
                    {activeAffiliation}
                  </span>
                </div>
              </Link>
            );
          })()}

          {/* Regulator & Accreditation Strip (Desktop) */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            {isCollege ? (
              <>
                <div className="p-2 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-center gap-2 text-left">
                  <Award className="size-6 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div>
                    <div className="text-xs font-black text-amber-700 dark:text-amber-300">
                      NAAC Grade A+
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      CGPA 3.42 · Cycle 3
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded-lg border border-border/70 bg-muted/20 text-left text-[11px]">
                  <div className="font-bold text-foreground">UGC Category-1</div>
                  <div className="text-[10px] text-muted-foreground">Govt. of Odisha</div>
                </div>
              </>
            ) : (
              <>
                <div className="p-2 rounded-lg border border-primary/30 bg-primary/10 flex items-center gap-2 text-left">
                  <Award className="size-6 text-primary shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-primary">
                      CBSE Affiliated
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      Affiliation No. 3330123
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded-lg border border-border/70 bg-muted/20 text-left text-[11px]">
                  <div className="font-bold text-foreground">K-12 School</div>
                  <div className="text-[10px] text-muted-foreground">Nursery – Class XII</div>
                </div>
              </>
            )}

            {/* Persona Switcher / User Profile */}
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 h-10 px-2.5 border border-border/80">
                    <AvatarInitials name={currentUser.name} size="sm" />
                    <div className="text-left hidden xl:block">
                      <div className="text-xs font-semibold leading-none">{currentUser.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{ROLE_LABELS[currentUser.role]}</div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="text-xs font-bold">{currentUser.name}</div>
                    <div className="text-[10px] text-muted-foreground font-normal">{currentUser.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/admin">Admin Command Center</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/naac">NAAC & IQAC Console</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/naac/permissions">RBAC Permission Matrix</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="size-3.5 mr-2" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" className="gap-1.5 text-xs shadow-xs">
                <Link to={`/auth/login?institution=${institutionId}`}>
                  <LogIn className="size-3.5" />
                  <span>Portal Login</span>
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg border border-border text-foreground hover:bg-muted"
              aria-label="Search"
            >
              <Search className="size-4" />
            </button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMobileOpen(true)}
              aria-label="Open mobile navigation menu"
            >
              <Menu className="size-5" />
            </Button>
          </div>
        </Container>

        {/* Tier 4: Primary Mega-Menu Navigation Bar */}
        <div className="hidden lg:block border-t border-border/70 bg-card">
          <Container>
            <nav className="flex items-center gap-0.5 overflow-x-auto py-1">
              {(menu?.items ?? []).map((item) => {
                const isActive = isItemActive(item);
                return item.children && item.children.length > 0 ? (
                  <DropdownMenu key={item.label}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        className={cn(
                          "shrink-0 gap-1 px-3 h-8 text-xs font-bold rounded-lg transition-all whitespace-nowrap",
                          isActive
                            ? "bg-primary text-white shadow-xs hover:bg-primary/90 hover:text-white"
                            : "text-foreground hover:text-primary hover:bg-primary/10"
                        )}
                      >
                        {t(item.label)}{" "}
                        <ChevronDown className={cn("size-3", isActive ? "text-white/80" : "text-muted-foreground")} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-52 shadow-lg border-primary/20">
                      {item.children.map((child) => {
                        const isChildActiveItem = isChildActive(child.path);
                        return (
                          <DropdownMenuItem
                            key={child.label}
                            asChild
                            className={cn(
                              "text-xs cursor-pointer py-1.5 font-medium rounded-md px-2",
                              isChildActiveItem && "bg-primary text-white font-bold focus:bg-primary focus:text-white"
                            )}
                          >
                            <Link to={child.path}>
                              {t(child.label)}
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    key={item.label}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    asChild
                    className={cn(
                      "shrink-0 px-3 h-8 text-xs font-bold rounded-lg transition-all whitespace-nowrap",
                      isActive
                        ? "bg-primary text-white shadow-xs hover:bg-primary/90 hover:text-white"
                        : "text-foreground hover:text-primary hover:bg-primary/10"
                    )}
                  >
                    <Link to={item.path || `/${institutionId}`}>
                      {t(item.label)}
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </Container>
        </div>

        {/* Mobile Navigation Drawer Sheet */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="right" className="w-80 sm:w-96 overflow-y-auto p-4">
            <SheetHeader className="text-left pb-3 border-b">
              <SheetTitle className="text-base font-bold flex items-center gap-2">
                {isCollege ? (
                  <Landmark className="size-5 text-primary" />
                ) : (
                  <GraduationCap className="size-5 text-primary" />
                )}
                {institution?.name ?? (isCollege ? "Our College" : "Our School")}
              </SheetTitle>
              <div className="flex items-center gap-2 pt-1">
                {isCollege ? (
                  <>
                    <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px]">
                      NAAC Grade A+
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      UGC Category-1
                    </Badge>
                  </>
                ) : (
                  <>
                    <Badge className="bg-primary/10 text-primary text-[10px]">
                      CBSE Affiliated
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      K-12 School
                    </Badge>
                  </>
                )}
              </div>
            </SheetHeader>

            <div className="py-4 space-y-3">
              {/* Accessibility Text Resizing (Mobile: -A, A, A+) */}
              <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="text-primary font-black">A±</span> Text Size (Accessibility)
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono text-primary border-primary/30 font-bold">
                    {zoomPercent}%
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {TEXT_ZOOM_OPTIONS.map((opt) => {
                    const isActive =
                      opt.level === "normal"
                        ? zoomPercent === 100
                        : opt.level === "small"
                        ? zoomPercent < 100
                        : zoomPercent > 100;
                    return (
                      <button
                        key={opt.level}
                        type="button"
                        onClick={() => handleZoom(opt.level)}
                        className={cn(
                          "py-1.5 text-center rounded-lg text-xs font-bold transition-all",
                          isActive
                            ? "bg-primary text-white shadow-xs font-black"
                            : "bg-background border border-border/70 text-foreground hover:bg-muted"
                        )}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Access Links (Mobile) */}
              <div className="p-2 rounded-lg bg-muted/40 border border-border/60 space-y-1.5 text-xs">
                <div className="font-bold text-[11px] text-primary uppercase tracking-wider">
                  Quick Access
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  {isCollege ? (
                    <>
                      <SheetClose asChild>
                        <Link to="/college/admissions" className="p-1.5 rounded bg-background border hover:border-primary">
                          e-Admission
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/college/examination-cell" className="p-1.5 rounded bg-background border hover:border-primary">
                          Results & Exams
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/college/grievance" className="p-1.5 rounded bg-background border hover:border-primary text-emerald-600">
                          e-Pratikar Grievance
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/college/library" className="p-1.5 rounded bg-background border hover:border-primary">
                          Library OPAC
                        </Link>
                      </SheetClose>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Link to="/school/admissions" className="p-1.5 rounded bg-background border hover:border-primary">
                          Admissions
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/school/results" className="p-1.5 rounded bg-background border hover:border-primary">
                          Board Results
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/school/parent-corner" className="p-1.5 rounded bg-background border hover:border-primary">
                          Parent Corner
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/school/facilities" className="p-1.5 rounded bg-background border hover:border-primary">
                          Facilities & Labs
                        </Link>
                      </SheetClose>
                    </>
                  )}
                </div>
              </div>

              {/* Main Menu Groups */}
              <nav className="space-y-1">
                {(menu?.items ?? []).map((item) => {
                  const isActive = isItemActive(item);
                  return (
                    <div key={item.label} className="py-1">
                      {item.children ? (
                        <div className="space-y-1">
                          <div
                            className={cn(
                              "px-2.5 py-1 text-xs font-bold flex items-center justify-between rounded-md",
                              isActive
                                ? "bg-primary text-white font-bold shadow-xs"
                                : "text-foreground"
                            )}
                          >
                            <span>{t(item.label)}</span>
                          </div>
                          <div className="pl-3 space-y-0.5 border-l-2 border-primary/20 ml-2">
                            {item.children.map((child) => {
                              const isChildActiveItem = isChildActive(child.path);
                              return (
                                <SheetClose key={child.label} asChild>
                                  <Link
                                    to={child.path}
                                    className={cn(
                                      "block py-1.5 px-2 text-xs rounded transition-colors",
                                      isChildActiveItem
                                        ? "bg-primary text-white font-bold shadow-xs"
                                        : "text-muted-foreground hover:text-primary hover:bg-muted/30"
                                    )}
                                  >
                                    {t(child.label)}
                                  </Link>
                                </SheetClose>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <SheetClose asChild>
                          <Link
                            to={item.path || `/${institutionId}`}
                            className={cn(
                              "block px-2.5 py-1.5 text-xs font-bold rounded transition-colors",
                              isActive
                                ? "bg-primary text-white shadow-xs"
                                : "text-foreground hover:text-primary hover:bg-muted/40"
                            )}
                          >
                            {t(item.label)}
                          </Link>
                        </SheetClose>
                      )}
                    </div>
                  );
                })}
              </nav>

              <div className="pt-4 border-t space-y-2">
                <Button asChild className="w-full text-xs gap-1.5">
                  <Link to={`/auth/login?institution=${institutionId}`}>
                    <LogIn className="size-3.5" />
                    <span>Portal Login</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full text-xs gap-1.5">
                  <Link to="/admin">
                    <ShieldCheck className="size-3.5 text-primary" />
                    <span>Admin Command Center</span>
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* University Site-Wide Search Modal */}
      <UniversitySearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
