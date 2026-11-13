import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import {
  Menu,
  Phone,
  Mail,
  Moon,
  Sun,
  ChevronDown,
  RotateCcw,
  LogIn,
  LogOut,
  ChevronRight,
  GraduationCap,
  Landmark,
  Search,
  Award,
  ExternalLink,
  ShieldCheck,
  FileText,
  CreditCard,
  Building2,
  Globe,
  SlidersHorizontal,
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
import { demoUsers } from "@/mocks/data/users";
import { ROLE_LABELS } from "@/types";
import { navMenuService } from "@/features/content/navMenuService";
import { queryKeys } from "@/lib/queryKeys";
import { resetDemoData } from "@/lib/resetDemoData";
import { cn } from "@/lib/utils";
import { LanguageDropdown } from "@/components/common/LanguageDropdown";
import { useTranslation } from "@/features/i18n/languageStore";
import { UniversitySearchDialog } from "@/components/common/UniversitySearchDialog";
import { setTextZoom, getStoredTextZoom, type TextZoomLevel } from "@/lib/accessibility";

export function Header() {
  const { institutionId, institution } = useInstitutionData();
  const setInstitution = useInstitutionStore((s) => s.setInstitution);
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<TextZoomLevel>(getStoredTextZoom);
  const { t } = useTranslation();

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

  const handleZoom = (lvl: TextZoomLevel) => {
    setZoomLevel(lvl);
    setTextZoom(lvl);
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

              {/* Text Size Scaling Controls */}
              <div className="flex items-center rounded bg-white/15 p-0.5" title="Text Resizing (A- / 100% / A+)">
                <button
                  type="button"
                  onClick={() => handleZoom("small")}
                  className={cn(
                    "px-1.5 py-0.2 text-[10px] font-bold rounded transition-colors",
                    zoomLevel === "small" ? "bg-white text-primary" : "text-white/80 hover:text-white"
                  )}
                  aria-label="Decrease text size"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => handleZoom("normal")}
                  className={cn(
                    "px-1.5 py-0.2 text-[10px] font-bold rounded transition-colors",
                    zoomLevel === "normal" ? "bg-white text-primary" : "text-white/80 hover:text-white"
                  )}
                  aria-label="Normal text size"
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => handleZoom("large")}
                  className={cn(
                    "px-1.5 py-0.2 text-[10px] font-bold rounded transition-colors",
                    zoomLevel === "large" ? "bg-white text-primary" : "text-white/80 hover:text-white"
                  )}
                  aria-label="Increase text size"
                >
                  A+
                </button>
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

              {/* Wing toggle — School / College */}
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
                    {wing === "school" ? <GraduationCap className="size-3" /> : <Landmark className="size-3" />}
                    {wing === "school" ? t("school") : t("college")}
                  </button>
                ))}
              </div>

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
                <Link to="/college/admissions" className="hover:text-primary font-medium flex items-center gap-1 text-blue-600 dark:text-blue-400">
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
                <Link to="/school/admissions" className="hover:text-primary font-medium flex items-center gap-1 text-blue-600 dark:text-blue-400">
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
          <Link to={`/${institutionId}`} className="flex min-w-0 shrink items-center gap-3">
            <div className="relative size-12 shrink-0 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white shadow-md border border-white/20">
              {isCollege ? (
                <Landmark className="size-6 text-white" />
              ) : (
                <GraduationCap className="size-6 text-white" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-heading text-foreground block truncate text-base sm:text-lg font-bold leading-tight">
                  {institution?.name ?? (isCollege ? "Our College" : "Our School")}
                </span>
              </div>
              <span className="text-xs text-primary font-semibold block truncate">
                {isCollege ? "Our College · Est. 1868 / 1943" : (institution?.tagline ?? "Where every child learns to shine")}
              </span>
              <span className="text-[11px] text-muted-foreground hidden sm:block truncate">
                {institution?.affiliation ?? (isCollege ? "Autonomous College · NAAC A+" : "CBSE Affiliation No. 3330123")}
              </span>
            </div>
          </Link>

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
              {(menu?.items ?? []).map((item) =>
                item.children && item.children.length > 0 ? (
                  <DropdownMenu key={item.label}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0 gap-1 px-2.5 h-8 text-xs font-bold text-foreground hover:text-primary hover:bg-primary/10 whitespace-nowrap"
                      >
                        {t(item.label)} <ChevronDown className="size-3 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-52 shadow-lg border-primary/20">
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.path} asChild>
                          <Link to={child.path} className="text-xs cursor-pointer py-1.5 font-medium">
                            {t(child.label)}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    key={item.label}
                    variant="ghost"
                    size="sm"
                    asChild
                    className="shrink-0 px-2.5 h-8 text-xs font-bold text-foreground hover:text-primary hover:bg-primary/10 whitespace-nowrap"
                  >
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        isActive ? "text-primary bg-primary/10 font-bold" : ""
                      }
                    >
                      {t(item.label)}
                    </NavLink>
                  </Button>
                )
              )}
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
                {(menu?.items ?? []).map((item) => (
                  <div key={item.label} className="py-1">
                    {item.children ? (
                      <div className="space-y-1">
                        <div className="px-2 py-1 text-xs font-bold text-foreground flex items-center justify-between">
                          <span>{t(item.label)}</span>
                        </div>
                        <div className="pl-3 space-y-0.5 border-l-2 border-primary/20 ml-2">
                          {item.children.map((child) => (
                            <SheetClose key={child.path} asChild>
                              <Link
                                to={child.path}
                                className="block py-1 px-2 text-xs text-muted-foreground hover:text-primary hover:bg-muted/30 rounded"
                              >
                                {t(child.label)}
                              </Link>
                            </SheetClose>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <SheetClose asChild>
                        <Link
                          to={item.path}
                          className="block px-2 py-1.5 text-xs font-bold text-foreground hover:text-primary hover:bg-muted/40 rounded"
                        >
                          {t(item.label)}
                        </Link>
                      </SheetClose>
                    )}
                  </div>
                ))}
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
