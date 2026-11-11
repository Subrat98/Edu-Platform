import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Download,
  Search,
  Filter,
  Lock,
  FileCheck,
  Building2,
  Sparkles,
  ArrowRight,
  UserCheck,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ResponsiveTableContainer } from "@/components/admin/ResponsiveTableContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  NAAC_ROLES,
  getStoredPermissionMatrix,
  savePermissionMatrix,
  resetPermissionMatrixToDefault,
  useNaacPermissions,
  type NaacRole,
  type NaacPermissionAction,
  type RolePermissionMatrixItem,
} from "@/features/naac/naacPermissions";
import { useAuthStore } from "@/features/auth/authStore";
import { demoUsers } from "@/mocks/data/users";

export default function NaacPermissionMatrixConsole() {
  const { currentUser, activeNaacRole, roleLabel, roleBadge, permissions } = useNaacPermissions();
  const setUser = useAuthStore((s) => s.setUser);

  const [matrix, setMatrix] = useState<RolePermissionMatrixItem[]>(getStoredPermissionMatrix);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    "All",
    "Executive Governance",
    "Quality Oversight",
    "Department Operations",
    "Evidence Vault",
    "Compliance & Audit",
  ];

  const filteredMatrix = matrix.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggle = (key: NaacPermissionAction, role: NaacRole) => {
    const updated = matrix.map((item) => {
      if (item.key === key) {
        return {
          ...item,
          allowedRoles: {
            ...item.allowedRoles,
            [role]: !item.allowedRoles[role],
          },
        };
      }
      return item;
    });
    setMatrix(updated);
    savePermissionMatrix(updated);
    toast.success("Permission updated", {
      description: `Updated ${key} for role ${role}.`,
    });
  };

  const handleReset = () => {
    const defaultMatrix = resetPermissionMatrixToDefault();
    setMatrix(defaultMatrix);
    toast.info("Permissions reset", {
      description: "Restored factory default NAAC RBAC security matrix.",
    });
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(matrix, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `NAAC_RBAC_Matrix_Policy_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Matrix policy exported as JSON");
  };

  const switchPersona = (roleKey: string) => {
    const targetUser = demoUsers.find((u) => u.role === roleKey && u.institutionId === "college")
      || demoUsers.find((u) => u.role === roleKey);
    if (targetUser) {
      setUser(targetUser);
      toast.success(`Switched role to: ${targetUser.name} (${targetUser.title})`);
    } else {
      toast.error(`No demo persona found for role ${roleKey}`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <AdminPageHeader
        title="NAAC Security & RBAC: Role-Based Permission Matrix"
        description="Statutory Role-Based Access Control matrix defining operational authority across Principal (Full/Sign-off), IQAC Coordinator (Manage/Review), HOD (Dept Data), and Faculty (Upload)."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "NAAC", href: "/admin/naac" },
          { label: "Permission Matrix" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5 text-xs">
              <RotateCcw className="size-3.5" />
              <span>Reset Factory Defaults</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportJson} className="gap-1.5 text-xs">
              <Download className="size-3.5" />
              <span>Export Policy JSON</span>
            </Button>
          </div>
        }
      />

      {/* Persona Simulator & Active Role Status Banner */}
      <Card className="border-primary/30 bg-gradient-to-r from-primary/5 via-background to-card shadow-xs">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <UserCheck className="size-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">Currently Signed-In Persona:</span>
                  <Badge className="bg-primary/15 text-primary border-primary/30 text-xs">
                    {currentUser?.name || "Dr. B. K. Ray (Principal)"}
                  </Badge>
                  <Badge variant="outline" className="font-mono text-[11px]">
                    Role: {roleLabel} ({roleBadge})
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  NAAC Operations Scope: {NAAC_ROLES.find((r) => r.id === activeNaacRole)?.scope} — {NAAC_ROLES.find((r) => r.id === activeNaacRole)?.desc}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
              <span className="text-[11px] font-medium text-muted-foreground mr-1">Simulate Role:</span>
              <Button
                variant={activeNaacRole === "principal" ? "default" : "outline"}
                size="xs"
                onClick={() => switchPersona("principal")}
                className="text-xs h-7 gap-1"
              >
                👑 Principal
              </Button>
              <Button
                variant={activeNaacRole === "iqac_coordinator" ? "default" : "outline"}
                size="xs"
                onClick={() => switchPersona("iqac_coordinator")}
                className="text-xs h-7 gap-1"
              >
                🎯 IQAC Coord
              </Button>
              <Button
                variant={activeNaacRole === "hod" ? "default" : "outline"}
                size="xs"
                onClick={() => switchPersona("hod")}
                className="text-xs h-7 gap-1"
              >
                🏛️ HOD
              </Button>
              <Button
                variant={activeNaacRole === "faculty" ? "default" : "outline"}
                size="xs"
                onClick={() => switchPersona("faculty")}
                className="text-xs h-7 gap-1"
              >
                ✍️ Faculty
              </Button>
            </div>
          </div>

          {/* Live Capability Pills for Active Persona */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/50 text-xs">
            <div className="flex items-center justify-between p-2 rounded-md bg-card border border-border/60">
              <span className="font-medium">Final Sign-Off / Freeze</span>
              {permissions.sign_off_ssr ? (
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1 text-[10px]">
                  <CheckCircle2 className="size-3" /> Granted
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground gap-1 text-[10px]">
                  <XCircle className="size-3" /> Restricted
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-2 rounded-md bg-card border border-border/60">
              <span className="font-medium">Manage & Review QA</span>
              {permissions.review_evidence ? (
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1 text-[10px]">
                  <CheckCircle2 className="size-3" /> Granted
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground gap-1 text-[10px]">
                  <XCircle className="size-3" /> Restricted
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-2 rounded-md bg-card border border-border/60">
              <span className="font-medium">Department Data Entry</span>
              {permissions.manage_dept_data ? (
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1 text-[10px]">
                  <CheckCircle2 className="size-3" /> Granted
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground gap-1 text-[10px]">
                  <XCircle className="size-3" /> Restricted
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-2 rounded-md bg-card border border-border/60">
              <span className="font-medium">Evidence Dossier Upload</span>
              {permissions.upload_evidence ? (
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1 text-[10px]">
                  <CheckCircle2 className="size-3" /> Granted
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground gap-1 text-[10px]">
                  <XCircle className="size-3" /> Restricted
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Definitions Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {NAAC_ROLES.map((r) => {
          const isCurrent = activeNaacRole === r.id;
          return (
            <Card
              key={r.id}
              className={`border transition-all ${
                isCurrent
                  ? "border-primary ring-1 ring-primary/40 bg-primary/5"
                  : "border-border/60 bg-card hover:bg-muted/30"
              }`}
            >
              <CardHeader className="p-3.5 pb-2">
                <div className="flex items-center justify-between">
                  <Badge
                    variant={isCurrent ? "default" : "secondary"}
                    className="text-[11px] font-semibold"
                  >
                    {r.badge}
                  </Badge>
                  {isCurrent && (
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                      Active
                    </span>
                  )}
                </div>
                <CardTitle className="text-sm font-bold text-foreground mt-1">
                  {r.label}
                </CardTitle>
                <CardDescription className="text-[11px]">
                  {r.scope}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3.5 pt-0">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {r.desc}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filter & Search Bar */}
      <Card className="border-border/60 bg-card shadow-xs">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
                <Filter className="size-3" />
                Category:
              </span>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "ghost"}
                  size="xs"
                  onClick={() => setSelectedCategory(cat)}
                  className="text-xs h-7"
                >
                  {cat}
                </Button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search capabilities or actions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Permission Matrix Table */}
      <Card className="border-border/60 bg-card shadow-xs">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                Role Capability & Access Matrix
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Toggle permissions dynamically. Changes take immediate effect across administrative and self-service consoles.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              {filteredMatrix.length} Capabilities
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ResponsiveTableContainer>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-[320px]">Capability / Operation</TableHead>
                  <TableHead className="w-[160px]">Category</TableHead>
                  <TableHead className="text-center w-[120px]">
                    <div className="font-bold text-foreground">Principal</div>
                    <div className="text-[10px] text-muted-foreground font-normal">Full / Sign-off</div>
                  </TableHead>
                  <TableHead className="text-center w-[130px]">
                    <div className="font-bold text-foreground">IQAC Coord</div>
                    <div className="text-[10px] text-muted-foreground font-normal">Manage / Review</div>
                  </TableHead>
                  <TableHead className="text-center w-[120px]">
                    <div className="font-bold text-foreground">HOD</div>
                    <div className="text-[10px] text-muted-foreground font-normal">Dept Data</div>
                  </TableHead>
                  <TableHead className="text-center w-[120px]">
                    <div className="font-bold text-foreground">Faculty</div>
                    <div className="text-[10px] text-muted-foreground font-normal">Upload</div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMatrix.map((item) => (
                  <TableRow key={item.key} className="hover:bg-muted/30">
                    <TableCell>
                      <div>
                        <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                          {item.category === "Executive Governance" && <Lock className="size-3 text-amber-500" />}
                          {item.category === "Quality Oversight" && <Sparkles className="size-3 text-primary" />}
                          {item.category === "Department Operations" && <Building2 className="size-3 text-blue-500" />}
                          {item.category === "Evidence Vault" && <FileCheck className="size-3 text-teal-500" />}
                          {item.category === "Compliance & Audit" && <ShieldCheck className="size-3 text-purple-500" />}
                          {item.name}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                          {item.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-normal">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Switch
                          checked={item.allowedRoles.principal}
                          onCheckedChange={() => handleToggle(item.key, "principal")}
                          aria-label={`Toggle ${item.name} for Principal`}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Switch
                          checked={item.allowedRoles.iqac_coordinator}
                          onCheckedChange={() => handleToggle(item.key, "iqac_coordinator")}
                          aria-label={`Toggle ${item.name} for IQAC Coordinator`}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Switch
                          checked={item.allowedRoles.hod}
                          onCheckedChange={() => handleToggle(item.key, "hod")}
                          aria-label={`Toggle ${item.name} for HOD`}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Switch
                          checked={item.allowedRoles.faculty}
                          onCheckedChange={() => handleToggle(item.key, "faculty")}
                          aria-label={`Toggle ${item.name} for Faculty`}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ResponsiveTableContainer>
        </CardContent>
      </Card>

      {/* Quick Navigation to Related NAAC Governance Consoles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          to="/admin/naac/approvals"
          className="group block p-4 rounded-lg border border-border/60 bg-card hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground group-hover:text-primary flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-emerald-600" />
              Approvals & Sign-Off Workflows
            </span>
            <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Review pending indicator sign-offs, evidence validations, and executive approval queue.
          </p>
        </Link>

        <Link
          to="/admin/naac/audit"
          className="group block p-4 rounded-lg border border-border/60 bg-card hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground group-hover:text-primary flex items-center gap-1.5">
              <ShieldAlert className="size-4 text-purple-600" />
              Tamper-Evident Audit Trail
            </span>
            <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Inspect SHA-256 evidence upload checksums, user modification logs, and status transitions.
          </p>
        </Link>

        <Link
          to="/admin/naac/criteria"
          className="group block p-4 rounded-lg border border-border/60 bg-card hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground group-hover:text-primary flex items-center gap-1.5">
              <Award className="size-4 text-blue-600" />
              Criteria Hub & Indicator Consoles
            </span>
            <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Access 35+ granular metric consoles spanning Criteria 1 through 7.
          </p>
        </Link>
      </div>
    </div>
  );
}
