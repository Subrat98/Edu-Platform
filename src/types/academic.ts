export interface Department {
  id: string;
  institutionId: "college";
  name: string;
  slug: string;
  hod: string;
  description: string;
  establishedYear: number;
  facultyCount: number;
  labCount: number;
}

export type ProgrammeLevel = "UG" | "PG" | "Diploma" | "Certificate";

export interface Programme {
  id: string;
  institutionId: "college";
  name: string;
  slug: string;
  departmentId: string;
  level: ProgrammeLevel;
  durationYears: number;
  seats: number;
  eligibility: string;
  description: string;
  feePerYear: number;
}

export interface SchoolClass {
  id: string;
  institutionId: "school";
  name: string;
  stage: "Pre-Primary" | "Primary" | "Middle" | "Secondary" | "Senior Secondary";
  streams?: string[];
  sections: string[];
  description: string;
}
