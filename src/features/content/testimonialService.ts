import { mockRequest } from "@/mocks/api/client";
import { getTestimonialsByInstitution } from "@/mocks/data/testimonials";
import type { InstitutionType, Testimonial } from "@/types";

export const testimonialService = {
  list: (institutionId: InstitutionType) =>
    mockRequest<Testimonial[]>(() => getTestimonialsByInstitution(institutionId), { latencyMs: [250, 500] }),
};
