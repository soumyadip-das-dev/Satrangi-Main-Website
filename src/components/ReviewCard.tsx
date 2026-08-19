import React, { useState } from "react";
import { Star, CheckCircle2, Camera, Home, Bed, Eye, X, ShieldCheck } from "lucide-react";
import { Review } from "../types";

interface ReviewCardProps {
  key?: string;
  review: Review;
  destinationRooms?: { id: string; name: string; type: string }[];
}

export default function ReviewCard({ review, destinationRooms = [] }: ReviewCardProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Check if review has photos
  const hasPhotos = Array.isArray(review.photos) && review.photos.length > 0;
  // Is verified stay (if review has photos, or explicit flag, or Verified Guest name)
  const isVerified = hasPhotos || Boolean(review.isVerifiedStay) || review.authorName.startsWith("Verified Guest:");

  // Determine author name to display
  const authorDisplay = review.authorName.startsWith("Verified Guest:")
    ? review.authorName.replace("Verified Guest:", "").trim()
    : review.authorName;

  // Fallback room name & type resolution
  let roomName = review.roomName;
  let roomType = review.roomType;

  // Default room fallback if not explicitly recorded in review
  if (!roomName) {
    if (review.destinationId === "lamahatta") {
      roomName = "The Cloud Suite";
      roomType = "Mountain Glass Suite";
    } else if (review.destinationId === "kolkata") {
      roomName = "Courtyard Heritage Suite";
      roomType = "1920s Colonial Suite";
    } else {
      roomName = "Gplot Sunset Beach Suite";
      roomType = "Stilted Mangrove Villa";
    }
  }

  return (
    <div className="group relative bg-white border border-gray-200/80 hover:border-[#B85A32]/60 p-6 sm:p-7 flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl text-left">
      {/* Top Header Row */}
      <div>
        <div className="flex flex-wrap items-start justify-between gap-2 mb-4 border-b border-gray-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-serif font-bold text-[#1C352D] text-base">
                {authorDisplay}
              </h4>
              {/* Verified Stay Badge */}
              {isVerified && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0">
                  <CheckCircle2 size={10} className="text-emerald-600 shrink-0" />
                  {hasPhotos && <Camera size={10} className="text-emerald-600 shrink-0" />}
                  <span>Verified Stay</span>
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
              {review.date}
            </span>
          </div>

          {/* Interactive Stars Rating */}
          <div className="flex items-center gap-0.5 text-[#C5A059] shrink-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < review.rating ? "fill-[#C5A059] text-[#C5A059]" : "text-gray-200"}
              />
            ))}
          </div>
        </div>

        {/* Review Body Text */}
        <p className="text-xs text-gray-700 leading-relaxed font-sans italic mb-4">
          "{review.text}"
        </p>

        {/* Photo Gallery Thumbnails */}
        {hasPhotos && (
          <div className="mb-4 pt-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-2 flex items-center gap-1">
              <Camera size={11} className="text-[#B85A32]" /> Guest Photos:
            </span>
            <div className="flex flex-wrap gap-2">
              {review.photos!.map((photoUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPhoto(photoUrl)}
                  className="relative group/photo w-16 h-16 rounded-xl overflow-hidden border border-gray-200 cursor-pointer shadow-sm hover:border-[#B85A32] transition"
                >
                  <img
                    src={photoUrl}
                    alt={`Guest photo ${idx + 1}`}
                    className="w-full h-full object-cover group-hover/photo:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Eye size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER: ROOM TYPE HOVER HIGHLIGHT SECTION */}
      <div className="mt-4 pt-3 border-t border-gray-100 relative">
        <div className="flex items-center justify-between gap-2">
          {/* Default visible room indicator */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-sans">
            <Bed size={14} className="text-[#B85A32] shrink-0" />
            <span className="font-serif font-semibold text-[#1C352D] group-hover:text-[#B85A32] transition-colors">
              {roomName}
            </span>
          </div>

          {/* Hover trigger badge for Room Type */}
          <div className="relative group/room cursor-pointer shrink-0">
            <span className="inline-flex items-center gap-1 bg-gray-50 group-hover:bg-[#1C352D] text-gray-700 group-hover:text-white px-2.5 py-1 rounded-full text-[10px] font-sans uppercase font-bold tracking-wider border border-gray-200 group-hover:border-[#1C352D] transition-all duration-300 shadow-xs">
              <Home size={10} className="text-[#B85A32] group-hover:text-[#C5A059] transition-colors" />
              <span>{roomType || "Room Type"}</span>
            </span>

            {/* Smooth Floating Hover Tooltip */}
            <div className="absolute right-0 bottom-full mb-2 w-64 bg-[#1C352D] text-white p-3.5 rounded-xl shadow-2xl opacity-0 group-hover/room:opacity-100 pointer-events-none group-hover/room:pointer-events-auto transition-all duration-300 transform translate-y-2 group-hover/room:translate-y-0 z-30 border border-[#C5A059]/40 text-left">
              <div className="flex items-center justify-between text-[#C5A059] text-[9px] uppercase font-bold tracking-widest mb-1.5 border-b border-white/10 pb-1">
                <span className="flex items-center gap-1">
                  <Bed size={11} /> Stay Accommodation
                </span>
                <span className="text-gray-300 font-mono">VERIFIED</span>
              </div>
              <p className="font-serif font-bold text-sm text-white leading-tight mb-1">
                {roomName}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-gray-300 font-sans mt-2">
                <span className="bg-[#B85A32] text-white px-2 py-0.5 rounded font-mono text-[9px] font-bold">
                  {roomType}
                </span>
                <span className="text-gray-300 font-sans italic">Sanctuary Lodging</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle hover reveal banner */}
        <div className="mt-2 text-[10px] text-[#B85A32] font-sans font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
          <ShieldCheck size={11} /> Guest stayed in <strong className="font-serif underline font-bold">{roomName}</strong> ({roomType})
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-2xl w-full bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 bg-black/60 hover:bg-black text-white p-2 rounded-full z-10 transition cursor-pointer"
            >
              <X size={18} />
            </button>
            <img
              src={selectedPhoto}
              alt="Enlarged Guest Photo"
              className="w-full max-h-[80vh] object-contain"
            />
            <div className="p-3.5 bg-gray-900 text-white text-xs font-sans text-center border-t border-gray-800">
              Verified Guest Photo • {review.authorName} ({roomName})
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
