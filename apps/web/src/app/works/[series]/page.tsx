import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeriesDetail } from "@/components/series/SeriesDetail";
import { JsonLd } from "../../_components/JsonLd";
import { getSeriesBySlug, seriesDetails } from "../../_content/series";
import { getSiteUrl } from "../../_lib/site";

const siteUrl = getSiteUrl();

type SeriesPageParams = {
  series: string;
};

type SeriesPageProps = {
  params: Promise<SeriesPageParams>;
};

export async function generateStaticParams() {
  return seriesDetails.map((series) => ({ series: series.slug }));
}

export async function generateMetadata(
  { params }: SeriesPageProps,
): Promise<Metadata> {
  const { series } = await params;
  const data = getSeriesBySlug(series);

  if (!data) {
    return {};
  }

  const description = data.lead;
  const url = `${siteUrl}/works/${data.slug}`;
  const heroImageUrl = `${siteUrl}${data.heroImage.src}`;

  return {
    title: `${data.title} | Works`,
    description,
    alternates: {
      canonical: `/works/${data.slug}`,
    },
    openGraph: {
      title: `${data.title} | Taro Photos`,
      description,
      url,
      type: "article",
      images: [
        {
          url: heroImageUrl,
          width: data.heroImage.width,
          height: data.heroImage.height,
          alt: data.heroImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.title} | Taro Photos`,
      description,
      images: [heroImageUrl],
    },
  };
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { series } = await params;
  const data = getSeriesBySlug(series);

  if (!data) {
    notFound();
  }

  const imageObjects = data.gallery.map((image) => ({
    "@type": "ImageObject",
    contentUrl: `${siteUrl}${image.src}`,
    creator: {
      "@type": "Person",
      name: "Taro Shirai",
    },
    contentLocation: image.contentLocation,
    datePublished: image.datePublished,
    name: image.alt,
  }));

  const pageUrl = `${siteUrl}/works/${data.slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${data.title} | Taro Photos`,
    description: data.lead,
    url: pageUrl,
    hasPart: imageObjects,
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Works", item: `${siteUrl}/works` },
      { "@type": "ListItem", position: 3, name: data.title, item: pageUrl },
    ],
  };

  return (
    <>
      <SeriesDetail data={data} />
      <JsonLd data={[structuredData, breadcrumbStructuredData]} />
    </>
  );
}
