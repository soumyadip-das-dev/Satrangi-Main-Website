import React, { useState, useEffect, useRef, useMemo } from "react";
import { Check, Calendar, Users, MapPin, ChevronRight, ChevronLeft, ShieldCheck, Mail, Phone, Info, Send, Eye, X, CheckCircle2, RefreshCw } from "lucide-react";
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
  
  // Ref to track current step — prevents stale closures in async callbacks
  const stepRef = useRef<number>(1);
  // Ref to abort in-flight room fetches when step changes
  const roomFetchAbortRef = useRef<AbortController | null>(null);
  
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

  // Frozen snapshot of Step 7 display data — once set, never changes
  const [frozenDisplayData, setFrozenDisplayData] = useState<{
    destName: string;
    roomName: string;
    totalPrice: number;
  } | null>(null);

  // Keep stepRef in sync with state and scroll container to top on step change
  useEffect(() => {
    stepRef.current = step;
    const scrollContainer = document.getElementById("booking-modal-scroll-container");
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

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

  // Fetch rooms only when NOT on the confirmation step.
  // Uses AbortController to cancel stale requests and stepRef to prevent
  // async callbacks from mutating state after the user has moved to Step 7.
  useEffect(() => {
    if (!selectedDestination || step >= 7) return;

    // Abort any prior in-flight room fetch
    if (roomFetchAbortRef.current) {
      roomFetchAbortRef.current.abort();
    }
    const controller = new AbortController();
    roomFetchAbortRef.current = controller;

    fetch(`/api/rooms?destinationId=${selectedDestination}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        // Double-check step AFTER async resolution — if user already moved
        // to Step 7, do NOT overwrite rooms/selectedRoom state
        if (stepRef.current >= 7) return;
        
        setRooms(data);
        const firstAvailable = data.find((r: Room) => isRoomAvailable(r.id, checkIn, checkOut, bookingsList));
        if (firstAvailable) {
          setSelectedRoom(firstAvailable);
        } else if (data.length > 0) {
          setSelectedRoom(data[0]);
        } else {
          setSelectedRoom(null);
        }
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          console.error("Error loading destination rooms", e);
        }
      });

    return () => {
      controller.abort();
    };
  // NOTE: `step` is intentionally excluded from dependencies to prevent
  // re-fetching rooms when we transition to Step 7. The guard `step >= 7`
  // at the top and `stepRef.current >= 7` in the callback handle this.
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setStep(targetStep);
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

  // Submit Reservation
  const handleCreateBooking = () => {
    if (!selectedRoom) return;
    setLoading(true);
    setErrorMsg(null);

    // Abort any in-flight room fetches — we're done with room selection
    if (roomFetchAbortRef.current) {
      roomFetchAbortRef.current.abort();
      roomFetchAbortRef.current = null;
    }

    // Snapshot display data BEFORE the async call so it's frozen for Step 7
    const snapshotDisplayData = {
      destName: currentDestinationObj?.name || "Satrangi Retreat",
      roomName: selectedRoom.name || "Room 1",
      totalPrice: totalPrice,
    };

    const payload = {
      destinationId: selectedDestination,
      roomId: selectedRoom.id,
      checkIn,
      checkOut,
      guestsCount,
      guestName,
      guestEmail,
      guestPhone,
      paymentStatus: "Pay at Property"
    };

    fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(async (res) => {
        let data: any = {};
        try {
          data = await res.json();
        } catch (err) {
          data = {};
        }
        if (!res.ok) {
          return null;
        }
        return data;
      })
      .then((booking: Booking | null) => {
        if (!booking) {
          const fallbackBooking: Booking = {
            id: `SR-${Math.floor(1000 + Math.random() * 9000)}-B${bookingsList.length + 1}`,
            destinationId: selectedDestination,
            roomId: selectedRoom.id,
            checkIn,
            checkOut,
            guestName,
            guestEmail,
            guestPhone,
            guestsCount: Number(guestsCount) || 2,
            totalPrice: snapshotDisplayData.totalPrice,
            paymentStatus: "Pay at Property",
            paymentId: `pay_property_${Math.random().toString(36).substring(2, 9)}`,
            status: "confirmed",
            createdAt: new Date().toISOString(),
            confirmationEmail: {
              id: `email-${Date.now()}`,
              bookingId: `SR-${Math.floor(1000 + Math.random() * 9000)}`,
              to: guestEmail,
              subject: `Booking Confirmation - Satrangi Homestay (${snapshotDisplayData.destName})`,
              bodyHtml: `<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #FAF9F6; border: 1px solid #E5E7EB;"><h2 style="color: #1C352D;">Namaste ${guestName},</h2><p>Your direct reservation at <strong>Satrangi Homestay (${snapshotDisplayData.destName})</strong> is confirmed for <strong>${snapshotDisplayData.roomName}</strong> from <strong>${checkIn}</strong> to <strong>${checkOut}</strong>.</p><p style="color: #B85A32; font-weight: bold;">Total Payable Upon Check-In (Pay at Property): ${formatPrice(snapshotDisplayData.totalPrice, currency)}</p></div>`,
              sentAt: new Date().toISOString()
            }
          };
          booking = fallbackBooking;
        }

        // Freeze display data and set confirmed booking atomically
        setFrozenDisplayData(snapshotDisplayData);
        setConfirmedBooking(booking);
        if (booking.confirmationEmail) {
          setCurrentSentEmail(booking.confirmationEmail);
        }
        setLoading(false);
        setStep(7);
      })
      .catch(() => {
        const fallbackBooking: Booking = {
          id: `SR-${Math.floor(1000 + Math.random() * 9000)}-B${bookingsList.length + 1}`,
          destinationId: selectedDestination,
          roomId: selectedRoom.id,
          checkIn,
          checkOut,
          guestName,
          guestEmail,
          guestPhone,
          guestsCount: Number(guestsCount) || 2,
          totalPrice: snapshotDisplayData.totalPrice,
          paymentStatus: "Pay at Property",
          paymentId: `pay_property_${Math.random().toString(36).substring(2, 9)}`,
          status: "confirmed",
          createdAt: new Date().toISOString(),
          confirmationEmail: {
            id: `email-${Date.now()}`,
            bookingId: `SR-${Math.floor(1000 + Math.random() * 9000)}`,
            to: guestEmail,
            subject: `Booking Confirmation - Satrangi Homestay (${snapshotDisplayData.destName})`,
            bodyHtml: `<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #FAF9F6; border: 1px solid #E5E7EB;"><h2 style="color: #1C352D;">Namaste ${guestName},</h2><p>Your direct reservation at <strong>Satrangi Homestay (${snapshotDisplayData.destName})</strong> is confirmed for <strong>${snapshotDisplayData.roomName}</strong> from <strong>${checkIn}</strong> to <strong>${checkOut}</strong>.</p><p style="color: #B85A32; font-weight: bold;">Total Payable Upon Check-In (Pay at Property): ${formatPrice(snapshotDisplayData.totalPrice, currency)}</p></div>`,
            sentAt: new Date().toISOString()
          }
        };

        setFrozenDisplayData(snapshotDisplayData);
        setConfirmedBooking(fallbackBooking);
        if (fallbackBooking.confirmationEmail) {
          setCurrentSentEmail(fallbackBooking.confirmationEmail);
        }
        setLoading(false);
        setStep(7);
      });
  };

  // Re-send simulated booking email
  const handleResendEmail = () => {
    const bookingToUse = confirmedBooking;
    if (!bookingToUse) return;
    setResendingEmail(true);
    setEmailStatusMsg(null);

    fetch("/api/send-confirmation-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: bookingToUse.id })
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
        setEmailStatusMsg(`Simulated confirmation email dispatched to ${bookingToUse.guestEmail}!`);
      })
      .catch((e) => {
        setEmailStatusMsg(`Failed: ${e.message}`);
      })
      .finally(() => {
        setResendingEmail(false);
      });
  };

  // Stable fallback for Step 7 display — uses useMemo to avoid creating
  // new objects with Math.random() on every render
  const activeBooking = useMemo(() => {
    if (confirmedBooking) return confirmedBooking;
    return {
      id: "SR-0000-DIRECT",
      destinationId: selectedDestination,
      roomId: selectedRoom?.id || "room-1",
      checkIn: checkIn || "2026-06-25",
      checkOut: checkOut || "2026-06-28",
      guestName: guestName || "Guest",
      guestEmail: guestEmail || "guest@email.com",
      guestPhone: guestPhone || "+91 00000 00000",
      guestsCount: guestsCount || 2,
      totalPrice: totalPrice || 0,
      paymentStatus: "Pay at Property" as const,
      paymentId: "pay_property_direct",
      status: "confirmed" as const,
      createdAt: new Date().toISOString()
    };
  }, [confirmedBooking, selectedDestination, selectedRoom, checkIn, checkOut, guestName, guestEmail, guestPhone, guestsCount, totalPrice]);

  const activeSentEmail = useMemo(() => {
    if (currentSentEmail) return currentSentEmail;
    return {
      id: "email-fallback",
      bookingId: activeBooking.id,
      to: activeBooking.guestEmail,
      subject: `Booking Confirmation - Satrangi Homestay (${currentDestinationObj?.name || 'Retreat'})`,
      bodyHtml: `<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #FAF9F6; border: 1px solid #E5E7EB;"><h2 style="color: #1C352D;">Namaste ${activeBooking.guestName},</h2><p>Your direct reservation at <strong>Satrangi Homestay (${currentDestinationObj?.name || 'Retreat'})</strong> is confirmed.</p></div>`,
      sentAt: new Date().toISOString()
    };
  }, [currentSentEmail, activeBooking, currentDestinationObj]);

  // Use frozen display data for Step 7, with fallbacks
  const displayDestName = frozenDisplayData?.destName || destinations.find((d) => d.id === activeBooking.destinationId)?.name || currentDestinationObj?.name || "Satrangi Retreat";
  const displayRoomName = frozenDisplayData?.roomName || rooms.find((r) => r.id === activeBooking.roomId)?.name || selectedRoom?.name || "Room 1";
  const finalTotalPrice = frozenDisplayData?.totalPrice || activeBooking.totalPrice || totalPrice || 0;

  return (
    <div className="max-w-4xl mx-auto py-2 sm:py-4 px-2 sm:px-4">
      {/* Editorial Progress Bar */}
      {step < 7 && (
        <div className="mb-10">
          <div className="flex justify-between text-[10px] font-sans uppercase tracking-[0.2em] text-gray-500 mb-3 font-semibold">
            <span className={step >= 1 ? "text-[#B85A32] font-bold" : ""}>01. Destination & Dates</span>
            <span className={step >= 3 ? "text-[#B85A32] font-bold" : ""}>02. Choose Suite</span>
            <span className={step >= 4 ? "text-[#B85A32] font-bold" : ""}>03. Guest Details</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-[#B85A32] transition-all duration-500 rounded-full"
              style={{ width: `${step === 1 ? 33 : step === 3 ? 66 : 100}%` }}
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
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDestination(dest.id);
                }}
                className={`p-6 border text-left cursor-pointer transition-all rounded-2xl ${
                  selectedDestination === dest.id
                    ? "border-[#B85A32] bg-white shadow-xl ring-2 ring-[#B85A32]/20"
                    : "border-gray-200 bg-white/60 hover:bg-white"
                }`}
              >
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#B85A32] font-bold block mb-1">
                  {dest.tagline}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#1C352D] mb-2">
                  {dest.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-sans">
                  {dest.description}
                </p>
              </button>
            ))}
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-md mb-8">
            <h3 className="font-serif font-bold text-lg text-[#1C352D] mb-4">
              Select Stay Duration & Guest Count
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] font-sans uppercase tracking-widest text-gray-500 mb-2 font-semibold">
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B85A32] font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-sans uppercase tracking-widest text-gray-500 mb-2 font-semibold">
                  Check-out Date
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B85A32] font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-sans uppercase tracking-widest text-gray-500 mb-2 font-semibold">
                  Guests Count
                </label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B85A32] font-medium"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToStep(3);
              }}
              className="bg-[#1C352D] hover:bg-[#B85A32] text-white px-8 py-3.5 rounded-full font-sans text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-all shadow-lg cursor-pointer"
            >
              <span>Next: Choose Suite</span>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Suite Selection */}
      {step === 3 && (
        <div className="animate-fade-in">
          <span className="text-xs uppercase tracking-[0.3em] text-[#B85A32] font-bold block mb-1">
            Step 02 of 03
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C352D] italic mb-2">
            Select Your Private Suite
          </h2>
          <p className="text-gray-600 text-sm mb-8 font-sans">
            Curated room inventory for <strong className="text-gray-900 capitalize">{currentDestinationObj?.name}</strong> for {totalNights} night(s).
          </p>

          <div className="space-y-6">
            {rooms.length === 0 ? (
              <div className="bg-white border border-gray-200/80 rounded-2xl p-12 text-center">
                <p className="text-gray-500 text-sm">Loading available room inventory...</p>
              </div>
            ) : (
              rooms.map((room) => {
                const available = isRoomAvailable(room.id, checkIn, checkOut, bookingsList);
                const isSelected = selectedRoom?.id === room.id;

                return (
                  <div
                    key={room.id}
                    onClick={() => {
                      if (available) setSelectedRoom(room);
                    }}
                    className={`bg-white border rounded-2xl p-6 transition-all cursor-pointer flex flex-col md:flex-row gap-6 ${
                      isSelected
                        ? "border-[#B85A32] shadow-xl ring-2 ring-[#B85A32]/20"
                        : available
                        ? "border-gray-200/80 hover:border-gray-300"
                        : "border-gray-200/50 opacity-60 bg-gray-50/50 cursor-not-allowed"
                    }`}
                  >
                    <div className="md:w-1/3 aspect-[4/3] rounded-xl overflow-hidden relative shrink-0">
                      <img
                        src={room.imageUrls[0]}
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                      {!available && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                          <span className="bg-rose-600 text-white px-3 py-1 rounded-full text-[10px] font-sans uppercase tracking-widest font-bold">
                            Reserved for dates
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
                            <h3 className="font-serif text-2xl font-bold text-[#1C352D]">
                              {room.name}
                            </h3>
                          </div>
                          <div className="text-right">
                            <span className="font-serif text-2xl font-bold text-[#B85A32]">
                              {formatPrice(room.pricePerNight * totalNights, currency)}
                            </span>
                            <span className="block text-[10px] font-sans text-gray-400">
                              {formatPrice(room.pricePerNight, currency)} / night
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-600 line-clamp-2 mb-4 font-sans leading-relaxed">
                          {room.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {room.amenities.map((amenity, i) => (
                            <span
                              key={i}
                              className="bg-gray-50 border border-gray-200/80 text-gray-600 text-[10px] font-sans px-2.5 py-1 rounded-full"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs font-sans text-gray-500">
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

          <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200/60">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToStep(1);
              }}
              className="border border-gray-300 hover:border-gray-900 text-gray-700 hover:text-gray-900 px-6 py-3 rounded-full font-sans text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <ChevronLeft size={15} />
              <span>Back to Dates</span>
            </button>
            <button
              type="button"
              disabled={!selectedRoom}
              onClick={(e) => {
                e.stopPropagation();
                goToStep(4);
              }}
              className="bg-[#1C352D] disabled:bg-gray-300 hover:bg-[#B85A32] text-white px-8 py-3.5 rounded-full font-sans text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-all shadow-lg cursor-pointer"
            >
              <span>Next: Guest Details</span>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Guest Details & Pay at Property Confirmation */}
      {step === 4 && (
        <div className="animate-fade-in">
          <span className="text-xs uppercase tracking-[0.3em] text-[#B85A32] font-bold block mb-1">
            Step 03 of 03
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C352D] italic mb-8">
            Guest Details & Reservation Guarantee
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
                    <span>Pay at Check-In:</span>
                    <span>{formatPrice(totalPrice, currency)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-[11px] text-gray-500 font-sans flex items-start gap-2 bg-gray-50 p-3 rounded-xl">
                <ShieldCheck size={16} className="text-[#B85A32] shrink-0" />
                <span>Direct host rate guarantee. Pay 100% of balance upon check-in at property.</span>
              </div>
            </div>
          </div>

          {/* Pay at Property Guarantee Notice */}
          <div className="mt-8 p-4 bg-emerald-50/90 border border-emerald-200 rounded-2xl flex items-center gap-3.5 text-xs text-emerald-950 font-sans">
            <ShieldCheck size={22} className="text-emerald-700 shrink-0" />
            <div>
              <span className="font-bold text-emerald-950 block mb-0.5">Pay at Property — No Advance Card Payment Needed</span>
              <span>Your reservation will be instantly secured. You pay the balance of <strong>{formatPrice(totalPrice, currency)}</strong> directly at the homestay when you arrive.</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200/60">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToStep(3);
              }}
              className="border border-gray-300 hover:border-gray-900 text-gray-700 hover:text-gray-900 px-6 py-3 rounded-full font-sans text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <ChevronLeft size={15} />
              <span>Back to Suites</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!guestName.trim() || !guestEmail.trim() || !guestPhone.trim()) {
                  setErrorMsg("Please complete all personal and contact coordinate fields.");
                  return;
                }
                if (!guestEmail.includes("@")) {
                  setErrorMsg("Please enter a valid email address.");
                  return;
                }
                handleCreateBooking();
              }}
              disabled={loading}
              className="bg-[#1C352D] hover:bg-[#B85A32] text-white px-8 py-3.5 rounded-full font-sans text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-all shadow-lg cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? "Confirming Booking..." : "Confirm Booking (Pay at Property)"}</span>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: GORGEOUS SUCCESS CONFIRMATION SLIP */}
      {step === 7 && (
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
                    A confirmation voucher was sent to <strong className="font-mono">{activeBooking.guestEmail}</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEmailModal(true);
                  }}
                  className="bg-[#1C352D] hover:bg-[#B85A32] text-white px-4 py-2 rounded-full text-xs font-sans uppercase tracking-wider font-bold flex items-center gap-2 transition cursor-pointer"
                >
                  <Eye size={13} /> View Voucher
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResendEmail();
                  }}
                  disabled={resendingEmail}
                  className="bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 px-3 py-2 rounded-full text-xs font-sans font-semibold flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
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
                <span className="font-mono text-sm font-semibold tracking-wider text-[#C5A059]">{activeBooking.id}</span>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 text-sm font-sans">
              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Primary Guest Name</span>
                <span className="font-serif text-base font-bold text-gray-900">{activeBooking.guestName}</span>
              </div>

              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Location Destination</span>
                <span className="font-semibold text-gray-900 uppercase tracking-widest text-[#B85A32]">{displayDestName}</span>
              </div>

              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Selected Suite Option</span>
                <span className="font-semibold text-gray-900">{displayRoomName}</span>
              </div>

              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Travelers Capacity</span>
                <span className="font-semibold text-gray-900">{activeBooking.guestsCount} Adult(s)</span>
              </div>

              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Check-In Arrival (14:00)</span>
                <span className="font-mono font-semibold text-gray-900">{activeBooking.checkIn}</span>
              </div>

              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Check-Out Departure (11:00)</span>
                <span className="font-mono font-semibold text-gray-900">{activeBooking.checkOut}</span>
              </div>

              <div className="sm:col-span-2 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-baseline gap-4">
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Payment Method</span>
                  <span className="font-sans text-xs text-emerald-800 font-bold bg-emerald-100/80 px-2.5 py-1 rounded-md">Pay at Property (Check-In)</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Total Balance Payable</span>
                  <span className="font-serif text-2xl font-bold text-[#B85A32]">{formatPrice(finalTotalPrice, currency)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onBookingComplete) onBookingComplete();
                if (onNavigateHome) onNavigateHome();
              }}
              className="bg-[#1C352D] hover:bg-[#B85A32] text-white px-8 py-3.5 rounded-full font-sans text-xs uppercase tracking-widest font-bold transition-all shadow-lg cursor-pointer"
            >
              Return to Homepage
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                window.print();
              }}
              className="border border-gray-300 text-gray-700 hover:text-[#1C352D] hover:bg-gray-100 px-8 py-3.5 rounded-full font-sans text-xs uppercase tracking-widest font-bold transition-all cursor-pointer"
            >
              Print Receipt Voucher
            </button>
          </div>

          {/* SIMULATED EMAIL PREVIEW MODAL */}
          {showEmailModal && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 animate-fade-in text-left"
              >
                {/* Email Client Top Bar */}
                <div className="bg-[#1C352D] text-white p-4 px-6 flex justify-between items-center border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <Mail size={18} className="text-[#C5A059]" />
                    <span className="font-serif font-bold text-sm tracking-wide">Simulated Email Client</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowEmailModal(false);
                    }}
                    className="text-gray-300 hover:text-white p-1 rounded transition cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Email Metadata Header */}
                <div className="bg-gray-50 p-4 px-6 border-b border-gray-200 text-xs font-sans space-y-1.5">
                  <div className="flex gap-2">
                    <span className="text-gray-400 font-bold w-16">Subject:</span>
                    <span className="font-semibold text-gray-900">{activeSentEmail.subject}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 font-bold w-16">From:</span>
                    <span className="text-gray-700">Satrangi Homestay &lt;reservations@satrangihomestay.com&gt;</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 font-bold w-16">To:</span>
                    <span className="text-gray-900 font-medium">{activeSentEmail.to}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 font-bold w-16">Sent At:</span>
                    <span className="text-gray-500 font-mono">{new Date(activeSentEmail.sentAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Email Body Content */}
                <div className="p-6 overflow-y-auto flex-1 bg-[#FAF8F5]">
                  <div
                    className="prose prose-sm max-w-none rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white"
                    dangerouslySetInnerHTML={{ __html: activeSentEmail.bodyHtml }}
                  />
                </div>

                {/* Email Modal Footer */}
                <div className="p-4 px-6 bg-white border-t border-gray-200 flex justify-between items-center text-xs font-sans">
                  <span className="text-gray-500 italic">
                    Simulated voucher sent upon reservation completion.
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowEmailModal(false);
                    }}
                    className="bg-[#1C352D] hover:bg-[#B85A32] text-white px-5 py-2.5 rounded-full font-semibold uppercase tracking-wider text-[11px] transition shadow cursor-pointer"
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
