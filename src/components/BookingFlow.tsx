import { useState, useEffect } from "react";
import { 
  Check, 
  Calendar, 
  Users, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  Mail, 
  Info, 
  Eye, 
  X, 
  CheckCircle2, 
  RefreshCw, 
  CreditCard, 
  QrCode, 
  Building2, 
  Copy, 
  Printer, 
  Clock, 
  HeartHandshake
} from "lucide-react";
import { Destination, Room, Booking } from "../types";
import { Currency, formatPrice } from "../utils/currency";
import { destinationsData, roomsData } from "../data/mockData";
import { getFormattedDateString, isRoomAvailable, getAmenityEmoji } from "../utils/bookingUtils";
import SuitePhotoCarousel from "./SuitePhotoCarousel";

interface BookingProps {
  destinations?: Destination[];
  rooms?: Room[];
  bookings?: Booking[];
  currency?: Currency;
  initialDestId?: string;
  initialDestinationId?: string;
  initialRoomId?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuestsCount?: number;
  initialStep?: number;
  onBookingComplete?: (newBooking: Booking) => void;
  onNavigateHome?: () => void;
}

export default function BookingFlow({ 
  destinations = destinationsData,
  rooms = roomsData,
  bookings: initialBookings = [],
  initialDestId,
  initialDestinationId,
  initialRoomId,
  initialCheckIn, 
  initialCheckOut, 
  initialGuestsCount,
  initialStep,
  onBookingComplete, 
  onNavigateHome,
  currency = "INR"
}: BookingProps) {
  const effectiveDestId = initialDestId || initialDestinationId || "lamahatta";
  const [step, setStep] = useState<number>(() => initialStep || (initialRoomId ? 3 : 1));
  const [bookingsList, setBookingsList] = useState<any[]>(() => {
    const saved = localStorage.getItem("satrangi_bookings");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return initialBookings;
  });
  
  // Selection state with dynamic current date defaults
  const todayStr = getFormattedDateString(0);
  const defaultCheckIn = initialCheckIn || todayStr;
  const defaultCheckOut = initialCheckOut || getFormattedDateString(3, defaultCheckIn);

  const [selectedDestination, setSelectedDestination] = useState<string>(effectiveDestId);
  const [checkIn, setCheckIn] = useState<string>(defaultCheckIn);
  const [checkOut, setCheckOut] = useState<string>(defaultCheckOut);
  const [guestsCount, setGuestsCount] = useState<number>(initialGuestsCount || 2);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(() => {
    if (initialRoomId) {
      const match = rooms.find(r => r.id === initialRoomId);
      if (match) return match;
    }
    const destRooms = rooms.filter(r => r.destinationId === effectiveDestId);
    return destRooms.length > 0 ? destRooms[0] : null;
  });

  useEffect(() => {
    if (initialDestId || initialDestinationId) {
      setSelectedDestination(initialDestId || initialDestinationId || "lamahatta");
    }
    if (initialRoomId) {
      const match = rooms.find(r => r.id === initialRoomId);
      if (match) setSelectedRoom(match);
    }
    if (initialCheckIn) setCheckIn(initialCheckIn);
    if (initialCheckOut) setCheckOut(initialCheckOut);
    if (initialGuestsCount) setGuestsCount(initialGuestsCount);
    if (initialStep) {
      setStep(initialStep);
    } else if (initialRoomId) {
      setStep(3);
    }
  }, [initialDestId, initialDestinationId, initialRoomId, initialCheckIn, initialCheckOut, initialGuestsCount, initialStep]);
  
  // Guest personal & request details
  const [guestName, setGuestName] = useState<string>("");
  const [guestEmail, setGuestEmail] = useState<string>("");
  const [guestPhone, setGuestPhone] = useState<string>("");
  const [specialRequests, setSpecialRequests] = useState<string>("");

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<"pay_at_property" | "online_upi" | "online_card" | "advance_deposit">("pay_at_property");
  const [upiId, setUpiId] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>("");
  const [cardCvv, setCardCvv] = useState<string>("");
  
  // Submission & confirmed outcome state
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);

  // Handle smart check-in date change
  const handleCheckInChange = (newDate: string) => {
    setCheckIn(newDate);
    if (checkOut <= newDate) {
      setCheckOut(getFormattedDateString(1, newDate));
    }
  };

  // Available rooms for currently selected destination
  const availableDestinationRooms = rooms.filter((r) => r.destinationId === selectedDestination);

  // Update room selection if destination changes
  useEffect(() => {
    if (step === 5) return;
    const destRooms = rooms.filter(r => r.destinationId === selectedDestination);
    if (initialRoomId) {
      const match = destRooms.find(r => r.id === initialRoomId);
      if (match) {
        setSelectedRoom(match);
        return;
      }
    }
    const firstAvail = destRooms.find(r => isRoomAvailable(r.id, checkIn, checkOut, bookingsList));
    if (firstAvail) {
      setSelectedRoom(firstAvail);
    } else if (destRooms.length > 0) {
      setSelectedRoom(destRooms[0]);
    }
  }, [selectedDestination]);

  // Scroll to top on step changes
  useEffect(() => {
    const scrollContainer = document.getElementById("booking-modal-scroll-container");
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

  // Helper calculations
  const getNightsCount = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
  };

  const currentDestinationObj = destinations.find((d) => d.id === selectedDestination);
  const totalNights = getNightsCount();
  const totalPrice = selectedRoom ? selectedRoom.pricePerNight * totalNights : 0;
  const depositAmount = Math.round(totalPrice * 0.3);

  // Step navigation & validation
  const goToStep = (targetStep: number) => {
    setErrorMsg(null);

    // Validate dates when moving past Step 1
    if (targetStep > 1 && step === 1) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        setErrorMsg("Please specify valid check-in and check-out dates.");
        return;
      }
      if (start >= end) {
        setErrorMsg("Check-out date must fall strictly after check-in date.");
        return;
      }
    }

    // Validate room selection when moving past Step 2
    if (targetStep > 2 && step === 2) {
      if (!selectedRoom) {
        setErrorMsg("Please select an available suite to continue.");
        return;
      }
      if (!isRoomAvailable(selectedRoom.id, checkIn, checkOut, bookingsList)) {
        setErrorMsg("The selected suite is already reserved for these dates. Please choose another suite.");
        return;
      }
    }

    // Validate guest details when moving past Step 3
    if (targetStep > 3 && step === 3) {
      if (!guestName.trim()) {
        setErrorMsg("Please enter your full name.");
        return;
      }
      if (!guestEmail.trim() || !guestEmail.includes("@")) {
        setErrorMsg("Please enter a valid email address for your confirmation voucher.");
        return;
      }
      if (!guestPhone.trim() || guestPhone.trim().length < 8) {
        setErrorMsg("Please enter a valid mobile number for check-in coordination.");
        return;
      }
    }

    setStep(targetStep);
  };

  // Special request helper tags
  const specialRequestPresets = [
    "Quiet corner room",
    "Late arrival (after 6 PM)",
    "Pure vegetarian Bengali food",
    "Airport / Station pickup transfer",
    "Anniversary / Celebration decor",
    "Extra bed / linen requested"
  ];

  const handleTogglePreset = (preset: string) => {
    if (specialRequests.includes(preset)) {
      setSpecialRequests(prev => prev.replace(preset, "").replace(/,\s*,/g, ",").replace(/^,\s*|,\s*$/g, "").trim());
    } else {
      setSpecialRequests(prev => prev.trim() ? `${prev.trim()}, ${preset}` : preset);
    }
  };

  // Submit Reservation
  const handleConfirmReservation = () => {
    if (!selectedRoom) return;

    if (paymentMethod === "online_upi" && !upiId.trim()) {
      setErrorMsg("Please enter a UPI ID (e.g., yourname@okaxis) or select Pay at Property.");
      return;
    }
    if (paymentMethod === "online_card" && (!cardNumber.trim() || cardNumber.replace(/\s/g, "").length < 12)) {
      setErrorMsg("Please enter a valid 16-digit card number or choose another payment method.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const effectivePaymentStatus = paymentMethod === "pay_at_property" 
      ? "Pay at Property" 
      : paymentMethod === "advance_deposit" 
      ? "partial_paid" 
      : "paid";

    const customPaymentId = paymentMethod === "pay_at_property"
      ? `pay_property_${Math.random().toString(36).substring(2, 9)}`
      : paymentMethod === "online_upi"
      ? `upi_${Math.random().toString(36).substring(2, 9)}`
      : paymentMethod === "online_card"
      ? `card_${Math.random().toString(36).substring(2, 9)}`
      : `dep_${Math.random().toString(36).substring(2, 9)}`;

    const destName = currentDestinationObj?.name || "Satrangi Sanctuary";
    const newBookingId = `SR-${Math.floor(1000 + Math.random() * 9000)}-B${bookingsList.length + 1}`;

    const newBooking: Booking = {
      id: newBookingId,
      destinationId: selectedDestination,
      roomId: selectedRoom.id,
      checkIn,
      checkOut,
      guestName,
      guestEmail,
      guestPhone,
      guestsCount: Number(guestsCount) || 2,
      specialRequests: specialRequests.trim() || undefined,
      paymentMethod,
      totalPrice: totalPrice,
      paymentStatus: effectivePaymentStatus,
      paymentId: customPaymentId,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      confirmationEmail: {
        id: `email-${Date.now()}`,
        bookingId: newBookingId,
        to: guestEmail,
        subject: `Booking Confirmation - Satrangi Homestay (${destName}) #${newBookingId}`,
        bodyHtml: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #FAF9F6; border: 1px solid #E5E7EB; border-radius: 8px;">
            <div style="background-color: #1C352D; color: #ffffff; padding: 24px; text-align: center; border-radius: 6px;">
              <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px;">SATRANGI HOMESTAY</h1>
              <p style="margin: 6px 0 0 0; font-size: 11px; text-transform: uppercase; color: #C5A059;">Official Confirmation Voucher</p>
            </div>
            <div style="padding: 20px 10px;">
              <h2 style="color: #1C352D; font-size: 20px;">Namaste ${guestName},</h2>
              <p style="color: #4B5563; font-size: 14px; line-height: 1.6;">Your reservation at <strong>Satrangi Homestay (${destName})</strong> is confirmed for <strong>${selectedRoom.name}</strong> from <strong>${checkIn}</strong> to <strong>${checkOut}</strong> (${totalNights} night${totalNights > 1 ? "s" : ""}).</p>
              <div style="background: #ffffff; border: 1px solid #E5E7EB; border-radius: 6px; padding: 16px; margin: 16px 0;">
                <p style="margin: 4px 0; font-size: 13px;"><strong>Booking Reference:</strong> <span style="color: #B85A32; font-family: monospace;">${newBookingId}</span></p>
                <p style="margin: 4px 0; font-size: 13px;"><strong>Suite:</strong> ${selectedRoom.name} (${selectedRoom.type})</p>
                <p style="margin: 4px 0; font-size: 13px;"><strong>Payment Method:</strong> ${paymentMethod === "pay_at_property" ? "Pay at Property Upon Check-in" : paymentMethod === "advance_deposit" ? "30% Advance Deposit Paid" : "Full Online Payment"}</p>
                <p style="margin: 4px 0; font-size: 14px; font-weight: bold; color: #B85A32;">Total Amount: ${formatPrice(totalPrice, currency)}</p>
              </div>
              <p style="font-size: 12px; color: #6B7280;">Complimentary breakfast, 0% platform fee, and 24/7 host concierge assistance are included in your reservation.</p>
            </div>
          </div>
        `,
        sentAt: new Date().toISOString()
      }
    };

    // Save to local storage
    const updatedBookings = [newBooking, ...bookingsList];
    setBookingsList(updatedBookings);
    try {
      localStorage.setItem("satrangi_bookings", JSON.stringify(updatedBookings));
    } catch {}

    setTimeout(() => {
      setConfirmedBooking(newBooking);
      setLoading(false);
      setStep(5);
    }, 600);
  };

  const copyBookingId = (id: string) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const activeBooking = confirmedBooking || {
    id: "SR-7734-DIRECT",
    destinationId: selectedDestination,
    roomId: selectedRoom?.id || "room-1",
    checkIn: checkIn || todayStr,
    checkOut: checkOut || getFormattedDateString(3),
    guestName: guestName || "Guest",
    guestEmail: guestEmail || "guest@email.com",
    guestPhone: guestPhone || "+91 98765 43210",
    guestsCount: guestsCount || 2,
    specialRequests: specialRequests || undefined,
    paymentMethod: paymentMethod,
    totalPrice: totalPrice || 0,
    paymentStatus: paymentMethod === "pay_at_property" ? "Pay at Property" : "paid" as const,
    paymentId: "pay_direct_guarantee",
    status: "confirmed" as const,
    createdAt: new Date().toISOString()
  };

  const displayDestName = destinations.find((d) => d.id === activeBooking.destinationId)?.name || currentDestinationObj?.name || "Satrangi Retreat";
  const displayRoomName = rooms.find((r) => r.id === activeBooking.roomId)?.name || selectedRoom?.name || "Luxury Suite";
  const finalTotalPrice = activeBooking.totalPrice || totalPrice || 0;

  const paymentMethodTitles: Record<string, string> = {
    pay_at_property: "Pay at Property (Upon Check-In)",
    online_upi: "Instant UPI / QR Code",
    online_card: "Credit / Debit Card",
    advance_deposit: "30% Advance Online Deposit"
  };

  return (
    <div className="max-w-4xl mx-auto py-2 sm:py-4 px-2 sm:px-4 text-left">
      {/* 4-Stage Stepper Bar */}
      {step < 5 && (
        <div className="mb-8">
          <div className="grid grid-cols-4 text-[10px] font-sans uppercase tracking-[0.15em] text-gray-400 mb-3 font-semibold text-center">
            <span className={step >= 1 ? "text-[#B85A32] font-bold" : ""}>1. Dates & Guests</span>
            <span className={step >= 2 ? "text-[#B85A32] font-bold" : ""}>2. Choose Suite</span>
            <span className={step >= 3 ? "text-[#B85A32] font-bold" : ""}>3. Guest Details</span>
            <span className={step >= 4 ? "text-[#B85A32] font-bold" : ""}>4. Payment</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-[#B85A32] transition-all duration-500 rounded-full"
              style={{ 
                width: step === 1 ? "25%" : step === 2 ? "50%" : step === 3 ? "75%" : "100%" 
              }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-800 text-xs sm:text-sm flex items-center gap-3 rounded-r-xl">
          <Info size={18} className="shrink-0 text-rose-600" />
          <span className="font-sans font-medium">{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: DATES, DESTINATION & GUEST COUNT */}
      {step === 1 && (
        <div className="animate-fade-in">
          <span className="text-xs uppercase tracking-[0.3em] text-[#B85A32] font-bold block mb-1">
            Step 01 of 04
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C352D] mb-2 italic">
            Where & when shall we welcome you?
          </h2>
          <p className="text-xs text-gray-500 mb-6 font-sans">
            Choose your preferred Bengal retreat, select your stay dates and number of travelers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {destinations.map((dest) => (
              <button
                key={dest.id}
                type="button"
                onClick={() => setSelectedDestination(dest.id)}
                className={`p-5 border text-left cursor-pointer transition-all rounded-2xl ${
                  selectedDestination === dest.id
                    ? "border-[#B85A32] bg-white shadow-xl ring-2 ring-[#B85A32]/20"
                    : "border-gray-200 bg-white/70 hover:bg-white hover:border-gray-300"
                }`}
              >
                <span className="text-[9px] font-sans uppercase tracking-widest text-[#B85A32] font-bold block mb-1">
                  {dest.tagline}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#1C352D] mb-1">
                  {dest.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-sans font-light">
                  {dest.propertyStory || dest.theme}
                </p>
              </button>
            ))}
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-md mb-8">
            <h3 className="font-serif font-bold text-base text-[#1C352D] mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-[#B85A32]" />
              <span>Select Stay Duration & Number of Guests</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-[10px] font-sans uppercase tracking-widest text-gray-600 mb-2 font-bold">
                  Check-in Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={checkIn}
                  onChange={(e) => handleCheckInChange(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B85A32] focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-sans uppercase tracking-widest text-gray-600 mb-2 font-bold">
                  Check-out Date
                </label>
                <input
                  type="date"
                  min={getFormattedDateString(1, checkIn)}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B85A32] focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-sans uppercase tracking-widest text-gray-600 mb-2 font-bold">
                  Number of Guests
                </label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B85A32] focus:bg-white font-medium"
                >
                  <option value={1}>1 Guest (Solo Traveler)</option>
                  <option value={2}>2 Guests (Couple / Pair)</option>
                  <option value={3}>3 Guests (Small Group / Family)</option>
                  <option value={4}>4 Guests (Family Suite)</option>
                  <option value={5}>5 Guests (Extended Family)</option>
                  <option value={6}>6 Guests (Group)</option>
                </select>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2">
              <span className="flex items-center gap-1.5 font-sans">
                <Clock size={14} className="text-[#B85A32]" />
                Calculated stay duration: <strong className="text-gray-900 font-semibold">{totalNights} night{totalNights > 1 ? "s" : ""}</strong>
              </span>
              <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                <ShieldCheck size={13} /> Direct Host Rates & Zero Commission
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="bg-[#1C352D] hover:bg-[#B85A32] text-white px-8 py-3.5 rounded-full font-sans text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              <span>Next: View Suites & Availability</span>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: VIEW SUITES, AVAILABILITY & RATES */}
      {step === 2 && (
        <div className="animate-fade-in">
          <span className="text-xs uppercase tracking-[0.3em] text-[#B85A32] font-bold block mb-1">
            Step 02 of 04
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C352D] italic mb-2">
            Select Your Private Suite
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm mb-6 font-sans">
            Showing room inventory for <strong className="text-gray-900 capitalize">{currentDestinationObj?.name}</strong> for {totalNights} night(s) ({checkIn} to {checkOut}).
          </p>

          <div className="space-y-5 mb-8">
            {availableDestinationRooms.length === 0 ? (
              <div className="bg-white border border-gray-200/80 rounded-2xl p-12 text-center">
                <p className="text-gray-500 text-sm">No suites found for this destination.</p>
              </div>
            ) : (
              availableDestinationRooms.map((room) => {
                const available = isRoomAvailable(room.id, checkIn, checkOut, bookingsList);
                const isSelected = selectedRoom?.id === room.id;

                return (
                  <div
                    key={room.id}
                    onClick={() => {
                      if (available) setSelectedRoom(room);
                    }}
                    className={`bg-white border rounded-2xl p-5 sm:p-6 transition-all cursor-pointer flex flex-col md:flex-row gap-5 ${
                      isSelected
                        ? "border-[#B85A32] shadow-xl ring-2 ring-[#B85A32]/20"
                        : available
                        ? "border-gray-200/80 hover:border-gray-300 hover:shadow-md"
                        : "border-gray-200/50 opacity-60 bg-gray-50/60 cursor-not-allowed"
                    }`}
                  >
                    <div className="md:w-1/3 aspect-[4/3] rounded-xl overflow-hidden relative shrink-0">
                      <SuitePhotoCarousel
                        suiteId={room.id}
                        images={room.imageUrls}
                        altText={room.name}
                        heightClass="h-full min-h-[160px]"
                      />
                      {!available ? (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 text-center pointer-events-none">
                          <span className="bg-rose-600 text-white px-3 py-1 rounded-full text-[10px] font-sans uppercase tracking-widest font-bold">
                            Reserved for dates
                          </span>
                        </div>
                      ) : (
                        <div className="absolute top-2 left-2 pointer-events-none">
                          <span className="bg-emerald-600/90 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-full text-[9px] font-sans uppercase tracking-wider font-bold flex items-center gap-1">
                            <CheckCircle2 size={10} /> Available
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-[10px] font-sans uppercase tracking-widest text-[#B85A32] font-bold">
                              {room.type} Suite
                            </span>
                            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C352D]">
                              {room.name}
                            </h3>
                          </div>
                          <div className="text-right">
                            <span className="font-serif text-xl sm:text-2xl font-bold text-[#B85A32] block">
                              {formatPrice(room.pricePerNight * totalNights, currency)}
                            </span>
                            <span className="text-[10px] font-sans text-gray-400">
                              {formatPrice(room.pricePerNight, currency)} / night × {totalNights} night{totalNights > 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-600 line-clamp-2 mb-3 font-sans leading-relaxed">
                          {room.description}
                        </p>

                        <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-3">
                          {room.amenities.map((amenity, i) => (
                            <span
                              key={i}
                              className="text-gray-700 text-xs font-sans flex items-center gap-1.5"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#B85A32]/80 shrink-0" />
                              <span>{amenity}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs font-sans text-gray-500">
                        <span>Capacity: Up to {room.capacity} Guests • {room.sqft} sq.ft</span>
                        {isSelected && (
                          <span className="text-[#B85A32] font-bold flex items-center gap-1 uppercase tracking-wider text-[10px]">
                            <CheckCircle2 size={14} /> Selected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200/60">
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="border border-gray-300 hover:border-gray-900 text-gray-700 hover:text-gray-900 px-6 py-3 rounded-full font-sans text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <ChevronLeft size={15} />
              <span>Back to Dates</span>
            </button>
            <button
              type="button"
              disabled={!selectedRoom}
              onClick={() => goToStep(3)}
              className="bg-[#1C352D] disabled:bg-gray-300 hover:bg-[#B85A32] text-white px-8 py-3.5 rounded-full font-sans text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-all shadow-lg cursor-pointer"
            >
              <span>Next: Guest Details</span>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: GUEST INFORMATION & SPECIAL REQUESTS */}
      {step === 3 && (
        <div className="animate-fade-in">
          <span className="text-xs uppercase tracking-[0.3em] text-[#B85A32] font-bold block mb-1">
            Step 03 of 04
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C352D] italic mb-2">
            Guest Details & Special Requests
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm mb-6 font-sans">
            Please enter contact coordinates for your reservation voucher and note any personal preferences.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-md space-y-5">
                <div>
                  <label className="block text-[10px] font-sans uppercase tracking-widest text-gray-600 mb-1.5 font-bold">
                    Guest Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Priyanshi Mehta"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B85A32] focus:bg-white font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-sans uppercase tracking-widest text-gray-600 mb-1.5 font-bold">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+91 91234 56789"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B85A32] focus:bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans uppercase tracking-widest text-gray-600 mb-1.5 font-bold">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="priyanshi@yahoo.com"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B85A32] focus:bg-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-sans uppercase tracking-widest text-gray-600 mb-1.5 font-bold">
                    Guest Count
                  </label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B85A32] focus:bg-white font-medium"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                    <option value={5}>5 Guests</option>
                    <option value={6}>6 Guests</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-[10px] font-sans uppercase tracking-widest text-gray-600 mb-1.5 font-bold flex items-center justify-between">
                    <span>Optional Special Requests</span>
                    <span className="text-gray-400 font-normal lowercase">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="E.g., early check-in requested, dietary preferences, vegetarian meals, airport transfer coordination..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-[#B85A32] focus:bg-white font-medium"
                  />

                  <div className="mt-2.5">
                    <span className="text-[10px] text-gray-400 font-sans block mb-1.5 font-medium">Quick Suggestions (Click to add):</span>
                    <div className="flex flex-wrap gap-1.5">
                      {specialRequestPresets.map((preset, idx) => {
                        const isSelected = specialRequests.includes(preset);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleTogglePreset(preset)}
                            className={`text-[10px] font-sans px-2.5 py-1 rounded-full border transition cursor-pointer ${
                              isSelected
                                ? "bg-[#B85A32] text-white border-[#B85A32]"
                                : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                            }`}
                          >
                            + {preset}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-1 bg-white border border-gray-200/80 rounded-2xl p-6 shadow-md flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1C352D] mb-4 pb-3 border-b border-gray-100">
                  Reservation Summary
                </h3>
                <div className="space-y-3 text-xs font-sans text-gray-600">
                  <div className="flex justify-between">
                    <span>Destination:</span>
                    <span className="font-semibold text-gray-900 capitalize">{currentDestinationObj?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Selected Suite:</span>
                    <span className="font-semibold text-gray-900 line-clamp-1 text-right">{selectedRoom?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dates:</span>
                    <span className="font-semibold text-gray-900">{checkIn.slice(5)} to {checkOut.slice(5)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nights Count:</span>
                    <span className="font-semibold text-gray-900">{totalNights} night{totalNights > 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Travelers:</span>
                    <span className="font-semibold text-gray-900">{guestsCount} guest{guestsCount > 1 ? "s" : ""}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex justify-between font-serif text-base font-bold text-[#B85A32]">
                    <span>Total Amount:</span>
                    <span>{formatPrice(totalPrice, currency)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-[11px] text-gray-500 font-sans flex items-start gap-2 bg-[#FAF8F5] p-3 rounded-xl border border-gray-100">
                <ShieldCheck size={16} className="text-[#B85A32] shrink-0 mt-0.5" />
                <span>Zero reservation processing fee. Direct host rate guarantee.</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200/60">
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="border border-gray-300 hover:border-gray-900 text-gray-700 hover:text-gray-900 px-6 py-3 rounded-full font-sans text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <ChevronLeft size={15} />
              <span>Back to Suites</span>
            </button>
            <button
              type="button"
              onClick={() => goToStep(4)}
              className="bg-[#1C352D] hover:bg-[#B85A32] text-white px-8 py-3.5 rounded-full font-sans text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-all shadow-lg cursor-pointer"
            >
              <span>Next: Choose Payment Method</span>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: MAKE PAYMENT / CHOOSE PAYMENT METHOD */}
      {step === 4 && (
        <div className="animate-fade-in">
          <span className="text-xs uppercase tracking-[0.3em] text-[#B85A32] font-bold block mb-1">
            Step 04 of 04
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C352D] italic mb-2">
            Payment & Reservation Guarantee
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm mb-6 font-sans">
            Choose how you wish to settle your stay. Direct bookings offer flexible settlement options.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2 space-y-4">
              {/* Option 1: Pay at Property */}
              <div
                onClick={() => setPaymentMethod("pay_at_property")}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  paymentMethod === "pay_at_property"
                    ? "bg-white border-[#B85A32] shadow-lg ring-2 ring-[#B85A32]/20"
                    : "bg-white/80 border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${paymentMethod === "pay_at_property" ? "bg-[#B85A32] text-white" : "bg-gray-100 text-gray-700"}`}>
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#1C352D]">
                        Pay at Property (Check-In)
                      </h4>
                      <span className="text-[10px] font-sans text-emerald-700 font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full">
                        Recommended • 0% Advance Required
                      </span>
                    </div>
                  </div>
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "pay_at_property" ? "border-[#B85A32] bg-[#B85A32]" : "border-gray-300"}`}>
                    {paymentMethod === "pay_at_property" && <Check size={12} className="text-white" />}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-2 font-sans pl-11">
                  Your reservation is immediately locked in. Pay the full balance of <strong>{formatPrice(totalPrice, currency)}</strong> upon arrival at the homestay via Cash, UPI, or Card.
                </p>
              </div>

              {/* Option 2: Instant Online UPI */}
              <div
                onClick={() => setPaymentMethod("online_upi")}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  paymentMethod === "online_upi"
                    ? "bg-white border-[#B85A32] shadow-lg ring-2 ring-[#B85A32]/20"
                    : "bg-white/80 border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${paymentMethod === "online_upi" ? "bg-[#B85A32] text-white" : "bg-gray-100 text-gray-700"}`}>
                      <QrCode size={20} />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#1C352D]">
                        Instant Online UPI / QR Code
                      </h4>
                      <span className="text-[10px] font-sans text-gray-500 font-medium">
                        Google Pay, PhonePe, Paytm, BHIM
                      </span>
                    </div>
                  </div>
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "online_upi" ? "border-[#B85A32] bg-[#B85A32]" : "border-gray-300"}`}>
                    {paymentMethod === "online_upi" && <Check size={12} className="text-white" />}
                  </span>
                </div>

                {paymentMethod === "online_upi" && (
                  <div className="mt-4 pt-4 border-t border-gray-100 pl-11 animate-fade-in space-y-3">
                    <p className="text-xs text-gray-600 font-sans">
                      Enter your UPI ID or proceed to pay {formatPrice(totalPrice, currency)} directly:
                    </p>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. mobile@upi or username@okhdfcbank"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-mono outline-none focus:border-[#B85A32] focus:bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Option 3: Credit / Debit Card */}
              <div
                onClick={() => setPaymentMethod("online_card")}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  paymentMethod === "online_card"
                    ? "bg-white border-[#B85A32] shadow-lg ring-2 ring-[#B85A32]/20"
                    : "bg-white/80 border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${paymentMethod === "online_card" ? "bg-[#B85A32] text-white" : "bg-gray-100 text-gray-700"}`}>
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#1C352D]">
                        Credit / Debit Card
                      </h4>
                      <span className="text-[10px] font-sans text-gray-500 font-medium">
                        Visa, Mastercard, RuPay, Amex
                      </span>
                    </div>
                  </div>
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "online_card" ? "border-[#B85A32] bg-[#B85A32]" : "border-gray-300"}`}>
                    {paymentMethod === "online_card" && <Check size={12} className="text-white" />}
                  </span>
                </div>

                {paymentMethod === "online_card" && (
                  <div className="mt-4 pt-4 border-t border-gray-100 pl-11 animate-fade-in space-y-3">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card Number (e.g. 4532 •••• •••• 8891)"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-mono outline-none focus:border-[#B85A32] focus:bg-white"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono outline-none focus:border-[#B85A32] focus:bg-white"
                      />
                      <input
                        type="password"
                        value={cardCvv}
                        maxLength={4}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="CVV"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono outline-none focus:border-[#B85A32] focus:bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Option 4: 30% Advance Deposit */}
              <div
                onClick={() => setPaymentMethod("advance_deposit")}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  paymentMethod === "advance_deposit"
                    ? "bg-white border-[#B85A32] shadow-lg ring-2 ring-[#B85A32]/20"
                    : "bg-white/80 border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${paymentMethod === "advance_deposit" ? "bg-[#B85A32] text-white" : "bg-gray-100 text-gray-700"}`}>
                      <HeartHandshake size={20} />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#1C352D]">
                        30% Advance Deposit
                      </h4>
                      <span className="text-[10px] font-sans text-gray-500 font-medium">
                        Pay {formatPrice(depositAmount, currency)} now, balance at check-in
                      </span>
                    </div>
                  </div>
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "advance_deposit" ? "border-[#B85A32] bg-[#B85A32]" : "border-gray-300"}`}>
                    {paymentMethod === "advance_deposit" && <Check size={12} className="text-white" />}
                  </span>
                </div>
              </div>
            </div>

            <div className="md:col-span-1 bg-white border border-gray-200/80 rounded-2xl p-6 shadow-md flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1C352D] mb-4 pb-3 border-b border-gray-100">
                  Bill Breakdown
                </h3>
                <div className="space-y-3 text-xs font-sans text-gray-600">
                  <div className="flex justify-between">
                    <span>Suite Rate ({totalNights} night{totalNights > 1 ? "s" : ""}):</span>
                    <span className="font-semibold text-gray-900">{formatPrice(totalPrice, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST & Local Taxes:</span>
                    <span className="text-emerald-700 font-medium">Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Direct Booking Discount:</span>
                    <span className="text-emerald-700 font-medium">Applied</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex justify-between font-serif text-base font-bold text-[#1C352D]">
                    <span>Total Bill:</span>
                    <span>{formatPrice(totalPrice, currency)}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-100 flex justify-between font-sans text-sm font-bold text-[#B85A32]">
                    <span>Payable Now:</span>
                    <span>
                      {paymentMethod === "pay_at_property" 
                        ? formatPrice(0, currency) 
                        : paymentMethod === "advance_deposit" 
                        ? formatPrice(depositAmount, currency) 
                        : formatPrice(totalPrice, currency)}
                    </span>
                  </div>
                  {paymentMethod !== "online_upi" && paymentMethod !== "online_card" && (
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Due at Check-in:</span>
                      <span>
                        {paymentMethod === "pay_at_property" 
                          ? formatPrice(totalPrice, currency) 
                          : formatPrice(totalPrice - depositAmount, currency)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 text-[11px] text-gray-500 font-sans flex items-start gap-2 bg-[#FAF8F5] p-3 rounded-xl border border-gray-100">
                <ShieldCheck size={16} className="text-[#B85A32] shrink-0 mt-0.5" />
                <span>Instant confirmation guarantee. Official voucher generated immediately.</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200/60">
            <button
              type="button"
              onClick={() => goToStep(3)}
              className="border border-gray-300 hover:border-gray-900 text-gray-700 hover:text-gray-900 px-6 py-3 rounded-full font-sans text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <ChevronLeft size={15} />
              <span>Back to Details</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleConfirmReservation}
              className="bg-[#1C352D] hover:bg-[#B85A32] text-white px-9 py-4 rounded-full font-sans text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-all shadow-xl hover:shadow-2xl cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Confirming Reservation...</span>
                </>
              ) : (
                <>
                  <span>
                    {paymentMethod === "pay_at_property" 
                      ? "Confirm Booking (Pay at Property)" 
                      : paymentMethod === "advance_deposit"
                      ? `Pay ${formatPrice(depositAmount, currency)} Deposit & Confirm`
                      : `Pay ${formatPrice(totalPrice, currency)} & Confirm`}
                  </span>
                  <CheckCircle2 size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: BOOKING CONFIRMED SCREEN */}
      {step === 5 && (
        <div className="animate-fade-in text-center max-w-2xl mx-auto py-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mb-4 animate-bounce">
            <CheckCircle2 size={36} />
          </div>

          <span className="text-xs uppercase tracking-[0.3em] text-emerald-700 font-bold block mb-1">
            Reservation Confirmed & Guaranteed
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C352D] mb-3 italic">
            Your Bengal Sanctuary Awaits
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
            Namaste <strong>{activeBooking.guestName}</strong>! Your stay at <strong>{displayDestName}</strong> is officially booked.
          </p>

          {/* Booking ID Highlight Pill */}
          <div className="inline-flex items-center gap-3 bg-white border border-[#B85A32]/30 rounded-2xl px-5 py-3 shadow-md mb-6">
            <div className="text-left">
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block">Official Booking ID</span>
              <span className="font-mono text-base sm:text-lg font-bold text-[#B85A32] tracking-wider">{activeBooking.id}</span>
            </div>
            <button
              type="button"
              onClick={() => copyBookingId(activeBooking.id)}
              className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition cursor-pointer"
              title="Copy Booking ID"
            >
              {copiedId ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
            </button>
          </div>

          {/* Confirmation Email Voucher Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 mb-8 text-left shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-full mt-0.5 shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-bold text-[#1C352D] text-sm sm:text-base">
                      Confirmation Voucher Generated
                    </h4>
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      <CheckCircle2 size={10} /> Confirmed
                    </span>
                  </div>
                  <p className="text-xs text-emerald-900 mt-1 font-sans">
                    A confirmation record has been created for <strong className="font-mono">{activeBooking.guestEmail}</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(true)}
                  className="bg-[#1C352D] hover:bg-[#B85A32] text-white px-4 py-2 rounded-full text-xs font-sans uppercase tracking-wider font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Eye size={13} /> View Voucher
                </button>
              </div>
            </div>
          </div>

          {/* Printable Ticket Voucher Slip */}
          <div className="bg-white border border-gray-200 text-left rounded-2xl overflow-hidden shadow-xl mb-8">
            <div className="bg-[#1C352D] text-white p-5 sm:p-6 flex justify-between items-baseline">
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide">SATRANGI HOMESTAY VOUCHER</h3>
                <p className="text-[10px] uppercase opacity-70 tracking-widest mt-0.5">Bengal Heritage & Eco-Retreats</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-[10px] block opacity-60">BOOKING REFERENCE:</span>
                <span className="font-mono text-sm font-semibold tracking-wider text-[#C5A059]">{activeBooking.id}</span>
              </div>
            </div>

            <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-10 text-sm font-sans">
              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Primary Guest</span>
                <span className="font-serif text-base font-bold text-gray-900">{activeBooking.guestName}</span>
                <span className="block text-xs text-gray-500 font-mono mt-0.5">{activeBooking.guestPhone} • {activeBooking.guestEmail}</span>
              </div>

              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Destination & Suite</span>
                <span className="font-semibold text-gray-900 uppercase tracking-wider text-[#B85A32] block">{displayDestName}</span>
                <span className="text-xs text-gray-600">{displayRoomName}</span>
              </div>

              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Check-In Arrival (14:00)</span>
                <span className="font-mono font-semibold text-gray-900">{activeBooking.checkIn}</span>
              </div>

              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Check-Out Departure (11:00)</span>
                <span className="font-mono font-semibold text-gray-900">{activeBooking.checkOut}</span>
              </div>

              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Travelers</span>
                <span className="font-semibold text-gray-900">{activeBooking.guestsCount} Guest(s)</span>
              </div>

              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Payment Method</span>
                <span className="font-semibold text-gray-900">{paymentMethodTitles[activeBooking.paymentMethod || "pay_at_property"] || activeBooking.paymentMethod}</span>
              </div>

              {activeBooking.specialRequests && (
                <div className="sm:col-span-2 bg-[#FAF8F5] p-3 rounded-xl border border-gray-100">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Special Requests</span>
                  <span className="text-xs text-gray-700 italic">"{activeBooking.specialRequests}"</span>
                </div>
              )}

              <div className="sm:col-span-2 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-baseline gap-3">
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Payment Status</span>
                  <span className={`font-sans text-xs font-bold px-2.5 py-1 rounded-md ${
                    activeBooking.paymentStatus === "paid" 
                      ? "text-emerald-800 bg-emerald-100/80" 
                      : activeBooking.paymentStatus === "partial_paid"
                      ? "text-amber-800 bg-amber-100/80"
                      : "text-blue-800 bg-blue-100/80"
                  }`}>
                    {activeBooking.paymentStatus === "paid" ? "PAID IN FULL" : activeBooking.paymentStatus === "partial_paid" ? "PARTIAL DEPOSIT PAID" : "PAY AT PROPERTY UPON CHECK-IN"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Total Amount</span>
                  <span className="font-serif text-2xl font-bold text-[#B85A32]">{formatPrice(finalTotalPrice, currency)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                if (onBookingComplete) onBookingComplete(activeBooking);
                if (onNavigateHome) onNavigateHome();
              }}
              className="bg-[#1C352D] hover:bg-[#B85A32] text-white px-8 py-3.5 rounded-full font-sans text-xs uppercase tracking-widest font-bold transition-all shadow-lg cursor-pointer"
            >
              Done & Return Home
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="border border-gray-300 text-gray-700 hover:text-[#1C352D] hover:bg-gray-100 px-7 py-3.5 rounded-full font-sans text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer size={15} />
              <span>Print Voucher</span>
            </button>
          </div>

          {/* SIMULATED EMAIL PREVIEW MODAL */}
          {showEmailModal && activeBooking.confirmationEmail && (
            <div
              onClick={() => setShowEmailModal(false)}
              className="fixed inset-0 z-[400] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 animate-fade-in text-left"
              >
                <div className="bg-[#1C352D] text-white p-4 px-6 flex justify-between items-center border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <Mail size={18} className="text-[#C5A059]" />
                    <span className="font-serif font-bold text-sm tracking-wide">Official Booking Email Voucher</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEmailModal(false)}
                    className="text-gray-300 hover:text-white p-1 rounded transition cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="bg-gray-50 p-4 px-6 border-b border-gray-200 text-xs font-sans space-y-1.5">
                  <div className="flex gap-2">
                    <span className="text-gray-400 font-bold w-16">Subject:</span>
                    <span className="font-semibold text-gray-900">{activeBooking.confirmationEmail.subject}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 font-bold w-16">From:</span>
                    <span className="text-gray-700">Satrangi Homestay &lt;reservations@satrangihomestay.com&gt;</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 font-bold w-16">To:</span>
                    <span className="text-gray-900 font-medium">{activeBooking.confirmationEmail.to}</span>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1 bg-[#FAF8F5]">
                  <div
                    className="prose prose-sm max-w-none rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white"
                    dangerouslySetInnerHTML={{ __html: activeBooking.confirmationEmail.bodyHtml }}
                  />
                </div>

                <div className="p-4 px-6 bg-white border-t border-gray-200 flex justify-between items-center text-xs font-sans">
                  <span className="text-gray-500 italic">
                    Official booking confirmation voucher
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowEmailModal(false)}
                    className="bg-[#1C352D] hover:bg-[#B85A32] text-white px-5 py-2.5 rounded-full font-semibold uppercase tracking-wider text-[11px] transition shadow cursor-pointer"
                  >
                    Close Voucher
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
