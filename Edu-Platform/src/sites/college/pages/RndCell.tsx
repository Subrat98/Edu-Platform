import { Link } from "react-router-dom";
import {
  FlaskConical,
  ShieldCheck,
  Award,
  BookOpen,
  FileText,
  Download,
  Lightbulb,
  CheckCircle2,
  ExternalLink,
  Users,
  Scale,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { collegeHeroUrl } from "@/mocks/data/images";
import { institutions } from "@/mocks/data/institutions";

export default function RndCell() {
  const institution = institutions.college;

  const rndPolicies = [
    {
      title: "University Seed Money Grant Scheme",
      category: "Early-Career Grant",
      description: "Financial assistance up to ₹5.00 Lakhs provided to newly joined assistant professors to establish laboratory baselines and pilot extramural grant applications.",
      eligibility: "Regular faculty within 3 years of appointment",
      docRef: "SEED-GRANT-SOP-2024.pdf",
    },
    {
      title: "Research Incentive & Author Honors Policy",
      category: "Incentive Norms",
      description: "Direct cash incentives and research contingency grants awarded for faculty papers published in Q1/Q2 Scopus / Web of Science indexed journals and national patents granted.",
      eligibility: "All university faculty, postdocs, and scholars",
      docRef: "RESEARCH-INCENTIVE-POLICY.pdf",
    },
    {
      title: "Policy on Academic Integrity & Plagiarism Check",
      category: "Ethical Standards",
      description: "Mandatory screening of all doctoral dissertations, postgraduate theses, and research papers through Turnitin / Urkund. Plagiarism similarity index must not exceed 10%.",
      eligibility: "Mandatory for all Master's & Ph.D. scholars",
      docRef: "UGC-PLAGIARISM-REGULATIONS.pdf",
    },
    {
      title: "Intellectual Property Rights (IPR) & Patents Policy",
      category: "Technology Transfer",
      description: "Framework for patent filing, institutional patent attorney support, copyright registration, licensing agreements, and university-incubated startup spin-offs.",
      eligibility: "Faculty, researchers, and student innovators",
      docRef: "IPR-POLICY-HANDBOOK.pdf",
    },
  ];

  const ethicsCommittees = [
    {
      name: "Institutional Human Ethics Committee (IHEC)",
      mandate: "Reviews all clinical, socio-medical, and behavioral research protocols involving human participants in accordance with ICMR guidelines.",
      head: "Dean of Medical Sciences / External Jurist",
    },
    {
      name: "Institutional Animal Ethics Committee (IAEC)",
      mandate: "Oversees humane maintenance, breeding, and experimentation protocols for laboratory animal houses in compliance with CPCSEA norms.",
      head: "Prof. of Zoology / CPCSEA Nominee",
    },
    {
      name: "Institutional Biosafety Committee (IBSC)",
      mandate: "Monitors recombinant DNA research, genetic engineering protocols, and biohazardous waste containment under DBT guidelines.",
      head: "Dean of Life Sciences & DBT Nominee",
    },
    {
      name: "University Research Advisory Board (RAB)",
      mandate: "Apex advisory body formulating long-term interdisciplinary research roadmaps, national lab tie-ups, and corporate CSR collaborations.",
      head: "Vice-Chancellor & Director, RDC",
    },
  ];

  const focusThrustAreas = [
    { area: "Advanced Functional Materials & Nanotechnology", depts: "Physics, Chemistry, Materials Science" },
    { area: "Biodiversity & Natural Product Bio-Prospection", depts: "Botany, Zoology, Biotechnology" },
    { area: "Artificial Intelligence, Quantum & Data Science", depts: "Computer Science, Statistics, Mathematics" },
    { area: "Heritage Studies, Odishan Epigraphy & Tribal Culture", depts: "History, Odia, Anthropology, Sanskrit" },
    { area: "Climate Resilience, Coastal & Water Ecology", depts: "Environmental Science, Geology, Geography" },
    { area: "Socio-Economic Policy, Rural & Tribal Welfare", depts: "Economics, Public Admin, Sociology, MSW" },
  ];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Research", href: "/college/research" },
          { label: "Research & Development Cell" },
        ]}
      />

      <Hero
        variant="compact"
        title="Research & Development Cell (RDC)"
        subtitle="Institutional Seed Grants, Research Advisory, Ethics Protocols & IPR Support"
        imageUrl={collegeHeroUrl(6)}
      />

      <Container className="py-10 space-y-12">
        {/* Intro */}
        <div className="space-y-4 border-b pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
              UGC RDC Guidelines Compliant
            </Badge>
            <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs">
              Innovation & Technology Transfer
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Research & Development Directorate (RDC)
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
            Established in accordance with the UGC National Guidelines on Research & Development Cells,
            the RDC at {institution.name} serves as the nodal institutional engine driving high-impact scholarly inquiry,
            industry-funded research, statutory ethics compliance, institutional seed grants, and technology commercialization.
          </p>
        </div>

        {/* Thrust Research Areas Grid */}
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Lightbulb className="size-5 text-primary" />
              Interdisciplinary Thrust Research Areas
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Priority academic clusters driving collaborative discoveries and international funding.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {focusThrustAreas.map((t, idx) => (
              <Card key={idx} className="p-4 border border-border/70 bg-card space-y-2">
                <Badge variant="outline" className="text-[10px] font-mono text-primary border-primary/30">
                  Cluster 0{idx + 1}
                </Badge>
                <h3 className="font-bold text-sm text-foreground">{t.area}</h3>
                <p className="text-xs text-muted-foreground">Contributing Faculties: {t.depts}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Core R&D Policies */}
        <div className="space-y-6">
          <div className="border-b pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Scale className="size-5 text-primary" />
                Institutional Research Policies & Seed Grants
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Statutory policies ratified by the Syndicate for promoting ethics, funding, and publication quality.
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-mono w-fit">
              Approved SOPs
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rndPolicies.map((p, idx) => (
              <Card key={idx} className="p-5 border border-border/70 bg-card hover:border-primary/40 transition-all shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                      {p.category}
                    </Badge>
                    <span className="text-[10px] font-mono text-muted-foreground">{p.docRef}</span>
                  </div>
                  <h3 className="font-bold text-base text-foreground leading-snug">{p.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
                  <div className="text-[11px] text-muted-foreground pt-1">
                    <span className="font-bold text-foreground">Target Group: </span>
                    {p.eligibility}
                  </div>
                </div>

                <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground font-mono">Official PDF SOP</span>
                  <Button size="xs" variant="outline" className="gap-1 text-xs text-primary border-primary/30">
                    <Download className="size-3" />
                    <span>Download Policy</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Statutory Ethics Committees */}
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              Statutory Research Ethics & Safety Committees
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Independent institutional oversight bodies ensuring international bioethics and safety protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ethicsCommittees.map((ec, i) => (
              <Card key={i} className="p-4 border border-border/70 bg-card space-y-2">
                <Badge variant="secondary" className="text-[10px] font-mono">
                  {ec.head}
                </Badge>
                <h4 className="font-bold text-sm text-foreground">{ec.name}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{ec.mandate}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Nav to Publications & Grants */}
        <div className="p-6 rounded-2xl bg-muted/40 border border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-base text-foreground">Explore Publications & Sponsored Grants</h3>
            <p className="text-xs text-muted-foreground">Browse verified Scopus-indexed research articles or explore funded projects from DST and CSIR.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm" variant="outline" asChild className="gap-1.5 text-xs text-primary border-primary/30">
              <Link to="/college/research/grants">
                <Award className="size-3.5" />
                <span>Sponsored Grants</span>
              </Link>
            </Button>
            <Button size="sm" asChild className="gap-1.5 bg-primary text-white text-xs font-bold shadow-xs">
              <Link to="/college/research/publications">
                <span>Scopus Publications Register</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
