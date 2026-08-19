import React from "react";
import { Check, Calendar, Sprout, Wifi, Coffee, MapPin } from "lucide-react";
import { Destination, Room, Experience, Review, Booking } from "../types";
import { Currency, formatPrice } from "../utils/currency";
import { isRoomAvailable, getTotalNights } from "../utils/bookingUtils";
import SuitePhotoCarousel from "../components/SuitePhotoCarousel";
import DestinationGallery from "../components/DestinationGallery";
import ReviewCard from "../components/ReviewCard";
import ReviewSubmission from "../components/ReviewSubmission";

interface DestinationPageProps {
  destinationId: "kolkata" | "sundarban" | "lamahatta";
  destinations: Destination[];
  rooms: Room[];
  experiences: Experience[];
  reviews: Review[];
  bookings: Booking[];
  currency: Currency;
  checkInSelect: string;
  setCheckInSelect: (d: string) => void;
  checkOutSelect: string;
  setCheckOutSelect: (d: string) => void;
  reviewsSortBy: string;
  setReviewsSortBy: (s: string) => void;
  onNavigate: (view: string, subParam?: any) => void;
  onReviewSubmitted: (newReview: Review) => void;
}

export default function DestinationPage({
  destinationId,
  destinations,
  rooms,
  experiences,
  reviews,
  bookings,
  currency,
  checkInSelect,
  setCheckInSelect,
  checkOutSelect,
  setCheckOutSelect,
  reviewsSortBy,
  setReviewsSortBy,
  onNavigate,
  onReviewSubmitted,
}: DestinationPageProps) {
  const destination = destinations.find((d) => d.id === destinationId);
  const destRooms = rooms.filter((r) => r.destinationId === destinationId);
  const destExperiences = experiences.filter((e) => e.destinationId === destinationId);

  const getSortedReviews = () => {
    const filtered = reviews.filter((r) => r.destinationId === destinationId);
    if (reviewsSortBy === "highest") {
      return [...filtered].sort((a, b) => b.rating - a.rating);
    }
    if (reviewsSortBy === "lowest") {
      return [...filtered].sort((a, b) => a.rating - b.rating);
    }
    return [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const sortedReviews = getSortedReviews();

  const getHeroContent = () => {
    switch (destinationId) {
      case "kolkata":
        return {
          title: "Kolkata: Culture & Comfort",
          eyebrow: "URBAN HERITAGE STAY",
          heroImg: "/kolkata_hero.png",
        };
      case "sundarban":
        return {
          title: "Sundarban: Estuary & Wildlife",
          eyebrow: "DELTA ECO SAFARI LODGE",
          heroImg: "/sundarban_hero.png",
        };
      case "lamahatta":
      default:
        return {
          title: "Lamahatta: Pine Mist & Kanchenjunga",
          eyebrow: "5,700 FT ALPINE SANCTUARY",
          heroImg: "/lamahatta_hero.png",
        };
    }
  };

  const heroConfig = getHeroContent();

  return (
    <div className="animate-fade-in text-left">
      {/* Destination Hero */}
      <section
        className="bg-cover bg-center h-[55vh] relative flex items-center px-6"
        style={{ backgroundImage: `url('${heroConfig.heroImg}')` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-4xl mx-auto text-white w-full">
          <span className="text-xs uppercase tracking-[0.4em] text-[#C5A059] font-bold block mb-3">
            {heroConfig.eyebrow}
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold italic mb-6">
            {heroConfig.title}
          </h1>
        </div>
      </section>

      {/* Property Story Section */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#B85A32] font-bold block mb-3">
              {destination?.theme || "CURATED SANCTUARY"}
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1C352D] mb-6">
              {destination?.name || "Sanctuary Overview"}
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed mb-6 font-light">
              {destination?.propertyStory}
            </p>
            <div className="space-y-2 mt-4">
              {destination?.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                  <Check size={14} className="text-[#B85A32]" /> <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            <img
              src={heroConfig.heroImg}
              alt={destination?.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Live Calendar Availability & Room Collection */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-serif text-3xl font-bold text-[#1C352D] mb-6 text-center italic">
            {destination?.name} Suite Collection
          </h2>

          {/* Calendar Search Ribbon */}
          <div className="bg-[#FAF8F5] border border-gray-200 p-5 rounded-2xl mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <h4 className="font-serif text-sm font-bold text-[#1C352D] mb-1">
                Check Real-Time Suite Availability
              </h4>
              <p className="text-[10px] text-gray-500 font-sans tracking-wide">
                Adjust stay dates to verify room inventory against our occupancy.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full md:w-auto">
              <div className="flex-1 min-w-[120px]">
                <label className="block text-[9px] text-[#B85A32] uppercase tracking-widest mb-1 font-bold">
                  Check-In
                </label>
                <input
                  type="date"
                  value={checkInSelect}
                  onChange={(e) => setCheckInSelect(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 outline-none focus:border-[#B85A32] font-mono"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="block text-[9px] text-[#B85A32] uppercase tracking-widest mb-1 font-bold">
                  Check-Out
                </label>
                <input
                  type="date"
                  value={checkOutSelect}
                  onChange={(e) => setCheckOutSelect(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 outline-none focus:border-[#B85A32] font-mono"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 text-xs text-gray-600 self-stretch md:self-auto justify-center font-sans shrink-0">
              <Calendar size={13} className="text-[#B85A32]" />
              <span>
                Stay duration:{" "}
                <strong className="text-[#1C352D] font-medium font-serif">
                  {getTotalNights(checkInSelect, checkOutSelect)} nights
                </strong>
              </span>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {destRooms.map((room) => {
              const available = isRoomAvailable(room.id, checkInSelect, checkOutSelect, bookings);
              return (
                <div key={room.id} className="border border-gray-200/80 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <SuitePhotoCarousel
                    images={room.imageUrls}
                    altText={room.name}
                    heightClass="h-64"
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="font-serif text-xl font-bold text-[#1C352D]">{room.name}</h3>
                      <span className="font-serif text-lg font-bold text-[#B85A32]">
                        {formatPrice(room.pricePerNight, currency)}{" "}
                        <span className="text-[10px] text-gray-400 font-sans font-normal">/night</span>
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                      {room.sqft} SQFT • Max {room.capacity} Guests
                    </p>

                    {/* Availability status badge */}
                    <div
                      className={`mb-4 flex items-center justify-between p-3 rounded-xl border text-xs font-sans tracking-wide transition-all ${
                        available
                          ? "bg-emerald-50/70 border-emerald-100 text-emerald-800"
                          : "bg-rose-50/70 border-rose-100 text-rose-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${available ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-widest leading-none mb-0.5">
                            {available ? "Bookable" : "Unavailable"}
                          </p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-gray-400 uppercase">
                        {checkInSelect.slice(5)} to {checkOutSelect.slice(5)}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed mb-6 font-sans">
                      {room.description}
                    </p>

                    <button
                      onClick={() => onNavigate("booking", destinationId)}
                      disabled={!available}
                      className={`w-full py-3 rounded-xl text-xs uppercase font-sans tracking-widest font-bold transition-all cursor-pointer ${
                        available
                          ? "bg-[#1C352D] hover:bg-[#B85A32] text-white shadow-md"
                          : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                      }`}
                    >
                      {available ? `Reserve ${room.name}` : "Unavailable (Select Other Dates)"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Destination Gallery */}
      <DestinationGallery destinationId={destinationId} destinationName={destination?.name || ""} />

      {/* Reviews & Guest Diaries Section */}
      <section className="py-16 bg-[#FAF8F5] border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-[0.3em] text-[#B85A32] font-bold block mb-2">
              GUEST STORIES
            </span>
            <h3 className="font-serif text-3xl font-bold text-[#1C352D] italic">
              {destination?.name} Guest Diaries
            </h3>
            <div className="w-12 h-0.5 bg-[#B85A32] mx-auto mt-3" />
          </div>

          {/* Sort selector */}
          <div className="flex justify-end mb-6 items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Sort stories:</span>
            <select
              value={reviewsSortBy}
              onChange={(e) => setReviewsSortBy(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg text-xs text-gray-700 px-3 py-1.5 focus:border-[#B85A32] outline-none font-sans font-medium"
            >
              <option value="latest">Latest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>

          {/* Reviews list */}
          {sortedReviews.length === 0 ? (
            <div className="text-center py-12 bg-white border border-gray-200 rounded-2xl text-xs text-gray-400 font-mono mb-12">
              No guest diaries compiled yet for {destination?.name}. Be the first to tell yours!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {sortedReviews.map((rev) => (
                <ReviewCard key={rev.id} review={rev} />
              ))}
            </div>
          )}

          {/* Submit Review */}
          <ReviewSubmission
            destinationId={destinationId}
            onReviewSubmitted={onReviewSubmitted}
          />
        </div>
      </section>
    </div>
  );
}
