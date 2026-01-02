export type WorkTag =
  | "urban"
  | "nature"
  | "motion"
  | "people"
  | "monochrome"
  | "color";

export type SeriesCategory = "Commercial" | "Personal";

export type SeriesImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  contentLocation: string;
  datePublished: string;
  caption?: string;
  statement?: string;
};

export type SeriesDetails = {
  slug: string;
  title: string;
  year: number;
  location: string;
  category: SeriesCategory;
  palette: WorkTag;
  focus: WorkTag;
  synopsis: string;
  lead: string;
  story: string;
  tags: string[];
  published: boolean;
  isDraft?: boolean;
  featured?: boolean;
  cover: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  heroImage: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  gallery: SeriesImage[];
  exif: Array<{ label: string; value: string }>;
  relatedCta: {
    heading: string;
    body: string;
    href: string;
    label: string;
  };
};
