// app/api/imagekit/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";

// Initialize ImageKit client
const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGE_KIT_BASE_URL!,
});

// Validate environment variables
function validateEnvVars() {
  const required = [
    "IMAGE_KIT_PUBLIC_KEY",
    "IMAGE_KIT_PRIVATE_KEY",
    "IMAGE_KIT_BASE_URL",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

// File validation
function validateFile(file: File) {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(
      `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(", ")}`
    );
  }

  if (file.size > MAX_SIZE) {
    throw new Error(
      `File size exceeds 5MB limit. Current size: ${(
        file.size /
        1024 /
        1024
      ).toFixed(2)}MB`
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    validateEnvVars();

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file
    validateFile(file);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split(".").pop() || "jpg";
    const fileName = `product_${timestamp}_${randomStr}.${fileExtension}`;

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: fileName,
      folder: "/products", // Organize in folders
      tags: ["product", "admin-upload"],
      useUniqueFileName: true,
    });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        url: uploadResponse.url,
        fileId: uploadResponse.fileId,
        fileName: uploadResponse.name,
        size: uploadResponse.size,
        fileType: uploadResponse.fileType,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("ImageKit upload error:", error);

    // Handle specific error types
    if (error.message?.includes("environment variables")) {
      return NextResponse.json(
        { error: "Server configuration error. Please contact support." },
        { status: 500 }
      );
    }

    if (error.message?.includes("Invalid file type")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error.message?.includes("File size exceeds")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        error: error.message || "Failed to upload image",
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    validateEnvVars();

    const authenticationParameters = imagekit.getAuthenticationParameters();

    return NextResponse.json({
      ...authenticationParameters,
      publicKey: process.env.IMAGE_KIT_PUBLIC_KEY!,
      urlEndpoint: process.env.IMAGE_KIT_BASE_URL!,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to get authentication parameters" },
      { status: 500 }
    );
  }
}
