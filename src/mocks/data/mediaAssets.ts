import { gallerySchoolFiles, galleryCollegeFiles, heroSchoolFiles, heroCollegeFiles } from "./imageManifest";
import type { MediaAsset } from "@/types";

function fromFiles(files: string[], dir: string, institutionId: "school" | "college", startIndex: number): MediaAsset[] {
  return files.map((f, i) => ({
    id: `media-${institutionId}-${startIndex + i}`,
    institutionId,
    fileName: f,
    fileType: "image",
    url: `/images/${dir}/${f}`,
    altText: f.replace(/[-.]/g, " ").replace(/\.(jpg|png)$/, ""),
    sizeLabel: `${(120 + ((startIndex + i) % 9) * 45)} KB`,
    uploadedDate: "2026-09-" + String(10 + ((startIndex + i) % 18)).padStart(2, "0"),
    uploadedBy: institutionId === "school" ? "Sujata Rout" : "Dr. Snigdha Mohanty",
  }));
}

export const schoolMedia: MediaAsset[] = [
  ...fromFiles(heroSchoolFiles, "hero", "school", 1),
  ...fromFiles(gallerySchoolFiles, "gallery/school", "school", 100),
];

export const collegeMedia: MediaAsset[] = [
  ...fromFiles(heroCollegeFiles, "hero", "college", 1),
  ...fromFiles(galleryCollegeFiles, "gallery/college", "college", 100),
];

export function getMediaByInstitution(id: "school" | "college"): MediaAsset[] {
  return id === "school" ? schoolMedia : collegeMedia;
}
