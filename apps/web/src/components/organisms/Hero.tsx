import Image from "next/image";

interface HeroProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
}

export default function Hero({ title, subtitle, imageSrc, imageAlt }: HeroProps) {
  return (
    <section className="relative h-screen w-full flex items-center justify-center text-white">
      <div className="absolute inset-0 bg-black/30 z-10"></div>
      <div className="absolute inset-0 w-full h-full">
        <Image 
          src={imageSrc} 
          alt={imageAlt} 
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-light uppercase tracking-[0.2em] leading-tight mb-8">
          {title}
        </h1>
        <p className="mt-8 max-w-2xl mx-auto text-lg font-light leading-relaxed">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
