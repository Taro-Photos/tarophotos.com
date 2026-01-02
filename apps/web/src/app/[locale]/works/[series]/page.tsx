import Image from "next/image";
import Link from "next/link";
import { getSeriesBySlug } from "@/app/_content/series";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ series: string }>;
}

export default async function SeriesPage({ params }: PageProps) {
  const { series: slug } = await params;
  const series = getSeriesBySlug(slug);

  if (!series) {
    notFound();
  }

  const isCommercial = series.tags.includes("Sports");
  const backLink = isCommercial ? "/works#commercial" : "/works#personal";
  const backLabel = "Back to Works";

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative h-[70vh] w-full flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={series.cover.src}
            alt={series.cover.alt}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-light uppercase tracking-[0.2em] leading-tight mb-4">
            {series.title}
          </h1>
          <p className="text-lg font-light tracking-widest">
            {series.year} — {series.location}
          </p>
        </div>
      </section>

      {/* Synopsis */}
      <section className="py-24 px-6 sm:px-10 md:px-20 max-w-4xl mx-auto text-center">
        <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
          {series.synopsis}
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <span className="text-xs uppercase tracking-widest border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-full">
            {series.palette}
          </span>
          <span className="text-xs uppercase tracking-widest border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-full">
            {series.focus}
          </span>
        </div>
      </section>

      {/* Gallery */}
      <section className="px-4 md:px-8 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {series.gallery.map((image, index) => (
            <div key={index} className="relative aspect-[3/2] group overflow-hidden">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Navigation */}
      <div className="text-center pb-24">
        <Link 
          href={backLink}
          className="inline-block text-xs uppercase tracking-[0.3em] border border-primary dark:border-white py-3 px-8 hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-primary transition-colors duration-300"
        >
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
