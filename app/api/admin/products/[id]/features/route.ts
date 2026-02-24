import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { featureSchema } from "@/lib/validations";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = featureSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const feature = await prisma.productFeature.create({
      data: { ...parsed.data, productId: id },
    });

    return NextResponse.json({ success: true, data: feature }, { status: 201 });
  } catch (error) {
    console.error("Create feature error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create feature" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params;
    const { searchParams } = new URL(request.url);
    const featureId = searchParams.get("featureId");

    if (!featureId) {
      return NextResponse.json(
        { success: false, error: "Feature ID is required" },
        { status: 400 }
      );
    }

    await prisma.productFeature.delete({ where: { id: featureId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete feature error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete feature" },
      { status: 500 }
    );
  }
}
