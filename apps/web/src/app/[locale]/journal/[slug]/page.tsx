import Image from "next/image";
import Link from "next/link";
import { getJournalPostBySlug } from "@/app/_content/journal";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function JournalPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getJournalPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative h-[60vh] w-full flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={post.hero.src}
            alt={post.hero.alt}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <span className="text-sm font-medium tracking-widest uppercase mb-4 block">
            {post.category} — {post.date}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-lg font-light opacity-90">
            Read time: {post.readTime}
          </p>
        </div>
      </section>

      {/* Content */}
      <article className="py-24 px-6 sm:px-10 md:px-20 max-w-3xl mx-auto">
        <div className="prose prose-lg dark:prose-invert mx-auto">
          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-12 font-light">
            {post.excerpt}
          </p>
          
          {post.content.map((block, index) => {
            switch (block.kind) {
              case "paragraph":
                return (
                  <p key={index} className="mb-8 leading-relaxed text-gray-700 dark:text-gray-300">
                    {block.text}
                  </p>
                );
              case "subheading":
                return (
                  <h2 key={index} className="text-2xl font-bold mt-12 mb-6 text-primary dark:text-white">
                    {block.text}
                  </h2>
                );
              case "list":
                return (
                  <ul key={index} className="list-disc pl-6 mb-8 space-y-2 text-gray-700 dark:text-gray-300">
                    {block.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                );
              case "quote":
                return (
                  <blockquote key={index} className="border-l-4 border-primary dark:border-white pl-6 my-12 italic text-xl text-gray-600 dark:text-gray-400">
                    &quot;{block.text}&quot;
                    {block.attribution && (
                      <footer className="text-sm font-normal mt-2 not-italic text-gray-500">
                        — {block.attribution}
                      </footer>
                    )}
                  </blockquote>
                );
              default:
                return null;
            }
          })}
        </div>
      </article>

      {/* Navigation */}
      <div className="text-center pb-24 border-t border-gray-100 dark:border-gray-800 pt-12 max-w-4xl mx-auto">
        <Link 
          href="/journal"
          className="inline-block text-xs uppercase tracking-[0.3em] border border-primary dark:border-white py-3 px-8 hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-primary transition-colors duration-300"
        >
          Back to Journal
        </Link>
      </div>
    </div>
  );
}
