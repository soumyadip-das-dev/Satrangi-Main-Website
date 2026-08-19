import React, { useEffect } from "react";
import { X } from "lucide-react";
import BookingFlow from "./BookingFlow";
import { Destination, Room, Booking } from "../types";
import { Currency } from "../utils/currency";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinations?: Destination[];
  rooms?: Room[];
  bookings?: Booking[];
  currency?: Currency;
  initialDestId?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  onBookingComplete?: () => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  destinations,
  rooms,
  bookings,
  currency = "INR",
  initialDestId,
  initialCheckIn,
  initialCheckOut,
  onBookingComplete,
}: BookingModalProps) {
  // Lock background body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[300] bg-[#1C352D]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
    >
      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[92vh] bg-[#FAF8F5] rounded-3xl shadow-2xl border border-white/40 overflow-hidden flex flex-col my-auto animate-fade-in text-left"
      >
        {/* Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B85A32] animate-pulse" />
            <span className="font-serif text-lg font-bold text-[#1C352D] tracking-wide">
              Satrangi Direct Reservations
            </span>
          </div>
          
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer focus:outline-none"
            aria-label="Close booking modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Booking Content */}
        <div 
          id="booking-modal-scroll-container"
          className="p-4 sm:p-8 overflow-y-auto flex-grow"
        >
          <BookingFlow
            destinations={destinations}
            rooms={rooms}
            bookings={bookings}
            currency={currency}
            initialDestId={initialDestId}
            initialCheckIn={initialCheckIn}
            initialCheckOut={initialCheckOut}
            onBookingComplete={() => {
              if (onBookingComplete) onBookingComplete();
            }}
            onNavigateHome={onClose}
          />
        </div>
      </div>
    </div>
  );
}

