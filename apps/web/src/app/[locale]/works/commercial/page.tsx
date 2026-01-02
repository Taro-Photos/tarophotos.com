import Link from "next/link";
import Image from "next/image";
import { workSeries } from "@/app/_content/works";

export default function CommercialWorksPage() {
  const commercialSeries = workSeries.filter(series => series.category === "Commercial");

  return (
    <div className="w-full">
      <div className="py-24 px-4 md:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-wider leading-tight mb-6 text-primary dark:text-white">
          Commercial Works
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
          Sports / Events / Client Works
        </p>
      </div>

      <section className="py-12 border-t border-gray-100 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-w-7xl mx-auto">
          {commercialSeries.map((series, index) => (
            <div key={series.slug} className="contents">
              <div
                className={`flex flex-col items-center justify-center p-12 text-center bg-background-light dark:bg-background-dark ${
                  index % 2 === 0 ? "order-1" : "order-2 md:order-1"
                }`}
              >
                <span className="text-sm font-light tracking-[0.2em] text-gray-500 dark:text-gray-400">COMMERCIAL</span>
                <h3 className="text-3xl md:text-4xl font-light tracking-[0.2em] my-4 uppercase text-primary dark:text-white">
                  {series.title}
                </h3>
                <span className="text-sm font-light tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  {series.year} / {series.location}
                </span>
                <Link
                  href={`/works/${series.slug}`}
                  className="mt-8 text-xs uppercase tracking-[0.3em] border border-primary dark:border-white py-3 px-8 hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-primary transition-colors duration-300"
                >
                  View Project
                </Link>
              </div>

              <div className={`${index % 2 === 0 ? "order-2" : "order-1 md:order-2"} aspect-square relative`}>
                <Link href={`/works/${series.slug}`} className="block w-full h-full group overflow-hidden">
                  <Image
                    src={series.cover.src}
                    alt={series.cover.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
