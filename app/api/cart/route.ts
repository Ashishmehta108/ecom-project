// import { userId } from "@/server";
import { getUserSession } from "@/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getUserSession();
  console.log(JSON.stringify(session));
  return NextResponse.json(
    {
      message: "ok",
      data: session?.user,
    },
    {
      status: 200,
    }
  );
}

export async function POST(req: Request) {
  const session = await getUserSession();
  const userId=session?.user.id
  if(!userId)
  return NextResponse.json(
    {
      message: "cart created",
    },
    {
      status: 201,
    }
  );
}
