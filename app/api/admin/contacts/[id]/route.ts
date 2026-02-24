import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const submission = await prisma.contactSubmission.update({
      where: { id },
      data: { isReviewed: true },
    });
    return NextResponse.json({ success: true, data: submission });
  } catch (error) {
    console.error("Update contact error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update contact submission" },
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
    await prisma.contactSubmission.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete contact error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete contact submission" },
      { status: 500 }
    );
  }
}
