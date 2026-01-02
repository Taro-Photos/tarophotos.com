export type ServiceAvailability = "active" | "paused";

export type ServicePlan = {
  slug: string;
  title: string;
  summary: string;
  price: string;
  deliverables: string[];
  notes: string;
  availability?: ServiceAvailability;
  availabilityNote?: string;
  isHidden?: boolean;
};

export type ProcessStep = {
  title: string;
  description: string;
  duration: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const servicePlans: ServicePlan[] = [
  {
    slug: "portrait",
    title: "Portrait",
    summary: "Capture your authentic self with natural light and professional direction.",
    price: "Starting at ¥30,000",
    deliverables: [
      "1 Hour Session",
      "20 High-Res Retouched Images",
      "Online Gallery",
      "Commercial Use License Available"
    ],
    notes: "Studio options available upon request.",
  },
  {
    slug: "event",
    title: "Event Coverage",
    summary: "Document your special occasions, corporate events, or live performances.",
    price: "Starting at ¥50,000",
    deliverables: [
      "3 Hours Coverage",
      "100+ Edited Images",
      "Quick Turnaround (24-48h)",
      "Web & Print Resolution"
    ],
    notes: "Travel expenses may apply for locations outside Tokyo.",
  },
  {
    slug: "commercial",
    title: "Commercial / Brand",
    summary: "Elevate your brand with high-quality visuals for web, social, and print.",
    price: "Custom Quote",
    deliverables: [
      "Concept Development",
      "Full Day / Half Day Options",
      "Professional Retouching",
      "Usage Rights Included"
    ],
    notes: "Please contact for a detailed consultation.",
  },
];

export const visibleServicePlans = servicePlans.filter((plan) => !plan.isHidden);

export const processSteps: ProcessStep[] = [
  {
    title: "Consultation",
    description:
      "We discuss your vision, requirements, and logistics to ensure we are a perfect fit.",
    duration: "30 min (Online/In-person)",
  },
  {
    title: "Shooting",
    description:
      "The main event. I guide you through the process to capture the best moments naturally.",
    duration: "Varies by project",
  },
  {
    title: "Editing",
    description:
      "Professional post-processing to enhance color, lighting, and composition.",
    duration: "1-2 Weeks",
  },
  {
    title: "Delivery",
    description:
      "Receive your high-resolution images via a private, secure online gallery.",
    duration: "Instant Download",
  },
];

export const faqs: FaqItem[] = [
  {
    question: "Do you travel for shoots?",
    answer:
      "Yes, I am based in Tokyo but available for assignments worldwide. Travel fees will be included in the quote.",
  },
  {
    question: "How do I book a session?",
    answer:
      "Please use the contact form to inquire about availability. A deposit is required to secure your date.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Cancellations made 7 days prior to the shoot are fully refundable. Within 7 days, the deposit is non-refundable.",
  },
  {
    question: "Do you provide raw files?",
    answer:
      "I do not provide RAW files as the editing process is an integral part of my artistic style and final product.",
  },
];
