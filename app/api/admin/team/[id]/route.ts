import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { teamMemberSchema } from "@/lib/validations";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = teamMemberSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const member = await prisma.teamMember.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, data: member });
  } catch (error) {
    console.error("Update team member error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update team member" },
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
    await prisma.teamMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete team member error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete team member" },
      { status: 500 }
    );
  }
}
