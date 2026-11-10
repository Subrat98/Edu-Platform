import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { GraduationCap, LogOut, ExternalLink, Moon, Sun } from "lucide-react";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import type { Tab } from "@/components/layout/BottomTabBar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AvatarInitials } from "@/components/common/AvatarInitials";
import { NotificationsBell } from "./NotificationsBell";
import { WingSwitcher } from "./WingSwitcher";
import { InstallPrompt } from "@/features/pwa/InstallPrompt";
import { Button } from "@/components/ui/button";
import { getUnifiedInstitution } from "@/mocks/data/unifiedInstitutions";
import { useAuthStore } from "@/features/auth/authStore";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { useSyncInstitutionToUser } from "@/features/institutions/useSyncInstitutionToUser";
import { ROLE_LABELS } from "@/types";
import { LanguageDropdown } from "@/components/common/LanguageDropdown";
import { useTranslation } from "@/features/i18n/languageStore";
import { AdminBreadcrumbs } from "./AdminBreadcrumbs";
import type { AdminNavGroup } from "./adminNavConfig";

/**
 * Automatically closes the mobile drawer when the user navigates to a new page.
 */
function MobileDrawerAutoClose() {
  const { pathname } = useLocation();
  const { setOpenMobile, isMobile } = useSidebar();

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, isMobile, setOpenMobile]);

  return null;
}

export function AppSidebarShell({
  groups,
  brandLabel,
  mobileTabs,
}: {
  groups: AdminNavGroup[];
  brandLabel: string;
  mobileTabs?: Tab[];
}) {
  useSyncInstitutionToUser();
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const { institution, institutionId } = useInstitutionData();
  const { pathname } = useLocation();
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useTranslation();
  const unified = currentUser?.homeInstitutionId ? getUnifiedInstitution(currentUser.homeInstitutionId) : undefined;
  const brandName = unified?.name ?? institution?.name;
  const publicSiteHref = unified ? "/unified" : `/${institutionId}`;

  return (
    <SidebarProvider>
      <MobileDrawerAutoClose />
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <span className="bg-primary flex size-8 shrink-0 items-center justify-center rounded-lg text-white">
              <GraduationCap className="size-4" />
            </span>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="text-sidebar-foreground truncate text-sm font-semibold">{brandLabel}</p>
              <p className="text-muted-foreground truncate text-xs">{brandName}</p>
            </div>
          </div>
          {unified ? (
            <div className="mt-2 px-2">
              <WingSwitcher />
            </div>
          ) : null}
        </SidebarHeader>

        <SidebarContent>
          {groups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{t(group.label)}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const isActive = item.end ? pathname === item.path : pathname.startsWith(item.path);
                    return (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton asChild tooltip={t(item.label)} isActive={isActive}>
                          <Link to={item.path}>
                            <item.icon className="size-4 shrink-0" />
                            <span className="truncate">{t(item.label)}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter>
          <Separator className="mb-2" />
          <div className="flex items-center gap-2 px-2 py-1.5 group-data-[collapsible=icon]:justify-center">
            {currentUser ? <AvatarInitials name={currentUser.name} size="sm" /> : null}
            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <p className="text-sidebar-foreground truncate text-xs font-medium">{currentUser?.name}</p>
              <p className="text-muted-foreground truncate text-[11px]">
                {currentUser ? ROLE_LABELS[currentUser.role] : ""}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1 px-2 group-data-[collapsible=icon]:hidden">
            <Button asChild variant="ghost" size="sm" className="justify-start gap-2">
              <Link to={publicSiteHref}>
                <ExternalLink className="size-4 shrink-0" /> {t("viewPublicSite")}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="justify-start gap-2" onClick={logout} asChild>
              <Link to="/auth/login">
                <LogOut className="size-4 shrink-0" /> {t("logOut")}
              </Link>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="relative flex w-full min-w-0 max-w-full flex-1 flex-col overflow-x-hidden bg-background">
        <header className="flex h-14 shrink-0 items-center gap-2 sm:gap-3 border-b border-border bg-card px-2.5 sm:px-4">
          <SidebarTrigger className="shrink-0" />
          <Separator orientation="vertical" className="h-5 shrink-0 hidden sm:block" />

          {/* Dynamic Breadcrumbs with responsive truncate on mobile */}
          <AdminBreadcrumbs groups={groups} className="min-w-0 flex-1" />

          {/* Right utility items */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            <LanguageDropdown variant="default" />
            <NotificationsBell />
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              aria-label="Toggle dark mode"
              className="size-8"
            >
              {resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          </div>
        </header>

        <main className="flex-1 min-w-0 max-w-full overflow-y-auto overflow-x-hidden p-3 sm:p-5 md:p-6 pb-20 sm:pb-6">
          <Outlet />
        </main>
      </SidebarInset>

      {mobileTabs && mobileTabs.length > 0 && (
        <BottomTabBar tabs={mobileTabs} />
      )}
      <InstallPrompt />
    </SidebarProvider>
  );
}
