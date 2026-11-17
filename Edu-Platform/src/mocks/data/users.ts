import { portraitUrl } from "./images";
import type { DemoUser } from "@/types";

export const demoUsers: DemoUser[] = [
  {
    id: "user-platform-super-admin",
    name: "Super Admin",
    email: "superadmin@eduplatform.demo",
    role: "platform_admin",
    institutionId: "school",
    avatarUrl: portraitUrl(1),
    title: "Platform Super Admin",
  },
];
