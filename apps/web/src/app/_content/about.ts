import { getSiteUrl } from "@/app/_lib/site";
import { primaryContactEmail } from "./contact";
import { aboutSocials, structuredDataSocialLinks } from "./socials";

const siteUrl = getSiteUrl();

export const profile = {
  name: "Taro Photos",
  tagline:
    "Professional Photographer based in Tokyo, capturing life's moments with clarity and emotion.",
  statement:
    "Photography is more than just capturing an image; it's about telling a story. With over 10 years of experience behind the lens, I strive to create visual narratives that resonate with viewers. Whether it's the raw energy of a live event, the quiet intimacy of a portrait, or the dynamic atmosphere of a commercial shoot, my goal is to deliver images that are both beautiful and meaningful. I believe in the power of visual storytelling to connect people and inspire change.",
  portrait: {
    src: "/profile/profile.jpg",
    alt: "Portrait of the photographer",
    width: 1600,
    height: 1671,
  },
  location: "Tokyo, Japan",
  languages: ["Japanese", "English"],
  email: primaryContactEmail,
  socials: aboutSocials.map(({ label, href }) => ({ platform: label, url: href })),
};

export const timeline: Array<{ year: string; description: string }> = [
  {
    year: "2024",
    description:
      "Expanded services to include international commercial projects and brand partnerships.",
  },
  {
    year: "2022",
    description:
      "Published first photo book featuring street photography from Tokyo.",
  },
  {
    year: "2020",
    description:
      "Established Taro Photos studio in Tokyo, focusing on portrait and event photography.",
  },
  {
    year: "2018",
    description:
      "Started professional freelance career, working with local businesses and artists.",
  },
  {
    year: "2015",
    description:
      "Graduated from Arts University with a degree in Photography.",
  },
];

type HighlightSection = {
  title: string;
  description?: string;
  items: string[];
};

type MvvItem = {
  id: string;
  label: string;
  title: string;
  description?: string;
  points?: string[];
};

export const mvv: MvvItem[] = [
  {
    id: "mission",
    label: "Mission",
    title: "Capturing the Essence",
    description:
      "To provide high-quality visual content that authentically represents the subject and tells a compelling story.",
  },
  {
    id: "vision",
    label: "Vision",
    title: "Visual Excellence",
    description:
      "To be a leading provider of photography services, known for creativity, professionalism, and technical excellence.",
  },
  {
    id: "values",
    label: "Values",
    title: "Core Principles",
    points: [
      "Authenticity - Staying true to the subject",
      "Quality - Uncompromising standards",
      "Creativity - Seeing the unique perspective",
    ],
  },
];

export const highlightSections: HighlightSection[] = [
  {
    title: "Areas of Expertise",
    description:
      "Specializing in various fields to meet diverse client needs.",
    items: [
      "Portrait Photography: capturing personality and character",
      "Event Photography: documenting moments as they happen",
      "Commercial Photography: enhancing brand identity",
    ],
  },
  {
    title: "Approach",
    description:
      "My workflow is designed to be collaborative and efficient.",
    items: [
      "Client-focused consultation",
      "Detailed planning and preparation",
      "Professional execution and delivery",
    ],
  },
];

export const clients = ["Global Tech Inc.", "Fashion Weekly", "City Arts Council"];

export const socials = aboutSocials;

export const personMetadata = {
  jobTitle: "Photographer",
  sameAs: structuredDataSocialLinks,
  url: siteUrl,
  email: primaryContactEmail,
};
