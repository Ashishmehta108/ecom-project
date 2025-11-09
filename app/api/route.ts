import { db } from "@/lib/db";
import { usersTable } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    const [newuser]=await db.insert(usersTable).values({
        age:21,
        email:"ashish1@gmail.com",
        name:"ashish1"
    }).returning({
        name:usersTable.name
    })
    if(!newuser){
        return NextResponse.json({
            message:"user not created"
        })
    }
    return NextResponse.json({
        message:"working",
        data:newuser
    },{
        status:201
    })
}