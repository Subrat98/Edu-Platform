import { mockRequest } from "@/mocks/api/client";
import { getGalleryAlbumsByInstitution } from "@/mocks/data/gallery";
import type { GalleryAlbum, InstitutionType } from "@/types";

export const galleryService = {
  list: (institutionId: InstitutionType) =>
    mockRequest<GalleryAlbum[]>(() => getGalleryAlbumsByInstitution(institutionId), { latencyMs: [300, 650] }),
};
