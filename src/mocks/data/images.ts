// Helpers that build URLs into the curated local image set downloaded by
// the one-time image-fetch scripts (see public/images/). Indices wrap
// defensively so mock data stays valid even if a search term returned
// fewer results than requested.
//
// Deliberate choice: people (staff, faculty, students, testimonials) are
// never represented with real photographs pulled from the open web — a
// stranger's likeness, especially a child's, shouldn't stand in as a
// fictional persona in a commercial-looking demo. Every person in this
// app renders through <AvatarInitials/> instead (see
// src/components/common/AvatarInitials.tsx). Only places and objects
// (campus buildings, classrooms, labs, libraries) use real photography.
import {
  gallerySchoolFiles,
  galleryCollegeFiles,
  heroSchoolFiles,
  heroCollegeFiles,
} from "./imageManifest";

export {
  gallerySchoolFiles,
  galleryCollegeFiles,
  heroSchoolFiles,
  heroCollegeFiles,
};

export function portraitUrl(_index: number): string {
  return "";
}

export function schoolGalleryUrl(index: number): string {
  const file = gallerySchoolFiles[(index - 1) % gallerySchoolFiles.length];
  return `/images/gallery/school/${file}`;
}

export function collegeGalleryUrl(index: number): string {
  const file = galleryCollegeFiles[(index - 1) % galleryCollegeFiles.length];
  return `/images/gallery/college/${file}`;
}

export function schoolHeroUrl(index: number): string {
  const file = heroSchoolFiles[(index - 1) % heroSchoolFiles.length];
  return `/images/hero/${file}`;
}

export function collegeHeroUrl(index: number): string {
  const file = heroCollegeFiles[(index - 1) % heroCollegeFiles.length];
  return `/images/hero/${file}`;
}
