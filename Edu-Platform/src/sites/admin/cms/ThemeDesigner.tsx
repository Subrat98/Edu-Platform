import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  RotateCcw,
  Save,
  Palette,
  Sparkles,
  Layers,
  Type,
  MousePointerClick,
  Square,
  Check,
  ExternalLink,
  Globe,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { cmsService } from "@/features/cms/cmsService";
import { queryKeys } from "@/lib/queryKeys";
import {
  saveCustomTheme,
  resetCustomTheme,
  getCustomTheme,
  type ThemeTargetScope,
} from "@/theme/themePersistence";
import type { ColorTokens } from "@/types";

interface ColorItemConfig {
  key: keyof ColorTokens;
  label: string;
  description: string;
  defaultValue: string;
}

const BRAND_RED_SECTION: ColorItemConfig[] = [
  {
    key: "primary",
    label: "Primary Brand Color (Currently Red)",
    description: "Replaces red across the entire website: headers, active tabs, brand badges, banners, and primary highlights.",
    defaultValue: "#C21717",
  },
  {
    key: "accent",
    label: "Accent & Secondary Brand Color",
    description: "Hover states, active menu pills, focus rings, and secondary accents.",
    defaultValue: "#991b1b",
  },
];

const BUTTONS_SECTION: ColorItemConfig[] = [
  {
    key: "buttonBackground",
    label: "Primary Buttons Background",
    description: "Background color of all primary action buttons throughout the entire website and admin panel.",
    defaultValue: "#C21717",
  },
  {
    key: "buttonForeground",
    label: "Primary Buttons Text Color",
    description: "Text and icon color inside all primary action buttons (usually white or contrasting).",
    defaultValue: "#FFFFFF",
  },
  {
    key: "highlight",
    label: "Key Call-to-Action (CTA) Button",
    description: "Background for high-priority action buttons (e.g., 'Apply Now', 'Admissions').",
    defaultValue: "#e0a100",
  },
];

const WHITE_SURFACES_SECTION: ColorItemConfig[] = [
  {
    key: "background",
    label: "Page Background (Currently White)",
    description: "The main page canvas background across public and administrative pages.",
    defaultValue: "#FFFFFF",
  },
  {
    key: "surface",
    label: "Cards & Container Surfaces (Currently White)",
    description: "Background of content cards, tables, panels, and modal dialogs.",
    defaultValue: "#FFFFFF",
  },
  {
    key: "border",
    label: "Border & Divider Outlines",
    description: "Borders around cards, tables, input fields, and section divider lines.",
    defaultValue: "#e2e8f0",
  },
];

const TEXT_SECTION: ColorItemConfig[] = [
  {
    key: "textPrimary",
    label: "Main Text & Heading Color",
    description: "Page titles, section headings, card titles, and primary body typography.",
    defaultValue: "#1e293b",
  },
  {
    key: "textSecondary",
    label: "Secondary & Subtitle Text Color",
    description: "Subtitles, meta labels, timestamps, and descriptive helper text.",
    defaultValue: "#64748b",
  },
];

interface QuickThemePreset {
  id: string;
  name: string;
  description: string;
  primary: string;
  bg: string;
  text: string;
  btnBg: string;
  btnFg: string;
}

const THEME_PRESETS: QuickThemePreset[] = [
  {
    id: "classic-red",
    name: "Classic Crimson (Default)",
    description: "Signature institutional crimson red with crisp white surfaces.",
    primary: "#C21717",
    bg: "#FFFFFF",
    text: "#1e293b",
    btnBg: "#C21717",
    btnFg: "#FFFFFF",
  },
  {
    id: "emerald-green",
    name: "Emerald Green",
    description: "Lush botanical green with clean modern contrast.",
    primary: "#15803d",
    bg: "#FFFFFF",
    text: "#0f172a",
    btnBg: "#15803d",
    btnFg: "#FFFFFF",
  },
  {
    id: "royal-blue",
    name: "Royal Navy Blue",
    description: "Prestigious academic navy blue for university portals.",
    primary: "#1d4ed8",
    bg: "#FFFFFF",
    text: "#0f172a",
    btnBg: "#1d4ed8",
    btnFg: "#FFFFFF",
  },
  {
    id: "deep-purple",
    name: "Imperial Purple",
    description: "Sophisticated royal violet with warm gold accents.",
    primary: "#7e22ce",
    bg: "#FFFFFF",
    text: "#1e1b4b",
    btnBg: "#7e22ce",
    btnFg: "#FFFFFF",
  },
  {
    id: "warm-amber",
    name: "Amber & Ochre",
    description: "Heritage warm amber-terracotta palette.",
    primary: "#b45309",
    bg: "#FFFFFF",
    text: "#292524",
    btnBg: "#b45309",
    btnFg: "#FFFFFF",
  },
];

function formatHexColor(val?: string, fallback: string = "#000000"): string {
  if (!val) return fallback;
  const trimmed = val.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed;
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    return `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`;
  }
  return fallback;
}

export default function ThemeDesigner() {
  const { institutionId } = useInstitutionData();
  const queryClient = useQueryClient();

  // Scope: defaults to global so College, School, and Admin all update together!
  const [themeScope, setThemeScope] = useState<ThemeTargetScope>("global");

  const effectiveId = themeScope === "school" ? "school" : "college";
  const { data: theme, isLoading } = useQuery({
    queryKey: ["cmsTheme", effectiveId],
    queryFn: () => cmsService.getTheme(effectiveId),
  });

  const [colors, setColors] = useState<ColorTokens | null>(null);
  const [radiusPx, setRadiusPx] = useState(12);

  // Initialize state from theme
  useEffect(() => {
    if (theme) {
      const mergedColors: ColorTokens = {
        ...theme.colors,
        buttonBackground: theme.colors.buttonBackground || theme.colors.primary,
        buttonForeground: theme.colors.buttonForeground || theme.colors.primaryForeground || "#FFFFFF",
      };
      setColors(mergedColors);
      setRadiusPx(Math.round(parseFloat(theme.radius) * 16));
    }
  }, [theme]);

  // Live Apply function: instantly applies and persists changes to both College and School
  const liveApply = useCallback(
    (newColors: ColorTokens, newRadiusPx: number) => {
      const radius = `${(newRadiusPx / 16).toFixed(3)}rem`;
      saveCustomTheme(themeScope, newColors, radius);
    },
    [themeScope]
  );

  const handleColorChange = (key: keyof ColorTokens, value: string) => {
    setColors((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [key]: value };
      if (key === "primary" && (!prev.buttonBackground || prev.buttonBackground === prev.primary)) {
        updated.buttonBackground = value;
      }
      return updated;
    });

    if (colors) {
      const updated = { ...colors, [key]: value };
      if (key === "primary" && (!colors.buttonBackground || colors.buttonBackground === colors.primary)) {
        updated.buttonBackground = value;
      }
      try {
        liveApply(updated, radiusPx);
      } catch (err) {
        console.error("Failed to apply theme color:", err);
      }
    }
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadiusPx(newRadius);
    if (colors) {
      try {
        liveApply(colors, newRadius);
      } catch (err) {
        console.error("Failed to apply radius:", err);
      }
    }
  };

  const applyPreset = (preset: QuickThemePreset) => {
    if (!colors) return;
    const updated: ColorTokens = {
      ...colors,
      primary: preset.primary,
      accent: preset.primary,
      background: preset.bg,
      surface: preset.bg,
      textPrimary: preset.text,
      buttonBackground: preset.btnBg,
      buttonForeground: preset.btnFg,
    };
    setColors(updated);
    liveApply(updated, radiusPx);
    toast.success(`Preset "${preset.name}" applied live to ${themeScope === "global" ? "Entire Website" : themeScope}!`, {
      description: "Click 'Save Theme to Entire Site' to ensure it stays permanent across all sessions.",
    });
  };

  const saveMutation = useMutation({
    mutationFn: () =>
      cmsService.updateTheme(
        institutionId,
        colors ?? {},
        `${(radiusPx / 16).toFixed(3)}rem`,
        themeScope
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.institution("college") });
      queryClient.invalidateQueries({ queryKey: queryKeys.institution("school") });
      queryClient.invalidateQueries({ queryKey: ["cmsTheme", "college"] });
      queryClient.invalidateQueries({ queryKey: ["cmsTheme", "school"] });
      toast.success("Theme permanently saved!", {
        description: `Colors are saved and active across ${themeScope === "global" ? "the whole website (College & School)" : themeScope}.`,
      });
    },
  });

  const resetDefaults = () => {
    resetCustomTheme(themeScope);
    const restored = getCustomTheme(effectiveId);
    setColors(restored.colors);
    setRadiusPx(Math.round(parseFloat(restored.radius) * 16));
    toast.info("Reverted to factory default theme");
  };

  if (isLoading || !colors) return <PageLoadingSkeleton />;

  return (
    <div className="space-y-6 pb-16">
      <AdminPageHeader
        title="Website Theme & Color Designer"
        description="Comprehensive website color controller. Change the primary red branding, white page surfaces, typography colors, or buttons — changes apply immediately across the entire website."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
              <Link to="/college">
                <ExternalLink className="size-3.5" />
                <span>Open College Home Screen</span>
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs" onClick={resetDefaults}>
              <RotateCcw className="size-3.5" />
              <span>Reset Defaults</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 text-xs shadow-xs"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
            >
              <Save className="size-3.5" />
              <span>{saveMutation.isPending ? "Saving..." : "Save Theme to Entire Site"}</span>
            </Button>
          </div>
        }
      />

      {/* Scope Selector Bar */}
      <Card className="border border-primary/20 bg-primary/5 shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Globe className="size-4 text-primary" />
              <span className="text-xs font-bold text-foreground">Target Campus Wing:</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Choose whether changes affect both wings together or just one specific campus.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-background p-1 rounded-xl border border-border/80">
            <button
              type="button"
              onClick={() => setThemeScope("global")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                themeScope === "global"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Entire Website (College &amp; School)
            </button>
            <button
              type="button"
              onClick={() => setThemeScope("college")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                themeScope === "college"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Our College Only
            </button>
            <button
              type="button"
              onClick={() => setThemeScope("school")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                themeScope === "school"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Our School Only
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Preset Theme Quick Bar */}
      <Card className="border border-border/70 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Palette className="size-4 text-primary" />
            <CardTitle className="text-sm font-bold">1-Click Full Theme Palettes</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Quickly switch the entire site's color scheme with pre-balanced aesthetic combinations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {THEME_PRESETS.map((p) => {
              const isActive = colors.primary.toLowerCase() === p.primary.toLowerCase();
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    isActive
                      ? "border-primary bg-primary/5 shadow-xs ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span
                      className="size-4 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: p.primary }}
                    />
                    <span
                      className="size-4 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: p.btnBg }}
                    />
                    <span
                      className="size-4 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: p.bg }}
                    />
                    {isActive && (
                      <Check className="size-3.5 text-primary ml-auto" />
                    )}
                  </div>
                  <p className="text-xs font-bold text-foreground truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{p.description}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Grid: Controls vs Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Color Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Red Branding (Primary) */}
          <Card className="border border-border/70 shadow-xs">
            <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <CardTitle className="text-sm font-bold">1. Primary Brand Accent (Where Red is now)</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Changes any element where the red color is currently used (e.g., change red to green, blue, purple, etc.).
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {BRAND_RED_SECTION.map((item) => (
                <div key={item.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-muted/20 border border-border/40">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-foreground">{item.label}</Label>
                    <p className="text-[11px] text-muted-foreground max-w-sm">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="color"
                      value={formatHexColor(colors[item.key], item.defaultValue)}
                      onChange={(e) => handleColorChange(item.key, e.target.value)}
                      className="size-8 cursor-pointer rounded-lg border border-border p-0.5"
                    />
                    <Input
                      type="text"
                      value={colors[item.key] || item.defaultValue}
                      onChange={(e) => handleColorChange(item.key, e.target.value)}
                      className="w-24 h-8 text-xs font-mono uppercase"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Section 2: All Button Colors */}
          <Card className="border border-border/70 shadow-xs">
            <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-2">
                <MousePointerClick className="size-4 text-primary" />
                <CardTitle className="text-sm font-bold">2. All Button Colors</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Customizes primary action buttons, key call-to-action buttons, and button text color.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {BUTTONS_SECTION.map((item) => (
                <div key={item.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-muted/20 border border-border/40">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-foreground">{item.label}</Label>
                    <p className="text-[11px] text-muted-foreground max-w-sm">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="color"
                      value={formatHexColor(colors[item.key], item.defaultValue)}
                      onChange={(e) => handleColorChange(item.key, e.target.value)}
                      className="size-8 cursor-pointer rounded-lg border border-border p-0.5"
                    />
                    <Input
                      type="text"
                      value={colors[item.key] || item.defaultValue}
                      onChange={(e) => handleColorChange(item.key, e.target.value)}
                      className="w-24 h-8 text-xs font-mono uppercase"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Section 3: White Background & Surfaces */}
          <Card className="border border-border/70 shadow-xs">
            <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-primary" />
                <CardTitle className="text-sm font-bold">3. Website Background & Surfaces (Where White is now)</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Controls the main page background, card surfaces, and border outlines.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {WHITE_SURFACES_SECTION.map((item) => (
                <div key={item.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-muted/20 border border-border/40">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-foreground">{item.label}</Label>
                    <p className="text-[11px] text-muted-foreground max-w-sm">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="color"
                      value={formatHexColor(colors[item.key], item.defaultValue)}
                      onChange={(e) => handleColorChange(item.key, e.target.value)}
                      className="size-8 cursor-pointer rounded-lg border border-border p-0.5"
                    />
                    <Input
                      type="text"
                      value={colors[item.key] || item.defaultValue}
                      onChange={(e) => handleColorChange(item.key, e.target.value)}
                      className="w-24 h-8 text-xs font-mono uppercase"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Section 4: Text & Typography Colors */}
          <Card className="border border-border/70 shadow-xs">
            <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-2">
                <Type className="size-4 text-primary" />
                <CardTitle className="text-sm font-bold">4. Main Text & Heading Colors</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Controls text typography colors for headings, paragraphs, and subtitles.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {TEXT_SECTION.map((item) => (
                <div key={item.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-muted/20 border border-border/40">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-foreground">{item.label}</Label>
                    <p className="text-[11px] text-muted-foreground max-w-sm">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="color"
                      value={formatHexColor(colors[item.key], item.defaultValue)}
                      onChange={(e) => handleColorChange(item.key, e.target.value)}
                      className="size-8 cursor-pointer rounded-lg border border-border p-0.5"
                    />
                    <Input
                      type="text"
                      value={colors[item.key] || item.defaultValue}
                      onChange={(e) => handleColorChange(item.key, e.target.value)}
                      className="w-24 h-8 text-xs font-mono uppercase"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Section 5: Corner Radius */}
          <Card className="border border-border/70 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Square className="size-4 text-primary" />
                  <CardTitle className="text-sm font-bold">5. Corner Radius & Shape</CardTitle>
                </div>
                <Badge variant="outline" className="font-mono text-xs">{radiusPx}px</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Slider
                value={[radiusPx]}
                onValueChange={([v]) => handleRadiusChange(v ?? radiusPx)}
                min={0}
                max={24}
                step={2}
                className="my-2"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground pt-1">
                <span>Sharp (0px)</span>
                <span>Soft (12px)</span>
                <span>Rounded (24px)</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Sticky Live Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Live Real-Time Website Preview
            </p>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 text-[10px] font-bold">
              Hot Applied Live
            </Badge>
          </div>

          {/* Realistic Website Mockup Card */}
          <div
            className="rounded-2xl border p-5 shadow-lg transition-all space-y-4"
            style={{
              backgroundColor: colors.background || "#FFFFFF",
              borderColor: colors.border || "#e2e8f0",
              borderRadius: `${radiusPx}px`,
            }}
          >
            {/* Mock Header Navigation */}
            <div
              className="flex items-center justify-between p-3 rounded-xl border"
              style={{
                backgroundColor: colors.surface || "#FFFFFF",
                borderColor: colors.border || "#e2e8f0",
                borderRadius: `${Math.max(4, radiusPx - 4)}px`,
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="size-7 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-xs"
                  style={{ backgroundColor: colors.primary }}
                >
                  OC
                </div>
                <span className="font-bold text-xs" style={{ color: colors.textPrimary || "#1e293b" }}>
                  Our College
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}
                >
                  NAAC A+
                </span>
                <button
                  type="button"
                  className="px-2.5 py-1 text-[11px] font-bold shadow-xs transition-opacity"
                  style={{
                    backgroundColor: colors.buttonBackground || colors.primary,
                    color: colors.buttonForeground || "#FFFFFF",
                    borderRadius: `${Math.max(4, radiusPx - 4)}px`,
                  }}
                >
                  Sign In
                </button>
              </div>
            </div>

            {/* Mock Hero Banner */}
            <div
              className="p-5 rounded-xl border relative overflow-hidden"
              style={{
                backgroundColor: `${colors.primary}10`,
                borderColor: `${colors.primary}30`,
                borderRadius: `${Math.max(4, radiusPx - 2)}px`,
              }}
            >
              <div
                className="inline-block text-[10px] font-bold uppercase tracking-wider mb-2 px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
              >
                Premier Autonomous Institution
              </div>
              <h3
                className="text-lg font-extrabold leading-snug font-heading"
                style={{ color: colors.textPrimary || "#1e293b" }}
              >
                Sculpting Heart, Head &amp; Hand
              </h3>
              <p
                className="text-xs leading-relaxed mt-1.5"
                style={{ color: colors.textSecondary || "#64748b" }}
              >
                Autonomous degree college of Odisha, NAAC Accredited A+ with state-of-the-art research laboratories.
              </p>

              {/* Action Buttons inside Hero */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <button
                  type="button"
                  className="px-3.5 py-1.5 text-xs font-bold shadow-sm transition-transform active:scale-95"
                  style={{
                    backgroundColor: colors.buttonBackground || colors.primary,
                    color: colors.buttonForeground || "#FFFFFF",
                    borderRadius: `${radiusPx}px`,
                  }}
                >
                  Explore Admissions
                </button>
                <button
                  type="button"
                  className="px-3.5 py-1.5 text-xs font-bold transition-transform active:scale-95"
                  style={{
                    backgroundColor: colors.highlight || "#e0a100",
                    color: colors.highlightForeground || "#1f1300",
                    borderRadius: `${radiusPx}px`,
                  }}
                >
                  Apply Now
                </button>
                <span
                  className="text-xs font-medium cursor-pointer underline-offset-2 hover:underline ml-1"
                  style={{ color: colors.accent || colors.primary }}
                >
                  View Prospectus →
                </span>
              </div>
            </div>

            {/* Mock Content Card on Surface */}
            <div
              className="p-4 rounded-xl border space-y-3"
              style={{
                backgroundColor: colors.surface || "#FFFFFF",
                borderColor: colors.border || "#e2e8f0",
                borderRadius: `${Math.max(4, radiusPx - 2)}px`,
              }}
            >
              <div className="flex items-center justify-between">
                <h4
                  className="text-xs font-bold font-heading"
                  style={{ color: colors.textPrimary || "#1e293b" }}
                >
                  Quality Assurance (IQAC &amp; NAAC)
                </h4>
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: colors.textSecondary || "#64748b" }}
              >
                This card demonstrates how content surfaces appear against the page canvas with your selected border and typography colors.
              </p>
              <div className="flex items-center justify-between pt-1 text-[11px] border-t" style={{ borderColor: colors.border || "#e2e8f0" }}>
                <span style={{ color: colors.textSecondary || "#64748b" }}>Status: Approved</span>
                <span className="font-bold cursor-pointer" style={{ color: colors.primary }}>
                  View Criterion 1–7 Evidence →
                </span>
              </div>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground space-y-1">
            <p className="font-bold text-foreground">💡 Real-Time Sync Across All Tabs</p>
            <p>
              Changes are saved to browser local storage and immediately injected into the website's CSS variables.
              Click <strong>"Open College Home Screen"</strong> above to see the changes live on the public college portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
