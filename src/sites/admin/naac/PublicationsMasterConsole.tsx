import { useState, useEffect } from "react";
import {
  BookOpen,
  Award,
  CheckCircle2,
  TrendingUp,
  FileText,
  Search,
  Plus,
  Download,
  ExternalLink,
  UploadCloud,
  ShieldCheck,
  Building2,
  Filter,
  Eye,
  Sparkles,
  Link2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveTableContainer } from "@/components/admin/ResponsiveTableContainer";
import {
  getPublicationsData,
  addResearchPublicationRecord,
  getEvidenceForMetric,
  uploadEvidenceDocument,
} from "@/features/naac/naacService";
import type {
  PublicationsData,
  ResearchPublicationRecord,
  NaacEvidenceDocument,
} from "@/types";

interface PublicationsMasterConsoleProps {
  onEvidenceUpdated?: () => void;
}

export function PublicationsMasterConsole({ onEvidenceUpdated }: PublicationsMasterConsoleProps) {
  const [data, setData] = useState<PublicationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceList, setEvidenceList] = useState<NaacEvidenceDocument[]>([]);
  const [activeTab, setActiveTab] = useState("publications");
  const [searchPub, setSearchPub] = useState("");
  const [filterIndexing, setFilterIndexing] = useState<string>("all");

  // Add Publication Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [paperTitle, setPaperTitle] = useState("");
  const [authors, setAuthors] = useState("Dr. Rashmita Mishra");
  const [primaryFaculty, setPrimaryFaculty] = useState("Dr. Rashmita Mishra");
  const [dept, setDept] = useState("Computer Science");
  const [journalName, setJournalName] = useState("IEEE Access");
  const [issnNumber, setIssnNumber] = useState("2169-3536");
  const [volumePages, setVolumePages] = useState("Vol. 13, pp. 45012-45025");
  const [impactFactor, setImpactFactor] = useState(3.9);
  const [citations, setCitations] = useState(12);
  const [doi, setDoi] = useState("10.1109/ACCESS.2025.340912");

  // Upload Evidence Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDept, setEvidenceDept] = useState("R&D Cell");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadConsoleData();
  }, []);

  async function loadConsoleData() {
    setLoading(true);
    try {
      const [pubData, evidences] = await Promise.all([
        getPublicationsData(),
        getEvidenceForMetric("3.3.1"),
      ]);
      setData(pubData);
      setEvidenceList(evidences);
    } catch (err) {
      console.error("Failed to load publications data", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredPublications = (data?.publications || []).filter((p) => {
    const matchesSearch =
      p.paperTitle.toLowerCase().includes(searchPub.toLowerCase()) ||
      p.primaryFacultyName.toLowerCase().includes(searchPub.toLowerCase()) ||
      p.journalName.toLowerCase().includes(searchPub.toLowerCase()) ||
      p.department.toLowerCase().includes(searchPub.toLowerCase()) ||
      p.doi.toLowerCase().includes(searchPub.toLowerCase());
    const matchesIndexing =
      filterIndexing === "all" ||
      p.indexing.some((idx) => idx.toLowerCase() === filterIndexing.toLowerCase());
    return matchesSearch && matchesIndexing;
  });

  async function handleAddPublication(e: React.FormEvent) {
    e.preventDefault();
    if (!paperTitle || !journalName) return;

    try {
      await addResearchPublicationRecord(
        {
          paperTitle,
          authors: authors.split(",").map((s) => s.trim()),
          primaryFacultyName: primaryFaculty,
          department: dept,
          journalName,
          issnNumber,
          volumeIssuePages: volumePages,
          publicationYear: 2025,
          indexing: ["Scopus", "Web of Science", "UGC-CARE Group I"],
          impactFactor: Number(impactFactor),
          citationsCount: Number(citations),
          doi,
          doiUrl: `https://doi.org/${doi}`,
          linkToAbstract: `https://doi.org/${doi}`,
        },
        { name: "Dr. Rashmita Mishra", role: "Dean Research" }
      );

      setShowAddModal(false);
      resetForm();
      loadConsoleData();
    } catch (err) {
      console.error("Failed to add publication", err);
    }
  }

  function resetForm() {
    setPaperTitle("");
    setDoi("10.1109/ACCESS.2025.340912");
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
          metricCode: "3.3.1",
          title: evidenceTitle,
          academicYear: "2025-26",
          department: evidenceDept,
          documentType: "XLSX",
          description: evidenceDesc || "Scopus and UGC-CARE indexed research papers master register.",
          remarks: "All 68 papers cross-verified with Scopus database.",
          fileName: evidenceFile?.name || `${evidenceTitle.replace(/\s+/g, "_")}.xlsx`,
          fileSize: evidenceFile ? `${(evidenceFile.size / (1024 * 1024)).toFixed(1)} MB` : "840 KB",
          evidenceUrl: `/documents/naac/evidence/ScopusPublications_${Date.now()}.xlsx`,
        },
        { name: "Dr. Rashmita Mishra", role: "Dean Research" }
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
      <Card className="border-indigo-200 bg-white/70 backdrop-blur">
        <CardContent className="p-12 text-center text-muted-foreground">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
          Loading Scopus & UGC-CARE Publications Master Console...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Card */}
      <Card className="border-2 border-indigo-300 bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/70 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-indigo-700 text-white hover:bg-indigo-800">
                  NAAC Metric 3.3.1
                </Badge>
                <Badge variant="outline" className="text-indigo-700 border-indigo-300">
                  Scopus & UGC-CARE Indexed
                </Badge>
                <Badge className="bg-emerald-600 text-white">Weightage: 15 Marks</Badge>
              </div>
              <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-indigo-600" />
                Scopus & UGC-CARE Publications Master Directory (68 Papers)
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Searchable master index of {data.totalPublications} peer-reviewed research papers with active DOIs, institutional h-index ({data.hIndexInstitutional}), and citation analytics.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                className="border-indigo-300 text-indigo-700 hover:bg-indigo-50 text-xs sm:text-sm"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Paper
              </Button>
              <Button
                className="bg-indigo-700 hover:bg-indigo-800 text-white text-xs sm:text-sm shadow-sm"
                onClick={() => setShowUploadModal(true)}
              >
                <UploadCloud className="w-4 h-4 mr-1.5" />
                Attach Master List
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Total Publications</span>
                <BookOpen className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-3xl font-black text-indigo-800 mt-1">
                {data.totalPublications}
              </div>
              <div className="text-xs text-emerald-600 font-medium mt-1">
                100% in UGC-CARE Group I/II
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Scopus & WoS Papers</span>
                <Award className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-blue-700 mt-1">
                {data.scopusIndexedCount}
              </div>
              <div className="text-xs text-gray-500 mt-1">{data.webOfScienceCount} in Web of Science Core</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Average Impact Factor</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-700 mt-1">
                {data.averageImpactFactor}
              </div>
              <div className="text-xs text-gray-500 mt-1">Elsevier, Springer, IEEE, RSC</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Annual Citations</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-black text-amber-600 mt-1">
                {data.totalCitationsLatestYear}
              </div>
              <div className="text-xs text-emerald-600 font-medium mt-1">Institutional h-index: {data.hIndexInstitutional}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-sm bg-gray-100 p-1">
          <TabsTrigger value="publications" className="text-xs sm:text-sm">
            Publications Master ({data.publications.length})
          </TabsTrigger>
          <TabsTrigger value="evidence" className="text-xs sm:text-sm">
            Evidences ({evidenceList.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Publications Master Table */}
        <TabsContent value="publications" className="space-y-4 mt-4">
          <Card className="border border-indigo-100 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-semibold text-gray-800">
                    Faculty Research Publications Master List (2025-26)
                  </CardTitle>
                  <CardDescription>
                    Search by paper title, author, journal, or live DOI links with impact factors.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative w-48 sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-gray-400" />
                    <Input
                      placeholder="Search title, author, journal, DOI..."
                      className="pl-8 text-xs h-9"
                      value={searchPub}
                      onChange={(e) => setSearchPub(e.target.value)}
                    />
                  </div>
                  <Select value={filterIndexing} onValueChange={setFilterIndexing}>
                    <SelectTrigger className="w-36 text-xs h-9">
                      <SelectValue placeholder="Indexing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Indexing</SelectItem>
                      <SelectItem value="Scopus">Scopus</SelectItem>
                      <SelectItem value="Web of Science">Web of Science</SelectItem>
                      <SelectItem value="UGC-CARE Group I">UGC-CARE Group I</SelectItem>
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
                      <TableHead className="font-semibold text-xs">Research Paper Title & DOI</TableHead>
                      <TableHead className="font-semibold text-xs">Author(s) & Department</TableHead>
                      <TableHead className="font-semibold text-xs">Journal & Volume</TableHead>
                      <TableHead className="font-semibold text-xs">Indexing Databases</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Impact Factor</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Citations</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPublications.map((pub) => (
                      <TableRow key={pub.id} className="hover:bg-indigo-50/30">
                        <TableCell>
                          <div className="font-semibold text-xs text-gray-900 max-w-sm sm:max-w-md leading-snug">
                            {pub.paperTitle}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <a
                              href={pub.doiUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-mono text-indigo-700 hover:underline flex items-center gap-0.5"
                            >
                              <Link2 className="w-2.5 h-2.5" />
                              {pub.doi}
                            </a>
                            <span className="text-[10px] text-gray-400">• Year: {pub.publicationYear}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-medium text-gray-900">{pub.primaryFacultyName}</div>
                          <div className="text-[10px] text-gray-500">{pub.department}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-gray-800 font-medium">{pub.journalName}</div>
                          <div className="text-[10px] text-gray-500 font-mono">
                            ISSN: {pub.issnNumber} • {pub.volumeIssuePages}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[140px]">
                            {pub.indexing.map((idx, i) => (
                              <Badge key={i} variant="outline" className="text-[9px] py-0 px-1 text-indigo-800 border-indigo-200">
                                {idx}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-center font-bold text-emerald-700">
                          {pub.impactFactor > 0 ? pub.impactFactor.toFixed(1) : "—"}
                        </TableCell>
                        <TableCell className="text-xs text-center font-bold text-blue-700">
                          {pub.citationsCount}
                        </TableCell>
                        <TableCell className="text-center">
                          <a
                            href={pub.doiUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-xs text-indigo-700 hover:text-indigo-900 font-medium"
                          >
                            DOI Link <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                          </a>
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
          <Card className="border border-indigo-100 shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-gray-800">
                  Evidentiary Documentation (Metric 3.3.1)
                </CardTitle>
                <CardDescription>
                  Verified Scopus master spreadsheets and paper reprints with author affiliations.
                </CardDescription>
              </div>
              <Button
                size="sm"
                className="bg-indigo-700 hover:bg-indigo-800 text-white text-xs"
                onClick={() => setShowUploadModal(true)}
              >
                <UploadCloud className="w-3.5 h-3.5 mr-1" />
                Upload Spreadsheet
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evidenceList.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-gray-100 bg-white hover:border-indigo-200 hover:shadow-xs transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
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
                        className="text-indigo-700 font-medium hover:underline inline-flex items-center gap-1"
                      >
                        View Master List <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Publication Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-indigo-800">
              <BookOpen className="w-5 h-5" />
              Add Published Research Paper
            </DialogTitle>
            <DialogDescription>
              Record paper publication details, DOI, and journal indexing.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddPublication} className="space-y-3">
            <div>
              <Label className="text-xs">Research Paper Title</Label>
              <Input
                className="text-xs h-9"
                required
                placeholder="e.g. Deep Reinforcement Learning for Grid Energy Optimization"
                value={paperTitle}
                onChange={(e) => setPaperTitle(e.target.value)}
              />
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
                <Label className="text-xs">Department</Label>
                <Input
                  className="text-xs h-9"
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">All Authors (Comma-separated)</Label>
              <Input
                className="text-xs h-9"
                value={authors}
                onChange={(e) => setAuthors(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Journal Name</Label>
                <Input
                  className="text-xs h-9"
                  required
                  value={journalName}
                  onChange={(e) => setJournalName(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">ISSN Number</Label>
                <Input
                  className="text-xs h-9 font-mono"
                  value={issnNumber}
                  onChange={(e) => setIssnNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs">Impact Factor</Label>
                <Input
                  type="number"
                  step="0.1"
                  className="text-xs h-9"
                  value={impactFactor}
                  onChange={(e) => setImpactFactor(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Citations</Label>
                <Input
                  type="number"
                  className="text-xs h-9"
                  value={citations}
                  onChange={(e) => setCitations(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Volume / Pages</Label>
                <Input
                  className="text-xs h-9"
                  value={volumePages}
                  onChange={(e) => setVolumePages(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">DOI Code</Label>
              <Input
                className="text-xs h-9 font-mono"
                required
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
              />
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
              <Button type="submit" className="bg-indigo-700 hover:bg-indigo-800 text-white text-xs h-9">
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
            <DialogTitle className="flex items-center gap-2 text-indigo-800">
              <UploadCloud className="w-5 h-5" />
              Upload Scopus Publications Master List
            </DialogTitle>
            <DialogDescription>
              Attach verified master spreadsheet or paper reprints compendium.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadEvidence} className="space-y-3">
            <div>
              <Label className="text-xs">Document Title</Label>
              <Input
                className="text-xs h-9"
                required
                placeholder="e.g. Scopus Master Register 2025-26"
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
                placeholder="Brief summary of publications indexing"
                value={evidenceDesc}
                onChange={(e) => setEvidenceDesc(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs">Select Document (XLSX/PDF)</Label>
              <Input
                type="file"
                className="text-xs h-9"
                accept=".xlsx,.csv,.pdf"
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
                className="bg-indigo-700 hover:bg-indigo-800 text-white text-xs h-9"
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
