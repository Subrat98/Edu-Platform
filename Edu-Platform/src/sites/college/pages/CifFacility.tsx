import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Cpu,
  Microscope,
  Zap,
  Activity,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { collegeHeroUrl } from "@/mocks/data/images";
import { institutions } from "@/mocks/data/institutions";

interface Instrument {
  id: string;
  name: string;
  shortName: string;
  category: "Imaging & Surface" | "Spectroscopy" | "Thermal & Chromatography" | "Elemental Analysis";
  makeModel: string;
  fundingScheme: string;
  specs: string[];
  applications: string[];
  sampleRequirements: string;
  inCharge: string;
  internalRate: string;
  externalAcademicRate: string;
  industryRate: string;
  status: "Operational" | "Scheduled Maintenance";
}

const INSTRUMENTS_LIST: Instrument[] = [
  {
    id: "fe-sem",
    name: "Field Emission Scanning Electron Microscope with EDS",
    shortName: "FE-SEM + EDS",
    category: "Imaging & Surface",
    makeModel: "JEOL JSM-7610FPlus / Oxford Aztec Energy",
    fundingScheme: "DST-FIST Grant",
    specs: [
      "Resolution: 1.0 nm at 15 kV, 1.5 nm at 1 kV",
      "Magnification: 25x to 1,000,000x",
      "Accelerating Voltage: 0.1 to 30 kV",
      "Detectors: In-lens SE, Upper SE, BSE, EDS (Silicon Drift Detector 50 mm²)",
      "Gold / Platinum Sputter Coater equipped",
    ],
    applications: [
      "Nanomaterials morphology and dimensional verification",
      "Elemental microanalysis, chemical mapping and line profiling",
      "Biological specimen ultrastructure and biofilm topology",
      "Fractography and metallurgical failure investigation",
    ],
    sampleRequirements: "Dry solid powder or thin film (< 10 mm diameter). Samples must be non-magnetic, non-volatile, and moisture-free.",
    inCharge: "Dr. Alok Nayak (Scientist-in-Charge)",
    internalRate: "₹300 / sample",
    externalAcademicRate: "₹1,200 / sample",
    industryRate: "₹3,500 / sample",
    status: "Operational",
  },
  {
    id: "xrd",
    name: "High Resolution Powder X-Ray Diffractometer",
    shortName: "HR-XRD",
    category: "Imaging & Surface",
    makeModel: "Bruker D8 Advance (DaVinci Design)",
    fundingScheme: "Institutional Endowment",
    specs: [
      "X-ray Source: Sealed Ceramic Cu-Kα Tube (λ = 1.5406 Å)",
      "Detector: LYNXEYE XE-T High-Speed Energy-Dispersive 1D Detector",
      "Goniometer Radius: 280 mm, Angular Range: 2θ from -110° to 168°",
      "Automated 9-position sample changer with spinner stage",
    ],
    applications: [
      "Phase identification, quantification and crystalline phase matching (ICDD database)",
      "Rietveld refinement for lattice parameters and atomic positions",
      "Crystallite size and microstrain calculation (Scherrer analysis)",
      "Thin film grazing incidence diffraction (GIXRD)",
    ],
    sampleRequirements: "Homogenously ground fine powder (minimum 100 mg). Highly toxic samples must be pre-declared.",
    inCharge: "Dr. Rashmita Mishra (Coordinator)",
    internalRate: "₹200 / scan",
    externalAcademicRate: "₹800 / scan",
    industryRate: "₹2,500 / scan",
    status: "Operational",
  },
  {
    id: "nmr",
    name: "400 MHz FT-Nuclear Magnetic Resonance Spectrometer",
    shortName: "400 MHz NMR",
    category: "Spectroscopy",
    makeModel: "Bruker AVANCE NEO 400 MHz",
    fundingScheme: "DST-SERB Infrastructure",
    specs: [
      "Proton resonance frequency: 400.13 MHz, Field: 9.4 Tesla UltraShield",
      "Probe: 5 mm Broad Band Fluorine Observe (BBFO) Plus probe with automated tuning",
      "Supported Nuclei: 1H, 13C, 19F, 31P, 29Si, 11B",
      "2D NMR capabilities: COSY, NOESY, HSQC, HMBC",
    ],
    applications: [
      "Organic synthetic compound structural elucidation",
      "Natural product isolated fraction characterization",
      "Coordination complex geometry and ligand exchange kinetics",
      "Polymer end-group analysis and stereoregularity profiling",
    ],
    sampleRequirements: "Sample dissolved in 0.6 mL deuterated solvent (CDCl3, DMSO-d6, D2O, CD3OD). Clean 5 mm NMR tubes only.",
    inCharge: "Dr. B. K. Ray (Lead Spectroscopist)",
    internalRate: "₹250 (1H) / ₹500 (13C)",
    externalAcademicRate: "₹750 (1H) / ₹1,500 (13C)",
    industryRate: "₹2,000 (1H) / ₹4,000 (13C)",
    status: "Operational",
  },
  {
    id: "hplc",
    name: "High Performance Liquid Chromatography System",
    shortName: "HPLC (DAD/UV)",
    category: "Thermal & Chromatography",
    makeModel: "Waters Alliance e2695 with 2998 PDA Detector",
    fundingScheme: "UGC Non-SAP Support",
    specs: [
      "Quaternary solvent delivery pump with vacuum degasser",
      "Flow rate range: 0.050 to 5.000 mL/min",
      "Wavelength range: 190 to 800 nm with 1.2 nm optical resolution",
      "Autosampler capacity: 120 vials with temperature control (4°C - 40°C)",
    ],
    applications: [
      "Separation and quantification of active pharmaceutical ingredients (APIs)",
      "Pesticide residue trace monitoring in environmental water samples",
      "Plant secondary metabolite fingerprinting",
      "Chiral separation of enantiomeric pharmaceuticals",
    ],
    sampleRequirements: "Clear liquid dissolved in HPLC grade mobile phase, filtered through 0.22 µm PTFE/PVDF syringe filter.",
    inCharge: "Dr. Suchitra Sahoo (Co-PI)",
    internalRate: "₹150 / injection",
    externalAcademicRate: "₹600 / injection",
    industryRate: "₹1,800 / injection",
    status: "Operational",
  },
  {
    id: "ftir",
    name: "Fourier Transform Infrared Spectrophotometer (FTIR-ATR)",
    shortName: "FTIR + Diamond ATR",
    category: "Spectroscopy",
    makeModel: "PerkinElmer Spectrum Two with Universal ATR",
    fundingScheme: "Institutional Development",
    specs: [
      "Spectral range: 8300 to 350 cm⁻¹ with KBr beamsplitter",
      "Spectral resolution: 0.5 cm⁻¹ standard",
      "Single-reflection diamond crystal ATR accessory for non-destructive analysis",
      "Atmospheric vapor compensation algorithm",
    ],
    applications: [
      "Organic functional group detection and finger-printing",
      "Polymer degradation and plasticizer identification",
      "Surface chemical modification tracking on functionalized nanoparticles",
      "Solid, liquid, and viscous paste direct qualitative screening",
    ],
    sampleRequirements: "Minimum 10 mg dry solid powder or 50 µL non-volatile liquid. No hydrofluoric acid or strongly caustic solutions.",
    inCharge: "Mr. Satish Panda (Senior Scientific Officer)",
    internalRate: "₹100 / sample",
    externalAcademicRate: "₹350 / sample",
    industryRate: "₹1,000 / sample",
    status: "Operational",
  },
  {
    id: "tga-dsc",
    name: "Simultaneous Thermal Analyzer (TGA - DSC)",
    shortName: "TGA-DSC (STA)",
    category: "Thermal & Chromatography",
    makeModel: "TA Instruments SDT 650 Discovery",
    fundingScheme: "DST-SERB Research Scheme",
    specs: [
      "Temperature range: Ambient to 1500 °C",
      "Heating rate: 0.1 to 100 °C/min",
      "Balance sensitivity: 0.1 µg",
      "Controlled purge gas atmospheres: N2, Ar, Air with dual mass flow controllers",
    ],
    applications: [
      "Thermal stability, oxidative degradation, and decomposition temperatures",
      "Glass transition, crystallization, and melting enthalpy determinations",
      "Moisture and volatile solvent content percentage analysis",
      "Reaction kinetics and residual ceramic/ash yield",
    ],
    sampleRequirements: "Solid dry fine powder (10 to 20 mg). Must specify expected decomposition byproducts.",
    inCharge: "Dr. Alok Nayak (In-Charge)",
    internalRate: "₹300 / run",
    externalAcademicRate: "₹1,000 / run",
    industryRate: "₹3,000 / run",
    status: "Operational",
  },
];

export default function CifFacility() {
  const institution = institutions.college;
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<string>("instruments");

  const filteredInstruments = selectedCategory === "All"
    ? INSTRUMENTS_LIST
    : INSTRUMENTS_LIST.filter((i) => i.category === selectedCategory);

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="Central Instrumentation Facility (CIF)"
        subtitle="A premier centralized analytical facility housing state-of-the-art electron microscopy, spectrometry, and thermal analysis instrumentation catering to multidisciplinary scientific research."
        backgroundImage={collegeHeroUrl}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Research", href: "/college/research" },
          { label: "Central Instrumentation Facility", href: "/college/research/cif" },
        ]}
      />

      <Container className="py-12 space-y-12">
        {/* Intro & Overview Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold px-3 py-1">
              Advanced Research Infrastructure
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Empowering Cutting-Edge Scientific Exploration
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              The Central Instrumentation Facility (CIF) functions as an open-access center of excellence created with generous funding from the Department of Science & Technology (DST-FIST), Council of Scientific & Industrial Research (CSIR), and institutional endowments.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Our mission is to foster high-impact cross-disciplinary discovery by offering sophisticated characterization tools, professional sample preparation assistance, and reliable analytical services to faculty, postgraduate scholars, doctoral fellows, and external academic or industrial researchers across eastern India.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild className="gap-2">
                <a href="#booking-procedure">
                  <Calendar className="w-4 h-4" /> Book Instrument Slot
                </a>
              </Button>
              <Button variant="outline" asChild className="gap-2">
                <a href="#tariff-rates">
                  <FileText className="w-4 h-4" /> View Tariff & User Charges
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Highlight Box */}
          <Card className="bg-gradient-to-br from-primary/5 via-card to-background border-primary/20 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Facility Quick Facts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-muted-foreground">Total High-End Instruments</span>
                <span className="font-bold text-foreground">6 Major Systems</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-muted-foreground">Annual Sample Analyses</span>
                <span className="font-bold text-foreground">3,800+ Samples</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-muted-foreground">Affiliated Research Scholars</span>
                <span className="font-bold text-foreground">120+ Active Users</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-muted-foreground">Turnaround Time (Standard)</span>
                <span className="font-bold text-emerald-600">3 - 5 Working Days</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-muted-foreground">Operating Schedule</span>
                <span className="font-bold text-foreground">Mon - Fri: 9:00 AM - 5:30 PM</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs for Facility Sections */}
        <Tabs defaultValue="instruments" className="space-y-6" onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <TabsList className="bg-muted/60 p-1">
              <TabsTrigger value="instruments" className="gap-2">
                <Microscope className="w-4 h-4" /> Instrumentation Catalog
              </TabsTrigger>
              <TabsTrigger value="booking" className="gap-2">
                <Calendar className="w-4 h-4" /> Slot Booking & SOP
              </TabsTrigger>
              <TabsTrigger value="tariff" className="gap-2">
                <Layers className="w-4 h-4" /> User Charges & Tariff
              </TabsTrigger>
              <TabsTrigger value="guidelines" className="gap-2">
                <ShieldAlert className="w-4 h-4" /> Safety & Policies
              </TabsTrigger>
            </TabsList>

            {activeTab === "instruments" && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-semibold uppercase">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Filter Instruments by Category"
                  className="h-9 px-3 text-xs rounded-md border border-input bg-background focus:ring-1 focus:ring-primary"
                >
                  <option value="All">All Categories</option>
                  <option value="Imaging & Surface">Imaging & Surface</option>
                  <option value="Spectroscopy">Spectroscopy</option>
                  <option value="Thermal & Chromatography">Thermal & Chromatography</option>
                </select>
              </div>
            )}
          </div>

          {/* Tab 1: Instruments Catalog */}
          <TabsContent value="instruments" className="space-y-6 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredInstruments.map((inst) => (
                <Card
                  key={inst.id}
                  className="bg-card border-border/80 hover:border-primary/50 transition-all hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <Badge variant="outline" className="text-xs font-semibold text-primary border-primary/30">
                          {inst.category}
                        </Badge>
                        <Badge
                          variant={inst.status === "Operational" ? "default" : "secondary"}
                          className={
                            inst.status === "Operational"
                              ? "bg-emerald-600/90 text-white text-xs"
                              : "bg-amber-500/10 text-amber-600 text-xs"
                          }
                        >
                          {inst.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-bold leading-tight">
                        {inst.name}
                      </CardTitle>
                      <CardDescription className="text-xs font-mono font-medium text-foreground pt-1">
                        Model: {inst.makeModel}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-0 text-xs">
                      <div>
                        <h4 className="font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-primary" /> Key Specifications:
                        </h4>
                        <ul className="space-y-1 text-muted-foreground pl-4 list-disc marker:text-primary">
                          {inst.specs.map((s, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-muted/30 p-3 rounded-lg space-y-1.5 border border-border/50">
                        <span className="font-semibold text-foreground block">Primary Applications:</span>
                        <p className="text-muted-foreground leading-relaxed">
                          {inst.applications.join("; ")}.
                        </p>
                      </div>

                      <div>
                        <span className="font-semibold text-foreground block mb-0.5">Sample Guidelines:</span>
                        <p className="text-muted-foreground italic text-[11px] leading-relaxed">
                          {inst.sampleRequirements}
                        </p>
                      </div>
                    </CardContent>
                  </div>

                  <div className="p-6 pt-0 border-t border-border/60 mt-4 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Academic Rate:</span>
                      <span className="font-bold text-primary">{inst.internalRate} (Internal)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-muted-foreground block text-[11px]">Scientist In-Charge:</span>
                      <span className="font-medium text-foreground">{inst.inCharge.split("(")[0]}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab 2: Booking Procedure & SOP */}
          <TabsContent value="booking" className="space-y-8 mt-0" id="booking-procedure">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" /> Standard Operating Procedure (SOP) for Slot Booking
                </CardTitle>
                <CardDescription>
                  Follow this mandatory four-step workflow to request instrument slots and retrieve analytical datasets.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl border border-border bg-muted/20 relative">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm mb-3">
                      1
                    </div>
                    <h4 className="font-bold text-sm text-foreground">Requisition Submission</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Download and fill out the official CIF Requisition Form. Ensure sample characteristics and safety declarations are signed by your Research Supervisor/HOD.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-border bg-muted/20 relative">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm mb-3">
                      2
                    </div>
                    <h4 className="font-bold text-sm text-foreground">Fee Payment & Slot Allotment</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Submit the form to the CIF Accounts Desk or pay online via the College Research Portal. The technical officer allocates a confirmed date and time slot.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-border bg-muted/20 relative">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm mb-3">
                      3
                    </div>
                    <h4 className="font-bold text-sm text-foreground">Sample Submission</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Deliver prepared and labeled samples to CIF Sample Desk 24 hours prior to the slot. Scholars may observe during the real-time measurement.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-border bg-muted/20 relative">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm mb-3">
                      4
                    </div>
                    <h4 className="font-bold text-sm text-foreground">Data Retrieval & Acknowledgement</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Collect electronic raw data files (.dat, .raw, .csv, .tif) via secure cloud drive. Acknowledge CIF in all resultant research publications and theses.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20 gap-4">
                  <div className="flex items-center gap-3">
                    <Download className="w-6 h-6 text-primary shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Download Official Requisition Form</h4>
                      <p className="text-xs text-muted-foreground">Standard CIF Requisition & Hazard Declaration Document (PDF)</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      alert("CIF Requisition Form (PDF) downloaded successfully.");
                    }}
                    className="gap-2 text-xs"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Form (PDF)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: User Charges & Tariff */}
          <TabsContent value="tariff" className="space-y-6 mt-0" id="tariff-rates">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" /> Subsidized User Tariff Structure
                </CardTitle>
                <CardDescription>
                  Highly subsidized nominal user charges levied to offset consumables, liquid nitrogen, target degradation, and annual maintenance contracts (AMC).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-border rounded-lg">
                    <thead className="bg-muted/60 text-foreground font-semibold border-b border-border">
                      <tr>
                        <th className="p-3">Instrument</th>
                        <th className="p-3">Make & Model</th>
                        <th className="p-3">Internal Scholars / Faculty</th>
                        <th className="p-3">External Academic Institutions</th>
                        <th className="p-3">Industry / Commercial</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {INSTRUMENTS_LIST.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                          <td className="p-3 font-semibold text-foreground">{item.shortName}</td>
                          <td className="p-3 text-muted-foreground font-mono text-[11px]">{item.makeModel}</td>
                          <td className="p-3 font-bold text-emerald-600">{item.internalRate}</td>
                          <td className="p-3 text-blue-600 font-medium">{item.externalAcademicRate}</td>
                          <td className="p-3 text-purple-600 font-medium">{item.industryRate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-muted/40 text-xs text-muted-foreground space-y-1">
                  <p>• Applicable GST (18%) is extra for external academic and commercial users.</p>
                  <p>• Gold/Platinum sputter coating for FE-SEM is charged additionally at ₹100 per stub for external scholars.</p>
                  <p>• Internal researchers may adjust charges against their active Seed Grants or DST/CSIR extramural project contingencies.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Guidelines & Policies */}
          <TabsContent value="guidelines" className="space-y-6 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-600" /> Laboratory Safety & Sample Protocols
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>No Radioactive or Explosive Materials:</strong> Samples releasing toxic or corrosive fumes under high vacuum are strictly prohibited in FE-SEM and HR-XRD.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Proper Labeling:</strong> All sample vials must carry clear permanent ink labels indicating sample code, chemical formula, and solvent composition.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Biological Waste Disposal:</strong> Biological samples must be fixed, dehydrated, and certified pathogen-free prior to loading into electron microscopes.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Personal Protective Equipment (PPE):</strong> Lab coats, nitrile gloves, and closed-toe safety footwear are mandatory inside CIF instrumentation bays.</span>
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" /> Mandatory CIF Acknowledgement Clause
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                  <p>
                    All users who publish scientific research articles, conference proceedings, or book chapters utilizing data generated from CIF instrumentation must explicitly acknowledge the facility:
                  </p>
                  <blockquote className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary font-serif italic text-foreground text-xs">
                    "The authors sincerely acknowledge the Central Instrumentation Facility (CIF), [College Name], for providing analytical access and technical assistance for the [Instrument Name] measurements used in this study."
                  </blockquote>
                  <p>
                    A digital reprint (PDF) or DOI link of the published paper must be communicated to <span className="text-primary font-medium">cif@eduplatform.ac.in</span> for institutional NAAC Criteria 3 compilation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Contact & Location Card */}
        <Card className="bg-muted/30 border-border/70">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Facility Location</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ground Floor, Science & Research Complex<br />
                    Central Campus, Knowledge City
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Operating Hours</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Monday to Friday: 09:00 AM – 05:30 PM<br />
                    Saturday: 09:30 AM – 01:30 PM (Sample Drop only)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Helpdesk & Booking Queries</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Email: cif@eduplatform.ac.in<br />
                    Phone: +91 674 230 4580 (Ext: 214)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
              to="/college/research/grants"
              className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-sm group flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                  Sponsored Research Grants
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">DST-SERB, CSIR, DBT sanctioned funds</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
