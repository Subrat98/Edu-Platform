import { useState, useEffect, useRef } from "react";
import {
  Search,
  UploadCloud,
  FileText,
  FileUp,
  Eye,
  Trash2,
  Download,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveTableContainer } from "@/components/admin/ResponsiveTableContainer";
import {
  getEvidenceList,
  uploadEvidenceDocument,
  updateEvidenceStatus,
  deleteEvidenceDocument,
} from "@/features/naac/naacService";
import type { NaacEvidenceDocument, EvidenceStatus, NaacCriterionId } from "@/types";

export default function EvidenceRepositoryPage() {
  const [evidence, setEvidence] = useState<NaacEvidenceDocument[]>([]);
  const [, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCriterion, setSelectedCriterion] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docTitle, setDocTitle] = useState("");
  const [docCriterion, setDocCriterion] = useState<NaacCriterionId>(1);
  const [docMetric, setDocMetric] = useState("1.1.1");
  const [docDept, setDocDept] = useState("Academics & IQAC");
  const [docYear, setDocYear] = useState("2025-26");
  const [docType, setDocType] = useState<NaacEvidenceDocument["documentType"]>("PDF");
  const [docDesc, setDocDesc] = useState("");
  const [docRemarks, setDocRemarks] = useState("");

  const [previewDoc, setPreviewDoc] = useState<NaacEvidenceDocument | null>(null);

  const loadData = () => {
    setLoading(true);
    getEvidenceList({
      criterionId: selectedCriterion !== "all" ? (Number(selectedCriterion) as NaacCriterionId) : undefined,
      status: selectedStatus !== "all" ? (selectedStatus as EvidenceStatus) : undefined,
      search: search || undefined,
    })
      .then((data) => setEvidence(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [selectedCriterion, selectedStatus, search]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFile) return;
    await uploadEvidenceDocument(
      {
        criterionId: docCriterion,
        indicatorCode: docMetric.slice(0, 3),
        metricCode: docMetric,
        title: docTitle,
        academicYear: docYear,
        department: docDept,
        documentType: docType,
        description: docDesc,
        remarks: docRemarks,
        fileName: docFile.name,
        fileSize: `${Math.max(1, Math.round(docFile.size / 1024))} KB`,
        evidenceUrl: URL.createObjectURL(docFile),
        uploadedBy: "Dr. Snigdha Mohanty",
      },
      { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" }
    );
    setUploadModalOpen(false);
    setDocFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    loadData();
  };

  const handleStatusChange = async (id: string, newStatus: EvidenceStatus) => {
    await updateEvidenceStatus(
      id,
      newStatus,
      { name: "Dr. Himansu Sekhar Das", role: "Principal" },
      `Status updated to ${newStatus}`
    );
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this document from the NAAC repository?")) {
      await deleteEvidenceDocument(id, { name: "Dr. Snigdha Mohanty", role: "IQAC Coordinator" });
      loadData();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Centralized NAAC Evidence Repository
            </h1>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              Evidentiary Vault
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Multi-stage document vault with tamper-evident status workflows, department filters, and DVV linking.
          </p>
        </div>

        <Button onClick={() => setUploadModalOpen(true)} className="gap-1.5 self-start sm:self-auto shrink-0">
          <UploadCloud className="size-4" />
          <span>Upload Evidence</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-border/60 shadow-xs">
        <CardContent className="p-3 sm:p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, metric or file name..."
                className="pl-9 h-9 text-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div>
              <Select value={selectedCriterion} onValueChange={setSelectedCriterion}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="All Criteria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All 7 Criteria</SelectItem>
                  <SelectItem value="1">Criterion 1 (Curricular)</SelectItem>
                  <SelectItem value="2">Criterion 2 (Teaching)</SelectItem>
                  <SelectItem value="3">Criterion 3 (Research)</SelectItem>
                  <SelectItem value="4">Criterion 4 (Infrastructure)</SelectItem>
                  <SelectItem value="5">Criterion 5 (Student Support)</SelectItem>
                  <SelectItem value="6">Criterion 6 (Governance)</SelectItem>
                  <SelectItem value="7">Criterion 7 (Values)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Uploaded">Uploaded</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Verified">Verified by IQAC</SelectItem>
                  <SelectItem value="Approved">Approved by Principal</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between sm:justify-end text-xs text-muted-foreground">
              <span>Total Documents:</span>
              <strong className="ml-1 text-foreground font-semibold">{evidence.length}</strong>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Card List View (Visible on phones < md) */}
      <div className="md:hidden space-y-3">
        {evidence.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground text-sm">
            No evidence documents match your filter.
          </Card>
        ) : (
          evidence.map((doc) => (
            <Card key={doc.id} className="border-border/70 p-3.5 shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 min-w-0">
                  <FileText className="size-4 text-primary shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-semibold text-xs text-foreground line-clamp-2">{doc.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{doc.fileName} · {doc.fileSize}</p>
                  </div>
                </div>
                <Badge
                  className={
                    doc.status === "Approved"
                      ? "bg-emerald-600 text-white shrink-0 text-[10px]"
                      : doc.status === "Verified"
                      ? "bg-blue-600 text-white shrink-0 text-[10px]"
                      : doc.status === "Under Review"
                      ? "bg-amber-600 text-white shrink-0 text-[10px]"
                      : "bg-slate-600 text-white shrink-0 text-[10px]"
                  }
                >
                  {doc.status}
                </Badge>
              </div>

              <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs border-t border-border/50 pt-2">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-medium block">Metric</span>
                  <Badge variant="outline" className="text-[10px] px-1 py-0 mt-0.5">
                    C{doc.criterionId} · {doc.metricCode}
                  </Badge>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-medium block">Dept & Year</span>
                  <span className="text-[11px] font-medium text-foreground truncate block">
                    {doc.department} ({doc.academicYear})
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-muted-foreground uppercase font-medium block">Uploaded By</span>
                  <span className="text-[11px] text-foreground">
                    {doc.uploadedBy} · {doc.uploadDate}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-1.5 border-t border-border/50 pt-2">
                <Button size="xs" variant="outline" onClick={() => setPreviewDoc(doc)} className="gap-1">
                  <Eye className="size-3" />
                  <span>Preview</span>
                </Button>
                {doc.status !== "Approved" && (
                  <Button size="xs" variant="default" onClick={() => handleStatusChange(doc.id, "Verified")}>
                    Verify
                  </Button>
                )}
                {doc.status !== "Approved" && (
                  <Button size="xs" variant="ghost" onClick={() => handleDelete(doc.id)} className="text-rose-500 hover:text-rose-600">
                    <Trash2 className="size-3" />
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Desktop Structured Data Table (Visible on md and above) */}
      <div className="hidden md:block">
        <ResponsiveTableContainer>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="font-semibold min-w-[220px]">Document Title</TableHead>
                <TableHead className="font-semibold min-w-[110px]">Metric</TableHead>
                <TableHead className="font-semibold min-w-[130px]">Department</TableHead>
                <TableHead className="font-semibold min-w-[90px]">Year</TableHead>
                <TableHead className="font-semibold min-w-[150px]">Uploader & Date</TableHead>
                <TableHead className="font-semibold min-w-[110px]">Status</TableHead>
                <TableHead className="font-semibold text-right min-w-[130px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evidence.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-muted/20">
                  <TableCell className="align-top">
                    <div className="flex items-start gap-2">
                      <FileText className="size-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-xs sm:text-sm text-foreground line-clamp-1">{doc.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{doc.fileName} · {doc.fileSize}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge variant="outline" className="text-xs">
                      C{doc.criterionId} · {doc.metricCode}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground align-top">
                    {doc.department}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground align-top">
                    {doc.academicYear}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground align-top">
                    <p className="font-medium text-foreground">{doc.uploadedBy}</p>
                    <p className="text-[10px]">{doc.uploadDate}</p>
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge
                      className={
                        doc.status === "Approved"
                          ? "bg-emerald-600 text-white"
                          : doc.status === "Verified"
                          ? "bg-blue-600 text-white"
                          : doc.status === "Under Review"
                          ? "bg-amber-600 text-white"
                          : "bg-slate-600 text-white"
                      }
                    >
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right align-top">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="xs" variant="ghost" onClick={() => setPreviewDoc(doc)}>
                        <Eye className="size-3" />
                      </Button>
                      {doc.status !== "Approved" && (
                        <Button size="xs" variant="outline" onClick={() => handleStatusChange(doc.id, "Verified")}>
                          Verify
                        </Button>
                      )}
                      {doc.status !== "Approved" && (
                        <Button size="xs" variant="ghost" onClick={() => handleDelete(doc.id)} className="text-rose-500">
                          <Trash2 className="size-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ResponsiveTableContainer>
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload NAAC Supporting Evidence</DialogTitle>
            <DialogDescription>
              Attach formal committee minutes, geo-tagged photos, or spreadsheets to NAAC metrics.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpload} className="space-y-4 pt-2">
            <div>
              <Label>File</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,image/*,.doc,.docx,.xls,.xlsx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setDocFile(file);
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full justify-start gap-1.5 font-normal"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileUp className="size-4" />
                {docFile ? docFile.name : "Choose a file to attach…"}
              </Button>
              {!docFile && <p className="text-muted-foreground mt-1 text-xs">Required — pick the evidence document from your device.</p>}
            </div>

            <div>
              <Label htmlFor="docTitle">Document Title</Label>
              <Input
                id="docTitle"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="e.g. BoS Minutes on CBCS Elective Revisions"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="docCriterion">Target Criterion</Label>
                <Select
                  value={String(docCriterion)}
                  onValueChange={(val) => setDocCriterion(Number(val) as NaacCriterionId)}
                >
                  <SelectTrigger id="docCriterion">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Criterion 1 (Curriculum)</SelectItem>
                    <SelectItem value="2">Criterion 2 (Teaching-Learning)</SelectItem>
                    <SelectItem value="3">Criterion 3 (Research)</SelectItem>
                    <SelectItem value="4">Criterion 4 (Infrastructure)</SelectItem>
                    <SelectItem value="5">Criterion 5 (Student Support)</SelectItem>
                    <SelectItem value="6">Criterion 6 (Governance)</SelectItem>
                    <SelectItem value="7">Criterion 7 (Values)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="docMetric">Metric Code</Label>
                <Input
                  id="docMetric"
                  value={docMetric}
                  onChange={(e) => setDocMetric(e.target.value)}
                  placeholder="e.g. 1.1.2 or 3.3.1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="docDept">Department</Label>
                <Input id="docDept" value={docDept} onChange={(e) => setDocDept(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="docYear">Academic Year</Label>
                <Input id="docYear" value={docYear} onChange={(e) => setDocYear(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="docType">Format</Label>
                <Select
                  value={docType}
                  onValueChange={(v) => setDocType(v as NaacEvidenceDocument["documentType"])}
                >
                  <SelectTrigger id="docType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="Spreadsheet">Excel / CSV</SelectItem>
                    <SelectItem value="GeoPhoto">Geo-Tagged Photo</SelectItem>
                    <SelectItem value="Scan">Signed Certificate</SelectItem>
                    <SelectItem value="WebLink">Web Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="docDesc">Description / Context</Label>
              <Textarea
                id="docDesc"
                rows={2}
                value={docDesc}
                onChange={(e) => setDocDesc(e.target.value)}
                placeholder="Brief summary of document contents and DVV relevance..."
              />
            </div>

            <div>
              <Label htmlFor="docRemarks">Internal IQAC Remarks</Label>
              <Input
                id="docRemarks"
                value={docRemarks}
                onChange={(e) => setDocRemarks(e.target.value)}
                placeholder="Optional remarks on verification status..."
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setUploadModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!docFile}>
                Submit & Index File
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      {previewDoc && (
        <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="size-5 text-primary" />
                <span className="truncate">{previewDoc.title}</span>
              </DialogTitle>
              <DialogDescription>
                Metric {previewDoc.metricCode} · {previewDoc.department} · {previewDoc.academicYear}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2 text-sm">
              <div className="rounded-lg bg-muted/40 p-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verification Status:</span>
                  <Badge variant="outline" className="font-semibold">{previewDoc.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">File Name:</span>
                  <span className="font-mono text-foreground">{previewDoc.fileName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">File Size:</span>
                  <span>{previewDoc.fileSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uploaded By:</span>
                  <span>{previewDoc.uploadedBy} on {previewDoc.uploadDate}</span>
                </div>
              </div>

              {previewDoc.description && (
                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Description</h4>
                  <p className="mt-1 text-xs text-foreground/90">{previewDoc.description}</p>
                </div>
              )}

              {previewDoc.remarks && (
                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">IQAC Audit Notes</h4>
                  <p className="mt-1 text-xs text-foreground/90">{previewDoc.remarks}</p>
                </div>
              )}

              <div className="rounded-md border border-dashed border-border p-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Simulated cloud storage link: <code className="text-primary">{previewDoc.evidenceUrl}</code>
                </p>
                <Button size="sm" variant="outline" className="mt-3 gap-1.5" asChild>
                  <a href={previewDoc.evidenceUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="size-3.5" />
                    Download File Dossier
                  </a>
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setPreviewDoc(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
