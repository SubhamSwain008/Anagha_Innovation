import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        architecture: true,
        features: { orderBy: { order: "asc" } },
        specifications: { orderBy: { order: "asc" } },
        media: { orderBy: { order: "asc" } },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { architecture, ...rest } = parsed.data as any;

    const product = await prisma.product.update({
      where: { id },
      data: rest,
      include: {
        category: true,
        architecture: true,
        features: { orderBy: { order: "asc" } },
        specifications: { orderBy: { order: "asc" } },
        media: { orderBy: { order: "asc" } },
      },
    });

    // Upsert architecture if provided
    if (architecture) {
      const existingArch = await prisma.productArchitecture.findUnique({ where: { productId: id } });
      if (existingArch) {
        await prisma.productArchitecture.update({ where: { id: existingArch.id }, data: { imageUrl: architecture.imageUrl || "", description: architecture.description || null } });
      } else if (architecture.imageUrl || architecture.description) {
        await prisma.productArchitecture.create({ data: { productId: id, imageUrl: architecture.imageUrl || "", description: architecture.description || undefined } });
      }
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
