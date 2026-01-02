import type { JournalPost, JournalPostDetail } from "./types";
import { visionOfLight } from "./vision-of-light";

export * from "./types";

// Environment check
const isDevelopment = process.env.NODE_ENV === 'development';

// All journal posts (unfiltered)
const allJournalPostDetails: JournalPostDetail[] = [
  visionOfLight,
];

// Filter based on published status
export const journalPostDetails: JournalPostDetail[] = allJournalPostDetails.filter(
  post => post.published || (isDevelopment && post.isDraft)
);

// Extract summary data for listing pages
export const journalPosts: JournalPost[] = journalPostDetails.map(
  ({ slug, title, excerpt, category, date, readTime }) => ({
    slug,
    title,
    excerpt,
    category,
    date,
    readTime,
  }),
);

// Helper function to get a specific post by slug
export function getJournalPostBySlug(slug: string) {
  return journalPostDetails.find((post) => post.slug === slug);
}
