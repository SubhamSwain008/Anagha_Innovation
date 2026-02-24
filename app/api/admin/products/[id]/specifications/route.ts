import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { specificationSchema } from "@/lib/validations";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = specificationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const spec = await prisma.productSpecification.create({
      data: { ...parsed.data, productId: id },
    });

    return NextResponse.json({ success: true, data: spec }, { status: 201 });
  } catch (error) {
    console.error("Create specification error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create specification" },
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
    const specId = searchParams.get("specId");

    if (!specId) {
      return NextResponse.json(
        { success: false, error: "Specification ID is required" },
        { status: 400 }
      );
    }

    await prisma.productSpecification.delete({ where: { id: specId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete specification error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete specification" },
      { status: 500 }
    );
  }
}
