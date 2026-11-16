import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Save,
  GraduationCap,
  Landmark,
  ShieldCheck,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useAuthStore } from "@/features/auth/authStore";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { useInstitutionStore } from "@/features/institutions/institutionStore";
import { institutionService } from "@/features/institutions/institutionService";
import { logActivity } from "@/mocks/data/activityLog";
import { queryKeys } from "@/lib/queryKeys";

export default function InstitutionSettings() {
  const { institutionId, institution, isLoading } = useInstitutionData();
  const currentUser = useAuthStore((s) => s.currentUser);
  const visibility = useInstitutionStore((s) => s.visibility);
  const setVisibility = useInstitutionStore((s) => s.setVisibility);
  const queryClient = useQueryClient();

  const handleToggleVisibility = (wing: "school" | "college", checked: boolean) => {
    if (!checked) {
      const otherWing = wing === "school" ? "college" : "school";
      if (!visibility[otherWing]) {
        toast.error("Cannot Hide Both Wings", {
          description: "At least one institution wing must remain visible on the public website.",
        });
        return;
      }
    }

    setVisibility({ [wing]: checked });
    const wingLabel = wing === "school" ? "School" : "College";

    logActivity({
      institutionId,
      category: "Settings",
      action: `Super Admin ${checked ? "enabled" : "hid"} ${wingLabel} content`,
      actor: currentUser?.name ?? "Super Admin",
      detail: `Website visibility: School=${wing === "school" ? checked : visibility.school}, College=${wing === "college" ? checked : visibility.college}`,
    });

    toast.success(`${wingLabel} Content ${checked ? "Visible" : "Hidden"}`, {
      description: checked
        ? `${wingLabel} content is now published on the website.`
        : `All ${wingLabel} content is now hidden from the website.`,
    });
  };

  const [form, setForm] = useState({
    tagline: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    facebook: "",
    youtube: "",
    instagram: "",
  });

  useEffect(() => {
    if (institution) {
      setForm({
        tagline: institution.tagline,
        description: institution.description,
        phone: institution.contact.phone,
        email: institution.contact.email,
        address: institution.contact.address,
        facebook: institution.socials.facebook ?? "",
        youtube: institution.socials.youtube ?? "",
        instagram: institution.socials.instagram ?? "",
      });
    }
  }, [institution]);

  const saveMutation = useMutation({
    mutationFn: () =>
      institutionService.update(
        institutionId,
        {
          tagline: form.tagline,
          description: form.description,
          contact: { phone: form.phone, email: form.email, address: form.address },
          socials: { facebook: form.facebook, youtube: form.youtube, instagram: form.instagram },
        },
        currentUser?.name ?? "Admin",
      ),
    onSuccess: () => {
      // Every page reads institution data through this one query key; only
      // invalidating it here (not a separate local key) keeps the header,
      // footer and public site in sync with the saved profile immediately.
      queryClient.invalidateQueries({ queryKey: queryKeys.institution(institutionId) });
      toast.success("Institution profile updated");
    },
  });

  if (isLoading || !institution) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader
        title="Institution Profile"
        description={`Public contact details and tagline for ${institution.name}.`}
        actions={
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="gap-1.5">
            <Save className="size-4" /> {saveMutation.isPending ? "Saving…" : "Save changes"}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Platform Super Admin: Website Content & Wing Visibility Configuration */}
        {currentUser?.role === "platform_admin" && (
          <Card className="lg:col-span-2 border-primary/30 bg-primary/5 shadow-xs">
            <CardHeader className="pb-3 border-b border-primary/10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base font-bold text-foreground">
                        Super Admin: Website Content Visibility
                      </CardTitle>
                      <Badge className="bg-primary text-primary-foreground text-[10px]">
                        Super Admin Only
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      Hide or publish all School content or College content from the website with zero downtime.
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <Button asChild variant="outline" size="sm" className="text-xs gap-1 border-primary/30">
                    <Link to="/admin/platform/settings">
                      <SlidersHorizontal className="size-3 text-primary" />
                      <span>Full Platform Config</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* School Wing Visibility */}
              <div className="p-3.5 rounded-xl border border-border/80 bg-card space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="size-4 text-primary" />
                    <span className="font-bold text-xs text-foreground">School Content</span>
                    <Badge variant={visibility.school ? "default" : "secondary"} className="text-[10px]">
                      {visibility.school ? "Visible on Website" : "Hidden"}
                    </Badge>
                  </div>
                  <Switch
                    checked={visibility.school}
                    onCheckedChange={(checked) => handleToggleVisibility("school", checked)}
                    aria-label="Toggle School Content"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Controls all School pages (/school), CBSE mandatory disclosure, facilities, student life, and school menu items.
                </p>
              </div>

              {/* College Wing Visibility */}
              <div className="p-3.5 rounded-xl border border-border/80 bg-card space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Landmark className="size-4 text-emerald-600" />
                    <span className="font-bold text-xs text-foreground">College Content</span>
                    <Badge variant={visibility.college ? "default" : "secondary"} className="text-[10px]">
                      {visibility.college ? "Visible on Website" : "Hidden"}
                    </Badge>
                  </div>
                  <Switch
                    checked={visibility.college}
                    onCheckedChange={(checked) => handleToggleVisibility("college", checked)}
                    aria-label="Toggle College Content"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Controls all College pages (/college), NAAC/IQAC portals, academic programmes, exam cell, tenders, and recruitments.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Tagline</Label>
              <Input className="mt-1.5" value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea className="mt-1.5" rows={5} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Address</Label>
              <Input className="mt-1.5" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input className="mt-1.5" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            </div>
            <div>
              <Label>Email</Label>
              <Input className="mt-1.5" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Social links</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <Label>Facebook</Label>
              <Input className="mt-1.5" value={form.facebook} onChange={(e) => setForm((f) => ({ ...f, facebook: e.target.value }))} />
            </div>
            <div>
              <Label>YouTube</Label>
              <Input className="mt-1.5" value={form.youtube} onChange={(e) => setForm((f) => ({ ...f, youtube: e.target.value }))} />
            </div>
            <div>
              <Label>Instagram</Label>
              <Input className="mt-1.5" value={form.instagram} onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value }))} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
