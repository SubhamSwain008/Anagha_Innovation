import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  description: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  categoryId: z.string().optional().nullable(),
  status: z.enum(["PROTOTYPE", "AVAILABLE", "UNDER_DEVELOPMENT"]),
  powerRating: z.string().optional().nullable(),
  voltageRange: z.string().optional().nullable(),
  efficiency: z.string().optional().nullable(),
  rpm: z.string().optional().nullable(),
  weight: z.string().optional().nullable(),
  dimensions: z.string().optional().nullable(),
  price: z.number().optional().nullable(),
  architecture: z
    .object({
      imageUrl: z.string().url().optional().or(z.literal("")),
      description: z.string().optional(),
    })
    .optional(),
});

export const featureSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  order: z.number().default(0),
});

export const specificationSchema = z.object({
  specKey: z.string().min(1, "Specification key is required"),
  specValue: z.string().min(1, "Specification value is required"),
  unit: z.string().optional(),
  order: z.number().default(0),
});

export const teamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  designation: z.string().min(2, "Designation is required"),
  roleType: z.enum(["ADVISOR", "CORE_TEAM", "DIRECTOR", "MENTOR", "ENGINEER"]),
  bio: z.string().optional(),
  linkedInUrl: z.string().url().optional().or(z.literal("")),
  imageUrl: z.string().optional(),
  order: z.number().default(0),
});

export const companyProfileSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  tagline: z.string().optional(),
  description: z.string().optional(),
  mission: z.string().optional(),
  vision: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  socialLinks: z.array(z.object({
    platform: z.string(),
    url: z.string().url(),
  })).optional(),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type FeatureInput = z.infer<typeof featureSchema>;
export type SpecificationInput = z.infer<typeof specificationSchema>;
export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
export type CompanyProfileInput = z.infer<typeof companyProfileSchema>;
