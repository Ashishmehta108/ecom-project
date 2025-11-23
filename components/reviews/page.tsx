"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

import {
  createReview,
  updateReview,
  deleteReview,
  getReviews,
} from "@/lib/actions/create-review";

/* --------------------------------------------------------
   CREATE FORM
-------------------------------------------------------- */
function ReviewForm({
  productId,
  onAddReview,
}: {
  productId: string;
  onAddReview: (r: any) => void;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const { data } = authClient.useSession();
  const userId = data?.user?.id;

  async function handleSubmit() {
    if (!userId) return toast.error("Please login to submit a review.");
    if (!rating) return toast.error("Please select a rating.");
    if (!comment.trim()) return toast.error("Please write something.");

    setLoading(true);

    const res = await createReview({
      productId,
      comment: comment.trim(),
      rating: String(rating),
      userId,
    });

    setLoading(false);

    if (!res.success) return toast.error(res.error);

    toast.success("Review submitted!");

    onAddReview({
      ...res.data,
      name,
      date: new Date().toISOString().split("T")[0],
    });
  }

  return (
    <div className="space-y-6">
      {/* NAME */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Your Name</label>
        <Input
          placeholder="Enter your name"
          className="h-11"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* RATING */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Rating</label>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => {
            const star = i + 1;
            return (
              <Star
                key={i}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className={`w-6 h-6 cursor-pointer transition-all ${
                  (hoverRating || rating) >= star
                    ? "fill-amber-400 text-amber-400 scale-105"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* COMMENT */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Your Review</label>
        <Textarea
          placeholder="Share your experience..."
          className="min-h-[120px]"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <Button disabled={loading} onClick={handleSubmit} className="w-full h-11">
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </div>
  );
}

/* --------------------------------------------------------
   EDIT FORM
-------------------------------------------------------- */
function EditReviewForm({
  review,
  onUpdate,
  onClose,
}: {
  review: any;
  onUpdate: (r: any) => void;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(Number(review.rating));
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(review.comment);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);

    const res = await updateReview({
      reviewId: review.id,
      comment,
      rating: String(rating),
    });

    setLoading(false);

    if (!res.success) return toast.error(res.error);

    toast.success("Review updated");
    onUpdate(res.data);
    onClose();
  }

  return (
    <div className="space-y-6">
      {/* RATING */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Rating</label>
        <div className="flex gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => {
            const star = i + 1;
            return (
              <Star
                key={i}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className={`w-6 h-6 cursor-pointer transition-all ${
                  (hoverRating || rating) >= star
                    ? "fill-amber-400 text-amber-400 scale-105"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* COMMENT */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Your Review</label>
        <Textarea
          className="min-h-[120px]"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <Button disabled={loading} onClick={handleSubmit} className="w-full h-11">
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}

/* --------------------------------------------------------
   MAIN PAGE
-------------------------------------------------------- */
export default function ReviewPage({ productId }: { productId: string }) {
  const { data } = authClient.useSession();
  const userId = data?.user?.id;

  const [reviews, setReviews] = useState<any[]>([]);
  const [editingReview, setEditingReview] = useState<any>(null);

  /* LOAD REVIEWS */
  useEffect(() => {
    async function load() {
      const res = await getReviews(productId);
      if (res.success) setReviews(res.data);
    }
    load();
  }, [productId]);

  /* ADD REVIEW */
  const onAddReview = (rev: any) => setReviews((prev) => [rev, ...prev]);

  /* DELETE */
  const onDelete = async (id: string) => {
    const res = await deleteReview({ reviewId: id });
    if (!res.success) return toast.error(res.error);
    toast.success("Review deleted");
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  /* UPDATE */
  const onEdit = (review: any) => setEditingReview(review);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + Number(r.rating), 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Number(r.rating) === star).length,
  }));

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-12">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-10 pb-8 border-b">
        <div className="flex flex-col items-center lg:items-start">
          <div className="text-5xl font-semibold">{averageRating}</div>
          <div className="flex gap-0.5 mt-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(Number(averageRating))
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-sm mt-2.5">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </p>
        </div>

        {/* BREAKDOWN */}
        <div className="flex-1 space-y-2.5 max-w-md w-full">
          {ratingCounts.map((item) => {
            const percentage =
              reviews.length === 0 ? 0 : (item.count / reviews.length) * 100;

            return (
              <div key={item.star} className="flex items-center gap-3">
                <span className="text-sm w-8">{item.star}</span>
                <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm w-8 text-right">{item.count}</span>
              </div>
            );
          })}
        </div>

        {/* WRITE BUTTON */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Write a Review</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
            </DialogHeader>
            <ReviewForm productId={productId} onAddReview={onAddReview} />
          </DialogContent>
        </Dialog>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-16">
            <Star className="w-6 h-6 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No reviews yet.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="border rounded-2xl p-6 bg-white dark:bg-gray-900/50"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium">
                    {review.user.name || "Anonymous"}
                  </p>
                </div>

                {review.userId === userId && (
                  <div className="flex gap-4">
                    <button onClick={() => onEdit(review)} className="text-sm">
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(review.id)}
                      className="text-sm text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Number(review.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>

              <p className="text-[15px]">{review.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* EDIT DIALOG */}
      <Dialog
        open={!!editingReview}
        onOpenChange={() => setEditingReview(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>

          {editingReview && (
            <EditReviewForm
              review={editingReview}
              onUpdate={(updated: any) =>
                setReviews((prev) =>
                  prev.map((r) => (r.id === updated.id ? updated : r))
                )
              }
              onClose={() => setEditingReview(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
