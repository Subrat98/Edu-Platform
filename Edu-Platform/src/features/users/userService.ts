import { mockRequest } from "@/mocks/api/client";
import { demoUsers } from "@/mocks/data/users";
import { logActivity } from "@/mocks/data/activityLog";
import type { DemoUser, RoleKey, InstitutionType } from "@/types";

export interface CreateUserInput {
  name: string;
  email: string;
  role: RoleKey;
  institutionId: InstitutionType;
  title?: string;
  department?: string;
  phone?: string;
}

export const userService = {
  list: () => mockRequest<DemoUser[]>(() => demoUsers, { latencyMs: [150, 350] }),

  create: (input: CreateUserInput, actor: string) =>
    mockRequest<{ ok: true; user: DemoUser } | { ok: false; error: string }>(() => {
      const name = input.name.trim();
      const email = input.email.trim().toLowerCase();
      if (!name) return { ok: false, error: "Full name is required." };
      if (!email) return { ok: false, error: "Email address is required." };

      const existing = demoUsers.find((u) => u.email.toLowerCase() === email);
      if (existing) {
        return { ok: false, error: "A user with this email address already exists." };
      }

      const idSuffix = email.split("@")[0]?.replace(/[^a-z0-9_-]/g, "") || Date.now().toString(36);
      const newUser: DemoUser = {
        id: `user-${idSuffix}`,
        name,
        email,
        role: input.role,
        institutionId: input.institutionId,
        avatarUrl: "",
        title: input.title?.trim() || `${input.role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`,
        active: true,
      };

      demoUsers.push(newUser);

      logActivity({
        institutionId: input.institutionId,
        category: "Settings",
        action: `Created user account for ${newUser.name} with role ${input.role}`,
        actor,
      });

      return { ok: true, user: newUser };
    }, { latencyMs: [250, 450] }),

  update: (userId: string, input: Partial<CreateUserInput>, actor: string) =>
    mockRequest<{ ok: true; user: DemoUser } | { ok: false; error: string }>(() => {
      const user = demoUsers.find((u) => u.id === userId);
      if (!user) return { ok: false, error: "User not found." };

      if (input.name) user.name = input.name.trim();
      if (input.email) user.email = input.email.trim().toLowerCase();
      if (input.role) user.role = input.role;
      if (input.institutionId) user.institutionId = input.institutionId;
      if (input.title !== undefined) user.title = input.title.trim();

      logActivity({
        institutionId: user.institutionId,
        category: "Settings",
        action: `Updated user account and roles for ${user.name}`,
        actor,
      });

      return { ok: true, user };
    }, { latencyMs: [250, 450] }),

  delete: (userId: string, actor: string) =>
    mockRequest<{ ok: true } | { ok: false; error: string }>(() => {
      if (userId === "user-platform-super-admin" || userId === "user-platform-admin") {
        return { ok: false, error: "The primary Super Admin account cannot be deleted." };
      }
      const index = demoUsers.findIndex((u) => u.id === userId);
      if (index === -1) return { ok: false, error: "User not found." };

      const [removed] = demoUsers.splice(index, 1);
      if (removed) {
        logActivity({
          institutionId: removed.institutionId,
          category: "Settings",
          action: `Deleted user account ${removed.name} (${removed.email})`,
          actor,
        });
      }

      return { ok: true };
    }, { latencyMs: [250, 450] }),

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
