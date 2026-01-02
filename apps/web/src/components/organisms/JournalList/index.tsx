import Link from "next/link";

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

interface Props {
  posts: Post[];
}

export default function JournalList({ posts }: Props) {
  return (
    <div className="flex flex-col gap-16 sm:gap-24 w-full max-w-4xl">
      {posts.map((post) => (
        <article key={post.slug} className="flex flex-col items-center gap-4 group">
          <Link href={`/journal/${post.slug}`} className="w-full">
            <div 
              className="w-full aspect-[16/9] rounded-lg shadow-sm overflow-hidden transition-transform duration-500 group-hover:scale-[1.01]"
            >
              <div className="w-full h-full bg-gray-200 dark:bg-gray-800" />
            </div>
          </Link>
          <div className="flex w-full max-w-2xl flex-col items-center justify-center gap-1 text-center">
            <p className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400">
              {post.date}
            </p>
            <Link href={`/journal/${post.slug}`}>
              <h3 className="text-xl sm:text-2xl font-bold leading-tight tracking-[-0.015em] text-primary dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200">
                {post.title}
              </h3>
            </Link>
            <p className="text-base font-normal leading-relaxed mt-1 text-gray-500 dark:text-gray-400">
              {post.excerpt}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
