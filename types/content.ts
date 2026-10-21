export type SectionLayout = "image-left" | "image-right" | "full-bleed";

export type Section = {
  id: string;
  key: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  layout: SectionLayout;
  sort_order: number;
  is_visible: boolean;
};

export type ModelCategory = "women" | "men" | "new-faces" | "kids";

export type Model = {
  id: string;
  name: string;
  slug: string;
  category: ModelCategory;
  cover_image_url: string | null;
  bio: string | null;
  height: string | null;
  bust: string | null;
  waist: string | null;
  hips: string | null;
  shoes: string | null;
  hair: string | null;
  eyes: string | null;
  sort_order: number;
  is_visible: boolean;
};

export type ModelImage = {
  id: string;
  model_id: string;
  image_url: string;
  sort_order: number;
};

export type Service = {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_visible: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  logo_url: string | null;
  quote: string | null;
  sort_order: number;
  is_visible: boolean;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
  is_read: boolean;
};

export const modelCategoryLabels: Record<ModelCategory, string> = {
  women: "Women",
  men: "Men",
  "new-faces": "New Faces",
  kids: "Kids",
};
