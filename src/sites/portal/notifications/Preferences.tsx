import { useState } from "react";
import { toast } from "sonner";
import { Bell, Smartphone } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/features/auth/authStore";
import { readStorage, writeStorage } from "@/lib/storage";
import { useInstallPrompt } from "@/features/pwa/useInstallPrompt";
import type { NotificationCategory } from "@/types";

const CATEGORIES: NotificationCategory[] = ["Academics", "Finance", "Admissions", "Library", "General"];

interface Prefs {
  email: Record<NotificationCategory, boolean>;
  push: Record<NotificationCategory, boolean>;
}

function defaultPrefs(): Prefs {
  const on = CATEGORIES.reduce((acc, c) => ({ ...acc, [c]: true }), {} as Record<NotificationCategory, boolean>);
  return { email: { ...on }, push: { ...on } };
}

export default function NotificationPreferences() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const key = `notif-prefs:${currentUser?.id ?? "anon"}`;
  const [prefs, setPrefs] = useState<Prefs>(() => readStorage(key, defaultPrefs()));
  const { canPromptNatively } = useInstallPrompt();
  const installed = typeof window !== "undefined" && window.matchMedia?.("(display-mode: standalone)").matches;

  function toggle(channel: "email" | "push", category: NotificationCategory) {
    setPrefs((p) => {
      const next = { ...p, [channel]: { ...p[channel], [category]: !p[channel][category] } };
      writeStorage(key, next);
      return next;
    });
    toast.success("Preference saved");
  }

  return (
    <div>
      <AdminPageHeader title="Notification Preferences" description="Choose how you'd like to hear about academics, fees, admissions and more." />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="size-4" /> By category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-border overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="p-3 text-left font-medium">Category</th>
                  <th className="p-3 text-center font-medium">Email</th>
                  <th className="p-3 text-center font-medium">Web Push</th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {CATEGORIES.map((c) => (
                  <tr key={c}>
                    <td className="p-3">{c}</td>
                    <td className="p-3 text-center">
                      <Switch checked={prefs.email[c]} onCheckedChange={() => toggle("email", c)} />
                    </td>
                    <td className="p-3 text-center">
                      <Switch checked={prefs.push[c]} onCheckedChange={() => toggle("push", c)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Smartphone className="size-4" /> About Web Push
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-2 text-sm">
          <p>
            This is a frontend-only demo, so toggling Web Push here saves your preference but doesn't register a real
            push subscription — no notification is actually sent.
          </p>
          <p>
            On iPhone and iPad, real web push only works for a site added to the Home Screen on iOS/iPadOS 16.4 or
            later — it isn't available in a regular Safari tab. {installed ? "You're currently running the installed app." : canPromptNatively ? "Use the Install prompt to add this app first." : "Use Share → Add to Home Screen first."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
