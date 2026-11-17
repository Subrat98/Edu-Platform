import { mockRequest } from "@/mocks/api/client";
import { demoUsers } from "@/mocks/data/users";
import type { DemoUser } from "@/types";

export const authService = {
  listPersonas: () => mockRequest<DemoUser[]>(() => demoUsers, { latencyMs: [100, 200] }),
  login: (userId: string) =>
    mockRequest<DemoUser | null>(() => demoUsers.find((u) => u.id === userId) ?? null, {
      latencyMs: [300, 700],
    }),
};
