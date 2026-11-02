import { nameAt, phoneAt } from "./namePools";
import { schoolClasses } from "../classes";
import { programmes } from "../programmes";
import type { AdmissionApplication, ApplicationStatus } from "@/types";

const STATUS_CYCLE: ApplicationStatus[] = [
  "Submitted",
  "Under Review",
  "Accepted",
  "Rejected",
  "Waitlisted",
  "Action Required",
  "Accepted",
  "Submitted",
];

function buildReviews(status: ApplicationStatus, actor: string, submittedDate: string): AdmissionApplication["reviews"] {
  if (status === "Submitted") return [];
  const reviews: AdmissionApplication["reviews"] = [
    { id: "r1", actor, timestamp: `${submittedDate}T11:00:00`, fromStatus: "Submitted", toStatus: "Under Review" },
  ];
  if (status !== "Under Review") {
    reviews.push({
      id: "r2",
      actor,
      timestamp: `${submittedDate}T15:00:00`,
      fromStatus: "Under Review",
      toStatus: status,
      note:
        status === "Rejected"
          ? "Eligibility criteria not met."
          : status === "Waitlisted"
            ? "Seats full — added to waitlist."
            : status === "Action Required"
              ? "Transfer certificate pending."
              : undefined,
    });
  }
  return reviews;
}

const applications: AdmissionApplication[] = [];

const SCHOOL_APP_COUNT = 20;
for (let i = 0; i < SCHOOL_APP_COUNT; i += 1) {
  const cls = schoolClasses[i % schoolClasses.length]!;
  const { name } = nameAt(i + 80);
  const status = STATUS_CYCLE[i % STATUS_CYCLE.length]!;
  const submittedDate = `2026-10-${String((i % 27) + 1).padStart(2, "0")}`;
  applications.push({
    id: `app-sch-${String(i + 1).padStart(3, "0")}`,
    institutionId: "school",
    applicationNo: `PSPS-ADM-2027-${String(1000 + i)}`,
    applicantName: name,
    guardianName: `${nameAt(i + 80).name.split(" ")[0]} ${nameAt(i + 81).name.split(" ")[1]}`,
    phone: phoneAt(i + 2000),
    email: `${name.toLowerCase().replace(" ", ".")}${i}@example.com`,
    appliedFor: cls.name,
    appliedForId: cls.id,
    previousSchoolOrCollege: i % 4 === 0 ? "— (first admission)" : "Saraswati Shishu Vidya Mandir",
    submittedDate,
    status,
    documents: [
      { name: "Birth Certificate", uploaded: true },
      { name: "Previous Report Card", uploaded: i % 3 !== 0 },
      { name: "Transfer Certificate", uploaded: status !== "Action Required" },
      { name: "Aadhaar Card", uploaded: true },
    ],
    reviews: buildReviews(status, "Priyanka Senapati", submittedDate),
  });
}

const COLLEGE_APP_COUNT = 15;
for (let i = 0; i < COLLEGE_APP_COUNT; i += 1) {
  const prog = programmes[i % programmes.length]!;
  const { name } = nameAt(i + 120);
  const status = STATUS_CYCLE[(i + 3) % STATUS_CYCLE.length]!;
  const submittedDate = `2026-10-${String((i % 27) + 1).padStart(2, "0")}`;
  applications.push({
    id: `app-col-${String(i + 1).padStart(3, "0")}`,
    institutionId: "college",
    applicationNo: `PSC-ADM-2027-${String(2000 + i)}`,
    applicantName: name,
    guardianName: `${nameAt(i + 120).name.split(" ")[0]} ${nameAt(i + 121).name.split(" ")[1]}`,
    phone: phoneAt(i + 3000),
    email: `${name.toLowerCase().replace(" ", ".")}${i}@example.com`,
    appliedFor: prog.name,
    appliedForId: prog.id,
    previousSchoolOrCollege: "Pathani Samanta Public School, Khandapara",
    submittedDate,
    status,
    documents: [
      { name: "10+2 Mark Sheet", uploaded: true },
      { name: "Migration Certificate", uploaded: i % 3 !== 0 },
      { name: "Category Certificate", uploaded: i % 2 === 0 },
      { name: "Aadhaar Card", uploaded: true },
    ],
    reviews: buildReviews(status, "Pratikshya Barik", submittedDate),
  });
}

export const allApplications = applications;

export function getApplicationsByInstitution(id: "school" | "college"): AdmissionApplication[] {
  return allApplications.filter((a) => a.institutionId === id);
}
export function getApplication(id: string): AdmissionApplication | undefined {
  return allApplications.find((a) => a.id === id);
}
