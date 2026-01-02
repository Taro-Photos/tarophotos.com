import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photography Portfolio - Works",
  description: "Explore curated photo series including Tokyo nightscapes, waterfront scenes, seasonal landscapes, historic districts, and commercial sports photography.",
  openGraph: {
    title: "Photography Portfolio - Taro Photos",
    description: "Curated photo series from Tokyo and beyond",
    url: "/works",
  },
};

export default function WorksPage() {
  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="py-24 px-4 md:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-wider leading-tight mb-6 text-primary dark:text-white">
          Works
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
          A collection of commercial assignments and personal artistic series.
        </p>
      </div>

      {/* Coming Soon State */}
      <div className="flex flex-col items-center justify-center py-24 text-center border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-md">
          <h2 className="text-2xl font-light mb-4 text-gray-900 dark:text-white">
            Coming Soon
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Portfolio works will be published soon. Check back later to explore commercial and personal photography projects.
          </p>
          <Link
            href="/"
            className="inline-block text-sm uppercase tracking-[0.3em] border border-primary dark:border-white py-3 px-8 hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-primary transition-colors duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
