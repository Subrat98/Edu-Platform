import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AvatarInitials } from "@/components/common/AvatarInitials";
import { authService } from "./authService";
import { useAuthStore } from "./authStore";
import { landingPathFor } from "./roleRouting";
import { demoUsers } from "@/mocks/data/users";
import { ROLE_LABELS } from "@/types";
import { cn } from "@/lib/utils";

export function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: authService.login,
    onMutate: (userId) => setPendingId(userId),
    onSuccess: (user) => {
      if (!user) {
        toast.error("Couldn't find that demo account.");
        return;
      }
      if (user.active === false) {
        toast.error("This demo account has been deactivated.", { description: "Try a different persona, or reactivate it from Settings > Users & Roles." });
        return;
      }
      setUser(user);
      toast.success(`Signed in as ${user.name}`, { description: ROLE_LABELS[user.role] });
      navigate(landingPathFor(user.role));
    },
    onSettled: () => setPendingId(null),
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-10 text-center">
        <div className="bg-primary mx-auto flex size-12 items-center justify-center rounded-xl text-white">
          <GraduationCap className="size-6" />
        </div>
        <h1 className="font-heading text-foreground mt-4 text-2xl font-bold">Sign in to EduPlatform</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          This is a frontend-only demo — pick any persona below to explore its view. No real password required.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {demoUsers.map((user) => {
          const deactivated = user.active === false;
          return (
            <Card
              key={user.id}
              role="button"
              tabIndex={0}
              onClick={() => mutation.mutate(user.id)}
              onKeyDown={(e) => e.key === "Enter" && mutation.mutate(user.id)}
              className={cn(
                "hover:border-accent cursor-pointer transition-colors",
                pendingId === user.id && "opacity-60",
                deactivated && "opacity-50 hover:border-border",
              )}
            >
              <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                <AvatarInitials name={user.name} size="lg" />
                <div className="min-w-0">
                  <p className="text-foreground truncate text-sm font-semibold">{user.name}</p>
                  <p className="text-muted-foreground truncate text-xs">{user.title}</p>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <Badge variant="secondary">{ROLE_LABELS[user.role]}</Badge>
                {deactivated ? (
                  <Badge variant="outline" className="border-destructive/30 text-destructive">
                    Deactivated
                  </Badge>
                ) : (
                  <Badge variant="outline" className="capitalize">
                    {user.institutionId}
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
