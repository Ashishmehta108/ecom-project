import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    
    return NextResponse.json({
        message:"working",
    
    },{
        status:201
    })
}
