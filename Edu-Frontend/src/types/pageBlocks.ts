export type BlockType = 'hero' | 'heading' | 'text' | 'image' | 'list' | 'cards' | 'button' | 'stats' | 'quote' | 'timeline';

export interface PageCardItem {
  title: string;
  text: string;
  image?: string;
}

export interface PageStatItem {
  value: string;
  label: string;
}

export interface PageTimelineItem {
  year: string;
  title: string;
  text: string;
}

export interface PageBlock {
  id: string;
  type: BlockType;
  title?: string;
  subtitle?: string;
  text?: string;
  image?: string;
  caption?: string;
  align?: 'full' | 'left' | 'right' | 'center';
  items?: string[];
  cards?: PageCardItem[];
  stats?: PageStatItem[];
  timeline?: PageTimelineItem[];
  link?: string;
  buttonText?: string;
}

export interface DesignedPageData {
  version: 1;
  template: string;
  blocks: PageBlock[];
}

export function parsePageContent(raw?: string): DesignedPageData | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed.startsWith('{')) return null;
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && Array.isArray(parsed.blocks)) {
      return {
        version: 1,
        template: parsed.template || 'custom',
        blocks: parsed.blocks,
      };
    }
  } catch {
    return null;
  }
  return null;
}

export function plainTextToBlocks(raw?: string): PageBlock[] {
  if (!raw || !raw.trim()) return [];
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, i) => ({
      id: `txt-${Date.now()}-${i}`,
      type: 'text' as const,
      text: line,
    }));
}
