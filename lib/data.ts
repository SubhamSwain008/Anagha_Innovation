import { prisma } from "@/lib/prisma";
import type { CompanyProfileData, SocialLink } from "@/types";

export async function getCompanyProfile(): Promise<CompanyProfileData | null> {
  try {
    const profile = await prisma.companyProfile.findFirst();
    if (!profile) return null;

    let socialLinks: SocialLink[] = [];
    try {
      socialLinks = typeof profile.socialLinks === "string"
        ? JSON.parse(profile.socialLinks as string)
        : (profile.socialLinks as unknown as SocialLink[]) || [];
    } catch {
      socialLinks = [];
    }

    return {
      ...profile,
      socialLinks,
    };
  } catch (err) {
    // Database is unavailable (e.g. during local dev). Return null so
    // callers can render a fallback UI instead of crashing the app.
    // eslint-disable-next-line no-console
    console.warn("getCompanyProfile: database unavailable:", (err as any)?.message ?? err);
    return null;
  }
}
