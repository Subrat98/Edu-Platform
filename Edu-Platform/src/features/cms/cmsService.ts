import { mockRequest } from "@/mocks/api/client";
import { cmsPages, getCmsPagesBySite, getCmsPage } from "@/mocks/data/cmsPages";
import { schoolMedia, collegeMedia, getMediaByInstitution } from "@/mocks/data/mediaAssets";
import { schoolNavMenu, collegeNavMenu, getNavMenu } from "@/mocks/data/navMenus";
import { institutions } from "@/mocks/data/institutions";
import { allNotices, getNoticesByInstitution } from "@/mocks/data/notices";
import { applyTheme } from "@/theme/applyTheme";
import type {
  CmsPageRecord,
  ColorTokens,
  InstitutionType,
  MediaAsset,
  NavItem,
  Notice,
  PageStatus,
  Section,
} from "@/types";

const TODAY = "2026-10-29T00:00:00";

export const cmsService = {
  // ---- Pages ----
  listPages: (siteArea: "school" | "college") => mockRequest<CmsPageRecord[]>(() => getCmsPagesBySite(siteArea)),

  getPage: (id: string) => mockRequest<CmsPageRecord | null>(() => getCmsPage(id) ?? null),

  createPage: (siteArea: "school" | "college", title: string, author: string) =>
    mockRequest<CmsPageRecord>(() => {
      const slug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "untitled-page";
      const record: CmsPageRecord = {
        id: `cms-page-live-${Date.now()}`,
        institutionId: siteArea,
        title,
        slug,
        siteArea,
        status: "Draft",
        author,
        updatedAt: TODAY,
        visibility: "Public",
        page: {
          slug,
          institutionId: siteArea,
          title,
          sections: [],
        },
      };
      cmsPages.unshift(record);
      return record;
    }, { latencyMs: [300, 600] }),

  updatePageSections: (id: string, sections: Section[]) =>
    mockRequest<{ ok: true } | { ok: false; error: string }>(() => {
      const record = cmsPages.find((p) => p.id === id);
      if (!record) return { ok: false, error: "Page not found." };
      record.page.sections = sections;
      record.updatedAt = TODAY;
      return { ok: true };
    }),

  setPageStatus: (id: string, status: PageStatus, scheduledFor?: string) =>
    mockRequest<{ ok: true } | { ok: false; error: string }>(() => {
      const record = cmsPages.find((p) => p.id === id);
      if (!record) return { ok: false, error: "Page not found." };
      record.status = status;
      record.updatedAt = TODAY;
      if (status === "Scheduled" && scheduledFor) record.scheduledFor = scheduledFor;
      return { ok: true };
    }),

  renamePage: (id: string, title: string) =>
    mockRequest<{ ok: true } | { ok: false; error: string }>(() => {
      const record = cmsPages.find((p) => p.id === id);
      if (!record) return { ok: false, error: "Page not found." };
      record.title = title;
      record.page.title = title;
      record.updatedAt = TODAY;
      return { ok: true };
    }),

  // ---- Menus ----
  getMenu: (institutionId: InstitutionType) => mockRequest(() => getNavMenu(institutionId), { latencyMs: [150, 300] }),

  updateMenuItems: (institutionId: InstitutionType, items: NavItem[]) =>
    mockRequest<{ ok: true }>(() => {
      const menu = institutionId === "school" ? schoolNavMenu : collegeNavMenu;
      menu.items = items;
      return { ok: true };
    }),

  // ---- Theme designer ----
  getTheme: (institutionId: InstitutionType) => mockRequest(() => institutions[institutionId].theme, { latencyMs: [100, 200] }),

  updateTheme: (institutionId: InstitutionType, colors: Partial<ColorTokens>, radius?: string) =>
    mockRequest<{ ok: true }>(() => {
      const institution = institutions[institutionId];
      institution.theme.colors = { ...institution.theme.colors, ...colors };
      if (radius) institution.theme.radius = radius;
      applyTheme(institution.theme);
      return { ok: true };
    }),

  // ---- Notices (CMS workflow) ----
  listNoticesForCms: (institutionId: InstitutionType) =>
    mockRequest<Notice[]>(() => [...getNoticesByInstitution(institutionId)].sort((a, b) => b.date.localeCompare(a.date))),

  createNotice: (notice: Omit<Notice, "id">) =>
    mockRequest<Notice>(() => {
      const created: Notice = { id: `notice-live-${Date.now()}`, ...notice };
      allNotices.unshift(created);
      return created;
    }, { latencyMs: [300, 600] }),

  updateNotice: (id: string, patch: Partial<Notice>) =>
    mockRequest<{ ok: true } | { ok: false; error: string }>(() => {
      const notice = allNotices.find((n) => n.id === id);
      if (!notice) return { ok: false, error: "Notice not found." };
      Object.assign(notice, patch);
      return { ok: true };
    }),

  setNoticeStatus: (id: string, status: NonNullable<Notice["status"]>) =>
    mockRequest<{ ok: true } | { ok: false; error: string }>(() => {
      const notice = allNotices.find((n) => n.id === id);
      if (!notice) return { ok: false, error: "Notice not found." };
      notice.status = status;
      return { ok: true };
    }),

  // ---- Media library ----
  listMedia: (institutionId: InstitutionType) => mockRequest<MediaAsset[]>(() => getMediaByInstitution(institutionId)),

  addMedia: (asset: Omit<MediaAsset, "id">) =>
    mockRequest<MediaAsset>(() => {
      const created: MediaAsset = { id: `media-live-${Date.now()}`, ...asset };
      (asset.institutionId === "school" ? schoolMedia : collegeMedia).unshift(created);
      return created;
    }, { latencyMs: [400, 900] }),

  deleteMedia: (institutionId: InstitutionType, id: string) =>
    mockRequest<{ ok: true }>(() => {
      const list = institutionId === "school" ? schoolMedia : collegeMedia;
      const idx = list.findIndex((m) => m.id === id);
      if (idx >= 0) list.splice(idx, 1);
      return { ok: true };
    }),
};
