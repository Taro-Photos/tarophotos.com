import { journalPosts } from "@/app/_content/journal";
import JournalEmptyState from "@/components/molecules/JournalEmptyState";
import JournalList from "@/components/organisms/JournalList";

export default function JournalPage() {
  return (
    <div className="flex flex-col items-center py-16 sm:py-24 px-6 sm:px-10 md:px-20">
      <div className="w-full max-w-4xl flex flex-col gap-3 pb-12 sm:pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-wider leading-tight text-primary dark:text-white">
          Journal
        </h1>
        <p className="text-base font-normal leading-normal max-w-lg mx-auto text-gray-500 dark:text-gray-400">
          A collection of stories, projects, and behind-the-scenes insights from a photographer&apos;s perspective.
        </p>
      </div>

      {/* Empty state */}
      {journalPosts.length === 0 && <JournalEmptyState />}

      {/* Journal posts */}
      {journalPosts.length > 0 && <JournalList posts={journalPosts} />}
    </div>
  );
}
