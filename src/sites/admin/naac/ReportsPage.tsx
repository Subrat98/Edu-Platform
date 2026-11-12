import { useEffect, useState } from "react";
import {
  FileText,
  Download,
  Printer,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveTableContainer } from "@/components/admin/ResponsiveTableContainer";
import { downloadCsv } from "@/lib/downloadCsv";

const REPORT_TEMPLATES = [
  { id: "r-01", title: "Criterion-Wise Quantitative Metric Compilation", type: "Criterion", year: "2025-26", format: "Excel / CSV" },
  { id: "r-02", title: "Annual Quality Assurance Report (AQAR) Master Export", type: "AQAR", year: "2025-26", format: "PDF / XML" },
  { id: "r-03", title: "Self Study Report (SSR) Cycle 3 Dossier", type: "SSR", year: "5-Year Period", format: "PDF / Word" },
  { id: "r-04", title: "Stakeholder Curriculum Feedback Analysis & Action Taken Report", type: "Feedback", year: "2025-26", format: "PDF" },
  { id: "r-05", title: "Centralized Evidence Vault Catalogue & Verification Status", type: "Evidence", year: "2025-26", format: "Excel / CSV" },
  { id: "r-06", title: "Pending Document Verification & Compliance Audit Report", type: "Compliance", year: "Current", format: "PDF / CSV" },
];

type ReportTemplate = (typeof REPORT_TEMPLATES)[number];

export default function ReportsPage() {
  const [selectedYear, setSelectedYear] = useState("2025-26");
  const [printReport, setPrintReport] = useState<ReportTemplate | null>(null);
  const [printGeneratedOn, setPrintGeneratedOn] = useState("");

  useEffect(() => {
    if (printReport) window.print();
  }, [printReport]);

  const downloadReport = (rep: ReportTemplate) => {
    const period = rep.year === "2025-26" ? selectedYear : rep.year;
    if (rep.format.includes("CSV") || rep.format.includes("Excel")) {
      downloadCsv(`${rep.title.replace(/[^\w]+/g, "_")}_${period}.csv`, [
        ["Report", "Category", "Academic Period", "Format"],
        [rep.title, rep.type, period, rep.format],
      ]);
    } else {
      setPrintGeneratedOn(new Date().toLocaleDateString());
      setPrintReport(rep);
    }
  };

  if (printReport) {
    const period = printReport.year === "2025-26" ? selectedYear : printReport.year;
    return (
      <div className="bg-muted/30 min-h-screen px-4 py-8 print:bg-white print:p-0">
        <div className="mx-auto mb-4 flex max-w-2xl justify-end gap-2 print:hidden">
          <Button variant="outline" onClick={() => setPrintReport(null)}>
            Close
          </Button>
          <Button onClick={() => window.print()} className="gap-1.5">
            <Printer className="size-4" /> Print
          </Button>
        </div>

        <div className="border-border bg-surface mx-auto max-w-2xl rounded-lg border p-8 shadow-sm print:rounded-none print:border-0 print:p-0 print:shadow-none">
          <div className="border-border mb-6 flex items-center justify-between border-b pb-4">
            <div>
              <p className="font-heading text-foreground text-lg font-bold">Our College</p>
              <p className="text-muted-foreground text-xs">NAAC & IQAC Accreditation Dossier</p>
            </div>
            <p className="border-border rounded-md border px-3 py-1 text-sm font-semibold">{printReport.format}</p>
          </div>

          <h2 className="text-foreground mb-4 text-lg font-semibold">{printReport.title}</h2>

          <table className="w-full border-collapse text-sm">
            <tbody>
              <tr className="border-border border-y">
                <td className="text-muted-foreground p-2 font-medium">Category</td>
                <td className="p-2 text-right">{printReport.type}</td>
              </tr>
              <tr className="border-border border-b">
                <td className="text-muted-foreground p-2 font-medium">Academic Period</td>
                <td className="p-2 text-right">{period}</td>
              </tr>
              <tr className="border-border border-b">
                <td className="text-muted-foreground p-2 font-medium">Generated On</td>
                <td className="p-2 text-right">{printGeneratedOn}</td>
              </tr>
            </tbody>
          </table>

          <p className="text-muted-foreground mt-6 text-xs">
            This is a system-generated accreditation dossier cover sheet produced from demo NAAC data for illustration
            purposes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              NAAC Reports & Compliance Dossiers
            </h1>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              Institutional Exporter
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate and export statutory accreditation reports in standard NAAC, AQAR, and SSR upload formats.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32 h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025-26">2025-26</SelectItem>
              <SelectItem value="2024-25">2024-25</SelectItem>
              <SelectItem value="2023-24">2023-24</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile Reports Card List (< md) */}
      <div className="md:hidden space-y-3">
        {REPORT_TEMPLATES.map((rep) => (
          <Card key={rep.id} className="border-border/70 p-3.5 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 min-w-0">
                <FileText className="size-4 text-primary shrink-0 mt-0.5" />
                <h4 className="font-semibold text-xs sm:text-sm text-foreground">{rep.title}</h4>
              </div>
              <Badge variant="outline" className="text-[10px] shrink-0">
                {rep.type}
              </Badge>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-2">
              <span>Period: <strong className="text-foreground">{rep.year === "2025-26" ? selectedYear : rep.year}</strong></span>
              <span>Format: <strong className="text-foreground">{rep.format}</strong></span>
            </div>

            <div className="mt-3 flex items-center justify-end border-t border-border/50 pt-2">
              <Button size="xs" variant="outline" onClick={() => downloadReport(rep)} className="gap-1">
                <Download className="size-3" />
                <span>Export Dossier</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop Reports Table (md+) */}
      <div className="hidden md:block">
        <ResponsiveTableContainer>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="font-semibold min-w-[260px]">Report Name</TableHead>
                <TableHead className="font-semibold min-w-[110px]">Category</TableHead>
                <TableHead className="font-semibold min-w-[130px]">Assessment Period</TableHead>
                <TableHead className="font-semibold min-w-[120px]">Format</TableHead>
                <TableHead className="font-semibold text-right min-w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {REPORT_TEMPLATES.map((rep) => (
                <TableRow key={rep.id} className="hover:bg-muted/20">
                  <TableCell className="font-bold text-xs sm:text-sm text-foreground">
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-primary shrink-0" />
                      <span>{rep.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {rep.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {rep.year === "2025-26" ? selectedYear : rep.year}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-foreground">
                    {rep.format}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="xs" variant="outline" onClick={() => downloadReport(rep)} className="gap-1">
                      <Download className="size-3" /> Export
                    </Button>
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
