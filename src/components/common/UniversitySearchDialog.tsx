import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { collegeNotices, schoolNotices } from "@/mocks/data/notices";
import { departments } from "@/mocks/data/departments";
import { programmes } from "@/mocks/data/programmes";
import { MOCK_PUBLICATIONS_DATA } from "@/mocks/data/naac/publications";

interface SearchResultItem {
  id: string;
  title: string;
  category: string;
  snippet: string;
  url: string;
  badge?: string;
}

export function UniversitySearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const navigate = useNavigate();
  const location = useLocation();

  const isSchool = location.pathname.startsWith("/school");

  // Reset query & filter on open or institution switch
  useEffect(() => {
    if (open) {
      setQuery("");
      setFilterCategory("All");
    }
  }, [open, isSchool]);

  // Index searchable database based on current portal mode
  const searchIndex: SearchResultItem[] = useMemo(() => {
    if (isSchool) {
      const items: SearchResultItem[] = [
        // School Statutory & Mandatory Disclosures
        {
          id: "sch-disclosure",
          title: "Mandatory Public Disclosure (CBSE Appendix IX Circular 1/2026)",
          category: "Statutory Disclosure",
          snippet: "Sections A–E: General information, affiliation documents, building safety, fire certificate, DEO certificate, and water/sanitation tests.",
          url: "/school/mandatory-disclosure",
          badge: "Appendix IX",
        },
        {
          id: "sch-smc",
          title: "School Management Committee (SMC & SDMC) — RTE Section 21",
          category: "Administration",
          snippet: "16-member statutory committee, 50% women representation, parent members, teacher representatives, and educational experts.",
          url: "/school/administration",
          badge: "RTE Sec 21",
        },
        {
          id: "sch-rte",
          title: "RTE 25% Reserved Admission Quota & Age Criteria (NEP 2020)",
          category: "Academics",
          snippet: "Section 12(1)(c) zero-tuition quota for economically weaker and disadvantaged groups. 40 entry seats.",
          url: "/school/admissions",
          badge: "RTE 12(1)(c)",
        },
        {
          id: "sch-pm-poshan",
          title: "PM-POSHAN Weekly Mid-Day Meal Nutrition Chart & Food Safety",
          category: "Student Welfare",
          snippet: "Classes I–VIII hot cooked meals, fortified rice, dalma, egg curry, hygiene roster, and daily teacher tasting log.",
          url: "/school/student-life",
          badge: "PM-POSHAN",
        },
        {
          id: "sch-results",
          title: "CBSE Class X & XII Board Examination Results (3-Year Archive)",
          category: "Academics",
          snippet: "100% pass record, Class X 91.2% quality pass (75%+), Class XII 89.4% quality pass, and school toppers.",
          url: "/school/results",
          badge: "Board Results",
        },
        {
          id: "sch-atl",
          title: "Atal Tinkering Lab (ATL), STEM & ICT Infrastructure",
          category: "Facilities",
          snippet: "NITI Aayog ATL lab with 3D printers, IoT kits, robotics, and 36 smart classrooms with interactive flat panels.",
          url: "/school/facilities",
          badge: "ATL Lab",
        },
        {
          id: "sch-rti",
          title: "Right to Information (RTI Act 2005) — Proactive Section 4(1)(b) Manuals",
          category: "Statutory Disclosure",
          snippet: "Public Information Officer (PIO), First Appellate Authority (FAA), fee structure, and 16 proactive manuals.",
          url: "/school/rti",
          badge: "RTI 2005",
        },
        {
          id: "sch-alumni",
          title: "Mo School Abhiyan (Odisha 2x Matching Grant) & Alumni Directory",
          category: "Administration",
          snippet: "Government of Odisha flagship initiative with 2x state matching grant for alumni donations. Roll of honor and alumni registration.",
          url: "/school/alumni",
          badge: "Mo School",
        },
        {
          id: "sch-grievance",
          title: "Student, Parent & POCSO Grievance Cell (Token System)",
          category: "Student Welfare",
          snippet: "File grievances online with tracking token SCH-GRV-2026-XXXX, Childline 1098, Women helpline 181, and Internal Complaints Committee.",
          url: "/school/grievance",
          badge: "24x7 Portal",
        },
        {
          id: "sch-transport",
          title: "School Transport Fleet & 8 GPS-Tracked Bus Routes",
          category: "Facilities",
          snippet: "8 yellow school buses with speed governors, CCTV, first-aid, female bus attendants, and live GPS tracking for parents.",
          url: "/school/facilities",
          badge: "Transport",
        },
        {
          id: "sch-calendar",
          title: "Annual School Calendar 2026-27 & Holistic Progress Card (NEP 2020)",
          category: "Academics",
          snippet: "220 instructional days, 5+3+3+4 pedagogical stages, formative evaluations, and 360-degree multi-dimensional assessment.",
          url: "/school/academics",
          badge: "NEP 2020",
        },
        {
          id: "sch-houses",
          title: "School Houses (Subhash, Gandhi, Tagore, Raman) & Clubs",
          category: "Student Welfare",
          snippet: "Four school houses fostering teamwork and discipline, Eco Club, Coding Club, Literary Club, and NCC/Scouts.",
          url: "/school/student-life",
          badge: "Co-Curricular",
        },
        {
          id: "sch-fees",
          title: "SMC Approved Fee Schedule 2026-27 & Concessions",
          category: "Administration",
          snippet: "Transparent fee structure approved by SMC. Quarterly payments, sibling concessions, and merit scholarships.",
          url: "/school/admissions",
          badge: "Fee Policy",
        },
        {
          id: "sch-tc",
          title: "Transfer Certificate (TC) Issuance & Online Verification",
          category: "Academics",
          snippet: "Online TC application, 7 working days processing, and public TC verification register for counter-signing.",
          url: "/school/admissions",
          badge: "TC Verify",
        },
        {
          id: "sch-about",
          title: "About Our School (UDISE+ 21160401201, Affiliation 3330123)",
          category: "Administration",
          snippet: "Founded in 1998, 4.0-acre green campus, 48 qualified faculty, school emblem, motto 'Vidya Dadati Vinayam', and anthem.",
          url: "/school/about",
          badge: "UDISE+",
        },
      ];

      // Index School Notices
      schoolNotices.forEach((n) => {
        items.push({
          id: `sch-notice-${n.id}`,
          title: n.title,
          category: "Notices",
          snippet: n.summary || `Published on ${n.date} · Category: ${n.category}`,
          url: "/school/notices",
          badge: n.category,
        });
      });

      return items;
    }

    // College / University Search Index
    const items: SearchResultItem[] = [
      // Key Statutory Pages
      {
        id: "page-iqac",
        title: "IQAC & NAAC Accreditation Portal (Grade A+)",
        category: "NAAC / IQAC",
        snippet: "Statutory IQAC composition, quarterly meeting minutes, 8-year AQAR archive, SSR dossiers, and Criteria 1–7 evidence.",
        url: "/college/iqac",
        badge: "Accreditation",
      },
      {
        id: "page-disclosure",
        title: "Mandatory Public Self-Disclosure (UGC 2024)",
        category: "NAAC / IQAC",
        snippet: "RTI disclosures, audit statements, annual budget, UGC approvals, AISHE, and NIRF rankings.",
        url: "/college/disclosure",
        badge: "Statutory",
      },
      {
        id: "page-administration",
        title: "University Administration & Statutory Bodies",
        category: "Administration",
        snippet: "Chancellor (Governor of Odisha), Vice-Chancellor, Syndicate, Academic Council, PG Council, and Secretariats.",
        url: "/college/administration",
        badge: "Governance",
      },
      {
        id: "page-grievance",
        title: "Online Grievance Redressal (e-Pratikar)",
        category: "Services",
        snippet: "File and track student/faculty grievances, Anti-Ragging helpline, ICC Women's Cell, and Equal Opportunity.",
        url: "/college/grievance",
        badge: "24x7 Portal",
      },
      {
        id: "page-tenders",
        title: "Tenders, RFPs & GeM Procurement Notices",
        category: "Notices",
        snippet: "Active tenders, bidding schedules, equipment procurement for Central Instrumentation Facility (CIF).",
        url: "/college/tenders",
        badge: "Tenders",
      },
      {
        id: "page-recruitment",
        title: "Recruitment & Vacancies (Faculty & Staff)",
        category: "Notices",
        snippet: "Assistant Professor advertisements, non-teaching vacancies, walk-in interviews, and interview shortlists.",
        url: "/college/recruitment",
        badge: "Jobs",
      },
      {
        id: "page-alumni",
        title: "Alumni Association & Give to the University",
        category: "Services",
        snippet: "Distinguished alumni network, endowment fund, scholarships, and global chapters.",
        url: "/college/alumni",
        badge: "Alumni",
      },
      {
        id: "page-virtual-tour",
        title: "Virtual Campus Tour & How to Reach",
        category: "Services",
        snippet: "360° tour of historic quadrangle, Parija Library, laboratories, and transport connectivity.",
        url: "/college/virtual-tour",
        badge: "Campus",
      },
      {
        id: "page-research",
        title: "Research, Scopus Publications & Grants",
        category: "Research",
        snippet: "Searchable register of 68 Scopus/WoS publications, ₹142.5L DST/CSIR grants, and Central Instrumentation Facility.",
        url: "/college/research",
        badge: "Metric 3.3.1",
      },
    ];

    // Index College Notices
    collegeNotices.forEach((n) => {
      items.push({
        id: `notice-${n.id}`,
        title: n.title,
        category: "Notices",
        snippet: n.summary || `Published on ${n.date} · Category: ${n.category}`,
        url: "/college/notices",
        badge: n.category,
      });
    });

    // Index Programmes
    programmes.forEach((p) => {
      items.push({
        id: `prog-${p.id}`,
        title: `${p.name} (${p.degree})`,
        category: "Academics",
        snippet: `${p.level} programme · Duration: ${p.duration} · Seats: ${p.intake} · Dept: ${p.department}`,
        url: `/college/programmes/${p.slug}`,
        badge: p.level,
      });
    });

    // Index Departments
    departments.forEach((d) => {
      items.push({
        id: `dept-${d.id}`,
        title: `Department of ${d.name}`,
        category: "Academics",
        snippet: `HOD: ${d.hod} · ${d.description}`,
        url: `/college/departments/${d.slug}`,
        badge: "Department",
      });
    });

    // Index Scopus Papers
    MOCK_PUBLICATIONS_DATA.publications.slice(0, 15).forEach((pub) => {
      items.push({
        id: `pub-${pub.id}`,
        title: pub.paperTitle,
        category: "Research",
        snippet: `Authors: ${pub.authors.join(", ")} · Journal: ${pub.journalName} (${pub.publicationYear})`,
        url: "/college/research",
        badge: `IF: ${pub.impactFactor || 3.5}`,
      });
    });

    return items;
  }, [isSchool]);

  const categories = useMemo(() => {
    if (isSchool) {
      return ["All", "Notices", "Academics", "Statutory Disclosure", "Administration", "Student Welfare", "Facilities"];
    }
    return ["All", "Notices", "Academics", "NAAC / IQAC", "Research", "Administration", "Services"];
  }, [isSchool]);

  const results = useMemo(() => {
    if (!query.trim()) return searchIndex.slice(0, 8);
    const q = query.toLowerCase();
    return searchIndex.filter((item) => {
      const matchCat = filterCategory === "All" || item.category === filterCategory;
      const matchText =
        item.title.toLowerCase().includes(q) ||
        item.snippet.toLowerCase().includes(q) ||
        (item.badge && item.badge.toLowerCase().includes(q));
      return matchCat && matchText;
    });
  }, [query, filterCategory, searchIndex]);

  const handleSelect = (url: string) => {
    onOpenChange(false);
    navigate(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden shadow-2xl border-primary/20">
        <DialogHeader className="p-4 border-b border-border/60 bg-muted/20">
          <DialogTitle className="text-sm font-bold text-foreground flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Search className="size-4 text-primary" />
              {isSchool ? "Our School Portal Search (CBSE & Odisha S&ME)" : "Our College Portal Search (Odisha State Repository)"}
            </span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded border border-border text-muted-foreground">
              ESC to close
            </kbd>
          </DialogTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={
                isSchool
                  ? "Search Appendix IX, RTE 25% quota, PM-POSHAN, SMC, faculty, circulars..."
                  : "Search notices, syllabi, NAAC documents, tenders, research, staff..."
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 h-10 text-sm bg-background border-border/80 focus-visible:ring-primary"
              autoFocus
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <span className="text-[11px] font-semibold text-muted-foreground mr-1">Filter:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full border transition-all ${
                  filterCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:bg-muted/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </DialogHeader>

        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {results.length > 0 ? (
            results.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item.url)}
                className="group flex items-start justify-between gap-3 p-2.5 rounded-lg hover:bg-primary/10 cursor-pointer transition-all border border-transparent hover:border-primary/20"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                      {item.title}
                    </span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0 shrink-0">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-1 leading-snug">
                    {item.snippet}
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-1 text-[11px] font-mono text-muted-foreground group-hover:text-primary">
                  <span>{item.category}</span>
                  <ExternalLink className="size-3" />
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-xs text-muted-foreground space-y-1">
              <Search className="size-6 mx-auto text-muted-foreground/60 mb-1" />
              <div className="font-semibold text-foreground">
                {isSchool ? "No matching school records found" : "No matching college records found"}
              </div>
              <p>
                {isSchool
                  ? "Try searching for \"Appendix IX\", \"RTE\", \"PM-POSHAN\", \"SMC\", or \"Fee\"."
                  : "Try searching for \"AQAR\", \"Syllabus\", \"Tender\", \"Hostel\", or \"Admission\"."}
              </p>
            </div>
          )}
        </div>

        <div className="p-2 border-t border-border/50 bg-muted/10 text-[10px] text-muted-foreground flex items-center justify-between px-4">
          <span>{isSchool ? "CBSE Circular 1/2026 & GIGW 3.0 Search Compliant" : "GIGW 3.0 & UGC Public Disclosure Search Compliant"}</span>
          <span>Showing {results.length} results</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
