import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RotateCcw, Save } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { cmsService } from "@/features/cms/cmsService";
import { queryKeys } from "@/lib/queryKeys";
import type { ColorTokens } from "@/types";

const SWATCHES: { key: keyof ColorTokens; label: string; help: string }[] = [
  { key: "primary", label: "Primary", help: "Header, headings, primary buttons" },
  { key: "accent", label: "Accent", help: "Links, highlights, active states" },
  { key: "highlight", label: "Highlight", help: "Apply Now and other key CTAs" },
];

export default function ThemeDesigner() {
  const { institutionId } = useInstitutionData();
  const queryClient = useQueryClient();
  const { data: theme, isLoading } = useQuery({ queryKey: ["cmsTheme", institutionId], queryFn: () => cmsService.getTheme(institutionId) });

  const [colors, setColors] = useState<ColorTokens | null>(null);
  const [radiusPx, setRadiusPx] = useState(12);

  useEffect(() => {
    if (theme) {
      setColors(theme.colors);
      setRadiusPx(Math.round(parseFloat(theme.radius) * 16));
    }
  }, [theme]);

  const saveMutation = useMutation({
    mutationFn: () => cmsService.updateTheme(institutionId, colors ?? {}, `${(radiusPx / 16).toFixed(3)}rem`),
    onSuccess: () => {
      // Every page reads institution data (including its theme) through
      // this one query key via useInstitutionData(); if we only
      // invalidated our own local "cmsTheme" key, that stale cached
      // snapshot would keep getting re-applied by ThemeProvider the next
      // time any component re-subscribed to it, silently reverting the
      // live edit.
      queryClient.invalidateQueries({ queryKey: queryKeys.institution(institutionId) });
      queryClient.invalidateQueries({ queryKey: ["cmsTheme", institutionId] });
      toast.success("Theme updated", { description: "Changes are live on the public site immediately." });
    },
  });

  function resetDefaults() {
    if (!theme) return;
    setColors(theme.colors);
    setRadiusPx(Math.round(parseFloat(theme.radius) * 16));
    toast.info("Reverted to last saved theme");
  }

  if (isLoading || !colors) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader
        title="Theme Designer"
        description="Customize brand colours and shape for the public website. Changes apply live."
        actions={
          <>
            <Button variant="outline" className="gap-1.5" onClick={resetDefaults}>
              <RotateCcw className="size-4" /> Reset
            </Button>
            <Button className="gap-1.5" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              <Save className="size-4" /> {saveMutation.isPending ? "Saving…" : "Save theme"}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Brand colours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {SWATCHES.map((s) => (
                <div key={s.key} className="flex items-center justify-between gap-4">
                  <div>
                    <Label>{s.label}</Label>
                    <p className="text-muted-foreground text-xs">{s.help}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={colors[s.key]}
                      onChange={(e) => setColors((c) => (c ? { ...c, [s.key]: e.target.value } : c))}
                      className="border-border size-9 cursor-pointer rounded-md border p-0.5"
                      aria-label={`${s.label} colour`}
                    />
                    <span className="text-muted-foreground font-mono text-xs uppercase">{colors[s.key]}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Shape</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label>Corner radius</Label>
                <span className="text-muted-foreground text-xs">{radiusPx}px</span>
              </div>
              <Slider value={[radiusPx]} onValueChange={([v]) => setRadiusPx(v ?? radiusPx)} min={0} max={24} step={2} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Typography</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-1 text-sm">
              <p>
                Headings: <span className="font-heading text-foreground">Poppins</span>
              </p>
              <p>
                Body: <span className="font-body text-foreground">Inter</span>
              </p>
              <p className="text-xs">Font pairing is fixed for brand consistency across the platform.</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">Live preview</p>
          <div
            className="border-border space-y-4 rounded-xl border p-6"
            style={{
              // Scoped preview using the DRAFT colours, independent of the
              // page-wide theme until "Save theme" is clicked.
              ["--preview-primary" as string]: colors.primary,
              ["--preview-accent" as string]: colors.accent,
              ["--preview-highlight" as string]: colors.highlight,
              ["--preview-radius" as string]: `${radiusPx}px`,
            }}
          >
            <div
              className="p-5 text-white"
              style={{ backgroundColor: "var(--preview-primary)", borderRadius: "var(--preview-radius)" }}
            >
              <p className="font-heading text-lg font-bold">Sample headline</p>
              <p className="mt-1 text-sm text-white/85">This is how your hero banner text will look.</p>
              <button
                type="button"
                className="mt-3 px-4 py-2 text-sm font-medium"
                style={{ backgroundColor: "var(--preview-highlight)", color: "#1f1300", borderRadius: "var(--preview-radius)" }}
              >
                Apply Now
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span style={{ color: "var(--preview-accent)" }} className="font-medium">
                Sample link
              </span>
              <span className="text-muted-foreground">— accent colour for links &amp; active states</span>
            </div>
            <div
              className="border-border border p-4"
              style={{ borderRadius: "var(--preview-radius)", borderColor: "var(--preview-accent)" }}
            >
              <p className="text-sm">A card with the selected corner radius.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
