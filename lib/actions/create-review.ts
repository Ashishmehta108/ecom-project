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

/* --------------------------------------------------------
   CREATE REVIEW
-------------------------------------------------------- */
export async function createReview({
  productId,
  comment,
  rating,

  userId: clientUserId,
}: {
  productId: string;
  comment: string;
  rating: string;

  userId?: string;
}) {
  try {
    const session = await requireUser();
    const userId = clientUserId || session.userId;
    if (session.error) return response(false, null, session.error);

    if (!productId) return response(false, null, "Product ID required.");
    if (!comment || comment.trim().length < 3)
      return response(false, null, "Review comment is too short.");
    if (!rating || Number(rating) < 1 || Number(rating) > 5)
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
        rating,
      })
      .returning();

    return response(true, r[0]);
  } catch (e: any) {
    return response(false, null, e.message);
  }
}

/* --------------------------------------------------------
   GET REVIEWS FOR PRODUCT
-------------------------------------------------------- */
export async function getReviews(productId: string) {
  try {
    if (!productId) return response(false, null, "Product ID required.");
    const r1 = await db.query.review.findMany({
      where: eq(review.productId, productId),
      with: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    console.log(r1);

    /*[
  {
    id: 'pA-dFyOssVjyUuVfDqAiM',     
    rating: '4',
    comment: 'hsh',
    userId: '2Az5TmLr6LcLa0vsaTjPa8OiEZH6gasl',
    productId: 'xDZtjg573a59E31Ow2ed8',
    user: {
      id: '2Az5TmLr6LcLa0vsaTjPa8OiEZH6gasl',
      name: 'devaccount',
      email: 'autoplot108@gmail.com',
      emailVerified: true,
      image: null,
      createdAt: 2025-11-16T08:48:27.338Z,
      updatedAt: 2025-11-23T11:57:28.521Z,
      role: 'user',
      banned: false,
      banReason: null,
      banExpires: null
    }
  }
] */
    // const r = await db
    //   .select()
    //   .from(review)
    //   .where(eq(review.productId, productId));

    return response(true, r1);
  } catch (e: any) {
    return response(false, null, e.message);
  }
}

/* --------------------------------------------------------
   GET REVIEWS BY USER
-------------------------------------------------------- */
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

export async function updateReview({
  reviewId,
  comment,
  rating,
}: {
  reviewId: string;
  comment: string;
  rating: string;
}) {
  try {
    const { error, userId } = await requireUser();
    if (error) return response(false, null, error);

    if (!reviewId) return response(false, null, "Review ID required.");
    if (!comment || comment.trim().length < 3)
      return response(false, null, "Review comment too short.");
    if (!rating || Number(rating) < 1 || Number(rating) > 5)
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
      .set({
        comment,
        rating,
      })
      .where(eq(review.id, reviewId))
      .returning();

    return response(true, updated[0]);
  } catch (e: any) {
    return response(false, null, e.message);
  }
}

/* --------------------------------------------------------
   DELETE REVIEW
-------------------------------------------------------- */
export async function deleteReview({ reviewId }: { reviewId: string }) {
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
