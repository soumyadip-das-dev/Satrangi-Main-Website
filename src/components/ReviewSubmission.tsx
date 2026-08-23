import React, { useState, useRef } from "react";
import { Star, CheckCircle, ShieldCheck, Loader2, Send, Camera, Key, X, Upload } from "lucide-react";
import { Review } from "../types";

interface ReviewSubmissionProps {
  destinationId?: string;
  onReviewSubmitted?: (newReview: Review) => void;
}

export default function ReviewSubmission({
  destinationId,
  onReviewSubmitted,
}: ReviewSubmissionProps) {
  const [selectedDestId, setSelectedDestId] = useState<string>(destinationId || "kolkata");
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");
  const [bookingId, setBookingId] = useState<string>("");
  const [selectedRoomName, setSelectedRoomName] = useState<string>("");

  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const roomPresets: Record<string, { name: string; type: string }[]> = {
    lamahatta: [
      { name: "Room 1", type: "Mountain Glass Suite" },
      { name: "Room 2", type: "Timber High-Vaulted Cabin" },
      { name: "Room 3", type: "Cedar Penthouse Suite" },
    ],
    kolkata: [
      { name: "Room 1", type: "1920s Colonial Suite" },
      { name: "Room 2", type: "Classic Marble Residence" },
      { name: "Room 3", type: "Terrace Garden Suite" },
    ],
    sundarban: [
      { name: "Room 1", type: "Stilted Mangrove Villa" },
      { name: "Room 2", type: "Waterfront Stilted Cabin" },
    ],
  };

  const currentDest = destinationId || selectedDestId;
  const availableRooms = roomPresets[currentDest] || roomPresets["kolkata"];

  // File Upload Handler (reads files as base64 data URLs)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVerifyBooking = async () => {
    if (!bookingId.trim()) return;
    setIsVerifying(true);
    setVerificationError(null);

    try {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error();
      const bookings = await res.json();
      const matched = bookings.find(
        (b: any) => b.id.toLowerCase() === bookingId.trim().toLowerCase()
      );

      if (matched) {
        setIsVerified(true);
        if (matched.guestName && !authorName) setAuthorName(matched.guestName);
        if (matched.roomId) {
          const r = availableRooms.find((rm) => rm.name.toLowerCase().includes(matched.roomId.toLowerCase()));
          if (r) setSelectedRoomName(r.name);
        }
      } else {
        setVerificationError("Reference code not found in bookings database.");
        setIsVerified(false);
      }
    } catch {
      setVerificationError("Verification connection unavailable.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!authorName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!commentText.trim()) {
      setError("Please share a few words about your stay.");
      return;
    }

    const matchedRoom = availableRooms.find((r) => r.name === selectedRoomName) || availableRooms[0];

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName,
          rating,
          text: commentText,
          destinationId: currentDest,
          roomName: matchedRoom.name,
          roomType: matchedRoom.type,
          photos: photos.length > 0 ? photos : undefined,
          isVerifiedStay: isVerified || photos.length > 0,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit review.");
      const newReview = await response.json();
      if (onReviewSubmitted) onReviewSubmitted(newReview);
      setSuccess(true);
      setAuthorName("");
      setCommentText("");
      setBookingId("");
      setPhotos([]);
      setIsVerified(false);
    } catch (err: any) {
      setError(err?.message || "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200/80 p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl text-left max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-6">
        <span className="text-[10px] text-[#B85A32] font-sans font-bold uppercase tracking-widest block mb-1">
          Guest Feedback
        </span>
        <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[#1C352D]">
          Share Your Experience
        </h3>
      </div>

      {success ? (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-3">
          <CheckCircle className="text-emerald-600 mx-auto" size={32} />
          <h4 className="font-serif font-bold text-lg text-emerald-900">Thank You!</h4>
          <p className="text-xs text-emerald-700 leading-relaxed font-sans">
            Your review has been published with your uploaded stay photos.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-2 bg-[#1C352D] hover:bg-[#B85A32] text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full transition cursor-pointer"
          >
            Write Another Review
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
          {/* Star Rating Bar */}
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-1.5">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none transition transform hover:scale-110 cursor-pointer"
                >
                  <Star
                    size={26}
                    className={`${
                      star <= (hoverRating || rating)
                        ? "fill-[#C5A059] text-[#C5A059]"
                        : "text-gray-300 fill-transparent"
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-[11px] font-bold text-[#1C352D]">
              {hoverRating || rating} out of 5 stars
            </span>
          </div>

          {/* Destination Selector (If opened from general About Page) */}
          {!destinationId && (
            <div className="mb-3">
              <label className="block text-[10px] uppercase font-bold text-gray-600 tracking-wider mb-1">
                Select Sanctuary *
              </label>
              <select
                value={selectedDestId}
                onChange={(e) => setSelectedDestId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#1C352D] font-semibold"
              >
                <option value="kolkata">Satrangi Kolkata • Heritage Townhouse</option>
                <option value="sundarban">Satrangi Sundarban • Estuary Lodge</option>
                <option value="lamahatta">Satrangi Lamahatta • Alpine Sanctuary</option>
              </select>
            </div>
          )}

          {/* Name & Suite 2-Column Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-600 tracking-wider mb-1">
                Your Name *
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Romit Bose"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#1C352D]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-600 tracking-wider mb-1">
                Suite Stayed In
              </label>
              <select
                value={selectedRoomName}
                onChange={(e) => setSelectedRoomName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#1C352D]"
              >
                <option value="">Select suite type...</option>
                {availableRooms.map((rm) => (
                  <option key={rm.name} value={rm.name}>
                    {rm.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Verified Booking Reference Code */}
          <div className="bg-gray-50/70 p-3 rounded-2xl border border-gray-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                <Key size={12} className="text-[#B85A32]" /> Booking ID (Optional for Verified Badge)
              </span>
              {isVerified && (
                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck size={11} /> Verified
                </span>
              )}
            </div>

            {!isVerified ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  placeholder="e.g. SR-3291-B01"
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleVerifyBooking}
                  disabled={isVerifying}
                  className="bg-[#1C352D] hover:bg-[#B85A32] text-white px-3 py-1.5 rounded-xl text-[10px] uppercase font-bold tracking-wider cursor-pointer"
                >
                  {isVerifying ? <Loader2 size={12} className="animate-spin" /> : "Verify"}
                </button>
              </div>
            ) : (
              <div className="text-[10px] text-emerald-800 font-medium flex items-center justify-between">
                <span>Verified stay reference <strong>{bookingId.toUpperCase()}</strong> connected.</span>
                <button
                  type="button"
                  onClick={() => setIsVerified(false)}
                  className="text-gray-400 hover:text-rose-600 underline text-[9px]"
                >
                  Reset
                </button>
              </div>
            )}
            {verificationError && (
              <p className="text-[10px] text-rose-600 font-medium">{verificationError}</p>
            )}
          </div>

          {/* Experience Review Comments */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-600 tracking-wider mb-1">
              Your Review *
            </label>
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Describe your room comfort, hospitality, meals, or local excursions..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#1C352D] resize-none leading-relaxed"
            />
          </div>

          {/* Direct File Upload Area */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-600 tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera size={13} className="text-[#B85A32]" /> Upload Stay Pictures (Optional)
              </span>
              {photos.length > 0 && (
                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  {photos.length} Photo{photos.length > 1 ? "s" : ""} Attached
                </span>
              )}
            </label>

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              multiple
              className="hidden"
            />

            {/* Upload Click Target Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 hover:border-[#B85A32] bg-gray-50/60 hover:bg-white rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 group flex flex-col items-center justify-center gap-1.5"
            >
              <div className="w-9 h-9 rounded-full bg-[#1C352D]/5 text-[#1C352D] group-hover:bg-[#B85A32]/10 group-hover:text-[#B85A32] flex items-center justify-center transition-colors">
                <Upload size={18} />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-[#B85A32] transition-colors">
                  Click to Upload Photos
                </span>
                <span className="text-[10px] text-gray-400 block font-normal mt-0.5">
                  Supports PNG, JPG, WEBP from device
                </span>
              </div>
            </div>

            {/* Thumbnails of uploaded images */}
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-3">
                {photos.map((imgSrc, idx) => (
                  <div key={idx} className="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-200 group shadow-xs">
                    <img src={imgSrc} alt={`Uploaded ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 bg-black/70 hover:bg-rose-600 text-white p-1 rounded-full transition cursor-pointer"
                      aria-label="Remove image"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 font-medium">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1C352D] hover:bg-[#B85A32] disabled:bg-gray-300 text-white py-3.5 rounded-full font-bold uppercase tracking-widest text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <Send size={14} /> Submit Guest Review
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
