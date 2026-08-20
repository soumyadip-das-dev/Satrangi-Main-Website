import { useState } from "react";
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  Calendar, 
  CheckCircle2,
  Bed,
  Wifi,
  Coffee,
  Wind,
  Flame,
  Tv,
  ShowerHead,
  Trees,
  PenTool,
  Utensils,
  Sun,
  Sparkles,
  Bath,
  Volume2
} from "lucide-react";
import { Room, Destination } from "../types";
import { Currency, formatPrice } from "../utils/currency";
import { getFormattedDateString } from "../utils/bookingUtils";

interface RoomDetailModalProps {
  room: Room | null;
  destination?: Destination;
  currency?: Currency;
  checkIn?: string;
  checkOut?: string;
  initialGuestsCount?: number;
  onClose: () => void;
  onBookNow?: (destinationId: string, roomId: string, checkIn: string, checkOut: string, guestsCount: number) => void;
}

const getAmenityIcon = (amenity: string) => {
  const lower = amenity.toLowerCase();
  if (lower.includes("wifi") || lower.includes("starlink")) return Wifi;
  if (lower.includes("coffee") || lower.includes("espresso") || lower.includes("tea")) return Coffee;
  if (lower.includes("bed") || lower.includes("linen") || lower.includes("canopy") || lower.includes("daybed")) return Bed;
  if (lower.includes("balcony") || lower.includes("deck") || lower.includes("terrace") || lower.includes("porch")) return Sun;
  if (lower.includes("view") || lower.includes("garden") || lower.includes("mud-flat") || lower.includes("forest") || lower.includes("river") || lower.includes("valley") || lower.includes("courtyard")) return Trees;
  if (lower.includes("shower")) return ShowerHead;
  if (lower.includes("bath")) return Bath;
  if (lower.includes("desk") || lower.includes("bureau") || lower.includes("writing")) return PenTool;
  if (lower.includes("air") || lower.includes("thermostat")) return Wind;
  if (lower.includes("heating") || lower.includes("hearth") || lower.includes("fireplace")) return Flame;
  if (lower.includes("tv")) return Tv;
  if (lower.includes("audio") || lower.includes("sonos") || lower.includes("sound")) return Volume2;
  if (lower.includes("kitchen") || lower.includes("bar")) return Utensils;
  return Sparkles;
};

export default function RoomDetailModal({
  room,
  destination,
  currency = "INR",
  checkIn: initialCheckIn,
  checkOut: initialCheckOut,
  initialGuestsCount = 2,
  onClose,
  onBookNow
}: RoomDetailModalProps) {
  if (!room) return null;

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [checkIn, setCheckIn] = useState(initialCheckIn || getFormattedDateString(0));
  const [checkOut, setCheckOut] = useState(initialCheckOut || getFormattedDateString(3, initialCheckIn || getFormattedDateString(0)));
  const [guestsCount, setGuestsCount] = useState<number>(initialGuestsCount || 2);

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

  const whatsappMessage = encodeURIComponent(
    `Hello Satrangi Homestay,\n\nI would like to inquire about reserving:\n- Suite: ${room.name} (${room.type})\n- Destination: ${destination?.name || "Satrangi"}\n- Guests: ${guestsCount} guest(s)\n- Dates: ${checkIn} to ${checkOut} (${nights} night${nights > 1 ? "s" : ""})\n\nPlease share reservation details.`
  );

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200/80 text-left animate-fade-rise"
      >
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

              {/* Photo Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] font-sans font-medium text-white/90 rounded-full border border-white/10">
                  {activeImgIndex + 1} / {images.length} Photos
                </div>
              )}
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

          {/* Right Column: Suite Details, Specs, Reservation Action */}
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

              {/* Clean Monochrome Amenities Breakdown (No Outer Capsules) */}
              <div className="mb-6">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-3">
                  Included Amenities & Comforts
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  {room.amenities.map((amenity) => {
                    const IconComp = getAmenityIcon(amenity);
                    return (
                      <div
                        key={amenity}
                        className="flex items-center gap-2.5 text-xs text-gray-700 font-medium"
                      >
                        <IconComp size={15} className="text-gray-900 shrink-0 stroke-[1.8]" />
                        <span className="leading-snug text-gray-800 font-sans">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Date Selector & Total Calculation */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm space-y-3 mb-6">
                <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#1C352D] flex items-center gap-1.5">
                  <Calendar size={13} className="text-[#B85A32]" /> Preferred Stay Dates & Guests
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-1">Check-In</label>
                    <input
                      type="date"
                      min={getFormattedDateString(0)}
                      value={checkIn}
                      onChange={(e) => {
                        const newIn = e.target.value;
                        setCheckIn(newIn);
                        if (checkOut <= newIn) {
                          setCheckOut(getFormattedDateString(1, newIn));
                        }
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs text-gray-800 font-medium outline-none focus:border-[#B85A32]"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-1">Check-Out</label>
                    <input
                      type="date"
                      min={getFormattedDateString(1, checkIn)}
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs text-gray-800 font-medium outline-none focus:border-[#B85A32]"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-1">Guests</label>
                    <select
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs text-gray-800 font-medium outline-none focus:border-[#B85A32]"
                    >
                      <option value={1}>1 Guest</option>
                      <option value={2}>2 Guests</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4 Guests</option>
                      <option value={5}>5 Guests</option>
                      <option value={6}>6 Guests</option>
                    </select>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl border bg-gray-50 border-gray-200 text-xs font-sans flex items-center justify-between">
                  <span className="text-gray-600 font-medium">{nights} night{nights > 1 ? "s" : ""} for {guestsCount} guest{guestsCount > 1 ? "s" : ""}:</span>
                  <span className="font-serif font-bold text-sm text-[#B85A32]">
                    {formatPrice(totalPrice, currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Host Reservation & WhatsApp Actions */}
            <div className="space-y-2.5">
              {onBookNow && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onBookNow(room.destinationId, room.id, checkIn, checkOut, guestsCount);
                  }}
                  className="w-full bg-[#1C352D] hover:bg-[#B85A32] text-white py-3.5 rounded-full text-xs font-sans uppercase tracking-widest font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 size={16} />
                  <span>Reserve This Suite</span>
                </button>
              )}

              <a
                href={`https://wa.me/919876543210?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3 rounded-full text-xs font-sans uppercase tracking-widest font-bold transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare size={15} />
                <span>Inquire via WhatsApp</span>
              </a>

              <div className="text-[10px] text-gray-400 font-sans text-center flex items-center justify-center gap-1">
                <ShieldCheck size={12} className="text-[#B85A32]" /> Direct host reservation guarantee with 0% booking fee.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
