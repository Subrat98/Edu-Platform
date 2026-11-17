import { mockRequest } from "@/mocks/api/client";
import { getEventsByInstitution } from "@/mocks/data/events";
import type { EventItem, InstitutionType } from "@/types";

export const eventService = {
  list: (institutionId: InstitutionType) =>
    mockRequest<EventItem[]>(
      () => [...getEventsByInstitution(institutionId)].sort((a, b) => a.date.localeCompare(b.date)),
      { latencyMs: [300, 600] },
    ),
};
