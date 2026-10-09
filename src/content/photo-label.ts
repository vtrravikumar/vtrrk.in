// Accessible text for photographs. The catalogue has no caption or alt-text
// field, so labels are derived from the metadata that does exist.

interface PhotoMeta {
  place?: string;
  country?: string;
  model?: string;
  categories?: string[];
}

const categoryLabels: Record<string, string> = {
  abstract: "Abstract",
  street: "Street",
  landscapes: "Landscape",
  portraits: "Portrait",
  model: "Model portfolio",
};

/** Describes a photograph, e.g. "Leh · India" or "Photograph of Bindu". */
export function photoLabel(photo: PhotoMeta): string {
  const where = [photo.place, photo.country].filter(Boolean).join(" · ");
  if (where) return where;
  if (photo.model) return `Photograph of ${photo.model}`;
  const category = photo.categories?.map((name) => categoryLabels[name]).find(Boolean);
  return category ? `${category} photograph` : "Photograph";
}

/** Name for a thumbnail link in a gallery, made distinct by its position. */
export function photoLinkLabel(photo: PhotoMeta, index: number, total: number): string {
  return `${photoLabel(photo)} (${index + 1} of ${total})`;
}
