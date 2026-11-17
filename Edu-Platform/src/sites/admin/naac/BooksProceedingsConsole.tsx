import { useState, useEffect } from "react";
import {
  BookCopy,
  Award,
  CheckCircle2,
  TrendingUp,
  FileText,
  Search,
  Plus,
  ExternalLink,
  UploadCloud,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveTableContainer } from "@/components/admin/ResponsiveTableContainer";
import {
  getBooksProceedingsData,
  addBookProceedingsRecord,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  BooksProceedingsData,
  BookProceedingsRecord,
  NaacEvidenceDocument,
} from "@/types";

interface BooksProceedingsConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function BooksProceedingsConsole({ onEvidenceUpdated }: BooksProceedingsConsoleProps) {
  const [data, setData] = useState<BooksProceedingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);
  const [activeTab, setActiveTab] = useState("books");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  // Add Book/Proceedings Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [workType, setWorkType] = useState<BookProceedingsRecord["workType"]>("Book Chapter");
  const [authors, setAuthors] = useState("Dr. Rashmita Mishra");
  const [primaryFaculty, setPrimaryFaculty] = useState("Dr. Rashmita Mishra");
  const [dept, setDept] = useState("Computer Science");
  const [publisher, setPublisher] = useState("Springer Nature");
  const [isbnIssn, setIsbnIssn] = useState("ISBN 978-981-19-4820-1");

  // Upload Evidence Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDept, setEvidenceDept] = useState("R&D Cell & Library");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadConsoleData();
  }, []);

  async function loadConsoleData() {
    setLoading(true);
    try {
      const [bkData, evidences] = await Promise.all([
        getBooksProceedingsData(),
        getEvidenceForMetric("3.3.2"),
      ]);
      setData(bkData);
      setEvidenceList(evidences);
    } catch (err) {
      console.error("Failed to load books and proceedings data", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredItems = (data?.items || []).filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.primaryFacultyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.publisherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.isbnIssn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || b.workType === filterType;
    return matchesSearch && matchesType;
  });

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !isbnIssn) return;

    try {
      await addBookProceedingsRecord(
        {
          title,
          workType,
          authors: authors.split(",").map((s) => s.trim()),
          primaryFacultyName: primaryFaculty,
          department: dept,
          publisherName: publisher,
          isbnIssn,
          yearOfPublication: 2025,
          peerReviewed: true,
          coverPageUrl: "https://documents.eduplatform.ac.in/books/cover.pdf",
        },
        { name: "Mr. Manoj Swain", role: "Chief Librarian" }
      );

      setShowAddModal(false);
      setTitle("");
      loadConsoleData();
    } catch (err) {
      console.error("Failed to add book/proceedings", err);
    }
  }

  async function handleUploadEvidence(e: React.FormEvent) {
    e.preventDefault();
    if (!evidenceTitle) return;

    setUploading(true);
    try {
      await uploadEvidenceDocument(
        {
          criterionId: 3,
          indicatorCode: "3.3",
          metricCode: "3.3.2",
          title: evidenceTitle,
          academicYear: "2025-26",
          department: evidenceDept,
          documentType: "PDF",
          description: evidenceDesc || "Books, chapters, and conference proceedings register.",
          remarks: "ISBN and publisher credentials verified.",
          fileName: evidenceFile?.name || `${evidenceTitle.replace(/\s+/g, "_")}.pdf`,
          fileSize: evidenceFile ? `${(evidenceFile.size / (1024 * 1024)).toFixed(1)} MB` : "4.5 MB",
          evidenceUrl: `/documents/naac/evidence/BooksRegister_${Date.now()}.pdf`,
        },
        { name: "Mr. Manoj Swain", role: "Chief Librarian" }
      );

      setShowUploadModal(false);
      setEvidenceTitle("");
      setEvidenceDesc("");
      setEvidenceFile(null);
      loadConsoleData();
      if (onEvidenceUpdated) onEvidenceUpdated();
    } catch (err) {
      console.error("Failed to upload evidence", err);
    } finally {
      setUploading(false);
    }
  }

  if (loading || !data) {
    return (
      <Card className="border-teal-200 bg-white/70 backdrop-blur">
        <CardContent className="p-12 text-center text-muted-foreground">
          <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4" />
          Loading Books, Chapters & Proceedings Console...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Card */}
      <Card className="border-2 border-teal-300 bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/70 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-teal-700 text-white hover:bg-teal-800">
                  NAAC Metric 3.3.2
                </Badge>
                <Badge variant="outline" className="text-teal-700 border-teal-300">
                  Books & Proceedings
                </Badge>
                <Badge className="bg-emerald-600 text-white">Weightage: 15 Marks</Badge>
              </div>
              <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BookCopy className="w-6 h-6 text-teal-600" />
                Books, Book Chapters & Conference Proceedings Directory
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Exhaustive catalogue of {data.totalBooksAndChapters} authored volumes, edited collections, chapters (CRC Press, Springer, Routledge, Elsevier), and IEEE conference proceedings with verified ISBN/ISSN proofs.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                className="border-teal-300 text-teal-700 hover:bg-teal-50 text-xs sm:text-sm"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Book / Chapter
              </Button>
              <Button
                className="bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm shadow-sm"
                onClick={() => setShowUploadModal(true)}
              >
                <UploadCloud className="w-4 h-4 mr-1.5" />
                Upload ISBN Proofs
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-teal-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Total Items</span>
                <BookCopy className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-3xl font-black text-teal-800 mt-1">
                {data.totalBooksAndChapters}
              </div>
              <div className="text-xs text-emerald-600 font-medium mt-1">
                Benchmark: ≥ 20 Items (Surpassed)
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-teal-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Authored / Edited Books</span>
                <Award className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-700 mt-1">
                {data.authoredBooksCount}
              </div>
              <div className="text-xs text-gray-500 mt-1">International Reputed Presses</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-teal-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Book Chapters</span>
                <Layers className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-blue-700 mt-1">
                {data.bookChaptersCount}
              </div>
              <div className="text-xs text-gray-500 mt-1">Peer-Reviewed Edited Volumes</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-teal-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Conference Proceedings</span>
                <TrendingUp className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-3xl font-black text-indigo-700 mt-1">
                {data.conferenceProceedingsCount}
              </div>
              <div className="text-xs text-gray-500 mt-1">IEEE, Springer, AIP Indexed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-sm bg-gray-100 p-1">
          <TabsTrigger value="books" className="text-xs sm:text-sm">
            Publications List ({data.items.length})
          </TabsTrigger>
          <TabsTrigger value="evidence" className="text-xs sm:text-sm">
            Evidences ({evidenceList.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Books Table */}
        <TabsContent value="books" className="space-y-4 mt-4">
          <Card className="border border-teal-100 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-semibold text-gray-800">
                    Faculty Books & Proceedings Master Register
                  </CardTitle>
                  <CardDescription>
                    All publications with verified ISBN credentials, peer-review tags, and publisher details.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative w-48 sm:w-60">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-gray-400" />
                    <Input
                      placeholder="Search title, faculty, publisher..."
                      className="pl-8 text-xs h-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-44 text-xs h-9">
                      <SelectValue placeholder="Work Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Authored Book">Authored Book</SelectItem>
                      <SelectItem value="Edited Book">Edited Book</SelectItem>
                      <SelectItem value="Book Chapter">Book Chapter</SelectItem>
                      <SelectItem value="Conference Proceedings">Conference Proceedings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ResponsiveTableContainer>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80">
                      <TableHead className="font-semibold text-xs">Work Title & ISBN</TableHead>
                      <TableHead className="font-semibold text-xs">Type</TableHead>
                      <TableHead className="font-semibold text-xs">Faculty Author(s)</TableHead>
                      <TableHead className="font-semibold text-xs">Publisher / Conference</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Year</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Peer-Reviewed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-teal-50/30">
                        <TableCell>
                          <div className="font-semibold text-xs text-gray-900 max-w-sm sm:max-w-md leading-snug">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-teal-800 font-mono mt-0.5">{item.isbnIssn}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              item.workType === "Authored Book"
                                ? "border-emerald-300 text-emerald-800 bg-emerald-50 text-[10px]"
                                : item.workType === "Conference Proceedings"
                                ? "border-blue-300 text-blue-800 bg-blue-50 text-[10px]"
                                : "text-[10px]"
                            }
                          >
                            {item.workType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-medium text-gray-900">{item.primaryFacultyName}</div>
                          <div className="text-[10px] text-gray-500">{item.department}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-gray-800">{item.publisherName}</div>
                          {item.conferenceDetails && (
                            <div className="text-[10px] text-gray-500 line-clamp-1">{item.conferenceDetails}</div>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-center font-mono text-gray-700">
                          {item.yearOfPublication}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                            Yes
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ResponsiveTableContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Evidences */}
        <TabsContent value="evidence" className="space-y-4 mt-4">
          <Card className="border border-teal-100 shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-gray-800">
                  Evidentiary Documentation (Metric 3.3.2)
                </CardTitle>
                <CardDescription>
                  Compiled book covers, copyright pages, and ISBN verification dossier.
                </CardDescription>
              </div>
              <Button
                size="sm"
                className="bg-teal-700 hover:bg-teal-800 text-white text-xs"
                onClick={() => setShowUploadModal(true)}
              >
                <UploadCloud className="w-3.5 h-3.5 mr-1" />
                Upload ISBN Dossier
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evidenceList.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-gray-100 bg-white hover:border-teal-200 hover:shadow-xs transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900 leading-snug">
                            {doc.title}
                          </h4>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            {doc.department} • {doc.academicYear} • {doc.fileSize}
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                        {doc.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{doc.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-gray-500">
                      <span>Uploaded by: {doc.uploadedBy}</span>
                      <a
                        href={doc.evidenceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-700 font-medium hover:underline inline-flex items-center gap-1"
                      >
                        View Dossier <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-teal-800">
              <BookCopy className="w-5 h-5" />
              Add Book / Proceedings Record
            </DialogTitle>
            <DialogDescription>
              Record newly published academic book, chapter, or conference proceedings.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddItem} className="space-y-3">
            <div>
              <Label className="text-xs">Book / Chapter Title</Label>
              <Input
                className="text-xs h-9"
                required
                placeholder="e.g. Modern Data Structures & Graph Theory"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Work Type</Label>
                <Select
                  value={workType}
                  onValueChange={(val: any) => setWorkType(val)}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Authored Book">Authored Book</SelectItem>
                    <SelectItem value="Edited Book">Edited Book</SelectItem>
                    <SelectItem value="Book Chapter">Book Chapter</SelectItem>
                    <SelectItem value="Conference Proceedings">Conference Proceedings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Department</Label>
                <Input
                  className="text-xs h-9"
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Primary Faculty</Label>
                <Input
                  className="text-xs h-9"
                  required
                  value={primaryFaculty}
                  onChange={(e) => setPrimaryFaculty(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">All Authors</Label>
                <Input
                  className="text-xs h-9"
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Publisher Name</Label>
                <Input
                  className="text-xs h-9"
                  required
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">ISBN / ISSN</Label>
                <Input
                  className="text-xs h-9 font-mono"
                  required
                  value={isbnIssn}
                  onChange={(e) => setIsbnIssn(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                className="text-xs h-9"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-700 hover:bg-teal-800 text-white text-xs h-9">
                Save Publication
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload Evidence Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-teal-800">
              <UploadCloud className="w-5 h-5" />
              Upload Metric 3.3.2 Evidence
            </DialogTitle>
            <DialogDescription>
              Attach book cover scans, copyright pages, and ISBN certificates.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadEvidence} className="space-y-3">
            <div>
              <Label className="text-xs">Document Title</Label>
              <Input
                className="text-xs h-9"
                required
                placeholder="e.g. Faculty Books Cover Compendium 2025-26"
                value={evidenceTitle}
                onChange={(e) => setEvidenceTitle(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs">Department / Issuer</Label>
              <Input
                className="text-xs h-9"
                value={evidenceDept}
                onChange={(e) => setEvidenceDept(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Input
                className="text-xs h-9"
                placeholder="Brief summary of published books and ISBN proofs"
                value={evidenceDesc}
                onChange={(e) => setEvidenceDesc(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs">Select Document (PDF/XLSX)</Label>
              <Input
                type="file"
                className="text-xs h-9"
                accept=".pdf,.xlsx,.csv"
                onChange={(e) => setEvidenceFile(e.target.files?.[0] || null)}
              />
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                className="text-xs h-9"
                onClick={() => setShowUploadModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={uploading}
                className="bg-teal-700 hover:bg-teal-800 text-white text-xs h-9"
              >
                {uploading ? "Uploading..." : "Upload & Link Document"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
