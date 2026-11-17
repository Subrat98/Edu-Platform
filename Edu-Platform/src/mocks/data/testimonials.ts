import type { Testimonial } from "@/types";

export const schoolTestimonials: Testimonial[] = [
  {
    id: "test-sch-01",
    institutionId: "school",
    name: "Suresh Pradhan",
    role: "Parent, Class VIII",
    quote:
      "The teachers at Our School genuinely know each child. My daughter's confidence has grown so much in just two years.",
    avatarUrl: "",
    rating: 5,
  },
  {
    id: "test-sch-02",
    institutionId: "school",
    name: "Manisha Tripathy",
    role: "Parent, Class III",
    quote:
      "The Parent Corner portal keeps me updated on everything — attendance, notices, even the fee ledger — without a single phone call.",
    avatarUrl: "",
    rating: 5,
  },
  {
    id: "test-sch-03",
    institutionId: "school",
    name: "Aditya Rout",
    role: "Alumnus, Class of 2024",
    quote:
      "Our School gave me a strong academic foundation and the confidence to speak up — things I still rely on in college.",
    avatarUrl: "",
    rating: 5,
  },
  {
    id: "test-sch-04",
    institutionId: "school",
    name: "Pratiksha Nayak",
    role: "Student, Class XI (Science)",
    quote: "The science labs are brilliant — we actually get to run the experiments ourselves, not just watch.",
    avatarUrl: "",
    rating: 4,
  },
  {
    id: "test-sch-05",
    institutionId: "school",
    name: "Biswajit Sahu",
    role: "Parent, Nursery",
    quote: "Such a caring environment for a first-time school parent. The teachers made the transition stress-free.",
    avatarUrl: "",
    rating: 5,
  },
  {
    id: "test-sch-06",
    institutionId: "school",
    name: "Soumya Ranjan Das",
    role: "Parent, Class X",
    quote: "The exam results and report cards are published online now — much faster than the old paper process.",
    avatarUrl: "",
    rating: 4,
  },
];

export const collegeTestimonials: Testimonial[] = [
  {
    id: "test-col-01",
    institutionId: "college",
    name: "Ankit Behera",
    role: "B.Sc. 4th Semester",
    quote:
      "The Computer Science labs and faculty mentorship here are genuinely strong — I landed an internship in my 3rd semester itself.",
    avatarUrl: "",
    rating: 5,
  },
  {
    id: "test-col-02",
    institutionId: "college",
    name: "Priyanka Jena",
    role: "B.Com (Honours), Alumna",
    quote: "The placement cell actively prepared us for interviews, not just the degree. I'm grateful for that push.",
    avatarUrl: "",
    rating: 5,
  },
  {
    id: "test-col-03",
    institutionId: "college",
    name: "Rohit Mallick",
    role: "M.Sc. Physics, 2nd Year",
    quote: "Our professors encourage us to publish and present at seminars — it genuinely feels research-driven.",
    avatarUrl: "",
    rating: 5,
  },
  {
    id: "test-col-04",
    institutionId: "college",
    name: "Sasmita Behera",
    role: "B.A. (Honours) English",
    quote: "The literary society and debate club here gave me opportunities I never expected from a district college.",
    avatarUrl: "",
    rating: 4,
  },
  {
    id: "test-col-05",
    institutionId: "college",
    name: "Debraj Patnaik",
    role: "BCA, 3rd Year",
    quote: "The library's digital resources and extended hours during exams make a real difference.",
    avatarUrl: "",
    rating: 4,
  },
  {
    id: "test-col-06",
    institutionId: "college",
    name: "Nibedita Panda",
    role: "Alumna, now at an IT firm in Bhubaneswar",
    quote: "PSC's placement drives connected me directly with recruiters — I had an offer before my final results.",
    avatarUrl: "",
    rating: 5,
  },
];

export const allTestimonials: Testimonial[] = [...schoolTestimonials, ...collegeTestimonials];

export function getTestimonialsByInstitution(id: "school" | "college"): Testimonial[] {
  return id === "school" ? schoolTestimonials : collegeTestimonials;
}
