import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Search,
  ExternalLink,
  Award,
  Sparkles,
  Filter,
  Calendar,
  Building2,
  Users,
  CheckCircle2,
  TrendingUp,
  Quote,
  FileText,
  FileCheck2,
  Layers,
  ArrowUpDown,
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { FacultyGrid } from "@/components/sections/FacultyGrid";
import { RichText } from "@/components/sections/RichText";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { collegeHeroUrl } from "@/mocks/data/images";
import { collegeStaff } from "@/mocks/data/staff";
import { MOCK_PUBLICATIONS_DATA } from "@/mocks/data/naac/publications";
import { MOCK_RESEARCH_FUNDING_DATA } from "@/mocks/data/naac/researchFunding";
import type { ResearchPublicationRecord } from "@/types/naac";

export default function CollegeResearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndexing, setSelectedIndexing] = useState<string>("All");
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"citations" | "impact" | "newest" | "title">("citations");

  const researchers = [...collegeStaff]
    .filter((s) => (s.publications ?? 0) > 0)
    .sort((a, b) => (b.publications ?? 0) - (a.publications ?? 0))
    .slice(0, 8);

  const departments = useMemo(() => {
    const set = new Set<string>();
    MOCK_PUBLICATIONS_DATA.publications.forEach((p) => {
      if (p.department) set.add(p.department);
    });
    return ["All", ...Array.from(set).sort()];
  }, []);

  const indexingOptions = ["All", "Scopus", "Web of Science", "UGC-CARE Group I", "PubMed"];

  const filteredPublications = useMemo(() => {
    let list = MOCK_PUBLICATIONS_DATA.publications.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        p.paperTitle.toLowerCase().includes(q) ||
        p.authors.some((a) => a.toLowerCase().includes(q)) ||
        p.journalName.toLowerCase().includes(q) ||
        (p.issnNumber && p.issnNumber.toLowerCase().includes(q)) ||
        (p.doi && p.doi.toLowerCase().includes(q));

      const matchesIndexing =
        selectedIndexing === "All" ||
        (p.indexing && p.indexing.some((idx) => idx.toLowerCase().includes(selectedIndexing.toLowerCase())));

      const matchesDept = selectedDept === "All" || p.department === selectedDept;

      return matchesSearch && matchesIndexing && matchesDept;
    });

    list.sort((a, b) => {
      if (sortBy === "citations") return (b.citationsCount ?? 0) - (a.citationsCount ?? 0);
      if (sortBy === "impact") return (b.impactFactor ?? 0) - (a.impactFactor ?? 0);
      if (sortBy === "newest") return b.publicationYear - a.publicationYear;
      if (sortBy === "title") return a.paperTitle.localeCompare(b.paperTitle);
      return 0;
    });

    return list;
  }, [searchQuery, selectedIndexing, selectedDept, sortBy]);

  return (
    <>
      <Hero variant="compact" title="Research, Innovations & Publications" imageUrl={collegeHeroUrl(1)} />
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "Research & Publications" }]} />

      {/* Institutional Research Telemetry Stats */}
      <Stats
        items={[
          { label: "Scopus & WoS Papers", value: `${MOCK_PUBLICATIONS_DATA.totalPublications}` },
          { label: "Institutional h-Index", value: `${MOCK_PUBLICATIONS_DATA.hIndexInstitutional}` },
          { label: "Total Citations", value: `${MOCK_PUBLICATIONS_DATA.totalCitationsLatestYear}+` },
          { label: "Research Grants", value: `₹${MOCK_RESEARCH_FUNDING_DATA.totalSanctionedAmountLakhs}L` },
        ]}
      />

      {/* Focus Areas Narrative */}
      <RichText
        eyebrow="Research Ecosystem"
        title="Interdisciplinary Research Centres & Innovation Focus Areas"
        paragraphs={[
          "Kalinga College maintains active, high-impact research clusters in Artificial Intelligence, Materials Chemistry, Perovskite Nanomaterials, Biodiversity Profiling of the Eastern Ghats, and Regional Development Economics. Faculty regularly publish in Q1/Q2 Scopus and Web of Science indexed journals with substantial international impact.",
          "Through our statutory Research Promotion Council and seed grants initiative, undergraduate and postgraduate students are actively embedded in funded projects sponsored by the Department of Science and Technology (DST-SERB), Council of Scientific and Industrial Research (CSIR), and UGC.",
        ]}
      />

      {/* Sponsored Projects & Extramural Grants Register */}
      <Container className="py-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/50 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-xs">
                  NAAC Metric 3.1.1
                </Badge>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">
                  100% Audited CA Certificates
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-foreground mt-1">
                Extramural Sponsored Research Projects & Grants
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Government and non-government funded research projects with audited Utilization Certificates (UC).
              </p>
            </div>

            <Button asChild size="sm" variant="outline" className="gap-1.5 self-start sm:self-auto text-xs shrink-0">
              <Link to="/admin/naac/criteria?tab=3">
                <Award className="size-3.5 text-primary" />
                <span>Admin Research Grants Console</span>
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {MOCK_RESEARCH_FUNDING_DATA.projects.slice(0, 3).map((grant) => (
              <Card key={grant.id} className="border border-border/60 bg-card shadow-xs flex flex-col justify-between">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge className="bg-blue-600 text-white text-[10px] font-mono">
                      {grant.fundingAgency.split("-")[0].trim()}
                    </Badge>
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                      ₹{grant.sanctionedAmountLakhs} Lakhs
                    </Badge>
                  </div>
                  <CardTitle className="text-xs sm:text-sm font-bold text-foreground mt-2 line-clamp-2">
                    {grant.projectTitle}
                  </CardTitle>
                  <CardDescription className="text-[11px] mt-1">
                    PI: {grant.principalInvestigator} ({grant.piDepartment})
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  <div className="p-2 rounded bg-muted/30 text-[11px] space-y-0.5">
                    <div className="text-muted-foreground truncate">
                      Sanction: {grant.sanctionOrderNumber}
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Tenure: {grant.durationMonths} Months</span>
                      <span className="text-emerald-600 font-semibold">{grant.status}</span>
                    </div>
                  </div>
                  {grant.documentUrl && (
                    <Button size="xs" variant="outline" asChild className="w-full gap-1 text-xs text-primary">
                      <a href={grant.documentUrl} target="_blank" rel="noreferrer">
                        <FileCheck2 className="size-3" />
                        <span>View Sanction Letter (PDF)</span>
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Container>

      {/* Core Scopus & UGC-CARE Verified Publications Register */}
      <Container className="py-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/50 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-xs">
                  NAAC Metric 3.3.1
                </Badge>
                <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs">
                  Scopus & UGC-CARE Master Register
                </Badge>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mt-1">
                Faculty Research Publications Directory
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-3xl">
                Browse our verified institutional repository of {MOCK_PUBLICATIONS_DATA.totalPublications} peer-reviewed research papers published in Scopus, Web of Science, and UGC-CARE indexed journals with direct publisher DOI and citation links.
              </p>
            </div>

            <Button asChild size="sm" variant="outline" className="gap-1.5 self-start sm:self-auto text-xs shrink-0">
              <Link to="/admin/naac/criteria?tab=3">
                <FileText className="size-3.5 text-primary" />
                <span>Admin Publications Master</span>
              </Link>
            </Button>
          </div>

          {/* Filter & Search Bar */}
          <Card className="border-border/60 bg-card shadow-xs">
            <CardContent className="p-4 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by paper title, author name, journal name, ISSN, or DOI..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 text-xs"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ArrowUpDown className="size-3.5" />
                    <span>Sort:</span>
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="h-8 rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="citations">Most Cited First</option>
                    <option value="impact">Highest Impact Factor</option>
                    <option value="newest">Newest First</option>
                    <option value="title">Title (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Indexing Badges Filter */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
                    <Filter className="size-3" />
                    Indexing:
                  </span>
                  {indexingOptions.map((opt) => (
                    <Button
                      key={opt}
                      variant={selectedIndexing === opt ? "default" : "outline"}
                      size="xs"
                      onClick={() => setSelectedIndexing(opt)}
                      className="text-xs h-7"
                    >
                      {opt}
                    </Button>
                  ))}
                </div>

                {/* Department Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">Department:</span>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="h-7 rounded-md border border-input bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Counter */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing <strong className="text-foreground">{filteredPublications.length}</strong> of{" "}
              {MOCK_PUBLICATIONS_DATA.totalPublications} verified publications
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] text-orange-600 border-orange-500/30">
                46 Scopus
              </Badge>
              <Badge variant="outline" className="text-[10px] text-purple-600 border-purple-500/30">
                38 Web of Science
              </Badge>
              <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30">
                68 UGC-CARE
              </Badge>
            </div>
          </div>

          {/* Publications Cards Grid */}
          <div className="space-y-3">
            {filteredPublications.map((pub) => (
              <Card
                key={pub.id}
                className="border border-border/60 bg-card hover:border-primary/40 hover:shadow-xs transition-all"
              >
                <CardContent className="p-4 sm:p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {pub.indexing?.map((idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className={`text-[10px] font-semibold ${
                              idx.includes("Scopus")
                                ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"
                                : idx.includes("Web of Science")
                                  ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                                  : idx.includes("PubMed")
                                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            }`}
                          >
                            {idx}
                          </Badge>
                        ))}
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {pub.department}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono">
                          Year: {pub.publicationYear}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-foreground leading-snug">
                        {pub.paperTitle}
                      </h3>

                      <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-1.5">
                        <span className="font-semibold text-foreground">Authors:</span>
                        {pub.authors.map((a, i) => (
                          <span
                            key={i}
                            className={a === pub.primaryFacultyName ? "text-primary font-semibold" : ""}
                          >
                            {a}
                            {i < pub.authors.length - 1 ? "," : ""}
                          </span>
                        ))}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        <span className="italic font-medium text-foreground">{pub.journalName}</span>
                        {pub.volumeIssuePages && ` · ${pub.volumeIssuePages}`}
                        {pub.issnNumber && ` · ISSN: ${pub.issnNumber}`}
                      </div>
                    </div>

                    {/* Quantitative Impact Metrics */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                      {pub.impactFactor && (
                        <div className="text-center sm:text-right p-1.5 sm:p-2 rounded bg-primary/5 border border-primary/20 min-w-20">
                          <div className="text-base sm:text-lg font-black text-primary">
                            {pub.impactFactor.toFixed(1)}
                          </div>
                          <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                            Impact Factor
                          </div>
                        </div>
                      )}

                      <div className="text-center sm:text-right p-1.5 sm:p-2 rounded bg-muted/40 border border-border/50 min-w-20">
                        <div className="text-base sm:text-lg font-bold text-foreground">
                          {pub.citationsCount ?? 0}
                        </div>
                        <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                          Citations
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Links */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 text-xs">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                      <span>DOI:</span>
                      <a
                        href={pub.doiUrl || `https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        <span>{pub.doi}</span>
                        <ExternalLink className="size-3" />
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      {pub.linkToAbstract && (
                        <Button
                          size="xs"
                          variant="outline"
                          asChild
                          className="h-7 text-[11px] gap-1 text-orange-600 border-orange-500/30 hover:bg-orange-500/10"
                        >
                          <a href={pub.linkToAbstract} target="_blank" rel="noreferrer">
                            <Quote className="size-3" />
                            <span>Scopus Abstract Link</span>
                          </a>
                        </Button>
                      )}

                      <Button
                        size="xs"
                        variant="outline"
                        asChild
                        className="h-7 text-[11px] gap-1 text-primary"
                      >
                        <a href={pub.doiUrl || `https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer">
                          <ExternalLink className="size-3" />
                          <span>View Publisher Paper</span>
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredPublications.length === 0 && (
              <div className="p-8 text-center rounded-lg border border-dashed border-border/80 text-muted-foreground text-xs space-y-1">
                <Search className="size-6 mx-auto text-muted-foreground/60 mb-2" />
                <div className="font-semibold text-foreground">No matching research publications found</div>
                <p>Try refining your search keyword, indexing criteria, or selected department.</p>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Faculty Publications Leaderboard */}
      <FacultyGrid
        eyebrow="Top Faculty Researchers"
        title="Faculty Publications Leaderboard"
        institutionId="college"
        items={researchers.map((r) => ({
          name: r.name,
          role: r.designation,
          meta: r.department,
          bio: `${r.publications} peer-reviewed publications`,
        }))}
      />
    </>
  );
}
