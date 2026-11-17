import type { Department } from "@/types";

export const departments: Department[] = [
  {
    id: "dept-cs",
    institutionId: "college",
    name: "Computer Science",
    slug: "computer-science",
    hod: "Dr. Snigdha Mohanty",
    description:
      "Offers BCA and M.Sc. (Computer Science) programmes with labs in programming, networking, data science and AI fundamentals, and active student projects in web and mobile development.",
    establishedYear: 2004,
    facultyCount: 9,
    labCount: 3,
  },
  {
    id: "dept-physics",
    institutionId: "college",
    name: "Physics",
    slug: "physics",
    hod: "Dr. Ashok Panigrahi",
    description:
      "A long-established department with well-equipped optics, electronics and mechanics laboratories, offering B.Sc. (Honours) and M.Sc. Physics with a focus on applied and experimental physics.",
    establishedYear: 1975,
    facultyCount: 7,
    labCount: 4,
  },
  {
    id: "dept-chemistry",
    institutionId: "college",
    name: "Chemistry",
    slug: "chemistry",
    hod: "Dr. Minati Behera",
    description:
      "Runs undergraduate and postgraduate programmes in Chemistry with organic, inorganic and analytical laboratories, and ongoing research collaborations in environmental chemistry.",
    establishedYear: 1975,
    facultyCount: 8,
    labCount: 3,
  },
  {
    id: "dept-mathematics",
    institutionId: "college",
    name: "Mathematics",
    slug: "mathematics",
    hod: "Dr. Jagannath Sahoo",
    description:
      "Offers rigorous B.Sc. and M.Sc. Mathematics programmes with a strong record in competitive-exam coaching and a dedicated statistics and computing lab.",
    establishedYear: 1975,
    facultyCount: 6,
    labCount: 1,
  },
  {
    id: "dept-commerce",
    institutionId: "college",
    name: "Commerce",
    slug: "commerce",
    hod: "Prof. Satyabrata Dash",
    description:
      "The largest department on campus, offering B.Com (Honours) with specializations in Accounting & Finance and Business Administration, plus an active commerce association and placement cell.",
    establishedYear: 1982,
    facultyCount: 11,
    labCount: 1,
  },
  {
    id: "dept-english",
    institutionId: "college",
    name: "English",
    slug: "english",
    hod: "Dr. Rashmita Mishra",
    description:
      "Offers B.A. (Honours) in English Literature with a language lab, a literary society, and regular seminars on contemporary and classical literature.",
    establishedYear: 1975,
    facultyCount: 6,
    labCount: 1,
  },
  {
    id: "dept-economics",
    institutionId: "college",
    name: "Economics",
    slug: "economics",
    hod: "Dr. Pradeep Kumar Jena",
    description:
      "A research-active department offering B.A. (Honours) Economics with a focus on development economics, and an economics forum that hosts regular guest lectures.",
    establishedYear: 1978,
    facultyCount: 5,
    labCount: 1,
  },
  {
    id: "dept-botany-zoology",
    institutionId: "college",
    name: "Botany & Zoology",
    slug: "botany-zoology",
    hod: "Dr. Lopamudra Tripathy",
    description:
      "Combined life-sciences department offering B.Sc. (Honours) in Botany and Zoology with dedicated herbarium, museum and microbiology laboratories.",
    establishedYear: 1976,
    facultyCount: 8,
    labCount: 4,
  },
];

export function getDepartment(slug: string): Department | undefined {
  return departments.find((d) => d.slug === slug);
}
