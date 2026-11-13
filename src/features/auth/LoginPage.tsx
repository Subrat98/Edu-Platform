import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  GraduationCap,
  Landmark,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AvatarInitials } from "@/components/common/AvatarInitials";
import { authService } from "./authService";
import { useAuthStore } from "./authStore";
import { landingPathFor } from "./roleRouting";
import { demoUsers } from "@/mocks/data/users";
import { ROLE_LABELS, type InstitutionType } from "@/types";
import { cn } from "@/lib/utils";
import { useInstitutionStore } from "@/features/institutions/institutionStore";

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);
  const activeInstitutionId = useInstitutionStore((s) => s.activeInstitutionId);
  const setInstitution = useInstitutionStore((s) => s.setInstitution);

  const [pendingId, setPendingId] = useState<string | null>(null);

  // Read URL query parameter "?institution=college" or "?institution=school"
  const paramInstitution = searchParams.get("institution");
  const initialInstitution: InstitutionType =
    paramInstitution === "college" || paramInstitution === "school"
      ? paramInstitution
      : activeInstitutionId === "college"
      ? "college"
      : "school";

  const [currentInstitution, setCurrentInstitution] = useState<InstitutionType>(initialInstitution);

  // Sync state when search param changes
  useEffect(() => {
    if (paramInstitution === "college" || paramInstitution === "school") {
      setCurrentInstitution(paramInstitution);
    }
  }, [paramInstitution]);

  const handleSwitchInstitution = (inst: InstitutionType) => {
    setCurrentInstitution(inst);
    setSearchParams({ institution: inst }, { replace: true });
    setInstitution(inst);
  };

  const mutation = useMutation({
    mutationFn: authService.login,
    onMutate: (userId) => setPendingId(userId),
    onSuccess: (user) => {
      if (!user) {
        toast.error("Couldn't find that demo account.");
        return;
      }
      if (user.active === false) {
        toast.error("This demo account has been deactivated.", {
          description: "Try a different persona, or reactivate it from Settings > Users & Roles.",
        });
        return;
      }

      // If Super Admin logs in, bind active institution to the portal view they selected
      if (user.role === "platform_admin") {
        setInstitution(currentInstitution);
      } else {
        setInstitution(user.institutionId);
      }

      setUser(user);
      toast.success(`Signed in as ${user.name}`, { description: ROLE_LABELS[user.role] });
      navigate(landingPathFor(user.role));
    },
    onSettled: () => setPendingId(null),
  });

  // Filter personas strictly per user requirement:
  // - College: College members + Super Admin
  // - School: School members + Super Admin
  const visibleUsers = useMemo(() => {
    const list = demoUsers.filter((u) => {
      if (u.role === "platform_admin") return true; // Super Admin always visible in both
      if (currentInstitution === "college") {
        return u.institutionId === "college";
      } else {
        return u.institutionId === "school" && u.id !== "user-unified-admin";
      }
    });

    // Sort: Platform Super Admin first, then other users
    return list.sort((a, b) => {
      if (a.role === "platform_admin") return -1;
      if (b.role === "platform_admin") return 1;
      return 0;
    });
  }, [currentInstitution]);

  const isCollege = currentInstitution === "college";

  return (
    <div className="mx-auto max-w-5xl py-6">
      {/* Top Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-border/60">
        <Link
          to={`/${currentInstitution}`}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-semibold"
        >
          <ArrowLeft className="size-3.5" />
          <span>Return to {isCollege ? "Our College" : "Our School"} Public Website</span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Active Portal:</span>
          <Badge variant="outline" className="font-bold capitalize bg-muted/40">
            {isCollege ? "College" : "School"}
          </Badge>
        </div>
      </div>

      {/* Hero / Portal Header */}
      <div className="mb-8 text-center space-y-3">
        <div
          className={cn(
            "mx-auto flex size-14 items-center justify-center rounded-2xl text-white shadow-md transition-all",
            isCollege ? "bg-emerald-600 shadow-emerald-600/20" : "bg-primary shadow-primary/20"
          )}
        >
          {isCollege ? <Landmark className="size-7" /> : <GraduationCap className="size-7" />}
        </div>
        <div>
          <h1 className="font-heading text-foreground text-2xl sm:text-3xl font-extrabold tracking-tight">
            Sign in to {isCollege ? "College Portal" : "School Portal"}
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm max-w-xl mx-auto">
            {isCollege
              ? "Showing authorized College faculty, administration, student accounts and Platform Super Admin."
              : "Showing authorized School administration, teachers, parent accounts and Platform Super Admin."}
          </p>
        </div>

        {/* Portal Personas Wing Switcher */}
        <div className="inline-flex items-center p-1 rounded-xl bg-muted/70 border border-border/80 shadow-xs mt-2">
          <button
            type="button"
            onClick={() => handleSwitchInstitution("college")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all",
              isCollege
                ? "bg-background text-foreground shadow-xs ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Landmark className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>College</span>
            <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
              College + Super Admin
            </Badge>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchInstitution("school")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all",
              !isCollege
                ? "bg-background text-foreground shadow-xs ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <GraduationCap className="size-3.5 text-primary" />
            <span>School</span>
            <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
              School + Super Admin
            </Badge>
          </button>
        </div>
      </div>

      {/* Grid of Authorized Personas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleUsers.map((user) => {
          const isSuperAdmin = user.role === "platform_admin";
          const deactivated = user.active === false;

          return (
            <Card
              key={user.id}
              role="button"
              tabIndex={0}
              onClick={() => mutation.mutate(user.id)}
              onKeyDown={(e) => e.key === "Enter" && mutation.mutate(user.id)}
              className={cn(
                "cursor-pointer transition-all border group hover:shadow-md relative overflow-hidden",
                isSuperAdmin
                  ? "border-amber-400/60 dark:border-amber-500/40 bg-amber-500/5 hover:border-amber-500 hover:bg-amber-500/10"
                  : "border-border hover:border-primary/50 hover:bg-muted/30",
                pendingId === user.id && "opacity-60 pointer-events-none",
                deactivated && "opacity-50 hover:border-border cursor-not-allowed"
              )}
            >
              {isSuperAdmin && (
                <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-bl uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <ShieldCheck className="size-2.5" />
                  <span>Platform Super Admin</span>
                </div>
              )}

              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-3 pt-4">
                <div className="relative">
                  <AvatarInitials name={user.name} size="lg" />
                  {isSuperAdmin && (
                    <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 rounded-full p-0.5 shadow">
                      <Sparkles className="size-3" />
                    </span>
                  )}
                </div>
                <div className="min-w-0 pr-12">
                  <p className="text-foreground group-hover:text-primary transition-colors truncate text-sm font-bold">
                    {user.name}
                  </p>
                  <p className="text-muted-foreground truncate text-xs mt-0.5">{user.title}</p>
                </div>
              </CardHeader>

              <CardContent className="flex items-center justify-between pt-0 pb-3.5">
                {isSuperAdmin ? (
                  <Badge className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px]">
                    Super Admin
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px]">
                    {ROLE_LABELS[user.role]}
                  </Badge>
                )}

                {deactivated ? (
                  <Badge variant="outline" className="border-destructive/30 text-destructive text-[10px]">
                    Deactivated
                  </Badge>
                ) : isSuperAdmin ? (
                  <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-300 font-semibold text-[10px]">
                    All Wings Access
                  </Badge>
                ) : (
                  <Badge variant="outline" className="capitalize text-[10px]">
                    {user.institutionId === "college" ? "College" : "School"}
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Security and RBAC Notice */}
      <div className="mt-8 pt-4 border-t border-border/50 text-center text-[11px] text-muted-foreground">
        <span>Click any persona card above to sign in instantly. Single Sign-On (SSO) & Role-Based Access Control (RBAC) simulated.</span>
      </div>
    </div>
  );
}
