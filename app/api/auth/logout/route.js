import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Make sure the path is correct
import { NextResponse } from 'next/server';

export async function POST(req) {
  const session = await getServerSession(req, authOptions);

  if (session) {
    // Destroy session
    req.session.destroy();

    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
  }

  return NextResponse.json({ message: "No active session" }, { status: 200 });
}
