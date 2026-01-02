export type JournalCategory = "Behind" | "Report" | "Gear" | "Memo";

export type JournalPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: JournalCategory;
  date: string;
  readTime: string;
};

export type JournalContentBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "subheading"; text: string }
  | { kind: "list"; title?: string; items: string[] }
  | { kind: "quote"; text: string; attribution?: string };

export type JournalPostDetail = JournalPost & {
  published: boolean;
  isDraft?: boolean;
  featured?: boolean;
  hero: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  content: JournalContentBlock[];
};

export const journalCategories: JournalCategory[] = ["Behind", "Report", "Gear", "Memo"];
