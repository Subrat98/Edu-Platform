import { useState } from "react";
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

export function Header() {
  const { institutionId, institution } = useInstitutionData();
  const setInstitution = useInstitutionStore((s) => s.setInstitution);
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: menu } = useQuery({
    queryKey: queryKeys.navMenu(institutionId),
    queryFn: () => navMenuService.get(institutionId),
  });

  const otherInstitutionId = institutionId === "school" ? "college" : "school";

  function handleInstitutionSwitch() {
    setInstitution(otherInstitutionId);
    navigate(`/${otherInstitutionId}`);
  }

  function handleLogout() {
    logout();
    navigate("/auth/login");
  }

  return (
    <header className="bg-surface border-border sticky top-0 z-40 border-b">
      {/* Utility bar */}
      <div className="bg-primary hidden text-white sm:block">
        <Container className="flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            {institution ? (
              <>
                <span className="flex items-center gap-1.5">
                  <Phone className="size-3" /> {institution.contact.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="size-3" /> {institution.contact.email}
                </span>
              </>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleInstitutionSwitch}
              className="rounded-full bg-white/15 px-2.5 py-1 font-medium hover:bg-white/25"
            >
              Switch to {otherInstitutionId === "school" ? "School" : "College"} site
            </button>
            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="rounded-full p-1.5 hover:bg-white/15"
              aria-label="Toggle dark mode"
            >
              {resolvedTheme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
            </button>
            <button
              type="button"
              onClick={resetDemoData}
              className="flex items-center gap-1 rounded-full px-2 py-1 hover:bg-white/15"
            >
              <RotateCcw className="size-3" /> Reset demo data
            </button>
          </div>
        </Container>
      </div>

      {/* Main nav */}
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link to={`/${institutionId}`} className="flex min-w-0 shrink items-center gap-2">
          {institution?.theme.logoUrl ? (
            <img
              src={institution.theme.logoUrl}
              alt={`${institution.name} logo`}
              className="size-9 shrink-0 rounded-lg object-contain"
            />
          ) : (
            <span className="bg-primary flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white">
              {institution?.shortName ?? ""}
            </span>
          )}
          <span className="min-w-0">
            <span className="font-heading text-foreground block truncate text-sm leading-tight font-semibold sm:text-base">
              {institution?.name ?? "Loading…"}
            </span>
            <span className="text-muted-foreground block truncate text-xs">{institution?.tagline}</span>
          </span>
        </Link>

        <nav className="hidden min-w-0 shrink items-center gap-0 overflow-x-auto xl:flex">
          {(menu?.items ?? []).map((item) =>
            item.children ? (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="shrink-0 gap-1 px-2 text-sm whitespace-nowrap">
                    {item.label} <ChevronDown className="size-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {item.children.map((child) => (
                    <DropdownMenuItem key={child.path} asChild>
                      <Link to={child.path}>{child.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === `/${institutionId}`}
                className={({ isActive }) =>
                  cn(
                    "hover:bg-muted shrink-0 rounded-lg px-1.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                    isActive ? "text-accent" : "text-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Button asChild size="sm" className="bg-highlight text-highlight-foreground hover:bg-highlight/90 hidden sm:inline-flex">
            <Link to={`/${institutionId}/admissions`}>Apply Now</Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                {currentUser ? (
                  <>
                    <AvatarInitials name={currentUser.name} size="sm" className="size-5 text-[10px]" />
                    <span className="hidden max-w-24 truncate md:inline">{currentUser.name}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="size-4" /> <span className="hidden md:inline">Login</span>
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {currentUser ? (
                <>
                  <DropdownMenuLabel>
                    Signed in as
                    <div className="text-muted-foreground font-normal">
                      {currentUser.name} · {ROLE_LABELS[currentUser.role]}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/portal">Go to portal</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              ) : null}
              <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
                Switch demo account
              </DropdownMenuLabel>
              {demoUsers.map((u) => (
                <DropdownMenuItem key={u.id} asChild>
                  <Link to="/auth/login">
                    <AvatarInitials name={u.name} size="sm" className="size-5 text-[10px]" />
                    <span className="flex-1 truncate">{u.name}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {u.institutionId}
                    </Badge>
                  </Link>
                </DropdownMenuItem>
              ))}
              {currentUser ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout} variant="destructive">
                    <LogOut className="size-4" /> Log out
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetContent side="right" className="w-[85%] max-w-sm overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{institution?.name}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4 pb-6">
                {(menu?.items ?? []).map((item) =>
                  item.children ? (
                    <div key={item.label} className="py-1">
                      <p className="text-muted-foreground px-2 py-1.5 text-xs font-semibold tracking-wide uppercase">
                        {item.label}
                      </p>
                      {item.children.map((child) => (
                        <SheetClose asChild key={child.path}>
                          <Link
                            to={child.path}
                            className="hover:bg-muted flex items-center justify-between rounded-lg px-2 py-2 text-sm"
                          >
                            {child.label} <ChevronRight className="text-muted-foreground size-4" />
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  ) : (
                    <SheetClose asChild key={item.path}>
                      <Link
                        to={item.path}
                        className="hover:bg-muted flex items-center justify-between rounded-lg px-2 py-2.5 text-sm font-medium"
                      >
                        {item.label} <ChevronRight className="text-muted-foreground size-4" />
                      </Link>
                    </SheetClose>
                  ),
                )}
                <div className="border-border mt-3 border-t pt-3">
                  <SheetClose asChild>
                    <Button onClick={handleInstitutionSwitch} variant="outline" className="w-full justify-start">
                      Switch to {otherInstitutionId === "school" ? "School" : "College"} site
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
            <Button variant="outline" size="icon" className="xl:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
