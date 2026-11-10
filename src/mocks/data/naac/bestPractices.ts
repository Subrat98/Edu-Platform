import type {
  BestPracticeItem,
  InstitutionalDistinctivenessItem,
} from "@/types";

export const initialBestPractices: BestPracticeItem[] = [
  {
    id: "bp-01",
    title: "Green Campus Microgrid & Zero-Waste Resource Conservation Model",
    academicYear: "2025-26",
    objectives:
      "To foster an ecologically sustainable educational ecosystem, reduce reliance on non-renewable fossil electricity, harvest rainwater, and manage 100% organic waste on campus.",
    context:
      "With escalating energy tariffs and regional water table depletion, the institution recognized its societal duty to establish a living laboratory of sustainability for students and local community.",
    practice:
      "Installed a 120 kW grid-connected rooftop solar photovoltaic array generating ~1.5 lakh units annually (42% of institution's daytime requirement). Built 4 rainwater harvesting recharge pits with 4.5 lakh litre holding capacity. Operationalized a decentralized mechanical composting unit processing canteen biodegradable waste into organic manure for botanical gardens.",
    evidence:
      "Solar net-metering settlement bills, Bureau of Energy Efficiency (BEE) certified audit report, and geo-tagged photographs of rainwater pits and composting facility.",
    outcome:
      "Reduction of ~120 metric tons of carbon emissions annually; campus energy bills decreased by 38%; 100% landscaping irrigation met via harvested and recycled water.",
    problemsEncountered:
      "High initial capital outlay required seed management funding and liaison with state power distribution utilities (TPCODL) for bidirectional net meters.",
    resourcesRequired:
      "Capital investment of ₹65 Lakhs (subsidized under MNRE scheme), trained technical workforce for periodic inverter and battery maintenance.",
    personResponsible: "Dr. Prasanna Sahoo (Convenor, Green Campus Committee)",
    status: "Active",
  },
  {
    id: "bp-02",
    title: "Rural STEM Outreach & Digital Literacy Empowerment Mission (SANKALP)",
    academicYear: "2025-26",
    objectives:
      "To bridge the urban-rural digital divide by deploying student-faculty volunteers to conduct free robotics, digital literacy, and foundational STEM workshops across regional government schools.",
    context:
      "Students in adjoining rural and tribal blocks often lack access to modern computer labs, experiential science kits, and digital skills necessary for higher education and employability.",
    practice:
      "Through 'Project SANKALP', 120 trained student volunteers accompanied by faculty visit 15 adopted schools on alternating Saturdays with portable STEM kits, basic laptops, and microcontrollers. Hands-on coding in Scratch and Python, practical science demonstrations, and cyber safety hygiene are taught in Odia and English.",
    evidence:
      "MoUs with District Education Office (DEO), attendance logs of 2,400+ school students, before-and-after baseline assessment reports, and felicitation certificate from State School & Mass Education Department.",
    outcome:
      "Over 2,400 rural students trained; 14 adopted schools established student science clubs; participating college student mentors demonstrated marked improvement in communication, empathy, and leadership skills.",
    problemsEncountered:
      "Logistical transport across remote rural hamlets during monsoon months and language adaptation of technical terminology.",
    resourcesRequired:
      "Dedicated college mobile van, 20 ruggedized educational laptops, DIY Arduino/sensor starter kits funded through institutional social responsibility corpus.",
    personResponsible: "Dr. Snigdha Mohanty (IQAC Coordinator & Project Lead)",
    status: "Active",
  },
];

export const initialInstitutionalDistinctiveness: InstitutionalDistinctivenessItem = {
  id: "id-01",
  title: "Heritage Stewardship, Indigenous Knowledge Systems & Tribal Artisanal Digitization Hub",
  academicYear: "2025-26",
  description:
    "Located in a region rich in indigenous culture, the college distinguishes itself through an institutional mission to digitally preserve, document, and commercially empower tribal handicrafts, handlooms, and indigenous knowledge systems (IKS) through interdisciplinary technology.",
  objectives:
    "To document endangered indigenous art forms (Pattachitra, Dokra casting, tribal handlooms), empower local artisanal clusters through e-commerce and digital branding, and integrate traditional knowledge with modern curriculum.",
  uniqueFeatures: [
    "Dedicated 'Digital Heritage Studio' equipped with high-resolution 3D scanners and digital preservation archives.",
    "Student-developed direct-to-consumer e-commerce portal connecting 120 tribal artisan families with global buyers without middlemen.",
    "Interdisciplinary elective on 'Indigenous Technologies & Sustainable Materials' taken by 450+ science and humanities students.",
    "Annual 'Samarpan' Regional Tribal Artisan Conclave providing free intellectual property rights (GI Tagging) and design mentorship.",
  ],
  majorAchievements: [
    "Successfully facilitated Geographical Indication (GI) registration dossier for local Kotpad Handloom weave cluster.",
    "Over ₹28 Lakhs in direct artisanal sales generated through student-managed digital storefronts.",
    "Commendation received from Ministry of Tribal Affairs and state heritage directorate.",
    "Featured as an exemplary case study in National Innovation and Start-up Policy (NISP) regional compendium.",
  ],
  supportingEvidence:
    "GI tag filing documentation, video documentaries, artisan income generation bank receipts, and digital repository URL on the institutional portal.",
  impact:
    "Direct economic upliftment of 120 artisan households; publication of 8 ethnobotanical research papers by faculty; 100% of graduating students sensitized to regional heritage preservation.",
  status: "Active",
};
