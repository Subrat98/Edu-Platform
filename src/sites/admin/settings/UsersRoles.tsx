import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AvatarInitials } from "@/components/common/AvatarInitials";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useAuthStore } from "@/features/auth/authStore";
import { userService } from "@/features/users/userService";
import { queryKeys } from "@/lib/queryKeys";
import { ROLE_LABELS } from "@/types";

export default function UsersRoles() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useQuery({ queryKey: queryKeys.demoUserList(), queryFn: () => userService.list() });

  const toggleMutation = useMutation({
    mutationFn: ({ userId, active }: { userId: string; active: boolean }) => userService.setActive(userId, active, currentUser?.name ?? "Admin"),
    onSuccess: (res, vars) => {
      if (res.ok) {
        toast.success(vars.active ? "Account reactivated" : "Account deactivated");
        queryClient.invalidateQueries({ queryKey: queryKeys.demoUserList() });
      }
    },
  });

  if (isLoading) return <PageLoadingSkeleton />;

  return (
    <div>
      <AdminPageHeader
        title="Users & Roles"
        description="All demo personas across both institutions. Deactivating an account prevents it from signing in."
      />
      <div className="border-border rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(users ?? []).map((u) => (
              <TableRow key={u.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-2 font-medium">
                    <AvatarInitials name={u.name} size="sm" />
                    {u.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{ROLE_LABELS[u.role]}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground capitalize">{u.institutionId}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{u.email}</TableCell>
                <TableCell>
                  {u.active === false ? (
                    <Badge variant="outline" className="border-destructive/30 text-destructive">
                      Deactivated
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
                      Active
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Switch
                    checked={u.active !== false}
                    disabled={toggleMutation.isPending || u.id === currentUser?.id}
                    onCheckedChange={(checked) => toggleMutation.mutate({ userId: u.id, active: checked })}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-muted-foreground mt-3 text-xs">You can't deactivate the account you're currently signed in as.</p>
    </div>
  );
}
