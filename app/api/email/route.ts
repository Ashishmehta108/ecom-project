import { sendEmail } from "@/lib/sendemail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const res=await sendEmail({
    to: "autoplot108@gmail.com",
    subject: "test",
    html: "<div>test</div>",
  });
  return NextResponse.json(res);
}
