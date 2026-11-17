import { mockRequest } from "@/mocks/api/client";
import { demoUsers } from "@/mocks/data/users";
import { logActivity } from "@/mocks/data/activityLog";
import type { DemoUser } from "@/types";

export const userService = {
  list: () => mockRequest<DemoUser[]>(() => demoUsers, { latencyMs: [150, 350] }),

  setActive: (userId: string, active: boolean, actor: string) =>
    mockRequest<{ ok: true } | { ok: false; error: string }>(() => {
      const user = demoUsers.find((u) => u.id === userId);
      if (!user) return { ok: false, error: "User not found." };
      user.active = active;
      logActivity({
        institutionId: user.institutionId,
        category: "Settings",
        action: `${active ? "Reactivated" : "Deactivated"} user account ${user.name}`,
        actor,
      });
      return { ok: true };
    }, { latencyMs: [300, 550] }),
};
