import Link from "next/link";

export default function JournalEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="max-w-md">
        <h2 className="text-2xl font-light mb-4 text-gray-900 dark:text-white">
          Coming Soon
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Journal entries will be published soon. Check back later for stories, insights, and behind-the-scenes content.
        </p>
        <Link
          href="/"
          className="inline-block text-sm uppercase tracking-[0.3em] border border-primary dark:border-white py-3 px-8 hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-primary transition-colors duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
