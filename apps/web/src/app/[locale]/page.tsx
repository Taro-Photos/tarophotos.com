import Hero from "@/components/organisms/Hero";
import FeaturedSection from "@/components/organisms/FeaturedSection";
import AboutTeaserSection from "@/components/organisms/AboutTeaserSection";
import { profile } from "../_content/about";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { seriesDetails } from "../_content/series";
import { journalPostDetails } from "../_content/journal";

const featuredSeries = seriesDetails
  .filter((series) => series.featured)
  .map((series) => ({
    title: series.title.toUpperCase(),
    subtitle: "SERIES",
    imageSrc: series.cover.src,
    imageAlt: series.cover.alt,
    link: `/works/${series.slug}`,
  }));

const featuredJournals = journalPostDetails
  .filter((post) => post.featured)
  .map((post) => ({
    title: post.title.toUpperCase(),
    subtitle: "JOURNAL",
    imageSrc: post.hero.src,
    imageAlt: post.hero.alt,
    link: `/journal/${post.slug}`,
  }));

const featuredItems = [...featuredSeries, ...featuredJournals].map(
  (item, index) => ({
    ...item,
    isTextLeft: index % 2 === 0,
  })
);

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations("home");
  
  return (
    <>
      <Hero
        title={t("heroTitle")}
        subtitle={profile.statement}
        imageSrc="/hero-main.png"
        imageAlt="Hero Image"
      />
      <FeaturedSection items={featuredItems} />

      <AboutTeaserSection />
    </>
  );
}
