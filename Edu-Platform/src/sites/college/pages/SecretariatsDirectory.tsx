import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  Building2,
  Search,
  ShieldCheck,
  Building,
  HeartPulse,
  Landmark,
  FileText,
  UserCheck,
  ChevronRight,
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { collegeHeroUrl } from "@/mocks/data/images";
import { institutions } from "@/mocks/data/institutions";

export default function SecretariatsDirectory() {
  const institution = institutions.college;
  const [search, setSearch] = useState("");
  const [filterWing, setFilterWing] = useState<string>("All");

  const directoryEntries = [
    {
      wing: "Executive",
      office: "Vice-Chancellor's Secretariat",
      inCharge: "Officer on Special Duty (OSD) & PS to VC",
      location: "Administrative Quadrangle, 1st Floor",
      extn: "101 / 102",
      phone: "+91 674 2567101",
      email: "principal@ourcollege.edu.in",
    },
    {
      wing: "General Admin",
      office: "Registrar's Directorate",
      inCharge: "Dr. Ashok Panigrahi, OAS (SAG), Registrar",
      location: "Administrative Block, Ground Floor",
      extn: "110",
      phone: "+91 674 2567387",
      email: "registrar@ourcollege.edu.in",
    },
    {
      wing: "General Admin",
      office: "Establishment Branch (Teaching & Non-Teaching)",
      inCharge: "Assistant Registrar (Estt.)",
      location: "Administrative Block, Wing B",
      extn: "114 / 115",
      phone: "+91 674 2567390",
      email: "establishment@ourcollege.edu.in",
    },
    {
      wing: "General Admin",
      office: "Legal Cell & Syndicate Secretariat",
      inCharge: "Law Officer & Section Officer",
      location: "Administrative Block, 1st Floor",
      extn: "120",
      phone: "+91 674 2567395",
      email: "legal@ourcollege.edu.in",
    },
    {
      wing: "Examinations",
      office: "Controller of Examinations (Directorate)",
      inCharge: "Dr. Rashmita Patnaik, COE",
      location: "Examination Directorate, New Block",
      extn: "201",
      phone: "+91 671 2201690",
      email: "coe@ourcollege.edu.in",
    },
    {
      wing: "Examinations",
      office: "Tabulation & Degree Verification Cell",
      inCharge: "Assistant Controller of Examinations",
      location: "Examination Directorate, Counter 4",
      extn: "205 / 206",
      phone: "+91 671 2201694",
      email: "tabulation.coe@ourcollege.edu.in",
    },
    {
      wing: "Finance",
      office: "Comptroller of Finance (COF Directorate)",
      inCharge: "Shri Debasish Mallick, OFS, COF",
      location: "Finance Wing, 1st Floor",
      extn: "301",
      phone: "+91 674 2567404",
      email: "cof@ourcollege.edu.in",
    },
    {
      wing: "Finance",
      office: "Accounts, Bill & Salary Section",
      inCharge: "Accounts Officer & Treasury Superintendent",
      location: "Finance Wing, Ground Floor",
      extn: "305",
      phone: "+91 674 2567408",
      email: "accounts@ourcollege.edu.in",
    },
    {
      wing: "Academic",
      office: "P.G. Council Secretariat",
      inCharge: "Prof. Satyabrata Dash, Chairperson CPGC",
      location: "P.G. Council Building, Ground Floor",
      extn: "401",
      phone: "+91 674 2567202",
      email: "cpgc@ourcollege.edu.in",
    },
    {
      wing: "Academic",
      office: "Central PG Admissions & SAMS Helpdesk",
      inCharge: "Admission Nodal Officer",
      location: "P.G. Council Building, Room 104",
      extn: "405",
      phone: "+91 674 2567210",
      email: "admissions@ourcollege.edu.in",
    },
    {
      wing: "Quality",
      office: "Internal Quality Assurance Cell (IQAC)",
      inCharge: "Dr. Snigdha Mohanty, Director IQAC",
      location: "Golden Jubilee Block, 2nd Floor",
      extn: "501",
      phone: "+91 674 2567505",
      email: "iqac.director@ourcollege.edu.in",
    },
    {
      wing: "Student Welfare",
      office: "Dean of Students' Welfare (DSW)",
      inCharge: "Prof. Manas Ranjan Pradhan, DSW",
      location: "Students' Welfare Complex",
      extn: "601",
      phone: "+91 674 2567707",
      email: "dsw@ourcollege.edu.in",
    },
    {
      wing: "Student Welfare",
      office: "Board of Residence (Hostel Administration)",
      inCharge: "Prof. Animesh Senapati, Chief Warden",
      location: "Board of Residence Office, Central Ave",
      extn: "605",
      phone: "+91 674 2567606",
      email: "chiefwarden@ourcollege.edu.in",
    },
    {
      wing: "Infrastructure",
      office: "Estate, Works & Civil Engineering Section",
      inCharge: "Superintending University Engineer",
      location: "Engineering Division, West Gate",
      extn: "701",
      phone: "+91 674 2567801",
      email: "estate@ourcollege.edu.in",
    },
    {
      wing: "Emergency",
      office: "University Health Centre (24x7 Emergency)",
      inCharge: "Chief Medical Officer (CMO)",
      location: "Campus Health Centre, Gate 2",
      extn: "801",
      phone: "+91 674 2567911",
      email: "healthcentre@ourcollege.edu.in",
    },
    {
      wing: "Emergency",
      office: "Security Control Room (24x7 Central Desk)",
      inCharge: "Security Officer & Chief Marshal",
      location: "Gate No. 1 Security Complex",
      extn: "900",
      phone: "+91 674 2567000",
      email: "security@ourcollege.edu.in",
    },
    {
      wing: "Public Info",
      office: "RTI & Public Information Cell",
      inCharge: "Public Information Officer (PIO)",
      location: "Administrative Block, Counter 2",
      extn: "118",
      phone: "+91 674 2567389",
      email: "rti@ourcollege.edu.in",
    },
  ];

  const wings = ["All", "Executive", "General Admin", "Examinations", "Finance", "Academic", "Student Welfare", "Emergency", "Public Info"];

  const filteredEntries = useMemo(() => {
    return directoryEntries.filter((item) => {
      const matchWing = filterWing === "All" || item.wing === filterWing;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.office.toLowerCase().includes(q) ||
        item.inCharge.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.phone.includes(q) ||
        item.email.toLowerCase().includes(q);
      return matchWing && matchSearch;
    });
  }, [directoryEntries, filterWing, search]);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Administration", href: "/college/administration" },
          { label: "Secretariats & Directory" },
        ]}
      />

      <Hero
        variant="compact"
        title="Secretariats & Directory"
        subtitle="Campus Administrative Portfolios, Direct Extensions & Official Helpdesks"
        imageUrl={collegeHeroUrl(2)}
      />

      <Container className="py-10 space-y-12">
        {/* Intro */}
        <div className="space-y-4 border-b pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
              Administrative Network
            </Badge>
            <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs">
              Official University Directory
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Administrative Secretariats & Contact Directory
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
            Directory of key administrative directorates, academic wings, student welfare offices, and emergency services
            at {institution.name}. Intercom extensions, direct landlines, and official domain emails are provided for all administrative officers.
          </p>
        </div>

        {/* Emergency Quick-Contact Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 border border-rose-500/30 bg-rose-500/5 space-y-1.5">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="size-4" />
              <span>Security (24x7)</span>
            </div>
            <div className="font-bold text-sm text-foreground">+91 674 2567000</div>
            <div className="text-[11px] text-muted-foreground">Main Gate 1 Control Room</div>
          </Card>

          <Card className="p-4 border border-emerald-500/30 bg-emerald-500/5 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
              <HeartPulse className="size-4" />
              <span>Health Centre</span>
            </div>
            <div className="font-bold text-sm text-foreground">+91 674 2567911</div>
            <div className="text-[11px] text-muted-foreground">Campus Medical Officer & Ambulance</div>
          </Card>

          <Card className="p-4 border border-blue-500/30 bg-blue-500/5 space-y-1.5">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
              <Building2 className="size-4" />
              <span>Registrar Office</span>
            </div>
            <div className="font-bold text-sm text-foreground">+91 674 2567387</div>
            <div className="text-[11px] text-muted-foreground">General Administration Secretariat</div>
          </Card>

          <Card className="p-4 border border-amber-500/30 bg-amber-500/5 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
              <FileText className="size-4" />
              <span>Examination Cell</span>
            </div>
            <div className="font-bold text-sm text-foreground">+91 671 2201690</div>
            <div className="text-[11px] text-muted-foreground">Controller of Examinations (COE)</div>
          </Card>
        </div>

        {/* Search & Filter Controls */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search by office, officer, phone, or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>
            <span className="text-xs text-muted-foreground">
              Showing {filteredEntries.length} of {directoryEntries.length} administrative offices
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {wings.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setFilterWing(w)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  filterWing === w
                    ? "bg-primary text-white shadow-xs font-bold"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Table */}
        <Card className="border border-border/70 bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-xs font-bold w-52">Office / Directorate</TableHead>
                <TableHead className="text-xs font-bold w-56">Officer-in-Charge</TableHead>
                <TableHead className="text-xs font-bold hidden md:table-cell">Campus Location</TableHead>
                <TableHead className="text-xs font-bold w-24">Extn</TableHead>
                <TableHead className="text-xs font-bold w-36">Phone</TableHead>
                <TableHead className="text-xs font-bold text-right w-48">Official Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((item, idx) => (
                <TableRow key={idx} className="hover:bg-muted/20">
                  <TableCell className="font-bold text-xs text-foreground">
                    <div>{item.office}</div>
                    <Badge variant="outline" className="text-[9px] font-mono mt-0.5 md:hidden">
                      {item.wing}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-foreground/90 font-medium">
                    {item.inCharge}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground hidden md:table-cell">
                    {item.location}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-primary font-semibold">
                    {item.extn}
                  </TableCell>
                  <TableCell className="text-xs text-foreground whitespace-nowrap">
                    {item.phone}
                  </TableCell>
                  <TableCell className="text-right text-xs">
                    <a href={`mailto:${item.email}`} className="text-primary hover:underline font-mono">
                      {item.email}
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Working Hours & General Enquiries Strip */}
        <div className="p-6 rounded-2xl bg-muted/40 border border-border/70 space-y-2">
          <div className="flex items-center gap-2">
            <Building className="size-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Administrative Working Hours</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            University administrative secretariats, accounts counters, and examination directorates function from
            **10:00 AM to 5:00 PM (Monday through Saturday)**, excluding second Saturdays and notified state government holidays.
            Student public counter services operate from 11:00 AM to 3:00 PM.
          </p>
        </div>
      </Container>
    </>
  );
}
