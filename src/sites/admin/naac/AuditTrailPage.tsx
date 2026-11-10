import { useState, useEffect } from "react";
import {
  History,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveTableContainer } from "@/components/admin/ResponsiveTableContainer";
import { getAuditLogsList } from "@/features/naac/naacService";
import type { NaacAuditLog } from "@/types";

export default function AuditTrailPage() {
  const [logs, setLogs] = useState<NaacAuditLog[]>([]);
  const [, setLoading] = useState(true);
  const [filterModule, setFilterModule] = useState("All");

  const loadData = () => {
    setLoading(true);
    getAuditLogsList(filterModule)
      .then((data) => setLogs(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [filterModule]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              NAAC Tamper-Evident Audit Trail
            </h1>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              Immutable Governance
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete cryptographic audit trail of all changes, verifications, approvals, and evidence alterations.
          </p>
        </div>

        <div className="w-full sm:w-48">
          <Select value={filterModule} onValueChange={setFilterModule}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Modules</SelectItem>
              <SelectItem value="Criterion">Criteria</SelectItem>
              <SelectItem value="Evidence">Evidence Vault</SelectItem>
              <SelectItem value="AQAR">AQAR</SelectItem>
              <SelectItem value="IQAC">IQAC</SelectItem>
              <SelectItem value="Approvals">Approvals</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile Card List (< md) */}
      <div className="md:hidden space-y-3">
        {logs.map((log) => (
          <Card key={log.id} className="border-border/70 p-3.5 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-[10px] text-muted-foreground">{log.timestamp}</span>
                <p className="font-semibold text-xs sm:text-sm text-foreground mt-0.5">{log.entityTitle}</p>
              </div>
              <Badge
                className={
                  log.action === "Approved"
                    ? "bg-emerald-600 text-white shrink-0 text-[10px]"
                    : log.action === "Verified"
                    ? "bg-blue-600 text-white shrink-0 text-[10px]"
                    : log.action === "Created"
                    ? "bg-purple-600 text-white shrink-0 text-[10px]"
                    : "bg-slate-600 text-white shrink-0 text-[10px]"
                }
              >
                {log.action}
              </Badge>
            </div>

            <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs border-t border-border/50 pt-2">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-medium block">Actor & Role</span>
                <p className="text-[11px] font-semibold text-foreground">{log.actorName}</p>
                <Badge variant="secondary" className="text-[9px] px-1 py-0 mt-0.5">{log.actorRole}</Badge>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-medium block">Module</span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 mt-0.5">{log.module}</Badge>
              </div>
              {(log.previousValue || log.newValue) && (
                <div className="col-span-2">
                  <span className="text-[10px] text-muted-foreground uppercase font-medium block">Transition</span>
                  <p className="text-[11px] text-muted-foreground">
                    <span className="line-through text-rose-500">{log.previousValue || "None"}</span> &rarr;{" "}
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">{log.newValue}</span>
                  </p>
                </div>
              )}
              {log.remarks && (
                <div className="col-span-2">
                  <span className="text-[10px] text-muted-foreground uppercase font-medium block">Remarks</span>
                  <p className="text-[11px] text-muted-foreground">{log.remarks}</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop Audit Table (md+) */}
      <div className="hidden md:block">
        <ResponsiveTableContainer>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="font-semibold min-w-[150px]">Timestamp</TableHead>
                <TableHead className="font-semibold min-w-[160px]">Actor & Role</TableHead>
                <TableHead className="font-semibold min-w-[100px]">Module</TableHead>
                <TableHead className="font-semibold min-w-[100px]">Action</TableHead>
                <TableHead className="font-semibold min-w-[200px]">Entity / Target</TableHead>
                <TableHead className="font-semibold min-w-[180px]">Previous &rarr; New Value</TableHead>
                <TableHead className="font-semibold min-w-[160px]">Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/20">
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {log.timestamp}
                  </TableCell>
                  <TableCell className="text-xs">
                    <p className="font-bold text-foreground">{log.actorName}</p>
                    <Badge variant="secondary" className="text-[10px] px-1 py-0">{log.actorRole}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {log.module}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        log.action === "Approved"
                          ? "bg-emerald-600 text-white"
                          : log.action === "Verified"
                          ? "bg-blue-600 text-white"
                          : log.action === "Created"
                          ? "bg-purple-600 text-white"
                          : "bg-slate-600 text-white"
                      }
                    >
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-xs text-foreground max-w-xs truncate">
                    {log.entityTitle}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {log.previousValue || log.newValue ? (
                      <span>
                        <span className="line-through text-rose-500">{log.previousValue || "None"}</span> &rarr;{" "}
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">{log.newValue}</span>
                      </span>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                    {log.remarks || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ResponsiveTableContainer>
      </div>
    </div>
  );
}
