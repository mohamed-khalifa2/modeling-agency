import type { Model, Section, Service, Testimonial } from "@/types";

export const DEFAULT_CONTACT = {
  email: "hello@luminamodels.com",
  phone: "+1 (212) 555-0148",
  whatsapp: "+12125550148",
  address: "214 Mercer Street, Suite 4, New York, NY 10012",
};

export const DEFAULT_SOCIALS = {
  instagram: "https://instagram.com/luminamodels",
  facebook: "https://facebook.com/luminamodels",
  tiktok: "https://tiktok.com/@luminamodels",
};

export const DEFAULT_TAGLINE =
  "Representing distinctive talent across fashion, commercial, and editorial.";

export const DEFAULT_HERO = {
  headline: "Faces That Define the Season",
  subheadline:
    "A boutique New York agency representing women, men, new faces, and kids for runway, editorial, and commercial campaigns.",
  primary: { label: "View the Board", href: "/models" },
  secondary: { label: "Get in Touch", href: "/#contact" },
};

export const DEFAULT_SECTIONS: Section[] = [
  {
    id: "placeholder-about",
    key: "about",
    title: "An Agency Built on Individuality",
    subtitle: "Who we are",
    description:
      "Introduce your agency here — who you are, what you believe in, and what sets your roster apart. Edit this section in the admin dashboard.",
    image_url: "https://placehold.co/900x1100/e8e4dd/1a1a1a?text=About",
    layout: "image-left",
    sort_order: 1,
    is_visible: true,
  },
  {
    id: "placeholder-philosophy",
    key: "philosophy",
    title: "Craft, Care, and Longevity",
    subtitle: "How we work",
    description:
      "Describe your approach — development, representation, and the standards you hold on set. This copy is editable in the admin dashboard.",
    image_url: "https://placehold.co/900x1100/dcd8d0/1a1a1a?text=Approach",
    layout: "image-right",
    sort_order: 2,
    is_visible: true,
  },
  {
    id: "placeholder-board",
    key: "representation",
    title: "A Board as Diverse as the Industry We Serve",
    subtitle: "Our board",
    description:
      "Tell visitors about your roster and how you scout and place talent. Edit or replace this section whenever you're ready.",
    image_url: "https://placehold.co/1920x900/cfc9bf/1a1a1a?text=Board",
    layout: "full-bleed",
    sort_order: 3,
    is_visible: true,
  },
];

export const DEFAULT_SERVICES: Service[] = [
  {
    id: "placeholder-service-1",
    title: "Editorial & Campaign Representation",
    description:
      "Full-service placement with magazines, fashion houses, and global brands — from lookbooks to season-long campaigns.",
    icon: "camera",
    sort_order: 1,
    is_visible: true,
  },
  {
    id: "placeholder-service-2",
    title: "Runway & Show Production",
    description:
      "Casting support, show packages, and backstage management for the world's fashion weeks.",
    icon: "runway",
    sort_order: 2,
    is_visible: true,
  },
  {
    id: "placeholder-service-3",
    title: "Brand Partnerships & Ambassadorships",
    description:
      "Long-term ambassador programs and social partnerships negotiated and managed end to end by our team.",
    icon: "handshake",
    sort_order: 3,
    is_visible: true,
  },
];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "placeholder-client-1",
    name: "Your Client Here",
    logo_url: "https://placehold.co/200x80/e8e4dd/1a1a1a?text=Client",
    quote: null,
    sort_order: 1,
    is_visible: true,
  },
  {
    id: "placeholder-client-2",
    name: "A Happy Brand",
    logo_url: null,
    quote: "Add a testimonial from a client in the admin dashboard and it will appear right here.",
    sort_order: 2,
    is_visible: true,
  },
  {
    id: "placeholder-client-3",
    name: "Another Client",
    logo_url: "https://placehold.co/200x80/dcd8d0/1a1a1a?text=Logo",
    quote: null,
    sort_order: 3,
    is_visible: true,
  },
];

export const DEFAULT_MODELS: Model[] = [
  {
    id: "placeholder-model-1",
    name: "Model One",
    slug: "placeholder-1",
    category: "women",
    cover_image_url: "https://placehold.co/800x1000/c9b8a8/1a1a1a?text=Model",
    bio: null,
    height: null,
    bust: null,
    waist: null,
    hips: null,
    shoes: null,
    hair: null,
    eyes: null,
    sort_order: 1,
    is_visible: true,
  },
  {
    id: "placeholder-model-2",
    name: "Model Two",
    slug: "placeholder-2",
    category: "men",
    cover_image_url: "https://placehold.co/800x1000/a8b8c9/1a1a1a?text=Model",
    bio: null,
    height: null,
    bust: null,
    waist: null,
    hips: null,
    shoes: null,
    hair: null,
    eyes: null,
    sort_order: 2,
    is_visible: true,
  },
  {
    id: "placeholder-model-3",
    name: "Model Three",
    slug: "placeholder-3",
    category: "new-faces",
    cover_image_url: "https://placehold.co/800x1000/c9c4a8/1a1a1a?text=Model",
    bio: null,
    height: null,
    bust: null,
    waist: null,
    hips: null,
    shoes: null,
    hair: null,
    eyes: null,
    sort_order: 3,
    is_visible: true,
  },
  {
    id: "placeholder-model-4",
    name: "Model Four",
    slug: "placeholder-4",
    category: "kids",
    cover_image_url: "https://placehold.co/800x1000/a8c9b4/1a1a1a?text=Model",
    bio: null,
    height: null,
    bust: null,
    waist: null,
    hips: null,
    shoes: null,
    hair: null,
    eyes: null,
    sort_order: 4,
    is_visible: true,
  },
];
