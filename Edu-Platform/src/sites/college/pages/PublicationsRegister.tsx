import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ExternalLink,
  Award,
  Filter,
  Quote,
  FileText,
  FileCheck2,
  ArrowUpDown,
  BookOpen,
  ArrowRight,
  Download,
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { collegeHeroUrl } from "@/mocks/data/images";
import { MOCK_PUBLICATIONS_DATA } from "@/mocks/data/naac/publications";
import { institutions } from "@/mocks/data/institutions";

export default function PublicationsRegister() {
  const institution = institutions.college;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndexing, setSelectedIndexing] = useState<string>("All");
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"citations" | "impact" | "newest" | "title">("citations");

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
      const q = searchQuery.toLowerCase().trim();
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
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Research", href: "/college/research" },
          { label: "Publications Register" },
        ]}
      />

      <Hero
        variant="compact"
        title="Scopus & WoS Publications Register"
        subtitle="Verified Institutional Repository of High-Impact Peer-Reviewed Research Articles"
        imageUrl={collegeHeroUrl(1)}
      />

      {/* Telemetry Stats Strip */}
      <Stats
        items={[
          { label: "Scopus & WoS Papers", value: `${MOCK_PUBLICATIONS_DATA.totalPublications}` },
          { label: "Institutional h-Index", value: `${MOCK_PUBLICATIONS_DATA.hIndexInstitutional}` },
          { label: "Total Citations", value: `${MOCK_PUBLICATIONS_DATA.totalCitationsLatestYear}+` },
          { label: "Average Impact Factor", value: "3.84" },
        ]}
      />

      <Container className="py-10 space-y-8">
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-xs">
                NAAC Metric 3.3.1
              </Badge>
              <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs">
                Live Bibliometric Data
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground">
              Faculty Research Publications Directory
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl">
              Complete catalog of peer-reviewed articles authored by university faculty in Scopus, Web of Science,
              and UGC-CARE indexed journals with verified DOIs, ISSNs, and citation metrics.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs text-primary border-primary/30">
              <Download className="size-3.5" />
              <span>Export BibTeX / CSV</span>
            </Button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <Card className="border border-border/70 bg-card p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search by title, author name, journal, or DOI…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted-foreground flex items-center gap-1 font-semibold">
                <ArrowUpDown className="size-3.5 text-primary" />
                Sort:
              </span>
              {[
                { id: "citations", label: "Citations" },
                { id: "impact", label: "Impact Factor" },
                { id: "newest", label: "Year" },
                { id: "title", label: "Title" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSortBy(s.id as any)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    sortBy === s.id
                      ? "bg-primary text-white font-bold"
                      : "bg-muted/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Department and Indexing Filter Strips */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-border/40 text-xs">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-muted-foreground font-semibold shrink-0">Indexing:</span>
              {indexingOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelectedIndexing(opt)}
                  className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-all ${
                    selectedIndexing === opt
                      ? "bg-primary/10 text-primary border border-primary/30 font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-muted-foreground font-semibold shrink-0">Department:</span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="text-xs bg-muted/40 border border-border/70 rounded-md px-2 py-1 text-foreground"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Search Results Summary */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {filteredPublications.length} of {MOCK_PUBLICATIONS_DATA.totalPublications} verified publications</span>
          {(searchQuery || selectedIndexing !== "All" || selectedDept !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedIndexing("All");
                setSelectedDept("All");
              }}
              className="text-primary hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Publications Cards Grid */}
        <div className="space-y-4">
          {filteredPublications.map((pub) => (
            <Card
              key={pub.id}
              className="border border-border/70 bg-card hover:border-primary/40 transition-all p-5 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {pub.indexing?.map((idx) => (
                      <Badge key={idx} variant="outline" className="text-[10px] font-mono border-primary/20 text-primary">
                        {idx}
                      </Badge>
                    ))}
                    {pub.department && (
                      <Badge variant="secondary" className="text-[10px]">
                        {pub.department}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="font-mono text-[10px]">
                      {pub.publicationYear}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-base text-foreground leading-snug">
                    {pub.paperTitle}
                  </h3>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                  {pub.citationsCount !== undefined && (
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-mono">
                      {pub.citationsCount} Citations
                    </Badge>
                  )}
                  {pub.impactFactor && (
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-mono">
                      IF: {pub.impactFactor}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                <span className="font-bold text-foreground">Authors: </span>
                {pub.authors.join(", ")}
              </div>

              <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 border-t border-border/50">
                <div>
                  <span className="font-bold text-foreground">Journal: </span>
                  <span className="italic">{pub.journalName}</span>
                </div>
                {pub.issnNumber && (
                  <div>
                    <span className="font-bold text-foreground">ISSN: </span>
                    <span className="font-mono">{pub.issnNumber}</span>
                  </div>
                )}
                {pub.doi && (
                  <div className="flex items-center gap-1 text-primary">
                    <span className="font-bold text-foreground">DOI: </span>
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline font-mono inline-flex items-center gap-0.5"
                    >
                      <span>{pub.doi}</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Nav */}
        <div className="p-6 rounded-2xl bg-muted/40 border border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-base text-foreground">Explore Extramural Sponsored Grants</h3>
            <p className="text-xs text-muted-foreground">Review research grants sponsored by DST-SERB, CSIR, and DBT with audited sanction orders.</p>
          </div>
          <Button size="sm" asChild className="gap-1.5 bg-primary text-white text-xs font-bold shadow-xs">
            <Link to="/college/research/grants">
              <span>View Sponsored Grants</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </Container>
    </>
  );
}
