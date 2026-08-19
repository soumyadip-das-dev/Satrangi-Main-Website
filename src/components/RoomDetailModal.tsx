import { useState } from "react";
import { X, Check, Calendar, Users, MapPin, ShieldCheck, ChevronLeft, ChevronRight, Wifi, Coffee, Sprout, Wind, Tv, Sparkles } from "lucide-react";
import { Room, Destination } from "../types";
import { Currency, formatPrice } from "../utils/currency";

interface RoomDetailModalProps {
  room: Room | null;
  destination?: Destination;
  currency?: Currency;
  checkIn: string;
  checkOut: string;
  bookings: any[];
  onClose: () => void;
  onBookNow: (destinationId: string, roomId: string, checkIn: string, checkOut: string) => void;
}

const isRoomAvailable = (roomId: string, checkIn: string, checkOut: string, bookings: any[]) => {
  if (!checkIn || !checkOut) return true;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
    return true;
  }
  return !bookings.some((b: any) => {
    if (b.roomId !== roomId || b.status === "cancelled") return false;
    const bStart = new Date(b.checkIn);
    const bEnd = new Date(b.checkOut);
    return start < bEnd && end > bStart;
  });
};

const getAmenityIcon = (amenity: string) => {
  const lower = amenity.toLowerCase();
  if (lower.includes("wifi")) return Wifi;
  if (lower.includes("coffee") || lower.includes("tea") || lower.includes("breakfast")) return Coffee;
  if (lower.includes("view") || lower.includes("garden") || lower.includes("terrace")) return Sprout;
  if (lower.includes("thermostat") || lower.includes("air") || lower.includes("heating")) return Wind;
  if (lower.includes("tv") || lower.includes("audio") || lower.includes("sound")) return Tv;
  return Sparkles;
};

export default function RoomDetailModal({
  room,
  destination,
  currency = "INR",
  checkIn: initialCheckIn,
  checkOut: initialCheckOut,
  bookings,
  onClose,
  onBookNow
}: RoomDetailModalProps) {
  if (!room) return null;

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);

  const images = room.imageUrls && room.imageUrls.length > 0 
    ? room.imageUrls 
    : ["https://lh3.googleusercontent.com/aida-public/AB6AXuDiJErL1NVsuFluLGmpkq_nb7AffVDvOyIm8pfr0dJVAEhu0QujGYI9LSR3xcJYfG0TpSVb3a_dXM9disYdO6UL52Rc9M60FpQnzH6dOlnshJCr7Gm_s2xgqEKYf85Mh_4Syu7ECBgMK6zUq5isZsis-t3SgK8_y5oZ9Y3To12rcIjUs-9dGJB4fZk-Lm_9PQFbs5HyqjBr1r3bvLiIAPG44_gdMRPIbJnEgkgeBtJwW6iDwUsdD3GucBCpzetUEtuA0oCvOfKB18He"];

  const handlePrevImg = () => {
    setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImg = () => {
    setActiveImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const getNightsCount = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return 1;
    }
    const diff = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
  };

  const nights = getNightsCount();
  const totalPrice = room.pricePerNight * nights;
  const isAvailable = isRoomAvailable(room.id, checkIn, checkOut, bookings);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200/80 text-left animate-fade-rise">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-[#B85A32] text-white p-2.5 rounded-full transition-all cursor-pointer shadow-lg"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Interactive Photo Gallery */}
          <div className="lg:col-span-7 bg-gray-900 p-6 flex flex-col justify-between relative min-h-[320px] lg:min-h-[500px]">
            {/* Main Active Image Showcase */}
            <div className="relative w-full h-[280px] sm:h-[360px] rounded-2xl overflow-hidden shadow-xl border border-white/10 group">
              <img
                src={images[activeImgIndex]}
                alt={`${room.name} view ${activeImgIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* Prev / Next Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImg}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition cursor-pointer"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={handleNextImg}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition cursor-pointer"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {/* Suite Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-[#B85A32] text-white text-[10px] font-sans uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow">
                  {room.type}
                </span>
                <span className="bg-white/90 backdrop-blur text-[#1C352D] text-[10px] font-sans uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow">
                  {room.sqft} SQFT
                </span>
              </div>
            </div>

            {/* Thumbnail Selector Row */}
            {images.length > 1 && (
              <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      idx === activeImgIndex ? "border-[#C5A059] ring-2 ring-[#C5A059]/40 scale-105" : "border-white/20 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Suite Details, Specs, Live Dates, CTA */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#FAF8F5]">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#B85A32] uppercase tracking-widest font-bold mb-1">
                <MapPin size={13} /> {destination?.name || "Satrangi Sanctuary"}
              </div>

              <h2 className="font-serif text-3xl font-bold text-[#1C352D] mb-2">
                {room.name}
              </h2>

              <div className="flex items-baseline gap-2 mb-4 pb-4 border-b border-gray-200">
                <span className="font-serif text-2xl font-bold text-[#B85A32]">
                  {formatPrice(room.pricePerNight, currency)}
                </span>
                <span className="text-xs text-gray-500 font-sans">/ night</span>
                <span className="text-xs text-gray-400 font-sans ml-auto">Max {room.capacity} Guests</span>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed mb-6 font-sans">
                {room.description}
              </p>

              {/* Amenity Breakdown */}
              <div className="mb-6">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-600 mb-2.5">
                  Included Amenities & Features
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {room.amenities.map((amenity) => {
                    const IconComp = getAmenityIcon(amenity);
                    return (
                      <div
                        key={amenity}
                        className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl text-xs text-gray-700 font-medium border border-gray-200/80 shadow-xs"
                      >
                        <IconComp size={14} className="text-[#B85A32] shrink-0" />
                        <span className="truncate">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instant Live Date Availability Checker */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm space-y-3 mb-6">
                <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#1C352D] flex items-center gap-1.5">
                  <Calendar size={13} className="text-[#B85A32]" /> Verify Real-Time Availability
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-1">Check-In</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs text-gray-800 font-medium outline-none focus:border-[#B85A32]"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-1">Check-Out</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs text-gray-800 font-medium outline-none focus:border-[#B85A32]"
                    />
                  </div>
                </div>

                {/* Status Badge & Pricing Summary */}
                <div className={`p-2.5 rounded-xl border text-xs font-sans flex items-center justify-between ${
                  isAvailable ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-rose-50 border-rose-200 text-rose-900"
                }`}>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isAvailable ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                    <span className="font-bold">{isAvailable ? "Available" : "Dates Overlapped"}</span>
                  </div>
                  <div className="font-serif font-bold text-sm">
                    {formatPrice(totalPrice, currency)} <span className="text-[10px] font-sans font-normal text-gray-500">({nights} night{nights > 1 ? "s" : ""})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Booking Action CTA */}
            <div className="space-y-2">
              <button
                disabled={!isAvailable}
                onClick={() => {
                  onBookNow(room.destinationId, room.id, checkIn, checkOut);
                  onClose();
                }}
                className="w-full bg-[#1C352D] disabled:bg-gray-300 hover:bg-[#B85A32] text-white py-3.5 rounded-full text-xs font-sans uppercase tracking-widest font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check size={16} />
                <span>{isAvailable ? "Reserve This Suite Now" : "Unavailable for Selected Dates"}</span>
              </button>

              <div className="text-[10px] text-gray-400 font-sans text-center flex items-center justify-center gap-1">
                <ShieldCheck size={12} className="text-[#B85A32]" /> Includes 0% platform fee direct rate & breakfast.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
