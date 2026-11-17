import type { InstitutionType } from "./institution";

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
}

export interface GalleryAlbum {
  id: string;
  institutionId: InstitutionType;
  title: string;
  date: string;
  coverUrl: string;
  images: GalleryImage[];
}
