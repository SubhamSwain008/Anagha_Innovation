import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const reviewed = searchParams.get("reviewed");

    const where: Record<string, unknown> = {};
    if (reviewed === "true") where.isReviewed = true;
    if (reviewed === "false") where.isReviewed = false;

    const [items, total] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.contactSubmission.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (error) {
    console.error("Get contacts error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contact submissions" },
      { status: 500 }
    );
  }
}
