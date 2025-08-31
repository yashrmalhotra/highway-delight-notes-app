import { createUser } from "@/utills/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await createUser(data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ messgae: error.message }, { status: 400 });
  }
}
