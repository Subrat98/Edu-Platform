export interface NaacDirectoryDocument {
  id: string;
  title: string;
  subtitle: string;
  url: string;
}

export interface NaacDirectorySection {
  id: "iqac" | "aqar" | "iiqa" | "ssr" | "dvv";
  label: string;
  heading: string;
  description: string;
  documents: NaacDirectoryDocument[];
}

export const naacDocumentDirectory: NaacDirectorySection[] = [
  {
    id: "iqac",
    label: "IQAC",
    heading: "Internal Quality Assurance Cell (IQAC)",
    description: "Statutory committee composition, meeting minutes and the institutional quality roadmap.",
    documents: [
      {
        id: "iqac-composition",
        title: "IQAC Composition 2023–2028",
        subtitle: "Statutory committee roster & tenure",
        url: "/documents/naac/iqac/IQAC_Composition_2023_2028.pdf",
      },
      {
        id: "iqac-minutes",
        title: "Latest IQAC Meeting Minutes",
        subtitle: "Quarterly proceedings",
        url: "/documents/naac/iqac/IQAC_Meeting_Minutes_Latest.pdf",
      },
      {
        id: "iqac-strategic",
        title: "IQAC Strategic Plan 2023–2028",
        subtitle: "Five-year institutional quality roadmap",
        url: "/documents/naac/iqac/IQAC_Strategic_Plan_2023_2028.pdf",
      },
    ],
  },
  {
    id: "aqar",
    label: "AQAR",
    heading: "Annual Quality Assurance Reports (AQAR)",
    description: "Year-wise statutory quality reports submitted to and acknowledged by NAAC.",
    documents: [
      {
        id: "aqar-2024-25",
        title: "AQAR 2024–25",
        subtitle: "Submitted 28 Nov 2025 · 100% criteria completion",
        url: "/documents/naac/aqar/AQAR_Final_2024_25.pdf",
      },
      {
        id: "aqar-2023-24",
        title: "AQAR 2023–24",
        subtitle: "Submitted 15 Dec 2024 · First AQAR of Cycle 3",
        url: "/documents/naac/aqar/AQAR_Final_2023_24.pdf",
      },
    ],
  },
  {
    id: "iiqa",
    label: "IIQA",
    heading: "Institutional Information for Quality Assessment (IIQA)",
    description: "Eligibility submission filed with NAAC ahead of the assessment cycle.",
    documents: [
      {
        id: "iiqa-cycle3",
        title: "Institutional Information for Quality Assessment (IIQA)",
        subtitle: "Cycle 3 submission, filed 2022",
        url: "/documents/naac/iiqa/IIQA_Cycle_3_Submission.pdf",
      },
      {
        id: "iiqa-approval",
        title: "IIQA Approval & Eligibility Letter",
        subtitle: "NAAC clearance to proceed to SSR",
        url: "/documents/naac/iiqa/IIQA_Approval_Letter.pdf",
      },
    ],
  },
  {
    id: "ssr",
    label: "SSR",
    heading: "Self Study Report (SSR)",
    description: "Five-year consolidated institutional self-evaluation submitted to NAAC.",
    documents: [
      {
        id: "ssr-cycle3",
        title: "Self Study Report (SSR)",
        subtitle: "Cycle 3 · 2018–2023 · DVV Verified",
        url: "/documents/naac/ssr/SSR_Cycle_3_Final.pdf",
      },
      {
        id: "ssr-naac-generated",
        title: "Self Study Report (SSR), NAAC Generated Pdf",
        subtitle: "Auto-compiled by the NAAC HEI portal",
        url: "/documents/naac/ssr/SSR_Cycle_3_NAAC_Generated.pdf",
      },
    ],
  },
  {
    id: "dvv",
    label: "DVV",
    heading: "Data Validation and Verification (DVV)",
    description: "Clarification reports exchanged with the NAAC DVV cell before the peer team visit.",
    documents: [
      {
        id: "dvv-clarification",
        title: "DVV for NAAC 2021",
        subtitle: "Cycle 3 clarification report, resolved Jul 2023",
        url: "/documents/naac/dvv/DVV_Clarification_Report_Cycle_3.pdf",
      },
      {
        id: "dvv-communication",
        title: "DVV Query–Response Log",
        subtitle: "Full correspondence record",
        url: "/documents/naac/dvv/DVV_Query_Response_Log.pdf",
      },
    ],
  },
];
