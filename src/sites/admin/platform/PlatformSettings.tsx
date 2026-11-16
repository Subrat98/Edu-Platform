import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  GraduationCap,
  Landmark,
  Layers,
  Lock,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  EyeOff,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { useAuthStore } from "@/features/auth/authStore";
import {
  useInstitutionStore,
  type WebsiteContentMode,
} from "@/features/institutions/institutionStore";
import { logActivity } from "@/mocks/data/activityLog";
import { cn } from "@/lib/utils";

export default function PlatformSettings() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const activeInstitutionId = useInstitutionStore((s) => s.activeInstitutionId);
  const visibility = useInstitutionStore((s) => s.visibility);
  const setVisibility = useInstitutionStore((s) => s.setVisibility);
  const setContentMode = useInstitutionStore((s) => s.setContentMode);

  const [saving, setSaving] = useState(false);

  // Platform Super Admin gatekeeper
  if (currentUser?.role !== "platform_admin") {
    return (
      <EmptyState
        icon={Lock}
        title="Platform Super Admin only"
        description="Configuring institution wing visibility and hiding school/college content from the public website requires Platform Super Admin privileges."
      />
    );
  }

  // Determine current active mode
  const currentMode: WebsiteContentMode =
    visibility.school && visibility.college
      ? "both"
      : visibility.college
      ? "college_only"
      : "school_only";

  const handleModeChange = (mode: WebsiteContentMode) => {
    setSaving(true);
    setContentMode(mode);

    const desc =
      mode === "both"
        ? "Both School and College content are live and visible on the website."
        : mode === "college_only"
        ? "All School content is hidden from the website. /school routes redirect to /college."
        : "All College content is hidden from the website. /college routes redirect to /school.";

    logActivity({
      institutionId: activeInstitutionId,
      category: "Settings",
      action: `Super Admin set website mode: ${mode}`,
      actor: currentUser?.name ?? "Super Admin",
      detail: desc,
    });

    toast.success("Website Configuration Updated", {
      description: desc,
    });

    setTimeout(() => setSaving(false), 300);
  };

  const handleToggleWing = (wing: "school" | "college", checked: boolean) => {
    if (!checked) {
      const otherWing = wing === "school" ? "college" : "school";
      if (!visibility[otherWing]) {
        toast.error("Cannot Hide Both Wings", {
          description: "At least one institution wing must remain visible on the public website.",
        });
        return;
      }
    }

    setSaving(true);
    setVisibility({ [wing]: checked });

    const newVisibility = { ...visibility, [wing]: checked };
    const wingLabel = wing === "school" ? "School" : "College";

    logActivity({
      institutionId: activeInstitutionId,
      category: "Settings",
      action: `Super Admin ${checked ? "enabled" : "hid"} ${wingLabel} content from website`,
      actor: currentUser?.name ?? "Super Admin",
      detail: `Visibility: School=${newVisibility.school ? "Visible" : "Hidden"}, College=${newVisibility.college ? "Visible" : "Hidden"}`,
    });

    toast.success(`${wingLabel} Content ${checked ? "Visible" : "Hidden"}`, {
      description: checked
        ? `${wingLabel} content is now published and accessible on the website.`
        : `All ${wingLabel} content has been hidden from the public website.`,
    });

    setTimeout(() => setSaving(false), 300);
  };

  const activePublicPath = visibility.college ? "/college" : "/school";

  return (
    <div className="space-y-6 pb-12">
      <AdminPageHeader
        title="Website Content & Wing Visibility"
        description="Super Admin configuration to hide or publish School and College content across the public website, routes, navigation menus, and login portals."
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
              <Link to={activePublicPath} target="_blank" rel="noreferrer">
                <ExternalLink className="size-3.5" />
                <span>Preview Live Website</span>
              </Link>
            </Button>
          </div>
        }
      />

      {/* Overview Banner */}
      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">Super Admin Content Status:</span>
              <Badge
                className={cn(
                  "font-bold text-xs uppercase",
                  currentMode === "both"
                    ? "bg-emerald-600 text-white"
                    : "bg-amber-600 text-white"
                )}
              >
                {currentMode === "both"
                  ? "Dual Campus (Both Wings Live)"
                  : currentMode === "college_only"
                  ? "College Only (School Content Hidden)"
                  : "School Only (College Content Hidden)"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Configured by Platform Super Admin. Changes take effect instantly for all visitors without server redeployment.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleModeChange("both")}
          disabled={currentMode === "both" || saving}
          className="text-xs shrink-0"
        >
          Reset to Dual Campus
        </Button>
      </div>

      {/* Quick Mode Preset Cards */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-primary" />
          <h2 className="text-base font-bold text-foreground">Quick Configuration Presets</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Option 1: Dual Campus */}
          <Card
            role="button"
            tabIndex={0}
            onClick={() => handleModeChange("both")}
            onKeyDown={(e) => e.key === "Enter" && handleModeChange("both")}
            className={cn(
              "cursor-pointer transition-all border-2 hover:shadow-md",
              currentMode === "both"
                ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20"
                : "border-border/70 hover:border-border"
            )}
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Sparkles className="size-5" />
                </div>
                {currentMode === "both" && (
                  <Badge className="bg-primary text-primary-foreground text-[10px] gap-1">
                    <CheckCircle2 className="size-3" />
                    <span>Active Mode</span>
                  </Badge>
                )}
              </div>
              <CardTitle className="text-base font-bold text-foreground mt-2">
                Dual Campus (Both Live)
              </CardTitle>
              <CardDescription className="text-xs">
                Show School and College wings together with the header switcher.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-1 text-xs text-muted-foreground space-y-2">
              <div className="flex items-center gap-1.5 text-foreground font-medium">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                <span>School (/school) + College (/college)</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Full dual-wing portal. Visitors can switch between institutions via the top navigation toggle.
              </p>
            </CardContent>
          </Card>

          {/* Option 2: College Only */}
          <Card
            role="button"
            tabIndex={0}
            onClick={() => handleModeChange("college_only")}
            onKeyDown={(e) => e.key === "Enter" && handleModeChange("college_only")}
            className={cn(
              "cursor-pointer transition-all border-2 hover:shadow-md",
              currentMode === "college_only"
                ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20"
                : "border-border/70 hover:border-border"
            )}
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <div className="size-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Landmark className="size-5" />
                </div>
                {currentMode === "college_only" && (
                  <Badge className="bg-primary text-primary-foreground text-[10px] gap-1">
                    <CheckCircle2 className="size-3" />
                    <span>Active Mode</span>
                  </Badge>
                )}
              </div>
              <CardTitle className="text-base font-bold text-foreground mt-2">
                College Only (Hide School)
              </CardTitle>
              <CardDescription className="text-xs">
                Hide all school pages, menus, switchers, and disclosures.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-1 text-xs text-muted-foreground space-y-2">
              <div className="flex items-center gap-1.5 text-foreground font-medium">
                <EyeOff className="size-3.5 text-rose-600" />
                <span>All School Content Completely Hidden</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Visiting /school or / redirects immediately to /college. The header wing toggle is hidden.
              </p>
            </CardContent>
          </Card>

          {/* Option 3: School Only */}
          <Card
            role="button"
            tabIndex={0}
            onClick={() => handleModeChange("school_only")}
            onKeyDown={(e) => e.key === "Enter" && handleModeChange("school_only")}
            className={cn(
              "cursor-pointer transition-all border-2 hover:shadow-md",
              currentMode === "school_only"
                ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20"
                : "border-border/70 hover:border-border"
            )}
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <div className="size-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <GraduationCap className="size-5" />
                </div>
                {currentMode === "school_only" && (
                  <Badge className="bg-primary text-primary-foreground text-[10px] gap-1">
                    <CheckCircle2 className="size-3" />
                    <span>Active Mode</span>
                  </Badge>
                )}
              </div>
              <CardTitle className="text-base font-bold text-foreground mt-2">
                School Only (Hide College)
              </CardTitle>
              <CardDescription className="text-xs">
                Hide all college pages, NAAC/IQAC, programmes, and admissions.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-1 text-xs text-muted-foreground space-y-2">
              <div className="flex items-center gap-1.5 text-foreground font-medium">
                <EyeOff className="size-3.5 text-rose-600" />
                <span>All College Content Completely Hidden</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Visiting /college or / redirects immediately to /school. The header wing toggle is hidden.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Granular Wing Control Switches */}
      <Card className="border border-border/70 shadow-xs">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
            <Layers className="size-5 text-primary" />
            <span>Granular Institution Wing Controls</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Toggle public availability for each institution wing individually. At least one wing must remain visible.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-border/60">
          {/* School Wing Row */}
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <GraduationCap className="size-4" />
                </span>
                <span className="font-bold text-sm text-foreground">
                  School Wing & Public Content (/school)
                </span>
                <Badge
                  variant={visibility.school ? "default" : "secondary"}
                  className="text-[10px]"
                >
                  {visibility.school ? "Published & Live" : "Hidden from Website"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground max-w-xl">
                Includes CBSE Mandatory Disclosure, RTE 25% admissions, academic calendar, facilities, student life, PM-POSHAN meals, and school administration.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-muted-foreground">
                <span className="font-mono">Route Prefix: /school/*</span>
                <span>·</span>
                <span>Status: {visibility.school ? "Accessible" : "Redirects to /college"}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
              <span className="text-xs font-semibold text-muted-foreground">
                {visibility.school ? "Visible" : "Hidden"}
              </span>
              <Switch
                checked={visibility.school}
                onCheckedChange={(checked) => handleToggleWing("school", checked)}
                aria-label="Toggle School Content Visibility"
              />
            </div>
          </div>

          {/* College Wing Row */}
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600">
                  <Landmark className="size-4" />
                </span>
                <span className="font-bold text-sm text-foreground">
                  College Wing & Public Content (/college)
                </span>
                <Badge
                  variant={visibility.college ? "default" : "secondary"}
                  className="text-[10px]"
                >
                  {visibility.college ? "Published & Live" : "Hidden from Website"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground max-w-xl">
                Includes NAAC A+ accreditation, IQAC cell, UG/PG programmes, departments, examination cell, tenders, recruitments, and virtual tour.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-muted-foreground">
                <span className="font-mono">Route Prefix: /college/*</span>
                <span>·</span>
                <span>Status: {visibility.college ? "Accessible" : "Redirects to /school"}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
              <span className="text-xs font-semibold text-muted-foreground">
                {visibility.college ? "Visible" : "Hidden"}
              </span>
              <Switch
                checked={visibility.college}
                onCheckedChange={(checked) => handleToggleWing("college", checked)}
                aria-label="Toggle College Content Visibility"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enforcement & Protection Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border border-border/70">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-600" />
              <span>Route Guard & Navigation Protection</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 space-y-2 text-xs text-muted-foreground">
            <p>
              When a wing is hidden by Super Admin:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-[11px]">
              <li><strong>Direct URLs:</strong> Attempting to load any hidden page directly (e.g. bookmarks, search results) is intercepted by <code className="text-primary font-mono">InstitutionRouteGuard</code> and automatically redirected.</li>
              <li><strong>Root URL (/):</strong> The website root automatically redirects to the active visible wing.</li>
              <li><strong>Navigation Switcher:</strong> The header wing toggle is automatically hidden when only one wing is active, preventing accidental cross-portal navigation.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border border-border/70">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-600" />
              <span>Super Admin Safeguards</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 space-y-2 text-xs text-muted-foreground">
            <p>
              Built-in platform guardrails:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-[11px]">
              <li><strong>Zero Downtime:</strong> At least one institution wing is enforced active at all times so your website always has a live public landing page.</li>
              <li><strong>Admin Command Center:</strong> Super Admins retain full access to manage all CMS, ERP, and NAAC data regardless of public visibility.</li>
              <li><strong>Audit Trail:</strong> All visibility switches are permanently recorded in the Super Admin Activity Log with timestamps and actor signatures.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
