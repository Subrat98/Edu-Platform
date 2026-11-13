import { Link } from "react-router-dom";
import {
  Globe,
  Mail,
  MapPin,
  Phone,
  Award,
  ShieldCheck,
  ExternalLink,
  Building2,
  Calendar,
  Eye,
  FileCheck2,
  GraduationCap,
  Landmark,
} from "lucide-react";
import { Container } from "@/components/common/Container";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { useQuery } from "@tanstack/react-query";
import { navMenuService } from "@/features/content/navMenuService";
import { queryKeys } from "@/lib/queryKeys";
import { Badge } from "@/components/ui/badge";

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  const { institutionId, institution } = useInstitutionData();
  const { data: menu } = useQuery({
    queryKey: queryKeys.navMenu(institutionId),
    queryFn: () => navMenuService.get(institutionId),
  });

  const isCollege = institutionId === "college";

  return (
    <footer className="bg-primary text-white border-t border-primary/20">
      {/* Top Banner Strip */}
      <div className="border-b border-white/10 bg-white/5 py-3">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {isCollege ? (
            <>
              <div className="flex items-center gap-3">
                <Badge className="bg-amber-400 text-slate-950 font-bold border-amber-300">
                  NAAC Grade A+
                </Badge>
                <span className="text-white/80">
                  CGPA 3.42 · Cycle 3 Accredited State University · Valid through 2028
                </span>
              </div>
              <div className="flex items-center gap-4 text-white/70">
                <span>UGC 2(f) & 12(B)</span>
                <span>·</span>
                <span>AISHE Code: U-0355</span>
                <span>·</span>
                <span>NIRF State Category Rank 42</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Badge className="bg-amber-400 text-slate-950 font-bold border-amber-300">
                  CBSE Affiliated
                </Badge>
                <span className="text-white/80">
                  Affiliation No. 3330123 · School Code: 15234 · Nursery to Class XII
                </span>
              </div>
              <div className="flex items-center gap-4 text-white/70">
                <span>Safe & Caring Campus</span>
                <span>·</span>
                <span>Co-Educational K-12</span>
                <span>·</span>
                <span>Khandapara, Nayagarh, Odisha</span>
              </div>
            </>
          )}
        </Container>
      </div>

      {/* Main 4-Column Layout */}
      <Container className="grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Column 1: Institution Identity & Official Contact */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white text-base">
              {isCollege ? (
                <Landmark className="size-5 text-amber-300" />
              ) : (
                <GraduationCap className="size-5 text-amber-300" />
              )}
            </div>
            <div>
              <span className="font-heading text-base font-bold block leading-tight">
                {institution?.name}
              </span>
              <span className="text-xs text-amber-300 block">
                {isCollege ? "Our College" : institution?.tagline}
              </span>
            </div>
          </div>
          <p className="text-xs text-white/75 leading-relaxed">
            {institution?.description}
          </p>

          {isCollege ? (
            <div className="p-3 rounded-lg bg-white/10 border border-white/15 space-y-1 text-xs">
              <div className="font-semibold text-amber-300">Secretariat Helplines</div>
              <div className="text-white/80">Registrar Office: +91 674 2567387</div>
              <div className="text-white/80">COE Exam Cell: +91 671 2201690</div>
              <div className="text-white/80 text-[11px] truncate">Email: {institution?.contact.email ?? "registrar@ourcollege.edu.in"}</div>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-white/10 border border-white/15 space-y-1 text-xs">
              <div className="font-semibold text-amber-300">School Office & Helpdesk</div>
              <div className="text-white/80">Reception: {institution?.contact.phone ?? "+91 98765 43210"}</div>
              <div className="text-white/80">Admissions: {institution?.contact.altPhone ?? "+91 674 223 4567"}</div>
              <div className="text-white/80 text-[11px] truncate">Email: {institution?.contact.email ?? "info@psps.eduplatform.demo"}</div>
            </div>
          )}
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <p className="text-xs font-bold tracking-wider text-amber-300 uppercase">
            Quick Links
          </p>
          <ul className="mt-3 space-y-2 text-xs">
            {(menu?.footerQuickLinks ?? []).map((link) => (
              <li key={link.label}>
                <Link to={link.path} className="text-white/80 hover:text-white hover:underline transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Academic & Institutional Disclosures */}
        <div>
          <p className="text-xs font-bold tracking-wider text-amber-300 uppercase">
            {isCollege ? "Academic & NAAC Dossier" : "Academics & Life"}
          </p>
          <ul className="mt-3 space-y-2 text-xs">
            {(menu?.footerAcademicLinks ?? (isCollege ? [
              { label: "IQAC Public Portal", path: "/college/iqac" },
              { label: "NAAC SSR Cycle 3 Dossier", path: "/college/iqac" },
              { label: "AQAR 8-Year Archive", path: "/college/iqac" },
              { label: "Criteria 1–7 Evidence", path: "/college/iqac" },
              { label: "R&D & Scopus Register", path: "/college/research" },
              { label: "Central Library OPAC", path: "/college/library" },
              { label: "Alumni Network & Giving", path: "/college/alumni" },
              { label: "Tenders & GeM Notices", path: "/college/tenders" },
            ] : [
              { label: "Curriculum & Academics", path: "/school/academics" },
              { label: "Faculty & Staff Directory", path: "/school/faculty-staff" },
              { label: "Board Results & Toppers", path: "/school/results" },
              { label: "Campus Facilities & Labs", path: "/school/facilities" },
              { label: "School Library Catalogue", path: "/school/library" },
              { label: "Student Life & Houses", path: "/school/student-life" },
              { label: "Photo & Video Gallery", path: "/school/gallery" },
            ])).map((link) => (
              <li key={link.label}>
                <Link to={link.path} className="text-white/80 hover:text-white hover:underline transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Student Support & Statutory Policies */}
        <div>
          <p className="text-xs font-bold tracking-wider text-amber-300 uppercase">
            {isCollege ? "Support, Welfare & Governance" : "Parents & Admissions"}
          </p>
          <ul className="mt-3 space-y-2 text-xs">
            {(menu?.footerSupportLinks ?? (isCollege ? [
              { label: "Online Grievance (e-Pratikar)", path: "/college/grievance" },
              { label: "Anti-Ragging 24x7 Cell", path: "/college/grievance" },
              { label: "Internal Committee (ICC)", path: "/college/grievance" },
              { label: "Equal Opportunity Cell", path: "/college/grievance" },
              { label: "Virtual Campus Tour", path: "/college/virtual-tour" },
              { label: "How to Reach Campus", path: "/college/virtual-tour" },
              { label: "Faculty Recruitment", path: "/college/recruitment" },
              { label: "Mandatory Disclosure (UGC)", path: "/college/disclosure" },
            ] : [
              { label: "Admission Guidelines & Enquiry", path: "/school/admissions" },
              { label: "Parent Corner & Circulars", path: "/school/parent-corner" },
              { label: "School Notices & Updates", path: "/school/notices" },
              { label: "Upcoming Events & Calendar", path: "/school/events" },
              { label: "Downloads & Forms", path: "/school/downloads" },
              { label: "Contact School Office", path: "/school/contact" },
            ])).map((link) => (
              <li key={link.label}>
                <Link to={link.path} className="text-white/80 hover:text-white hover:underline transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {/* GIGW 3.0 Compliance, Visitor Counter & Legal */}
      <div className="border-t border-white/15 bg-slate-950/40 py-5">
        <Container className="flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <div className="space-y-1 text-center lg:text-left">
            <div>
              © {CURRENT_YEAR} {institution?.name}. {isCollege ? "Official Portal Developed & Maintained under Odisha State University Standards." : "Official Portal Developed & Maintained for School Education Standards."}
            </div>
            <div className="text-[11px] text-white/50">
              Compliant with Guidelines for Indian Government Websites (GIGW 3.0) & WCAG 2.1 AA Standards.
            </div>
          </div>

          {/* Telemetry Counter & Last Updated */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 font-mono">
              <Eye className="size-3 text-amber-400" />
              <span>Visitor Count: <strong>1,428,950</strong></span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10">
              <Calendar className="size-3 text-sky-400" />
              <span>Last Updated: <strong>13 November 2026</strong></span>
            </div>
          </div>
        </Container>

        {/* Policy Badges & Disclaimer */}
        <Container className="pt-3 border-t border-white/10 mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/60">
          <div className="flex flex-wrap gap-4">
            <Link to={isCollege ? "/college/policies/privacy-policy" : "/school/policies/privacy-policy"} className="hover:text-white hover:underline">
              Privacy Policy
            </Link>
            <Link to={isCollege ? "/college/policies/terms-and-conditions" : "/school/policies/terms-and-conditions"} className="hover:text-white hover:underline">
              Terms & Conditions
            </Link>
            <Link to={isCollege ? "/college/disclosure" : "/school/about"} className="hover:text-white hover:underline">
              Hyperlinking Policy
            </Link>
            <Link to={isCollege ? "/college/disclosure" : "/school/about"} className="hover:text-white hover:underline">
              Accessibility Statement
            </Link>
            <Link to={isCollege ? "/college/disclosure" : "/school/contact"} className="hover:text-white hover:underline">
              {isCollege ? "RTI Act Section 4(1)(b)" : "Contact Office"}
            </Link>
          </div>
          <div className="text-[10px] text-white/40">
            Hosted securely on National Informatics Centre (NIC) / Government Cloud
          </div>
        </Container>
      </div>
    </footer>
  );
}
