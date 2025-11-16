"use server";

import { db } from "@/lib/db";
import { review } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { auth } from "@/auth";
import { headers } from "next/headers";

function response(success: boolean, data?: any, error?: string) {
  return { success, data, error };
}

async function requireUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id)
    return { error: "Unauthorized. Please log in.", userId: null };

  return { error: null, userId: session.user.id };
}

export async function createReview(
  productId: string,
  comment: string,
  rating: string
) {
  try {
    const { error, userId } = await requireUser();
    if (error) return response(false, null, error);

    const numericRating = Number(rating);

    if (!productId) return response(false, null, "Product ID required.");
    if (!comment || comment.trim().length < 3)
      return response(false, null, "Review comment is too short.");
    if (!numericRating || numericRating < 1 || numericRating > 5)
      return response(false, null, "Invalid rating (1-5).");

    const existing = await db
      .select()
      .from(review)
      .where(and(eq(review.userId, userId!), eq(review.productId, productId)));

    if (existing.length > 0)
      return response(false, null, "You already reviewed this product.");

    const r = await db
      .insert(review)
      .values({
        id: nanoid(),
        userId: userId!,
        productId,
        comment,
        rating: String(numericRating),
      })
      .returning();

    return response(true, r[0]);
  } catch (e: any) {
    return response(false, null, e.message);
  }
}

export async function getReviewsByProduct(productId: string) {
  try {
    if (!productId) return response(false, null, "Product ID required.");

    const r = await db
      .select()
      .from(review)
      .where(eq(review.productId, productId));

    return response(true, r);
  } catch (e: any) {
    return response(false, null, e.message);
  }
}

export async function getReviewsByUser() {
  try {
    const { error, userId } = await requireUser();
    if (error) return response(false, null, error);

    const r = await db.select().from(review).where(eq(review.userId, userId!));

    return response(true, r);
  } catch (e: any) {
    return response(false, null, e.message);
  }
}

export async function updateReview(
  reviewId: string,
  comment: string,
  rating: string
) {
  try {
    const { error, userId } = await requireUser();
    if (error) return response(false, null, error);

    const numericRating = Number(rating);

    if (!reviewId) return response(false, null, "Review ID required.");
    if (!comment || comment.trim().length < 3)
      return response(false, null, "Review comment too short.");
    if (!numericRating || numericRating < 1 || numericRating > 5)
      return response(false, null, "Invalid rating.");

    const existing = await db
      .select()
      .from(review)
      .where(eq(review.id, reviewId));

    if (!existing.length) return response(false, null, "Review not found.");
    if (existing[0].userId !== userId)
      return response(false, null, "Not allowed to update this review.");

    const updated = await db
      .update(review)
      .set({ comment, rating: String(numericRating) })
      .where(eq(review.id, reviewId))
      .returning();

    return response(true, updated[0]);
  } catch (e: any) {
    return response(false, null, e.message);
  }
}

export async function deleteReview(reviewId: string) {
  try {
    const { error, userId } = await requireUser();
    if (error) return response(false, null, error);

    if (!reviewId) return response(false, null, "Review ID required.");

    const existing = await db
      .select()
      .from(review)
      .where(eq(review.id, reviewId));

    if (!existing.length) return response(false, null, "Review not found.");
    if (existing[0].userId !== userId)
      return response(false, null, "Not allowed to delete this review.");

    const deleted = await db
      .delete(review)
      .where(eq(review.id, reviewId))
      .returning();

    return response(true, deleted[0]);
  } catch (e: any) {
    return response(false, null, e.message);
  }
}
