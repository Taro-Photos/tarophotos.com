import Image from "next/image";
import Link from "next/link";

export default function ServicePromoSection() {
  return (
    <section className="py-24 md:py-32 px-4 md:px-8 bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400 mb-4">
            Services
          </p>
          <h2 className="text-4xl md:text-6xl font-light uppercase tracking-wider leading-tight">
            Professional <br /> Photography
          </h2>
          <Link
            href="/services"
            className="inline-block mt-12 text-xs uppercase tracking-[0.3em] border border-black dark:border-white py-3 px-8 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300"
          >
            View Services
          </Link>
        </div>
        <div className="flex justify-center relative aspect-square w-full max-w-sm">
           {/* Placeholder for service image or keeping the book image from design as placeholder for now */}
           <Image 
             src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_yljZibpXPC8g5Eh6GzDjNRkJiLw55o6Wwgi03oLjHir7QqIcRxhVUf4T_3AC-4WULyrcErBb3rSK_GaGv1Zvi9RTpp2TlPq_1Xh1TfqOhJBioy6tMKAtOjbZZYHDJaaO3ciXCofNdalcgL-aodp1hizSgm2uzvP-m8dvRSekTt7qok06UulBWM7SIQQsiJrV_xsVqB5jmkaZFjRHANFkIsLdvkAD4xYpeyQ-XHT1ZbyCBqnPWzroQojL4AnUwOBOQOyubUzGBDo" 
             alt="Services" 
             fill
             className="object-cover shadow-xl"
             sizes="(max-width: 768px) 100vw, 50vw"
           />
        </div>
      </div>
    </section>
  );
}
