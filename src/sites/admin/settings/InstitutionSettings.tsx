import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useAuthStore } from "@/features/auth/authStore";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { institutionService } from "@/features/institutions/institutionService";
import { queryKeys } from "@/lib/queryKeys";

export default function InstitutionSettings() {
  const { institutionId, institution, isLoading } = useInstitutionData();
  const currentUser = useAuthStore((s) => s.currentUser);
  const queryClient = useQueryClient();

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
