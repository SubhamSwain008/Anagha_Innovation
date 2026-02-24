export interface CartItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  price: number | null;
  imageUrl: string | null;
  quantity: number;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface CompanyProfileData {
  id: string;
  companyName: string;
  tagline: string | null;
  description: string | null;
  mission: string | null;
  vision: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  socialLinks: SocialLink[];
  logoUrl: string | null;
  faviconUrl: string | null;
}

export interface ProductWithRelations {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  fullDescription: string | null;
  categoryId: string | null;
  status: "PROTOTYPE" | "AVAILABLE" | "UNDER_DEVELOPMENT";
  powerRating: string | null;
  voltageRange: string | null;
  efficiency: string | null;
  rpm: string | null;
  weight: string | null;
  dimensions: string | null;
  price: number | null;
  createdAt: Date;
  updatedAt: Date;
  category: { id: string; name: string; slug: string } | null;
  features: { id: string; title: string; description: string | null; order: number }[];
  specifications: { id: string; specKey: string; specValue: string; unit: string | null; order: number }[];
  media: { id: string; imageUrl: string; publicId: string | null; altText: string | null; order: number }[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
