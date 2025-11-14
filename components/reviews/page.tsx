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

function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <form className="space-y-5">
      {/* Username */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium dark:text-gray-200">
          Your Name
        </label>
        <Input placeholder="Enter your name" className="dark:bg-neutral-800" />
      </div>

      {/* Star Rating Selector */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium dark:text-gray-200">
          Your Rating
        </label>

        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => {
            const starValue = i + 1;
            return (
              <Star
                key={i}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(starValue)}
                className={`w-7 h-7 cursor-pointer transition-all ${
                  (hoverRating || rating) >= starValue
                    ? "fill-black text-black dark:fill-white dark:text-white"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Review Text */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium dark:text-gray-200">
          Your Review
        </label>
        <Textarea
          placeholder="Share your experience..."
          className="min-h-[110px] resize-none dark:bg-neutral-800"
        />
      </div>

      <Button className="w-full text-sm py-5">Submit Review</Button>
    </form>
  );
}

export default function ReviewPage() {
  const [reviews] = useState([
    {
      id: 1,
      name: "Amit Sharma",
      rating: 5,
      comment: "Amazing product! Great quality and fast delivery.",
      date: "2025-11-01",
    },
    {
      id: 2,
      name: "Riya Verma",
      rating: 4,
      comment: "Good product but packaging could be better.",
      date: "2025-10-28",
    },
  ]);

  const averageRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-10">
      {/* ==================== Rating Summary ==================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
        {/* Left Side Summary */}
        <div className="text-center md:text-left">
          <p className="text-5xl font-bold">{averageRating.toFixed(1)}</p>

          {/* Star Row */}
          <div className="flex justify-center md:justify-start mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 ${
                  i < Math.round(averageRating)
                    ? "fill-black text-black dark:fill-white dark:text-white"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Based on {reviews.length} reviews
          </p>
        </div>

        {/* Rating Bars */}
        <div className="flex-1 space-y-2">
          {ratingCounts.map((item) => (
            <div
              key={item.star}
              className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"
            >
              <span className="w-10">{item.star}★</span>

              <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gray-800 dark:bg-gray-300 h-full rounded-full transition-all"
                  style={{
                    width: `${(item.count / reviews.length) * 100 || 1}%`,
                  }}
                />
              </div>

              <span className="w-6 text-right">{item.count}</span>
            </div>
          ))}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-gray-300 dark:border-gray-700 dark:text-gray-200"
            >
              Write a Review
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md dark:bg-neutral-900 dark:border-neutral-700">
            <DialogHeader>
              <DialogTitle className="dark:text-white">
                Write a Review
              </DialogTitle>
            </DialogHeader>

            <ReviewForm />
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="
              border border-gray-200 dark:border-gray-800 
              rounded-xl p-5 shadow-sm 
              bg-white dark:bg-neutral-900 
              transition-all
            "
          >
            <div className="flex justify-between items-center">
              <p className="font-medium dark:text-white">{review.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {review.date}
              </p>
            </div>

            {/* Stars */}
            <div className="mt-2 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating
                      ? "fill-black text-black dark:fill-white dark:text-white"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>

            <p className="text-gray-700 dark:text-gray-300 mt-3 leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
