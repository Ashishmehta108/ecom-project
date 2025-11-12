import { createAdmin } from "@/seed";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    await createAdmin()
return NextResponse.json({
    message:"ok done"
},{
    status:201
})
}


export async function GET(req:Request){
    
}