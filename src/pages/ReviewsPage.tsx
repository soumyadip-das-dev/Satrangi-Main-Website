import React from "react";
import { Review } from "../types";
import ReviewCard from "../components/ReviewCard";
import ReviewSubmission from "../components/ReviewSubmission";

interface ReviewsPageProps {
  reviews: Review[];
  reviewsSortBy: string;
  setReviewsSortBy: (s: string) => void;
  onReviewSubmitted: (newReview: Review) => void;
}

export default function ReviewsPage({
  reviews,
  reviewsSortBy,
  setReviewsSortBy,
  onReviewSubmitted,
}: ReviewsPageProps) {
  const getSortedReviews = () => {
    if (reviewsSortBy === "highest") {
      return [...reviews].sort((a, b) => b.rating - a.rating);
    }
    if (reviewsSortBy === "lowest") {
      return [...reviews].sort((a, b) => a.rating - b.rating);
    }
    return [...reviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const sorted = getSortedReviews();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 animate-fade-in text-left">
      <div className="text-center mb-10 sm:mb-14">
        <span className="text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#B85A32] font-bold block mb-2 sm:mb-3">
          VERIFIED TRAVELER DIARIES
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold italic text-[#1C352D]">
          Guest Reviews & Experiences
        </h1>
        <div className="w-16 h-0.5 bg-[#B85A32] mx-auto mt-4" />
      </div>

      <div className="flex justify-end mb-6 sm:mb-8 items-center gap-2">
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Sort stories:</span>
        <select
          value={reviewsSortBy}
          onChange={(e) => setReviewsSortBy(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl text-xs text-gray-700 px-3 py-1.5 focus:border-[#B85A32] outline-none font-sans font-medium"
        >
          <option value="latest">Latest First</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-16">
        {sorted.map((rev) => (
          <ReviewCard key={rev.id} review={rev} />
        ))}
      </div>

      <div className="border-t border-gray-200 pt-10 sm:pt-12">
        <ReviewSubmission destinationId="kolkata" onReviewSubmitted={onReviewSubmitted} />
      </div>
    </div>
  );
}
