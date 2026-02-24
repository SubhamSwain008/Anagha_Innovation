import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteImage } from "@/lib/cloudinary";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const media = await prisma.productMedia.create({
      data: {
        productId: id,
        imageUrl: body.imageUrl,
        publicId: body.publicId || null,
        altText: body.altText || null,
        order: body.order || 0,
      },
    });

    return NextResponse.json({ success: true, data: media }, { status: 201 });
  } catch (error) {
    console.error("Create media error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add media" },
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
    const mediaId = searchParams.get("mediaId");

    if (!mediaId) {
      return NextResponse.json(
        { success: false, error: "Media ID is required" },
        { status: 400 }
      );
    }

    const media = await prisma.productMedia.findUnique({
      where: { id: mediaId },
    });

    if (media?.publicId) {
      try {
        await deleteImage(media.publicId);
      } catch (e) {
        console.error("Failed to delete from Cloudinary:", e);
      }
    }

    await prisma.productMedia.delete({ where: { id: mediaId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete media error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete media" },
      { status: 500 }
    );
  }
}
