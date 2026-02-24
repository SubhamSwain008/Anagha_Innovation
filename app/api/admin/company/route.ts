import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { companyProfileSchema } from "@/lib/validations";

export async function GET() {
  try {
    let profile = await prisma.companyProfile.findFirst();
    if (!profile) {
      profile = await prisma.companyProfile.create({
        data: {
          companyName: "Anagha Innovation",
          tagline: "Powering the Future of Green Energy",
        },
      });
    }
    // Parse socialLinks from JSON string if needed
    const data = {
      ...profile,
      socialLinks: typeof profile.socialLinks === "string"
        ? JSON.parse(profile.socialLinks as string)
        : profile.socialLinks,
    };
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Get company profile error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch company profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const parsed = companyProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const existing = await prisma.companyProfile.findFirst();
    const data = {
      ...parsed.data,
      socialLinks: JSON.stringify(parsed.data.socialLinks || []),
    };

    let profile;
    if (existing) {
      profile = await prisma.companyProfile.update({
        where: { id: existing.id },
        data,
      });
    } else {
      profile = await prisma.companyProfile.create({ data });
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error("Update company profile error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update company profile" },
      { status: 500 }
    );
  }
}
