import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, ChevronLeft, ChevronRight, GraduationCap, Landmark, Lock, Sparkles } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/features/auth/authStore";
import { EmptyState } from "@/components/common/EmptyState";
import {
  institutionWizardService,
  ALL_TEMPLATE_PRESETS,
  MODULE_OPTIONS,
  type WizardInput,
} from "@/features/platform/institutionWizardService";
import { cn } from "@/lib/utils";

const STEPS = ["Mode", "Brand", "Template", "Modules", "Academic Structure", "Roles", "Review & Go-Live"];

const DEFAULT_INPUT: WizardInput = {
  name: "",
  shortName: "",
  tagline: "",
  description: "",
  presetId: ALL_TEMPLATE_PRESETS[0]!.id,
  modulesEnabled: MODULE_OPTIONS.map((m) => m.id),
  adminName: "",
  adminTitle: "",
};

export default function SetupWizard() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<WizardInput>(DEFAULT_INPUT);

  const createMutation = useMutation({
    mutationFn: () => institutionWizardService.createUnifiedInstitution(form, currentUser?.name ?? "Platform Admin"),
    onSuccess: (res) => {
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(`${res.institution.name} is live`, { description: `Signed in as ${res.user.name}` });
      setUser(res.user);
      navigate("/admin");
    },
  });

  if (currentUser?.role !== "platform_admin") {
    return <EmptyState icon={Lock} title="Platform Super Admin only" description="Creating a new institution is a platform-level action." />;
  }

  const brandValid = form.name.trim().length > 0;
  const rolesValid = form.adminName.trim().length > 0;
  const nextDisabled = (step === 1 && !brandValid) || (step === 5 && !rolesValid);

  return (
    <div>
      <AdminPageHeader title="Setup Wizard" description="Create a new Both-mode institution — a shared campus brand running a School wing and a College wing together." />

      <div className="mb-6 flex flex-wrap gap-2">
        {STEPS.map((label, i) => (
          <Badge
            key={label}
            variant={i === step ? "default" : "outline"}
            className={cn("gap-1.5", i < step && "border-success/30 text-success")}
          >
            {i < step ? <Check className="size-3" /> : null}
            {i + 1}. {label}
          </Badge>
        ))}
      </div>

      <Card className="max-w-2xl">
        <CardContent className="space-y-4 pt-6">
          {step === 0 && (
            <div>
              <p className="mb-3 text-sm font-medium">Choose institution mode</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="border-border rounded-lg border p-4 opacity-50">
                  <GraduationCap className="text-muted-foreground mb-2 size-5" />
                  <p className="text-sm font-medium">School</p>
                  <p className="text-muted-foreground mt-1 text-xs">Already provisioned as Our School.</p>
                </div>
                <div className="border-border rounded-lg border p-4 opacity-50">
                  <Landmark className="text-muted-foreground mb-2 size-5" />
                  <p className="text-sm font-medium">College</p>
                  <p className="text-muted-foreground mt-1 text-xs">Already provisioned as Our College.</p>
                </div>
                <div className="border-accent bg-accent/5 rounded-lg border-2 p-4">
                  <Sparkles className="text-accent mb-2 size-5" />
                  <p className="text-sm font-medium">Both</p>
                  <p className="text-muted-foreground mt-1 text-xs">One institution, a School wing and a College wing, sharing one brand.</p>
                </div>
              </div>
              <p className="text-muted-foreground mt-3 text-xs">
                This demo already has one School and one College dataset, so Setup Wizard only provisions new Both-mode institutions —
                each gets its own brand, admin persona and combined dashboard, sharing the existing School/College academic data as its two wings.
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <div>
                <Label>Institution name</Label>
                <Input className="mt-1.5" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Nilakantha Vidyapitha" />
              </div>
              <div>
                <Label>Short name</Label>
                <Input className="mt-1.5" value={form.shortName} onChange={(e) => setForm((f) => ({ ...f, shortName: e.target.value }))} placeholder="e.g. NVP" />
              </div>
              <div>
                <Label>Tagline</Label>
                <Input className="mt-1.5" value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} placeholder="e.g. Learning without limits" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea className="mt-1.5" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="mb-3 text-sm font-medium">Choose a starting template</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {ALL_TEMPLATE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, presetId: preset.id }))}
                    className={cn(
                      "rounded-lg border p-3 text-left transition-colors",
                      form.presetId === preset.id ? "border-accent bg-accent/5" : "border-border hover:border-accent/50",
                    )}
                  >
                    <div className="mb-2 flex gap-1.5">
                      {[preset.theme.colors.primary, preset.theme.colors.accent, preset.theme.colors.highlight].map((c, i) => (
                        <span key={i} className="size-4 rounded-full border border-white/40" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <p className="text-sm font-medium">{preset.label}</p>
                    <p className="text-muted-foreground mt-0.5 text-xs">{preset.description}</p>
                  </button>
                ))}
              </div>
              <p className="text-muted-foreground mt-3 text-xs">Can be changed later from Theme Designer.</p>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="mb-3 text-sm font-medium">Enable modules</p>
              <div className="flex flex-wrap gap-2">
                {MODULE_OPTIONS.map((m) => {
                  const enabled = form.modulesEnabled.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          modulesEnabled: enabled ? f.modulesEnabled.filter((x) => x !== m.id) : [...f.modulesEnabled, m.id],
                        }))
                      }
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                        enabled ? "border-success/40 bg-success/10 text-success" : "border-border text-muted-foreground hover:bg-muted",
                      )}
                    >
                      {enabled ? <Check className="mr-1 inline size-3" /> : null}
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3 text-sm">
              <p className="font-medium">Academic structure</p>
              <p className="text-muted-foreground">
                Both-mode institutions in this demo reuse the existing academic structures rather than generating a new dataset:
              </p>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                <li>School wing — Nursery through Classes XI–XII (Science, Commerce, Arts streams), same as Our School.</li>
                <li>College wing — all 12 UG/PG/Diploma programmes, same as Our College.</li>
              </ul>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Create the first admin persona</p>
              <div>
                <Label>Admin name</Label>
                <Input className="mt-1.5" value={form.adminName} onChange={(e) => setForm((f) => ({ ...f, adminName: e.target.value }))} placeholder="e.g. Mitali Senapati" />
              </div>
              <div>
                <Label>Title</Label>
                <Input className="mt-1.5" value={form.adminTitle} onChange={(e) => setForm((f) => ({ ...f, adminTitle: e.target.value }))} placeholder="e.g. Campus Director" />
              </div>
              <p className="text-muted-foreground text-xs">This persona will appear on the login screen and land directly on the new institution's admin dashboard.</p>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-2 text-sm">
              <p className="font-medium">Review</p>
              <dl className="divide-border divide-y">
                <div className="flex justify-between py-1.5"><dt className="text-muted-foreground">Name</dt><dd>{form.name || "—"}</dd></div>
                <div className="flex justify-between py-1.5"><dt className="text-muted-foreground">Short name</dt><dd>{form.shortName || "—"}</dd></div>
                <div className="flex justify-between py-1.5"><dt className="text-muted-foreground">Tagline</dt><dd>{form.tagline || "—"}</dd></div>
                <div className="flex justify-between py-1.5"><dt className="text-muted-foreground">Template</dt><dd>{ALL_TEMPLATE_PRESETS.find((p) => p.id === form.presetId)?.label}</dd></div>
                <div className="flex justify-between py-1.5"><dt className="text-muted-foreground">Modules</dt><dd>{form.modulesEnabled.length} enabled</dd></div>
                <div className="flex justify-between py-1.5"><dt className="text-muted-foreground">Admin persona</dt><dd>{form.adminName || "—"}</dd></div>
              </dl>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-4 flex max-w-2xl justify-between">
        <Button variant="outline" className="gap-1.5" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
          <ChevronLeft className="size-4" /> Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button className="gap-1.5" disabled={nextDisabled} onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>
            Next <ChevronRight className="size-4" />
          </Button>
        ) : (
          <Button className="gap-1.5" disabled={!rolesValid || createMutation.isPending} onClick={() => createMutation.mutate()}>
            {createMutation.isPending ? "Creating…" : "Create institution & go live"}
          </Button>
        )}
      </div>
    </div>
  );
}
