import { createNote, deleteNote } from "@/utills/notes";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();
  console.log(data);
  try {
    await createNote(data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const data = await req.json();
  try {
    await deleteNote(data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
