
import Link from "next/link";

export const metadata = {
  title: "404 - Page Not Found",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl font-display font-medium mb-4 tracking-widest text-primary dark:text-white">
        404
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 tracking-wider">
        PAGE NOT FOUND
      </p>
      <Link
        href="/"
        className="inline-block px-8 py-3 text-sm border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors tracking-[0.2em] uppercase"
      >
        BACK TO TOP
      </Link>
    </div>
  );
}
