import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Search,
  Download,
  Calendar,
  Building2,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { collegeHeroUrl } from "@/mocks/data/images";

interface TenderRecord {
  id: string;
  tenderNumber: string;
  title: string;
  department: string;
  estimatedValue: string;
  emdAmount: string;
  publishDate: string;
  closingDate: string;
  status: "Open" | "Evaluation" | "Awarded" | "Closed";
  tenderPdfUrl: string;
  corrigendumUrl?: string;
  isGem?: boolean;
}

export default function CollegeTenders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const tendersList: TenderRecord[] = [
    {
      id: "ten-01",
      tenderNumber: "KSU/CIF/EQP/2026/04",
      title: "Supply, Installation & Commissioning of High-Resolution X-Ray Diffractometer (XRD) for Central Instrumentation Facility",
      department: "Central Instrumentation Facility (CIF)",
      estimatedValue: "₹85,00,000",
      emdAmount: "₹1,70,000",
      publishDate: "2026-11-08",
      closingDate: "2026-12-05",
      status: "Open",
      tenderPdfUrl: "/documents/tenders/tender-cif-xrd-2026.pdf",
      corrigendumUrl: "/documents/tenders/corrigendum-01-cif.pdf",
    },
    {
      id: "ten-02",
      tenderNumber: "KSU/EST/SOLAR/2026/09",
      title: "Comprehensive Annual Maintenance Contract (AMC) for 120 kWp Rooftop Solar PV Microgrid & Inverter Systems",
      department: "Estate & Works Wing",
      estimatedValue: "₹6,50,000",
      emdAmount: "₹15,000",
      publishDate: "2026-11-05",
      closingDate: "2026-11-30",
      status: "Open",
      tenderPdfUrl: "/documents/tenders/rfp-solar-amc-2026.pdf",
    },
    {
      id: "ten-03",
      tenderNumber: "GEM/2026/B/4891204",
      title: "Procurement through GeM: 34 Units of 75-inch 4K Interactive Flat Panels for Smart ICT Classrooms (Block B)",
      department: "ICT & Computer Centre",
      estimatedValue: "₹42,00,000",
      emdAmount: "Exempted (GeM)",
      publishDate: "2026-10-30",
      closingDate: "2026-11-25",
      status: "Open",
      tenderPdfUrl: "/documents/tenders/gem-smart-panels-procurement.pdf",
      isGem: true,
    },
    {
      id: "ten-04",
      tenderNumber: "KSU/LIB/ILMS/2026/02",
      title: "Annual Subscription & Server Maintenance for Koha ILMS, RFID Gates, and Institutional Repository (DSpace)",
      department: "Parija Central Library",
      estimatedValue: "₹8,20,000",
      emdAmount: "₹20,000",
      publishDate: "2026-10-15",
      closingDate: "2026-11-05",
      status: "Evaluation",
      tenderPdfUrl: "/documents/tenders/tender-library-rfid-2026.pdf",
    },
    {
      id: "ten-05",
      tenderNumber: "KSU/HOSTEL/MESS/2026/01",
      title: "Catering, Dining & Housekeeping Services for East & West Hostels (1,200 Boarders)",
      department: "Board of Residence",
      estimatedValue: "₹72,00,000",
      emdAmount: "₹1,50,000",
      publishDate: "2026-09-10",
      closingDate: "2026-10-05",
      status: "Awarded",
      tenderPdfUrl: "/documents/tenders/tender-hostel-catering-2026.pdf",
    },
  ];

  const filteredTenders = useMemo(() => {
    return tendersList.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        t.title.toLowerCase().includes(q) ||
        t.tenderNumber.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "All" || t.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <>
      <Hero variant="compact" title="Tenders & Procurement" imageUrl={collegeHeroUrl(3)} />
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "Tenders & RFPs" }]} />

      <Container className="py-10 space-y-8">
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                Public Procurement Portal
              </Badge>
              <Badge variant="outline" className="text-xs">
                GeM & e-Procurement Compliant
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground">
              Tenders, Requests for Proposals (RFPs) & EMD Notices
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl">
              Official university tenders published in accordance with Odisha General Financial Rules (OGFR) and Central Vigilance Commission (CVC) guidelines.
            </p>
          </div>

          <Button asChild size="sm" variant="outline" className="gap-1 text-xs self-start md:self-auto">
            <a href="https://gem.gov.in" target="_blank" rel="noreferrer">
              <span>GeM Portal</span>
              <ExternalLink className="size-3" />
            </a>
          </Button>
        </div>

        {/* Filter and Search Bar */}
        <Card className="border border-border/70 bg-card shadow-xs">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search tenders by keyword, equipment, department, or tender number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
                  <Filter className="size-3" /> Status:
                </span>
                {(["All", "Open", "Evaluation", "Awarded"] as const).map((st) => (
                  <Button
                    key={st}
                    variant={statusFilter === st ? "default" : "outline"}
                    size="xs"
                    onClick={() => setStatusFilter(st)}
                    className="text-xs h-7"
                  >
                    {st}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tenders List */}
        <div className="space-y-3">
          {filteredTenders.length > 0 ? (
            filteredTenders.map((tender) => (
              <Card
                key={tender.id}
                className="border border-border/60 bg-card hover:border-primary/40 shadow-xs transition-all"
              >
                <CardContent className="p-4 sm:p-5 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="font-mono text-[10px] border-primary/30 text-primary">
                          {tender.tenderNumber}
                        </Badge>
                        {tender.isGem && (
                          <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 text-[10px]">
                            GeM Bid
                          </Badge>
                        )}
                        <Badge
                          className={`text-[10px] ${
                            tender.status === "Open"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                              : tender.status === "Evaluation"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {tender.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono">
                          Dept: {tender.department}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-foreground leading-snug">
                        {tender.title}
                      </h3>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1 text-muted-foreground">
                        <div>
                          <span>Est. Value: </span>
                          <strong className="text-foreground">{tender.estimatedValue}</strong>
                        </div>
                        <div>
                          <span>EMD Amount: </span>
                          <strong className="text-foreground">{tender.emdAmount}</strong>
                        </div>
                        <div>
                          <span>Published: </span>
                          <span className="font-mono">{tender.publishDate}</span>
                        </div>
                        <div>
                          <span>Bid Closing: </span>
                          <strong className="text-rose-600 font-mono">{tender.closingDate}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 pt-2 md:pt-0">
                      <Button size="xs" variant="outline" asChild className="gap-1.5 text-xs text-primary h-8">
                        <a href={tender.tenderPdfUrl} target="_blank" rel="noreferrer">
                          <Download className="size-3" />
                          <span>Tender Document (PDF)</span>
                        </a>
                      </Button>
                      {tender.corrigendumUrl && (
                        <Button size="xs" variant="ghost" asChild className="gap-1 text-[11px] text-amber-600 h-7 p-0">
                          <a href={tender.corrigendumUrl} target="_blank" rel="noreferrer">
                            <span>Corrigendum Notice #1 →</span>
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="py-12 text-center text-xs text-muted-foreground rounded-xl border border-dashed p-8">
              No matching tender documents found for the selected query.
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
