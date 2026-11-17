import type { DownloadDocument } from "@/types";

export const schoolDownloads: DownloadDocument[] = [
  { id: "dl-sch-01", institutionId: "school", title: "School Prospectus 2027–28", category: "Admissions", fileType: "pdf", sizeLabel: "2.4 MB", updatedDate: "2026-10-20" },
  { id: "dl-sch-02", institutionId: "school", title: "Admission Application Form", category: "Admissions", fileType: "pdf", sizeLabel: "320 KB", updatedDate: "2026-10-20" },
  { id: "dl-sch-03", institutionId: "school", title: "Fee Structure 2026–27", category: "Fees", fileType: "pdf", sizeLabel: "180 KB", updatedDate: "2026-04-01" },
  { id: "dl-sch-04", institutionId: "school", title: "Academic Calendar 2026–27", category: "Academics", fileType: "pdf", sizeLabel: "410 KB", updatedDate: "2026-04-10" },
  { id: "dl-sch-05", institutionId: "school", title: "Syllabus — Classes IX–X (CBSE)", category: "Academics", fileType: "pdf", sizeLabel: "1.1 MB", updatedDate: "2026-04-15" },
  { id: "dl-sch-06", institutionId: "school", title: "Uniform & Book List 2026–27", category: "Parent Corner", fileType: "pdf", sizeLabel: "250 KB", updatedDate: "2026-03-28" },
  { id: "dl-sch-07", institutionId: "school", title: "Transfer Certificate Request Form", category: "Records", fileType: "doc", sizeLabel: "95 KB", updatedDate: "2026-02-10" },
  { id: "dl-sch-08", institutionId: "school", title: "Mandatory Public Disclosure (CBSE)", category: "Compliance", fileType: "pdf", sizeLabel: "640 KB", updatedDate: "2026-07-01" },
];

export const collegeDownloads: DownloadDocument[] = [
  { id: "dl-col-01", institutionId: "college", title: "College Prospectus 2027–28", category: "Admissions", fileType: "pdf", sizeLabel: "3.1 MB", updatedDate: "2026-10-20" },
  { id: "dl-col-02", institutionId: "college", title: "UG Application Form", category: "Admissions", fileType: "pdf", sizeLabel: "280 KB", updatedDate: "2026-10-20" },
  { id: "dl-col-03", institutionId: "college", title: "Fee Structure — All Programmes", category: "Fees", fileType: "xls", sizeLabel: "95 KB", updatedDate: "2026-05-01" },
  { id: "dl-col-04", institutionId: "college", title: "Academic Calendar 2026–27", category: "Academics", fileType: "pdf", sizeLabel: "380 KB", updatedDate: "2026-04-12" },
  { id: "dl-col-05", institutionId: "college", title: "AQAR 2025–26", category: "IQAC", fileType: "pdf", sizeLabel: "2.8 MB", updatedDate: "2026-09-15" },
  { id: "dl-col-06", institutionId: "college", title: "NAAC SSR (Self Study Report)", category: "IQAC", fileType: "pdf", sizeLabel: "5.2 MB", updatedDate: "2026-06-01" },
  { id: "dl-col-07", institutionId: "college", title: "Scholarship Application Form", category: "Scholarships", fileType: "pdf", sizeLabel: "210 KB", updatedDate: "2026-10-05" },
  { id: "dl-col-08", institutionId: "college", title: "Mandatory Disclosure Statement", category: "Compliance", fileType: "pdf", sizeLabel: "720 KB", updatedDate: "2026-07-01" },
];

export function getDownloadsByInstitution(id: "school" | "college"): DownloadDocument[] {
  return id === "school" ? schoolDownloads : collegeDownloads;
}
