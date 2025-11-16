"use client";

import { useState } from "react";
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
} from "@/lib/actions/create-review";

function ReviewForm({
  productId,
  onAddReview,
}: {
  productId: string;
  onAddReview: any;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const { data } = authClient.useSession();
  const userId = data?.user?.id;

  async function handleSubmit() {
    if (!userId)
      return toast.error("You must be logged in to submit a review.");
    if (rating === 0) return toast.error("Please select a rating.");
    if (!comment.trim()) return toast.error("Please write a review.");

    setLoading(true);

    const res = await createReview(productId, comment.trim(), String(rating));

    setLoading(false);

    if (!res.success) return toast.error(res.error || "Unable to post review");

    toast.success("Review submitted!");

    onAddReview({
      ...res.data,
      name,
      date: new Date().toISOString().split("T")[0],
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Your Name
        </label>
        <Input
          placeholder="Enter your name"
          className="h-11 border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Rating
        </label>
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
                    : "text-gray-300 dark:text-gray-600 hover:text-gray-400"
                }`}
              />
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Your Review
        </label>
        <Textarea
          placeholder="Share your experience..."
          className="min-h-[120px] border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100 resize-none"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <Button
        disabled={loading}
        onClick={handleSubmit}
        className="w-full h-11 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900 font-medium"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </div>
  );
}

function EditReviewForm({ review, onUpdate, onClose }: any) {
  const [rating, setRating] = useState(review.rating);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(review.comment);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);

    const res = await updateReview(review.id, comment, rating);

    setLoading(false);

    if (!res.success) return toast.error(res.error);

    toast.success("Review updated!");

    onUpdate(res.data);
    onClose();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Rating
        </label>
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
                    : "text-gray-300 dark:text-gray-600 hover:text-gray-400"
                }`}
              />
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Your Review
        </label>
        <Textarea
          className="min-h-[120px] border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100 resize-none"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <Button
        disabled={loading}
        onClick={handleSubmit}
        className="w-full h-11 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900 font-medium"
      >
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}

export default function ReviewPage({ productId }: { productId: string }) {
  const { data } = authClient.useSession();
  const userId = data?.user?.id;

  const [reviews, setReviews] = useState<any[]>([]);
  const [editingReview, setEditingReview] = useState<any>(null);

  const onAddReview = (rev: any) => setReviews((prev) => [rev, ...prev]);
  const onEdit = (review: any) => setEditingReview(review);

  const onDelete = async (id: string) => {
    const res = await deleteReview(id);
    if (!res.success) return toast.error(res.error);

    toast.success("Review deleted");
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-10 pb-8 border-b border-gray-100 dark:border-gray-800">
        {/* Average Rating */}
        <div className="flex flex-col items-center lg:items-start min-w-[140px]">
          <div className="text-5xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
            {averageRating}
          </div>
          <div className="flex gap-0.5 mt-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(Number(averageRating))
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-200 dark:text-gray-700"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2.5">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </p>
        </div>

        {/* Rating Breakdown */}
        <div className="flex-1 space-y-2.5 max-w-md w-full">
          {ratingCounts.map((item) => {
            const percentage =
              reviews.length === 0 ? 0 : (item.count / reviews.length) * 100;

            return (
              <div key={item.star} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-8">
                  {item.star}
                </span>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 dark:bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 w-8 text-right">
                  {item.count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Write Review Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="h-10 px-6 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium whitespace-nowrap"
            >
              Write a Review
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg border-gray-200 dark:border-gray-700 dark:bg-gray-900 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Write a Review
              </DialogTitle>
            </DialogHeader>

            <ReviewForm productId={productId} onAddReview={onAddReview} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <Star className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No reviews yet. Be the first to share your experience!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="group border border-gray-100 dark:border-gray-800 rounded-2xl p-6 bg-white dark:bg-gray-900/50 hover:shadow-sm transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {review.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {review.date}
                  </p>
                </div>

                {review.userId === userId && (
                  <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(review)}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(review.id)}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
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
                      i < review.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-200 dark:text-gray-700"
                    }`}
                  />
                ))}
              </div>

              <p className="text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
                {review.comment}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Edit Review Dialog */}
      <Dialog
        open={!!editingReview}
        onOpenChange={() => setEditingReview(null)}
      >
        <DialogContent className="max-w-lg border-gray-200 dark:border-gray-700 dark:bg-gray-900 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Edit Review
            </DialogTitle>
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
