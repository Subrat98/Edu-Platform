import type { InstitutionType } from "./institution";

export interface StaffMember {
  id: string;
  institutionId: InstitutionType;
  name: string;
  designation: string;
  department?: string;
  departmentId?: string;
  qualification: string;
  photoUrl: string;
  bio: string;
  email: string;
  isLeadership?: boolean;
  publications?: number;
}
