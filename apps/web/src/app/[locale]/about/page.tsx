import { profile, timeline, mvv, highlightSections } from "@/app/_content/about";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-24 px-6 sm:px-10 md:px-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-wider leading-tight mb-8">
            About Me
          </h1>
          <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-8">
            {profile.statement}
          </p>
          <div className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400">
            <p>Based in: {profile.location}</p>
            <p>Languages: {profile.languages.join(", ")}</p>
          </div>
        </div>
        <div className="relative aspect-[3/4] md:aspect-square w-full bg-gray-100 dark:bg-gray-800">
          <Image
            src={profile.portrait.src}
            alt={profile.portrait.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </section>

      {/* MVV Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-24 px-6 sm:px-10 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mvv.map((item) => (
              <div key={item.id} className="bg-white dark:bg-background-dark p-8 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block">
                  {item.label}
                </span>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                )}
                {item.points && (
                  <ul className="space-y-2 mt-4">
                    {item.points.map((point, i) => (
                      <li key={i} className="text-sm text-gray-500 dark:text-gray-400 flex items-start">
                        <span className="mr-2 text-primary dark:text-white">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-6 sm:px-10 md:px-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-light uppercase tracking-wider text-center mb-16">Timeline</h2>
        <div className="border-l border-gray-200 dark:border-gray-800 ml-4 md:ml-0 space-y-12">
          {timeline.map((item, index) => (
            <div key={index} className="relative pl-8 md:pl-12">
              <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-primary dark:bg-white"></div>
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                <span className="text-xl font-bold text-primary dark:text-white min-w-[80px]">
                  {item.year}
                </span>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-primary text-white py-24 px-6 sm:px-10 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {highlightSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-2xl font-light uppercase tracking-wider mb-6 border-b border-white/20 pb-4">
                {section.title}
              </h3>
              <p className="text-gray-300 mb-6">{section.description}</p>
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-300">
                    <span className="mr-3 text-white">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
