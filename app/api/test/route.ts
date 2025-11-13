import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { product } from "@/lib/db/schema";
import { randomUUID } from "crypto";
import { addCategory, addProduct } from "@/seed";

export async function POST(req:Request){
    const p=await addCategory()
    // const {name,description,price,currency,productDiscount}=await req.json();
    // const [p]=await db.insert(product).values({
    //     name,
    //     description,
    //     price:String(price),
    //     currency,
    //     productDiscount:String(productDiscount),
    //     id:randomUUID(),
    // }).returning({
    //     name:product.name,
    //     description:product.description,
    //     price:product.price,
    //     currency:product.currency,
    //     productDiscount:product.productDiscount,
    //     id:product.id,
    //     createdAt:product.createdAt,
    //     updatedAt:product.updatedAt,
    // });
    console.log(p)
    return NextResponse.json({
        message:"product added",
        data:p
    });
}   