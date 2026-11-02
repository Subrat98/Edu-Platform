import { collegeGalleryUrl, schoolGalleryUrl } from "./images";
import type { GalleryAlbum } from "@/types";

function buildAlbum(
  id: string,
  institutionId: "school" | "college",
  title: string,
  date: string,
  urlFn: (i: number) => string,
  startIndex: number,
  count: number,
): GalleryAlbum {
  const images = Array.from({ length: count }, (_, i) => {
    const idx = startIndex + i;
    return {
      id: `${id}-img-${i + 1}`,
      url: urlFn(idx),
      caption: `${title} — photo ${i + 1}`,
    };
  });
  return { id, institutionId, title, date, coverUrl: images[0]!.url, images };
}

export const schoolGalleryAlbums: GalleryAlbum[] = [
  buildAlbum("album-sch-classrooms", "school", "Classrooms & Learning Spaces", "2026-09-10", schoolGalleryUrl, 1, 7),
  buildAlbum("album-sch-labs", "school", "Science & Computer Labs", "2026-09-18", schoolGalleryUrl, 8, 6),
  buildAlbum("album-sch-sports", "school", "Sports Day 2026", "2026-10-02", schoolGalleryUrl, 14, 6),
  buildAlbum("album-sch-annual-day", "school", "Annual Day Celebrations", "2026-12-18", schoolGalleryUrl, 20, 7),
  buildAlbum("album-sch-campus", "school", "Campus & Facilities", "2026-08-05", schoolGalleryUrl, 27, 6),
];

export const collegeGalleryAlbums: GalleryAlbum[] = [
  buildAlbum("album-col-lecture", "college", "Lecture Halls & Seminars", "2026-09-12", collegeGalleryUrl, 1, 7),
  buildAlbum("album-col-labs", "college", "Science Laboratories", "2026-09-20", collegeGalleryUrl, 8, 7),
  buildAlbum("album-col-library", "college", "Central Library", "2026-09-25", collegeGalleryUrl, 15, 7),
  buildAlbum("album-col-fest", "college", "Utsav — Annual Cultural Fest", "2026-12-15", collegeGalleryUrl, 22, 7),
  buildAlbum("album-col-campus", "college", "Campus Architecture", "2026-08-10", collegeGalleryUrl, 29, 7),
];

export function getGalleryAlbumsByInstitution(id: "school" | "college"): GalleryAlbum[] {
  return id === "school" ? schoolGalleryAlbums : collegeGalleryAlbums;
}
