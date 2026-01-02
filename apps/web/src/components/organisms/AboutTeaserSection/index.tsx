import Image from "next/image";
import Link from "next/link";
import { profile } from "@/app/_content/about";

export default function AboutTeaserSection() {
  return (
    <section className="relative h-[90vh] w-full flex items-end justify-center text-white p-8 md:p-16">
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <Image 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1U9no9ibQnTYnpfUD03zd1VOO6D-tEbPMZ9A0MZ2Pj8ApV3AVF1OpIIqsVBLq9TtdFF5OgpeS1p6V6ZCqtKZXXxBWSRF49AmoCxXUWW6snpdJAcwsfvUCiIT9CAplrn9H-tm40-e3-5ygM-7usYYdz90YYqZa1OzbRw903hI2FXjkY_a99DST1ckC1nYmXbr5osE720BM0PL1IAhfmSYAa4jhzB6krmJMnbNIq-Z-lY3GmBBcdK1whPH89gt4pzcuyT_DJRt41u4" 
        alt="About Background" 
        fill
        className="object-cover"
        priority={false}
      />
      <div className="relative z-20 max-w-7xl mx-auto w-full">
        <h2 className="text-4xl md:text-6xl font-light leading-tight mb-8">
          {profile.tagline}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-base font-light leading-relaxed">
          <p>{profile.statement}</p>
          <p>
            <Link href="/about" className="underline hover:text-gray-300 transition-colors">
              Read more about me &rarr;
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
