import Image from "next/image";
import Link from "next/link";

interface FeaturedItem {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  link: string;
  isTextLeft?: boolean;
}

export default function FeaturedSection({ items }: { items: FeaturedItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-24 md:py-32 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400 mb-16">
          Featured
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {items.map((item, index) => (
            <div key={index} className="contents">
              {/* Text Block */}
              <div
                className={`flex flex-col items-center justify-center p-12 text-center bg-background-light dark:bg-background-dark ${
                  item.isTextLeft ? "order-1" : "order-2 md:order-1"
                }`}
              >
                <span className="text-sm font-light tracking-[0.2em]">THE</span>
                <h2 className="text-4xl md:text-5xl font-light tracking-[0.3em] my-2 uppercase">
                  {item.title}
                </h2>
                <span className="text-sm font-light tracking-[0.2em]">
                  {item.subtitle}
                </span>
              </div>

              {/* Image Block */}
              <div className={`${item.isTextLeft ? "order-2" : "order-1 md:order-2"} aspect-square relative`}>
                <Link href={item.link} className="block w-full h-full group overflow-hidden">
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
