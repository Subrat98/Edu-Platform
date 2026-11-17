import {
  Image,
  BarChart3,
  Megaphone,
  LayoutGrid,
  Building2,
  Users,
  CalendarDays,
  GalleryHorizontal,
  Quote,
  GraduationCap,
  FileDown,
  AlignLeft,
  HelpCircle,
  Mail,
  BookOpen,
  Award,
  type LucideIcon,
} from "lucide-react";
import type { SectionType } from "@/types";

export const SECTION_META: Record<SectionType, { label: string; icon: LucideIcon; description: string }> = {
  hero: { label: "Hero Banner", icon: Image, description: "Large banner with headline and call-to-action buttons." },
  stats: { label: "Statistics", icon: BarChart3, description: "A row of key numbers (students, faculty, results…)." },
  noticeBoard: { label: "Notice Board", icon: Megaphone, description: "Latest notices, optionally with category filter." },
  programmeCards: { label: "Programme / Class Cards", icon: LayoutGrid, description: "Card grid for classes, streams or programmes." },
  departmentCards: { label: "Department / Facility Cards", icon: Building2, description: "Card grid for departments or facilities." },
  facultyGrid: { label: "Faculty Grid", icon: Users, description: "Staff directory grid with optional department filter." },
  eventCards: { label: "Event Cards", icon: CalendarDays, description: "Upcoming events with dates and categories." },
  gallery: { label: "Gallery", icon: GalleryHorizontal, description: "Photo albums with a lightbox viewer." },
  testimonials: { label: "Testimonials", icon: Quote, description: "Rotating carousel of quotes and ratings." },
  admissionsCta: { label: "Admissions CTA", icon: GraduationCap, description: "Highlighted admissions call-to-action with steps." },
  downloads: { label: "Downloads", icon: FileDown, description: "List of downloadable documents by category." },
  richText: { label: "Rich Text", icon: AlignLeft, description: "Formatted paragraph content." },
  faq: { label: "FAQ Accordion", icon: HelpCircle, description: "Expandable frequently-asked-questions list." },
  contactForm: { label: "Contact Form", icon: Mail, description: "Validated enquiry form with institution contact details." },
  libraryWidget: { label: "Library Widget", icon: BookOpen, description: "Library teaser with catalogue search link." },
  accreditationStrip: { label: "Accreditation Strip", icon: Award, description: "Row of accreditation / affiliation badges." },
};

export const ALL_SECTION_TYPES = Object.keys(SECTION_META) as SectionType[];
