import { mockRequest } from "@/mocks/api/client";

export interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const contactService = {
  submit: (_data: ContactSubmission) =>
    mockRequest<{ ticketId: string }>(
      () => ({ ticketId: `ENQ-${Math.floor(100000 + Math.random() * 900000)}` }),
      { latencyMs: [500, 900], failRate: 0.15 },
    ),
};
