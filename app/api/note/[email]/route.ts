import { NextResponse } from "next/server";
import { getNotes } from "@/utills/notes";
export async function GET(req: Request, { params }: { params: Promise<{ email: string }> }) {
  const { email } = await params;
  try {
    const notes = await getNotes(email);
    return NextResponse.json({ notes });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
