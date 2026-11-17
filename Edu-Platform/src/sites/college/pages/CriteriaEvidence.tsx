import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Download,
  ChevronRight,
  ShieldCheck,
  FolderOpen,
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { collegeHeroUrl } from "@/mocks/data/images";
import { initialNaacCriteria } from "@/mocks/data/naac/criteria";

export default function CollegeCriteriaEvidence() {
  const [activeCriterion, setActiveCriterion] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");

  const currentCriterion = useMemo(() => {
    return initialNaacCriteria.find((c) => c.number === activeCriterion) ?? initialNaacCriteria[0]!;
  }, [activeCriterion]);

  // Flattened metrics for search
  const searchedMetrics = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const q = searchTerm.toLowerCase();

    const results: Array<{
      criterionNumber: number;
      criterionName: string;
      indicatorCode: string;
      indicatorName: string;
      metric: (typeof initialNaacCriteria)[0]["keyIndicators"][0]["metrics"][0];
    }> = [];

    initialNaacCriteria.forEach((crit) => {
      crit.keyIndicators.forEach((ki) => {
        ki.metrics.forEach((m) => {
          if (
            m.code.toLowerCase().includes(q) ||
            m.name.toLowerCase().includes(q) ||
            m.description.toLowerCase().includes(q) ||
            (m.qualitativeText && m.qualitativeText.toLowerCase().includes(q))
          ) {
            results.push({
              criterionNumber: crit.number,
              criterionName: crit.name,
              indicatorCode: ki.code,
              indicatorName: ki.name,
              metric: m,
            });
          }
        });
      });
    });

    return results;
  }, [searchTerm]);

  return (
    <>
      <Hero
        variant="compact"
        title="NAAC Criteria I–VII Evidence & Metrics Repository"
        imageUrl={collegeHeroUrl(4)}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Quality (IQAC / NAAC)", href: "/college/iqac" },
          { label: "Criteria I–VII Evidence" },
        ]}
      />

      {/* Overview Banner */}
      <section className="bg-gradient-to-b from-primary/5 via-background to-background py-10 sm:py-14 border-b border-border/60">
        <Container>
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="size-3.5" />
              <span>NAAC Self Study Report (SSR) Framework</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-heading">
              Criteria I–VII Institutional Quality Dossier
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Explore qualitative metrics (QnM), quantitative metrics (QlM), Key Indicators (KIs), and verified
              documentary evidence filed under the National Assessment and Accreditation Council (NAAC) revised
              autonomous college manual (Total Weightage: 1,000 Points).
            </p>
          </div>

          {/* Quick Summary Pill Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mt-8">
            {initialNaacCriteria.map((c) => {
              const isSelected = activeCriterion === c.number && !searchTerm.trim();
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setActiveCriterion(c.number);
                    setSearchTerm("");
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-[1.02]"
                      : "bg-card hover:bg-muted/40 border-border/70 text-foreground"
                  }`}
                >
                  <p className={`text-[10px] font-bold uppercase ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
                    Criterion {c.number}
                  </p>
                  <p className="text-xs font-bold truncate mt-0.5" title={c.name}>
                    {c.name}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-current/10 text-[10px]">
                    <span className="opacity-80">W: {c.weightage}</span>
                    <span className="font-bold">{c.completionPercentage}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Search and Criterion Content */}
      <section className="py-12 sm:py-16">
        <Container>
          {/* Search bar */}
          <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search metric code (e.g. 1.1.2) or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 text-sm"
              />
            </div>
            {searchTerm && (
              <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")} className="text-xs">
                Clear Search Filter
              </Button>
            )}
          </div>

          {/* If searching, display search results */}
          {searchedMetrics ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-bold">
                  Search Results for "{searchTerm}" ({searchedMetrics.length} matches found)
                </h3>
              </div>

              {searchedMetrics.length === 0 ? (
                <div className="text-center py-16 p-8 border border-dashed rounded-xl border-border/70 text-muted-foreground">
                  <FolderOpen className="size-10 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-sm font-semibold">No metrics match your search query.</p>
                  <p className="text-xs mt-1">Try searching for terms like "curriculum", "faculty", "research", or "1.1.1".</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {searchedMetrics.map((item) => (
                    <Card key={item.metric.id} className="border border-border/70 shadow-xs">
                      <CardHeader className="bg-muted/20 border-b border-border/50 py-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono text-xs font-bold bg-primary/5 text-primary border-primary/20">
                              Metric {item.metric.code}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px] capitalize">
                              {item.metric.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Criterion {item.criterionNumber}: {item.criterionName}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-[10px]">
                            Weightage: {item.metric.weightage} Points
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <h4 className="text-sm font-bold text-foreground leading-snug">{item.metric.name}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.metric.description}</p>
                        {item.metric.benchmark && (
                          <div className="text-xs bg-muted/40 p-2.5 rounded-lg border border-border/50">
                            <span className="font-semibold text-foreground">Statutory Benchmark / Data: </span>
                            <span className="text-muted-foreground">{item.metric.benchmark}</span>
                          </div>
                        )}
                        <div className="flex justify-end pt-2">
                          <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs">
                            <a
                              href={`/documents/naac/evidence/Metric_${item.metric.code.replace(/\./g, "_")}_Evidence.pdf`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="size-3" />
                              <span>View Verified Metric Evidence (PDF)</span>
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Otherwise, display Active Criterion Key Indicators and Metrics */
            <div className="space-y-8">
              {/* Active Criterion Header Card */}
              <Card className="border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent shadow-xs">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary text-white font-bold text-xs">
                          Criterion {currentCriterion.number}
                        </Badge>
                        <Badge variant="outline" className="text-xs font-semibold">
                          Total Weightage: {currentCriterion.weightage} Points
                        </Badge>
                        <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 text-xs font-bold">
                          {currentCriterion.completionPercentage}% DVV Verified
                        </Badge>
                      </div>
                      <h2 className="text-2xl font-extrabold text-foreground font-heading">
                        {currentCriterion.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                        {currentCriterion.executiveSummary}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <Button asChild size="sm" className="gap-1.5 shadow-xs">
                        <a
                          href={`/documents/naac/criteria/Criterion_${currentCriterion.number}_Full_Dossier.pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="size-3.5" />
                          <span>Criterion {currentCriterion.number} Dossier</span>
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Indicators List */}
              <div className="space-y-6">
                {currentCriterion.keyIndicators.map((ki) => (
                  <Card key={ki.id} className="border border-border/70 shadow-xs overflow-hidden">
                    <CardHeader className="bg-muted/30 border-b border-border/60 py-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded">
                            KI {ki.code}
                          </span>
                          <h3 className="font-bold text-sm sm:text-base text-foreground font-heading">
                            {ki.name}
                          </h3>
                        </div>
                        <Badge variant="secondary" className="text-xs font-semibold">
                          Weightage: {ki.weightage} Pts
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="p-0 divide-y divide-border/60">
                      {ki.metrics.map((m) => (
                        <div key={m.id} className="p-5 hover:bg-muted/20 transition-colors space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-mono text-xs font-bold border-primary/30 text-primary">
                                Metric {m.code}
                              </Badge>
                              <Badge variant="secondary" className="text-[10px] capitalize">
                                {m.type === "qualitative" ? "Qualitative (QlM)" : "Quantitative (QnM)"}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 text-[10px]"
                              >
                                {m.status}
                              </Badge>
                            </div>
                            <span className="text-xs font-bold text-muted-foreground">
                              Weightage: {m.weightage} Pts
                            </span>
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-foreground leading-snug">{m.name}</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed mt-1">{m.description}</p>
                          </div>

                          {m.qualitativeText && (
                            <div className="p-3 rounded-lg bg-surface border border-border/60 text-xs space-y-1">
                              <p className="font-semibold text-foreground">Institutional Description / Qualitative Brief:</p>
                              <p className="text-muted-foreground leading-relaxed">{m.qualitativeText}</p>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                            <div className="text-xs text-muted-foreground">
                              <span>Data Required: </span>
                              <span className="font-medium text-foreground">{m.dataRequired}</span>
                            </div>

                            <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs shrink-0">
                              <a
                                href={`/documents/naac/evidence/Metric_${m.code.replace(/\./g, "_")}_Verified.pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Download className="size-3" />
                                <span>Download Verified Proof (PDF)</span>
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Quick Cross Navigation */}
          <div className="mt-14 p-6 rounded-2xl bg-surface border border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-foreground">Looking for NAAC Cycle 3 Summary & Certificates?</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                View the official accreditation certificates, Peer Team visit reports, and Self Study Reports.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild size="sm" className="gap-1.5">
                <Link to="/college/accreditation-ssr">
                  <span>Accreditation & SSR</span>
                  <ChevronRight className="size-3.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <Link to="/college/aqar-archive">
                  <span>8-Year AQAR Archive</span>
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
