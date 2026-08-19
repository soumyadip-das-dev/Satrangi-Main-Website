import { useState, useEffect } from "react";
import { Check, Calendar, Users, MapPin, CreditCard, ChevronRight, ShieldCheck, Mail, Phone, Info, Send, Eye, X, CheckCircle2, RefreshCw } from "lucide-react";
import { Destination, Room, Booking, SentEmail } from "../types";
import { Currency, formatPrice } from "../utils/currency";

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

interface BookingProps {
  destinations?: Destination[];
  rooms?: Room[];
  bookings?: Booking[];
  currency?: Currency;
  initialDestId?: string;
  initialDestinationId?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  onBookingComplete?: () => void;
  onNavigateHome?: () => void;
}

export default function BookingFlow({ 
  initialDestId,
  initialDestinationId, 
  initialCheckIn, 
  initialCheckOut, 
  onBookingComplete, 
  onNavigateHome,
  currency = "INR"
}: BookingProps) {
  const effectiveDestId = initialDestId || initialDestinationId;
  const [step, setStep] = useState<number>(1);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookingsList, setBookingsList] = useState<any[]>([]);
  
  // Form selections state
  const [selectedDestination, setSelectedDestination] = useState<string>(effectiveDestId || "lamahatta");
  const [checkIn, setCheckIn] = useState<string>(initialCheckIn || "2026-06-25");
  const [checkOut, setCheckOut] = useState<string>(initialCheckOut || "2026-06-28");
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  
  // Guest personal state
  const [guestName, setGuestName] = useState<string>("");
  const [guestEmail, setGuestEmail] = useState<string>("");
  const [guestPhone, setGuestPhone] = useState<string>("");
  
  // Submission outcome state
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [currentSentEmail, setCurrentSentEmail] = useState<SentEmail | null>(null);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [resendingEmail, setResendingEmail] = useState<boolean>(false);
  const [emailStatusMsg, setEmailStatusMsg] = useState<string | null>(null);

  // Load destinations & live bookings
  useEffect(() => {
    Promise.all([
      fetch("/api/destinations").then(res => res.json()),
      fetch("/api/bookings").then(res => res.json())
    ])
    .then(([dests, bookingsData]) => {
      setDestinations(dests);
      setBookingsList(bookingsData || []);
    })
    .catch((e) => console.error("Error loading destinations and live bookings", e));
  }, []);

  useEffect(() => {
    if (selectedDestination) {
      fetch(`/api/rooms?destinationId=${selectedDestination}`)
        .then((res) => res.json())
        .then((data) => {
          setRooms(data);
          // Auto select first available room if not set
          const firstAvailable = data.find((r: Room) => isRoomAvailable(r.id, checkIn, checkOut, bookingsList));
          if (firstAvailable) {
            setSelectedRoom(firstAvailable);
          } else if (data.length > 0) {
            setSelectedRoom(data[0]);
          } else {
            setSelectedRoom(null);
          }
        })
        .catch((e) => console.error("Error loading destination rooms", e));
    }
  }, [selectedDestination, bookingsList, checkIn, checkOut]);

  // Handle step increments with local validation
  const goToStep = (targetStep: number) => {
    setErrorMsg(null);
    if (targetStep === 3) {
      // Validate dates
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
    if (targetStep === 5) {
      // Validate guest details
      if (!guestName.trim() || !guestEmail.trim() || !guestPhone.trim()) {
        setErrorMsg("Please complete all personal and contact coordinate fields.");
        return;
      }
      if (!guestEmail.includes("@")) {
        setErrorMsg("Please enter a valid email address.");
        return;
      }
    }
    setStep(targetStep);
  };

  // Submit Reservation
  const handleCreateBooking = () => {
    if (!selectedRoom) return;
    setLoading(true);
    setErrorMsg(null);

    const payload = {
      destinationId: selectedDestination,
      roomId: selectedRoom.id,
      checkIn,
      checkOut,
      guestsCount,
      guestName,
      guestEmail,
      guestPhone
    };

    fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Room availability overlap. Selected dates are blocked.");
        }
        return data;
      })
      .then((booking: Booking) => {
        setConfirmedBooking(booking);
        if (booking.confirmationEmail) {
          setCurrentSentEmail(booking.confirmationEmail);
        }
        setStep(7); // Jump straight to confirmation
        if (onBookingComplete) onBookingComplete();
      })
      .catch((e) => {
        setErrorMsg(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Re-send simulated booking email
  const handleResendEmail = () => {
    if (!confirmedBooking) return;
    setResendingEmail(true);
    setEmailStatusMsg(null);

    fetch("/api/send-confirmation-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: confirmedBooking.id })
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to dispatch email.");
        return data;
      })
      .then((data) => {
        if (data.confirmationEmail) {
          setCurrentSentEmail(data.confirmationEmail);
        }
        setEmailStatusMsg(`Simulated confirmation email dispatched to ${confirmedBooking.guestEmail}!`);
      })
      .catch((e) => {
        setEmailStatusMsg(`Failed: ${e.message}`);
      })
      .finally(() => {
        setResendingEmail(false);
      });
  };

  // Compute calculated values
  const getNightsCount = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
  };

  const currentDestinationObj = destinations.find((d) => d.id === selectedDestination);
  const totalNights = getNightsCount();
  const totalPrice = selectedRoom ? selectedRoom.pricePerNight * totalNights : 0;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {/* Editorial Progress Bar */}
      {step < 7 && (
        <div className="mb-12">
          <div className="flex justify-between text-[10px] font-sans uppercase tracking-[0.2em] text-gray-500 mb-3 font-semibold">
            <span className={step >= 1 ? "text-[#B85A32] font-bold" : ""}>01. Destination</span>
            <span className={step >= 3 ? "text-[#B85A32] font-bold" : ""}>02. Suite</span>
            <span className={step >= 5 ? "text-[#B85A32] font-bold" : ""}>03. Guest Details</span>
            <span className={step >= 6 ? "text-[#B85A32] font-bold" : ""}>04. Confirmation</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-[#B85A32] transition-all duration-500 rounded-full"
              style={{ width: `${((step - 1) / 5) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Error Hub */}
      {errorMsg && (
        <div className="mb-8 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-800 text-sm flex items-center gap-3 rounded-r-lg">
          <Info size={18} className="shrink-0 text-rose-600" />
          <span className="font-sans font-medium">{errorMsg}</span>
        </div>
      )}

      {/* STEP 1 & 2: Escape and Date details */}
      {step === 1 && (
        <div className="animate-fade-in">
          <span className="text-xs uppercase tracking-[0.3em] text-[#B85A32] font-bold block mb-2">
            Direct Reservations
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C352D] mb-8 italic">
            Where shall we welcome you?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {destinations.map((dest) => (
              <button
                key={dest.id}
                onClick={() => setSelectedDestination(dest.id)}
                className={`p-6 border text-left cursor-pointer transition-all rounded-2xl ${
                  selectedDestination === dest.id
                    ? "border-[#B85A32] bg-white shadow-xl ring-2 ring-[#B85A32]/20"
                    : "border-gray-200 bg-white/70 hover:border-gray-300 hover:bg-white"
                }`}
              >
                <MapPin size={20} className={selectedDestination === dest.id ? "text-[#B85A32]" : "text-gray-400"} />
                <h3 className="font-serif text-xl font-bold text-[#1C352D] mt-4 mb-1">
                  {dest.name}
                </h3>
                <p className="text-[10px] text-[#B85A32] uppercase font-bold tracking-widest mb-3">
                  {dest.theme}
                </p>
                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                  {dest.tagline}
                </p>
              </button>
            ))}
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-md grid grid-cols-1 sm:grid-cols-3 gap-6 items-end mb-8">
            <div>
              <label className="block text-[10px] font-sans uppercase tracking-widest text-gray-600 mb-2 font-bold">
                Check-In Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#B85A32] focus:bg-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-sans uppercase tracking-widest text-gray-600 mb-2 font-bold">
                Check-Out Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#B85A32] focus:bg-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-sans uppercase tracking-widest text-gray-600 mb-2 font-bold">
                Total Travel Guests
              </label>
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#B85A32] focus:bg-white font-medium"
              >
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests (Recommended)</option>
                <option value={3}>3 Guests</option>
                <option value={4}>4 Guests</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => goToStep(3)}
              className="bg-[#1C352D] hover:bg-[#B85A32] text-white px-10 py-4 rounded-full font-sans text-xs uppercase tracking-widest font-bold flex items-center gap-3 transition-all shadow-lg hover:shadow-xl"
            >
              Search Available Suites
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Available Rooms Page */}
      {step === 3 && (
        <div className="animate-fade-in">
          <div className="flex justify-between items-baseline mb-8">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#B85A32] font-bold block mb-1">
                Step 02 of 04
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1C352D] italic">
                Choose Available Suite
              </h2>
            </div>
            <button
              onClick={() => goToStep(1)}
              className="text-xs font-sans text-[#B85A32] hover:underline font-semibold"
            >
              Modify Search
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8 mb-12">
            {rooms.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-300 rounded-2xl bg-white">
                <p className="text-sm text-gray-500 font-sans">
                  No rooms loaded yet for this destination. Try switching destinations.
                </p>
              </div>
            ) : (
              rooms.map((room) => {
                const isChosen = selectedRoom?.id === room.id;
                const isAvailable = isRoomAvailable(room.id, checkIn, checkOut, bookingsList);
                return (
                  <div
                    key={room.id}
                    onClick={() => {
                      if (isAvailable) {
                        setSelectedRoom(room);
                      }
                    }}
                    className={`flex flex-col md:flex-row border rounded-2xl overflow-hidden transition-all ${
                      !isAvailable
                        ? "opacity-60 border-rose-200 bg-rose-50/20 cursor-not-allowed"
                        : isChosen
                        ? "border-[#B85A32] ring-2 ring-[#B85A32]/30 bg-white shadow-xl cursor-pointer"
                        : "border-gray-200/80 hover:border-gray-300 bg-white cursor-pointer hover:shadow-md"
                    }`}
                  >
                    <div className="w-full md:w-2/5 aspect-video md:aspect-auto relative">
                      <img
                        src={room.imageUrls[0]}
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-full md:w-3/5 p-6 sm:p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-serif text-2xl font-bold text-[#1C352D]">
                            {room.name}
                          </h3>
                          <div className="text-right">
                            <span className="font-serif text-xl font-bold text-[#B85A32]">
                              {formatPrice(room.pricePerNight, currency)}
                            </span>
                            <span className="text-[10px] text-gray-400 font-sans block">/ night</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-4 font-semibold">
                          {room.type} • {room.sqft} SQFT • Max {room.capacity} Guests
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed mb-6">
                          {room.description}
                        </p>
                        
                        {/* Amenities badges */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {room.amenities.map((amenity) => (
                            <span
                              key={amenity}
                              className="px-2.5 py-1 bg-gray-100/80 text-[10px] font-sans text-gray-700 rounded-full font-medium"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <span className="text-xs font-sans text-gray-600">
                          {!isAvailable ? "🔴 Dates Overlapped" : "🟢 Instant Direct Booking"}
                        </span>
                        <div className="flex items-center gap-3">
                          {!isAvailable ? (
                            <span className="px-3 py-1.5 bg-rose-50 text-rose-700 text-[10px] font-sans font-bold uppercase tracking-wider rounded-full border border-rose-200">
                              Unavailable
                            </span>
                          ) : isChosen ? (
                            <span className="px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 rounded-full border border-emerald-200">
                              <Check size={14} /> Selected
                            </span>
                          ) : (
                            <span className="text-xs font-sans text-[#B85A32] font-bold group-hover:underline">
                              Select Suite Option
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => goToStep(1)}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-sans text-xs uppercase tracking-widest font-bold transition-colors hover:bg-gray-100"
            >
              Previous Step
            </button>
            <button
              disabled={!selectedRoom}
              onClick={() => goToStep(4)}
              className="bg-[#1C352D] disabled:bg-gray-300 hover:bg-[#B85A32] text-white px-10 py-4 rounded-full font-sans text-xs uppercase tracking-widest font-bold flex items-center gap-3 transition-all shadow-lg"
            >
              Continue to Details
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Guest Details */}
      {step === 4 && (
        <div className="animate-fade-in">
          <span className="text-xs uppercase tracking-[0.3em] text-[#B85A32] font-bold block mb-1">
            Step 03 of 04
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C352D] italic mb-8">
            Guest Personal Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white border border-gray-200/80 rounded-2xl p-8 shadow-md space-y-6">
                <div>
                  <label className="block text-[10px] font-sans uppercase tracking-widest text-gray-600 mb-2 font-bold">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-sans uppercase tracking-widest text-gray-600 mb-2 font-bold">
                      Email Address *
                    </label>
                    <div className="relative">
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
                    <label className="block text-[10px] font-sans uppercase tracking-widest text-gray-600 mb-2 font-bold">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="+91 91234 56789"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B85A32] focus:bg-white font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Invoice Calculation summary */}
            <div className="md:col-span-1 bg-white border border-gray-200/80 rounded-2xl p-6 shadow-md flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#1C352D] mb-4 pb-3 border-b border-gray-100">
                  Reservation Summary
                </h3>
                <div className="space-y-3.5 text-xs font-sans text-gray-600">
                  <div className="flex justify-between">
                    <span>Destination:</span>
                    <span className="font-semibold text-gray-900 capitalize">{currentDestinationObj?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Suite:</span>
                    <span className="font-semibold text-gray-900 line-clamp-1 text-right">{selectedRoom?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nights Count:</span>
                    <span className="font-semibold text-gray-900">{totalNights} night(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests count:</span>
                    <span className="font-semibold text-gray-900">{guestsCount} adult(s)</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex justify-between font-serif text-lg font-bold text-[#B85A32]">
                    <span>Total Amount:</span>
                    <span>{formatPrice(totalPrice, currency)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-[11px] text-gray-500 font-sans flex items-start gap-2 bg-gray-50 p-3 rounded-xl">
                <ShieldCheck size={16} className="text-[#B85A32] shrink-0" />
                <span>Includes direct booking guarantee & complimentary breakfast.</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => goToStep(3)}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-sans text-xs uppercase tracking-widest font-bold transition-colors hover:bg-gray-100"
            >
              Back to Selection
            </button>
            <button
              onClick={() => goToStep(5)}
              className="bg-[#1C352D] hover:bg-[#B85A32] text-white px-10 py-4 rounded-full font-sans text-xs uppercase tracking-widest font-bold flex items-center gap-3 transition-all shadow-lg"
            >
              Review Details
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Review Booking details */}
      {step === 5 && (
        <div className="animate-fade-in text-left">
          <span className="text-xs uppercase tracking-[0.3em] text-[#B85A32] font-bold block mb-1">
            Step 04 of 04
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C352D] italic mb-8">
            Verify Reservation Details
          </h2>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-8 shadow-md space-y-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 text-sm font-sans text-gray-600">
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-[#B85A32] font-bold mb-1">Primary Guest</dt>
                <dd className="font-serif text-lg font-bold text-gray-900">{guestName}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-[#B85A32] font-bold mb-1">Destination Retreat</dt>
                <dd className="text-base text-gray-900 font-semibold uppercase tracking-wider">{currentDestinationObj?.name}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-[#B85A32] font-bold mb-1">Check-in Date (14:00)</dt>
                <dd className="text-base font-semibold text-gray-900">{checkIn}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-[#B85A32] font-bold mb-1">Check-out Date (11:00)</dt>
                <dd className="text-base font-semibold text-gray-900">{checkOut}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-[#B85A32] font-bold mb-1">Selected Sanctuary</dt>
                <dd className="font-serif text-base text-gray-900">{selectedRoom?.name} ({selectedRoom?.type})</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-[#B85A32] font-bold mb-1">Billing Summary</dt>
                <dd className="text-xl font-serif font-bold text-[#B85A32]">
                  {formatPrice(totalPrice, currency)} <span className="text-[11px] font-sans text-gray-400 font-normal">({totalNights} night(s))</span>
                </dd>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80 flex items-center gap-4">
              <Mail size={18} className="text-[#B85A32]" />
              <div className="text-xs text-gray-600 font-sans">
                <span className="font-semibold text-gray-900">Digital Stay Pass & Confirmation:</span> Will be sent to <strong className="text-gray-900">{guestEmail}</strong>. SMS updates sent to <strong className="text-gray-900">{guestPhone}</strong>.
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => goToStep(4)}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-sans text-xs uppercase tracking-widest font-bold transition-colors hover:bg-gray-100"
            >
              Previous Step
            </button>
            <button
              onClick={() => goToStep(6)}
              className="bg-[#1C352D] hover:bg-[#B85A32] text-white px-10 py-4 rounded-full font-sans text-xs uppercase tracking-widest font-bold flex items-center gap-3 transition-all shadow-lg"
            >
              Proceed to Deposit
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: Simulated Payment */}
      {step === 6 && (
        <div className="animate-fade-in max-w-md mx-auto bg-white border border-gray-200/80 rounded-2xl p-8 shadow-xl">
          <h2 className="font-serif text-2xl text-[#1C352D] font-bold text-center mb-1">
            Satrangi Deposit Terminal
          </h2>
          <p className="text-xs text-gray-500 text-center uppercase tracking-widest mb-6 font-semibold">
            Secure Direct Payment
          </p>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between font-sans mb-6">
            <span className="text-xs text-gray-600 font-medium">Prepayment Deposit Due:</span>
            <span className="font-serif text-xl font-bold text-[#B85A32]">{formatPrice(totalPrice, currency)}</span>
          </div>

          <div className="space-y-4 font-sans text-left">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-1">Cardholder Name</label>
              <input
                type="text"
                defaultValue={guestName}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#B85A32] font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-1">Mock Credit Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={19}
                  placeholder="4111 •••• •••• 9821"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#B85A32] font-medium"
                />
                <CreditCard size={18} className="absolute right-3.5 top-3 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-1">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-1">CVV Code</label>
                <input
                  type="password"
                  placeholder="•••"
                  maxLength={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={handleCreateBooking}
              disabled={loading}
              className="w-full bg-[#B85A32] hover:bg-[#1C352D] text-white py-4 rounded-full text-xs font-sans uppercase tracking-widest font-bold transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? "Confirming Booking..." : `Authorize Deposit Prepayment`}
            </button>
            <button
              onClick={() => goToStep(5)}
              className="w-full bg-transparent text-gray-500 hover:text-gray-900 py-2.5 text-[11px] font-sans uppercase tracking-widest font-bold"
            >
              Cancel Payment Session
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: GORGEOUS SUCCESS CONFIRMATION SLIP */}
      {step === 7 && confirmedBooking && (
        <div className="animate-fade-in text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mb-6">
            <ShieldCheck size={36} />
          </div>

          <span className="text-xs uppercase tracking-[0.3em] text-emerald-700 font-bold block mb-2">
            Direct Booking Confirmed
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C352D] mb-4 italic">
            Your Bengal Story Awaits
          </h2>
          <p className="text-gray-600 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Congratulations! Your private sanctuary has been logged under direct rates. Details have been dispatched.
          </p>

          {/* SIMULATED EMAIL CONFIRMATION DISPATCH BANNER */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-8 text-left shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-full mt-0.5 shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-bold text-[#1C352D] text-base">
                      Simulated Confirmation Sent
                    </h4>
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      <CheckCircle2 size={10} /> Dispatched
                    </span>
                  </div>
                  <p className="text-xs text-emerald-900 mt-1 font-sans">
                    A confirmation voucher was sent to <strong className="font-mono">{confirmedBooking.guestEmail}</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="bg-[#1C352D] hover:bg-[#B85A32] text-white px-4 py-2 rounded-full text-xs font-sans uppercase tracking-wider font-bold flex items-center gap-2 transition"
                >
                  <Eye size={13} /> View Voucher
                </button>
                <button
                  onClick={handleResendEmail}
                  disabled={resendingEmail}
                  className="bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 px-3 py-2 rounded-full text-xs font-sans font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  <RefreshCw size={12} className={resendingEmail ? "animate-spin" : ""} />
                  {resendingEmail ? "Sending..." : "Resend"}
                </button>
              </div>
            </div>

            {emailStatusMsg && (
              <div className="mt-3 text-xs font-semibold text-emerald-800 pt-2 border-t border-emerald-200/60 flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-emerald-600" /> {emailStatusMsg}
              </div>
            )}
          </div>

          {/* Printable Ticket Coupon Layout */}
          <div className="bg-white border border-gray-200/80 text-left rounded-2xl overflow-hidden shadow-xl mb-10">
            <div className="bg-[#1C352D] text-white p-6 flex justify-between items-baseline">
              <div>
                <h3 className="font-serif text-lg font-bold">SATRANGI RESERVATION VOUCHER</h3>
                <p className="text-[10px] uppercase opacity-70 tracking-widest mt-1">Luxury Eco-Retreats Bengal</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs block opacity-60">Voucher Order No:</span>
                <span className="font-mono text-sm font-semibold tracking-wider text-[#C5A059]">{confirmedBooking.id}</span>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 text-sm font-sans">
              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Primary Guest Name</span>
                <span className="font-serif text-base font-bold text-gray-900">{confirmedBooking.guestName}</span>
              </div>

              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Location Destination</span>
                <span className="font-semibold text-gray-900 uppercase tracking-widest text-[#B85A32]">{currentDestinationObj?.name}</span>
              </div>

              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Selected Suite Option</span>
                <span className="font-semibold text-gray-900">{selectedRoom?.name}</span>
              </div>

              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Travelers Capacity</span>
                <span className="font-semibold text-gray-900">{confirmedBooking.guestsCount} Adult(s)</span>
              </div>

              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Check-In Arrival (14:00)</span>
                <span className="font-mono font-semibold text-gray-900">{confirmedBooking.checkIn}</span>
              </div>

              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Check-Out Departure (11:00)</span>
                <span className="font-mono font-semibold text-gray-900">{confirmedBooking.checkOut}</span>
              </div>

              <div className="sm:col-span-2 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-baseline gap-4">
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Payment Verification ID</span>
                  <span className="font-mono text-xs text-gray-600 font-medium">{confirmedBooking.paymentId || "simulated_card_pay"}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Total Bill Paid</span>
                  <span className="font-serif text-2xl font-bold text-[#B85A32]">{formatPrice(confirmedBooking.totalPrice, currency)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                if (onNavigateHome) onNavigateHome();
              }}
              className="bg-[#1C352D] hover:bg-[#B85A32] text-white px-8 py-3.5 rounded-full font-sans text-xs uppercase tracking-widest font-bold transition-all shadow-lg"
            >
              Return to Homepage
            </button>
            <button
              onClick={() => window.print()}
              className="border border-gray-300 text-gray-700 hover:text-[#1C352D] hover:bg-gray-100 px-8 py-3.5 rounded-full font-sans text-xs uppercase tracking-widest font-bold transition-all"
            >
              Print Receipt Voucher
            </button>
          </div>

          {/* SIMULATED EMAIL PREVIEW MODAL */}
          {showEmailModal && currentSentEmail && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 animate-fade-in text-left">
                {/* Email Client Top Bar */}
                <div className="bg-[#1C352D] text-white p-4 px-6 flex justify-between items-center border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <Mail size={18} className="text-[#C5A059]" />
                    <span className="font-serif font-bold text-sm tracking-wide">Simulated Email Client</span>
                  </div>
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="text-gray-300 hover:text-white p-1 rounded transition"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Email Metadata Header */}
                <div className="bg-gray-50 p-4 px-6 border-b border-gray-200 text-xs font-sans space-y-1.5">
                  <div className="flex gap-2">
                    <span className="text-gray-400 font-bold w-16">Subject:</span>
                    <span className="font-semibold text-gray-900">{currentSentEmail.subject}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 font-bold w-16">From:</span>
                    <span className="text-gray-700">Satrangi Homestay &lt;reservations@satrangihomestay.com&gt;</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 font-bold w-16">To:</span>
                    <span className="text-gray-900 font-medium">{currentSentEmail.to}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 font-bold w-16">Sent At:</span>
                    <span className="text-gray-500 font-mono">{new Date(currentSentEmail.sentAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Email Body Content */}
                <div className="p-6 overflow-y-auto flex-1 bg-[#FAF8F5]">
                  <div
                    className="prose prose-sm max-w-none rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white"
                    dangerouslySetInnerHTML={{ __html: currentSentEmail.bodyHtml }}
                  />
                </div>

                {/* Email Modal Footer */}
                <div className="p-4 px-6 bg-white border-t border-gray-200 flex justify-between items-center text-xs font-sans">
                  <span className="text-gray-500 italic">
                    Simulated voucher sent upon reservation completion.
                  </span>
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="bg-[#1C352D] hover:bg-[#B85A32] text-white px-5 py-2.5 rounded-full font-semibold uppercase tracking-wider text-[11px] transition shadow"
                  >
                    Close Preview
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
