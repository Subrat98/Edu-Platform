import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  UserPlus,
  Trash2,
  Search,
  ShieldCheck,
  Building2,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AvatarInitials } from "@/components/common/AvatarInitials";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { useAuthStore } from "@/features/auth/authStore";
import { userService, type CreateUserInput } from "@/features/users/userService";
import { queryKeys } from "@/lib/queryKeys";
import { ROLE_LABELS, type RoleKey, type InstitutionType } from "@/types";

const ALL_ROLES: { key: RoleKey; label: string; institution: "all" | "college" | "school" }[] = [
  { key: "platform_admin", label: "Platform Super Admin", institution: "all" },
  { key: "institution_admin", label: "Institution Admin", institution: "all" },
  { key: "principal", label: "Principal / Head of Institution", institution: "all" },
  { key: "admission_officer", label: "Admission Officer", institution: "all" },
  { key: "accountant", label: "Accounts & Finance Officer", institution: "all" },
  { key: "librarian", label: "Chief Librarian", institution: "all" },
  { key: "hod", label: "Head of Department (HOD)", institution: "college" },
  { key: "iqac_coordinator", label: "IQAC Coordinator (NAAC)", institution: "college" },
  { key: "faculty", label: "College Faculty / Professor", institution: "college" },
  { key: "teacher", label: "School Teacher", institution: "school" },
  { key: "exam_cell", label: "Examination Cell", institution: "college" },
  { key: "student", label: "Student", institution: "all" },
  { key: "parent", label: "Parent / Guardian", institution: "school" },
];

export default function UsersRoles() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useQuery({
    queryKey: queryKeys.demoUserList(),
    queryFn: () => userService.list(),
  });

  const isSuperAdmin = currentUser?.role === "platform_admin";

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWing, setSelectedWing] = useState<string>("all");

  // Create User modal state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<RoleKey>("faculty");
  const [institutionId, setInstitutionId] = useState<InstitutionType>("college");
  const [title, setTitle] = useState("");
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);

  // Toggle user activation
  const toggleMutation = useMutation({
    mutationFn: ({ userId, active }: { userId: string; active: boolean }) =>
      userService.setActive(userId, active, currentUser?.name ?? "Admin"),
    onSuccess: (res, vars) => {
      if (res.ok) {
        toast.success(vars.active ? "Account reactivated" : "Account deactivated");
        queryClient.invalidateQueries({ queryKey: queryKeys.demoUserList() });
      }
    },
  });

  // Create User mutation
  const createMutation = useMutation({
    mutationFn: (input: CreateUserInput) =>
      userService.create(input, currentUser?.name ?? "Super Admin"),
    onSuccess: (res) => {
      if (res.ok) {
        toast.success(`User "${res.user.name}" created successfully`, {
          description: `Assigned role: ${ROLE_LABELS[res.user.role]} (${res.user.institutionId})`,
        });
        queryClient.invalidateQueries({ queryKey: queryKeys.demoUserList() });
        setIsAddDialogOpen(false);
        // Reset form
        setName("");
        setEmail("");
        setTitle("");
        setRole("faculty");
        setInstitutionId("college");
      } else {
        toast.error("Failed to create user", { description: res.error });
      }
    },
  });

  // Update Role mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, newRole }: { userId: string; newRole: RoleKey }) =>
      userService.update(userId, { role: newRole }, currentUser?.name ?? "Super Admin"),
    onSuccess: (res) => {
      if (res.ok) {
        toast.success(`Role updated for ${res.user.name}`, {
          description: `New role: ${ROLE_LABELS[res.user.role]}`,
        });
        queryClient.invalidateQueries({ queryKey: queryKeys.demoUserList() });
      } else {
        toast.error("Failed to update role", { description: res.error });
      }
    },
  });

  // Delete User mutation
  const deleteMutation = useMutation({
    mutationFn: (userId: string) =>
      userService.delete(userId, currentUser?.name ?? "Super Admin"),
    onSuccess: (res) => {
      if (res.ok) {
        toast.success("User account deleted successfully");
        queryClient.invalidateQueries({ queryKey: queryKeys.demoUserList() });
        setUserToDelete(null);
      } else {
        toast.error("Failed to delete user", { description: res.error });
      }
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter user full name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    createMutation.mutate({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      institutionId,
      title: title.trim() || undefined,
    });
  };

  const filteredUsers = useMemo(() => {
    return (users ?? []).filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ROLE_LABELS[u.role] ?? u.role).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.title ?? "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchWing =
        selectedWing === "all" ||
        u.institutionId === selectedWing ||
        u.role === "platform_admin";

      return matchSearch && matchWing;
    });
  }, [users, searchTerm, selectedWing]);

  if (isLoading) return <PageLoadingSkeleton />;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Users & Roles"
        description="Comprehensive User and Role-Based Access Control (RBAC) management. Super Admins can add accounts, assign statutory roles, and govern permissions."
        actions={
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-xs">
                <UserPlus className="size-4" />
                <span>Add User & Role</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px]">
              <form onSubmit={handleCreateSubmit}>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <UserPlus className="size-5 text-primary" />
                    <span>Add New User Account</span>
                  </DialogTitle>
                  <DialogDescription>
                    Create a new user account and assign their statutory role and campus affiliation.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="user-name">Full Name *</Label>
                    <Input
                      id="user-name"
                      placeholder="e.g. Dr. Priya Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="user-email">Email Address *</Label>
                    <Input
                      id="user-email"
                      type="email"
                      placeholder="e.g. p.sharma@college.demo"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="user-role">Assigned Role *</Label>
                      <Select
                        value={role}
                        onValueChange={(val) => {
                          const r = val as RoleKey;
                          setRole(r);
                          if (r === "teacher" || r === "parent") {
                            setInstitutionId("school");
                          } else if (
                            r === "faculty" ||
                            r === "hod" ||
                            r === "iqac_coordinator" ||
                            r === "exam_cell"
                          ) {
                            setInstitutionId("college");
                          }
                        }}
                      >
                        <SelectTrigger id="user-role" className="w-full">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {ALL_ROLES.map((r) => (
                            <SelectItem key={r.key} value={r.key}>
                              {r.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="user-wing">Institution Wing *</Label>
                      <Select
                        value={institutionId}
                        onValueChange={(val) => setInstitutionId(val as InstitutionType)}
                      >
                        <SelectTrigger id="user-wing" className="w-full">
                          <SelectValue placeholder="Select wing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="college">Our College</SelectItem>
                          <SelectItem value="school">Our School</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="user-title">Designation / Title (Optional)</Label>
                    <Input
                      id="user-title"
                      placeholder="e.g. Associate Professor, Department of Physics"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Creating..." : "Create User"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Filter and Overview Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedWing} onValueChange={setSelectedWing}>
            <SelectTrigger className="h-9 w-[160px] text-xs">
              <SelectValue placeholder="Filter Wing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Wings</SelectItem>
              <SelectItem value="college">College Only</SelectItem>
              <SelectItem value="school">School Only</SelectItem>
            </SelectContent>
          </Select>

          <Badge variant="outline" className="h-9 px-3 text-xs font-semibold">
            Total Users: {filteredUsers.length}
          </Badge>
        </div>
      </div>

      {/* Users Table */}
      <div className="border-border rounded-lg border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-[280px]">User</TableHead>
              <TableHead className="w-[240px]">Role</TableHead>
              <TableHead className="w-[120px]">Institution</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[80px] text-center">Active</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShieldCheck className="size-8 text-muted-foreground/40" />
                    <p className="text-sm font-medium">No users found matching your search.</p>
                    <p className="text-xs">Click "Add User & Role" above to create an account.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((u) => {
                const isSuperAdminAccount =
                  u.role === "platform_admin" || u.id === "user-platform-super-admin";
                const isCurrent = u.id === currentUser?.id;

                return (
                  <TableRow key={u.id} className="hover:bg-muted/40 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3 font-medium">
                        <div className="relative">
                          <AvatarInitials name={u.name} size="sm" />
                          {isSuperAdminAccount && (
                            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 rounded-full p-0.5 shadow-xs">
                              <Sparkles className="size-2.5" />
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 font-bold text-sm">
                            <span className="truncate">{u.name}</span>
                            {isCurrent && (
                              <Badge variant="outline" className="text-[10px] py-0 px-1 font-normal">
                                You
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground text-xs truncate max-w-[220px]">
                            {u.title || "No designation"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      {isSuperAdmin && !isSuperAdminAccount ? (
                        <Select
                          value={u.role}
                          onValueChange={(newRole) =>
                            updateRoleMutation.mutate({
                              userId: u.id,
                              newRole: newRole as RoleKey,
                            })
                          }
                        >
                          <SelectTrigger className="h-7 text-xs w-[190px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-[260px]">
                            {ALL_ROLES.map((r) => (
                              <SelectItem key={r.key} value={r.key} className="text-xs">
                                {r.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge
                          variant={isSuperAdminAccount ? "default" : "secondary"}
                          className={
                            isSuperAdminAccount
                              ? "bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
                              : "text-xs"
                          }
                        >
                          {ROLE_LABELS[u.role] ?? u.role}
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      {u.role === "platform_admin" ? (
                        <Badge variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-semibold">
                          All Wings
                        </Badge>
                      ) : u.institutionId === "college" ? (
                        <Badge variant="outline" className="gap-1 text-[10px] border-primary/20 bg-primary/5">
                          <Building2 className="size-3 text-primary" />
                          <span>College</span>
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 text-[10px]">
                          <GraduationCap className="size-3" />
                          <span>School</span>
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-muted-foreground text-xs font-mono">
                      {u.email}
                    </TableCell>

                    <TableCell>
                      {u.active === false ? (
                        <Badge variant="outline" className="border-destructive/30 text-destructive text-[11px]">
                          Deactivated
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                          Active
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      <Switch
                        checked={u.active !== false}
                        disabled={toggleMutation.isPending || isCurrent || isSuperAdminAccount}
                        onCheckedChange={(checked) =>
                          toggleMutation.mutate({ userId: u.id, active: checked })
                        }
                      />
                    </TableCell>

                    <TableCell className="text-right">
                      {!isSuperAdminAccount && !isCurrent ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground hover:text-destructive"
                          onClick={() => setUserToDelete({ id: u.id, name: u.name })}
                          title={`Delete user ${u.name}`}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      ) : (
                        <span className="text-[11px] text-muted-foreground italic">Primary</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete User Confirmation Dialog */}
      <Dialog
        open={Boolean(userToDelete)}
        onOpenChange={(open) => !open && setUserToDelete(null)}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="size-5" />
              <span>Delete User Account</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete account <strong>{userToDelete?.name}</strong>? This action will permanently remove access for this user.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setUserToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => userToDelete && deleteMutation.mutate(userToDelete.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground pt-1">
        <p>• The primary Super Admin account is protected and cannot be deleted or deactivated.</p>
        <p>• Roles can be reassigned dynamically using the Role dropdown selector.</p>
      </div>
    </div>
  );
}
