import type { LibraryMembership } from "@/types";

const SCHOOL_STUDENT_NAMES = [
  "Aditi Mohapatra", "Rakesh Prusty", "Swagatika Behera", "Manas Ranjan Giri", "Priya Darshini Sahu",
  "Abhinav Kumar Nayak", "Sneha Patra", "Rohit Chandra Swain", "Ishita Rani Das", "Siddharth Mallick",
  "Ankita Pradhan", "Debadutta Jena", "Riya Sharma", "Vikram Biswal", "Anushka Panigrahi",
  "Saurav Mohanty", "Trisha Rout", "Gourav Sethi", "Nandini Acharya", "Aryan Senapati",
];

const COLLEGE_STUDENT_NAMES = [
  "Ankit Behera", "Priyanka Jena", "Rohit Mallick", "Sasmita Behera", "Debraj Patnaik",
  "Nibedita Panda", "Suman Kumar Rout", "Jyotsna Mishra", "Abhishek Das", "Lipika Nayak",
  "Chinmay Pati", "Rashmita Sahu", "Bikram Keshari Dash", "Sunita Barik", "Pritam Routray",
  "Monalisa Swain", "Deepak Kumar Sahoo", "Anjali Pradhan", "Subhransu Mallick", "Keerti Rani Nanda",
];

function membershipWindow() {
  return { validFrom: "2026-06-01", validTo: "2027-05-31" };
}

export const schoolMembers: LibraryMembership[] = SCHOOL_STUDENT_NAMES.map((name, i) => ({
  id: `mem-sch-${String(i + 1).padStart(2, "0")}`,
  institutionId: "school",
  memberName: name,
  memberType: "student",
  memberRefId: `student-sch-${String(i + 1).padStart(3, "0")}`,
  membershipNo: `PSPS-LIB-${String(2026000 + i + 1)}`,
  status: "Active",
  ...membershipWindow(),
  maxLoans: 2,
  loanPeriodDays: 14,
}));

export const collegeMembers: LibraryMembership[] = COLLEGE_STUDENT_NAMES.map((name, i) => ({
  id: `mem-col-${String(i + 1).padStart(2, "0")}`,
  institutionId: "college",
  memberName: name,
  memberType: "student",
  memberRefId: `student-col-${String(i + 1).padStart(3, "0")}`,
  membershipNo: `PSC-LIB-${String(2026000 + i + 1)}`,
  status: "Active",
  ...membershipWindow(),
  maxLoans: 3,
  loanPeriodDays: 14,
}));

// A couple of faculty memberships with higher limits, matching the
// spec's "role-specific policies for students and faculty".
collegeMembers.push(
  {
    id: "mem-col-faculty-01",
    institutionId: "college",
    memberName: "Dr. Snigdha Mohanty",
    memberType: "faculty",
    memberRefId: "staff-col-02",
    membershipNo: "PSC-LIB-F001",
    status: "Active",
    ...membershipWindow(),
    maxLoans: 6,
    loanPeriodDays: 30,
  },
  {
    id: "mem-col-faculty-02",
    institutionId: "college",
    memberName: "Dr. Ashok Panigrahi",
    memberType: "faculty",
    memberRefId: "staff-col-03",
    membershipNo: "PSC-LIB-F002",
    status: "Active",
    ...membershipWindow(),
    maxLoans: 6,
    loanPeriodDays: 30,
  },
);

export const allMembers: LibraryMembership[] = [...schoolMembers, ...collegeMembers];

export function getMembersByInstitution(id: "school" | "college"): LibraryMembership[] {
  return id === "school" ? schoolMembers : collegeMembers;
}

export function getMember(id: string): LibraryMembership | undefined {
  return allMembers.find((m) => m.id === id);
}

export function getMemberByBookingDemo(name: string, institutionId: "school" | "college"): LibraryMembership | undefined {
  return getMembersByInstitution(institutionId).find((m) => m.memberName === name);
}
