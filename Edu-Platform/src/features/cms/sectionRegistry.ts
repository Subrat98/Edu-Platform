import type { ComponentType } from "react";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { NoticeBoard } from "@/components/sections/NoticeBoard";
import { ProgrammeCards } from "@/components/sections/ProgrammeCards";
import { DepartmentCards } from "@/components/sections/DepartmentCards";
import { FacultyGrid } from "@/components/sections/FacultyGrid";
import { EventCards } from "@/components/sections/EventCards";
import { Gallery } from "@/components/sections/Gallery";
import { Testimonials } from "@/components/sections/Testimonials";
import { AdmissionsCTA } from "@/components/sections/AdmissionsCTA";
import { Downloads } from "@/components/sections/Downloads";
import { RichText } from "@/components/sections/RichText";
import { Faq } from "@/components/sections/Faq";
import { ContactForm } from "@/components/sections/ContactForm";
import { LibraryWidget } from "@/components/sections/LibraryWidget";
import { AccreditationStrip } from "@/components/sections/AccreditationStrip";
import type { SectionType } from "@/types";

/**
 * Maps each CMS section type to its renderer component. This registry is
 * the extension point the Phase 2 CMS page builder will read from to
 * offer draggable sections — every section type here is already a
 * complete, theme-reactive, data-driven component today.
 */
export const sectionRegistry: Record<SectionType, ComponentType<any>> = {
  hero: Hero,
  stats: Stats,
  noticeBoard: NoticeBoard,
  programmeCards: ProgrammeCards,
  departmentCards: DepartmentCards,
  facultyGrid: FacultyGrid,
  eventCards: EventCards,
  gallery: Gallery,
  testimonials: Testimonials,
  admissionsCta: AdmissionsCTA,
  downloads: Downloads,
  richText: RichText,
  faq: Faq,
  contactForm: ContactForm,
  libraryWidget: LibraryWidget,
  accreditationStrip: AccreditationStrip,
};
