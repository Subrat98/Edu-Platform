import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  FileCheck2,
  FileText,
  DollarSign,
  TrendingUp,
  Award,
  Building,
  Calendar,
  UserCheck,
  Download,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Landmark,
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { collegeHeroUrl } from "@/mocks/data/images";
import { MOCK_RESEARCH_FUNDING_DATA } from "@/mocks/data/naac/researchFunding";
import { institutions } from "@/mocks/data/institutions";

export default function SponsoredGrants() {
  const institution = institutions.college;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgency, setSelectedAgency] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const agencies = useMemo(() => {
    const set = new Set<string>();
    MOCK_RESEARCH_FUNDING_DATA.projects.forEach((p) => {
      if (p.fundingAgency) set.add(p.fundingAgency);
    });
    return ["All", ...Array.from(set).sort()];
  }, []);

  const filteredProjects = useMemo(() => {
    return MOCK_RESEARCH_FUNDING_DATA.projects.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !searchQuery ||
        p.projectTitle.toLowerCase().includes(q) ||
        p.principalInvestigator.toLowerCase().includes(q) ||
        p.projectCode.toLowerCase().includes(q) ||
        p.sanctionOrderNumber.toLowerCase().includes(q) ||
        p.piDepartment.toLowerCase().includes(q);

      const matchesAgency = selectedAgency === "All" || p.fundingAgency === selectedAgency;
      const matchesStatus = selectedStatus === "All" || p.status === selectedStatus;

      return matchesSearch && matchesAgency && matchesStatus;
    });
  }, [searchQuery, selectedAgency, selectedStatus]);

  const totalSanctionedFiltered = useMemo(() => {
    return filteredProjects.reduce((acc, curr) => acc + (curr.sanctionedAmountLakhs || 0), 0);
  }, [filteredProjects]);

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="Sponsored Research Grants & Extramural Funding"
        subtitle="Endowed and competitive external research projects sanctioned by central funding agencies including DST-SERB, CSIR, DBT, and UGC with audited utilization compliance."
        backgroundImage={collegeHeroUrl}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Research", href: "/college/research" },
          { label: "Sponsored Grants (DST/CSIR)", href: "/college/research/grants" },
        ]}
      />

      <Container className="py-12 space-y-12">
        {/* Key Metrics / Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card/70 border-primary/20 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Sanctioned Grants</p>
                  <p className="text-3xl font-extrabold text-primary mt-1">
                    ₹{MOCK_RESEARCH_FUNDING_DATA.totalSanctionedAmountLakhs.toFixed(2)} L
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Across approved extramural projects</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/70 border-emerald-500/20 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ongoing Projects</p>
                  <p className="text-3xl font-extrabold text-emerald-600 mt-1">
                    {MOCK_RESEARCH_FUNDING_DATA.totalOngoingProjects} Active
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Active field & laboratory investigations</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/70 border-blue-500/20 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Funding Agencies</p>
                  <p className="text-3xl font-extrabold text-blue-600 mt-1">
                    {MOCK_RESEARCH_FUNDING_DATA.govtAgenciesCount + MOCK_RESEARCH_FUNDING_DATA.nonGovtAgenciesCount} Bodies
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">DST, CSIR, DBT, State DST & Industry</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600">
                  <Landmark className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/70 border-purple-500/20 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Audited UC Compliance</p>
                  <p className="text-3xl font-extrabold text-purple-600 mt-1">
                    {MOCK_RESEARCH_FUNDING_DATA.auditedUcSubmissionRate}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Statutory CA Verified Statements</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search, Filter & Summary Bar */}
        <Card className="bg-card border-border/70 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by project title, PI name, sanction code, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Agency:</span>
                </div>
                <select
                  value={selectedAgency}
                  onChange={(e) => setSelectedAgency(e.target.value)}
                  aria-label="Filter by Funding Agency"
                  className="h-10 px-3 text-sm rounded-md border border-input bg-background focus:ring-2 focus:ring-primary"
                >
                  {agencies.map((agency) => (
                    <option key={agency} value={agency}>
                      {agency}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg">
                  {["All", "Ongoing", "Completed"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setSelectedStatus(st)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        selectedStatus === st
                          ? "bg-background text-foreground shadow-sm font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/60">
              <span>
                Showing <strong>{filteredProjects.length}</strong> of{" "}
                <strong>{MOCK_RESEARCH_FUNDING_DATA.projects.length}</strong> sanctioned grants
              </span>
              <span>
                Filtered Total:{" "}
                <strong className="text-foreground font-semibold">₹{totalSanctionedFiltered.toFixed(2)} Lakhs</strong>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Grants Register List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Sanctioned Projects Register</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const csvHeader = "Code,Title,PI,Department,Funding Agency,Sanction Order,Sanction Date,Amount (Lakhs),Status\n";
                const rows = filteredProjects
                  .map(
                    (p) =>
                      `"${p.projectCode}","${p.projectTitle.replace(/"/g, '""')}","${p.principalInvestigator}","${
                        p.piDepartment
                      }","${p.fundingAgency}","${p.sanctionOrderNumber}","${p.sanctionDate}",${p.sanctionedAmountLakhs},"${p.status}"`
                  )
                  .join("\n");
                const blob = new Blob([csvHeader + rows], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `Sponsored_Grants_Register_${new Date().getFullYear()}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="gap-2 text-xs"
            >
              <Download className="w-3.5 h-3.5" /> Export Register (CSV)
            </Button>
          </div>

          {filteredProjects.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent className="space-y-3">
                <FileText className="w-10 h-10 text-muted-foreground mx-auto" />
                <p className="text-base font-semibold">No sponsored grants match your criteria</p>
                <p className="text-sm text-muted-foreground">Try clearing your search query or selecting "All" agencies.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedAgency("All");
                    setSelectedStatus("All");
                  }}
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="bg-card hover:border-primary/40 transition-all hover:shadow-md border-border/80"
                >
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs font-semibold">
                          {project.projectCode}
                        </Badge>
                        <Badge
                          variant={project.status === "Ongoing" ? "default" : "secondary"}
                          className={
                            project.status === "Ongoing"
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                              : "bg-blue-600/10 text-blue-700 dark:text-blue-300"
                          }
                        >
                          {project.status}
                        </Badge>
                        {project.utilizationCertificateAudited && (
                          <Badge variant="outline" className="text-xs text-purple-700 dark:text-purple-300 border-purple-300 bg-purple-50/50 dark:bg-purple-950/20 gap-1">
                            <ShieldCheck className="w-3 h-3" /> Audited UC
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground uppercase font-semibold">Sanctioned: </span>
                        <span className="text-lg font-bold text-primary">₹{project.sanctionedAmountLakhs.toFixed(2)} Lakhs</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg md:text-xl font-bold leading-snug">
                      {project.projectTitle}
                    </CardTitle>
                    <CardDescription className="text-sm flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                      <span className="flex items-center gap-1 font-medium text-foreground">
                        <UserCheck className="w-3.5 h-3.5 text-primary" /> PI: {project.principalInvestigator} ({project.piDepartment})
                      </span>
                      {project.coInvestigator && (
                        <span className="text-muted-foreground">
                          Co-PI: {project.coInvestigator}
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-muted/30 p-3 rounded-lg text-xs">
                      <div>
                        <span className="text-muted-foreground block">Funding Agency:</span>
                        <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                          <Building className="w-3.5 h-3.5 text-muted-foreground" />
                          {project.fundingAgency}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Sanction Order:</span>
                        <span className="font-mono font-medium text-foreground mt-0.5 block truncate" title={project.sanctionOrderNumber}>
                          {project.sanctionOrderNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Sanction Date:</span>
                        <span className="font-medium text-foreground flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          {project.sanctionDate}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Tenure / Duration:</span>
                        <span className="font-medium text-foreground mt-0.5 block">
                          {project.durationMonths} Months ({project.receivedAmountLakhs ? `₹${project.receivedAmountLakhs}L received` : "Tranches in progress"})
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between pt-2 border-t border-border/50 gap-3">
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Scheme: {project.agencyType}</span>
                      </div>
                      {project.documentUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 text-xs font-semibold text-primary hover:text-primary gap-1.5"
                        >
                          <a href={project.documentUrl} target="_blank" rel="noopener noreferrer">
                            <FileText className="w-3.5 h-3.5" /> View Sanction Letter
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Institutional Research Grant Support Policy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-card border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Landmark className="w-5 h-5 text-primary" /> Extramural Grant Support Mechanism
              </CardTitle>
              <CardDescription>
                Systematic institutional facilitation for faculty submitting proposals to national and international funding bodies.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Pre-Submission Scientific Review</h4>
                  <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">
                    The Research Advisory Council conducts blinded internal peer reviews of grant proposals prior to portal submission, strengthening technical rigor and budget justifications.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Institutional Seed Grant Matching</h4>
                  <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">
                    Faculty developing initial proof-of-concept preliminary data receive internal seed grants up to ₹2.5 Lakhs from the institution before pitching to central agencies.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Dedicated Financial Audit & UC Processing</h4>
                  <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">
                    A dedicated project accounts desk ensures continuous compliance with GFR 2017 norms, timely generation of Statements of Expenditure (SoE), and CA-audited Utilization Certificates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" /> Major Sponsoring Agencies & Schemes
              </CardTitle>
              <CardDescription>
                Key funding authorities providing research grants, equipment allocations, and junior research fellowships.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">DST - SERB (CRG & SURE Schemes)</span>
                  <Badge variant="outline" className="text-xs">Central Govt</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Core Research Grant (CRG) and State University Research Excellence (SURE) funding advanced physical and life science investigations.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">CSIR - Extramural Research (EMR-II)</span>
                  <Badge variant="outline" className="text-xs">Autonomous</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports basic and applied research in chemical, ecological, and bio-resource isolation with student stipends.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">DBT & UGC Major Projects</span>
                  <Badge variant="outline" className="text-xs">Government</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Biotechnology and interdisciplinary science initiatives driving regional agricultural and ecological sustainability.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cross-navigation to Other Research Sections */}
        <div className="pt-6 border-t border-border">
          <h3 className="text-lg font-bold mb-4">Explore More in Research</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/college/research/rnd-cell"
              className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-sm group flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                  Research & Development Cell
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">Policies, Seed Grants & Ethics</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/college/research/publications"
              className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-sm group flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                  Scopus Publications Register
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">Indexed papers, citations & DOIs</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/college/research/cif"
              className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-sm group flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                  Central Instrumentation Facility
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">FE-SEM, XRD, NMR & Slot Booking</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
