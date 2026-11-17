import { cn } from "@/lib/utils";

const PALETTE = [
  "bg-primary text-primary-foreground",
  "bg-secondary text-secondary-foreground",
  "bg-accent text-accent-foreground",
  "bg-[color-mix(in_srgb,var(--color-primary)_80%,white)] text-primary-foreground",
  "bg-[color-mix(in_srgb,var(--color-accent)_75%,black)] text-secondary-foreground",
];

function initialsFor(name: string): string {
  const parts = name
    .replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.)\s*/i, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
}

function paletteIndexFor(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % PALETTE.length;
  }
  return Math.abs(hash) % PALETTE.length;
}

const SIZE_CLASSES = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-16 text-lg",
  xl: "size-24 text-2xl",
  "2xl": "size-32 text-3xl",
} as const;

interface AvatarInitialsProps {
  name: string;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
}

/**
 * Deterministic initials avatar used for every person in the app (staff,
 * faculty, students, testimonials, demo accounts). See src/mocks/data/
 * images.ts for why real photos of real people are deliberately not used.
 */
export function AvatarInitials({ name, size = "md", className }: AvatarInitialsProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-heading font-semibold",
        SIZE_CLASSES[size],
        PALETTE[paletteIndexFor(name)],
        className,
      )}
      role="img"
      aria-label={name}
      title={name}
    >
      {initialsFor(name)}
    </div>
  );
}
