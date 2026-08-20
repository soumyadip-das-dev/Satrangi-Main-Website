import React from "react";
import { Check, Calendar, Sprout, Wifi, Coffee, MapPin, Sparkles, ShieldCheck, ArrowRight, Compass, TreePine, Landmark } from "lucide-react";
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
  bookings?: Booking[];
  currency: Currency;
  checkInSelect: string;
  setCheckInSelect: (d: string) => void;
  checkOutSelect: string;
  setCheckOutSelect: (d: string) => void;
  reviewsSortBy: string;
  setReviewsSortBy: (s: string) => void;
  onNavigate: (view: string, subParam?: any) => void;
  onReviewSubmitted: (newReview: Review) => void;
  onSelectRoomModal?: (room: Room) => void;
}

export default function DestinationPage({
  destinationId,
  destinations,
  rooms,
  experiences,
  reviews,
  bookings = [],
  currency,
  checkInSelect,
  setCheckInSelect,
  checkOutSelect,
  setCheckOutSelect,
  reviewsSortBy,
  setReviewsSortBy,
  onNavigate,
  onReviewSubmitted,
  onSelectRoomModal,
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

  const getHeroConfig = () => {
    switch (destinationId) {
      case "kolkata":
        return {
          title: "Kolkata Heritage Townhouse",
          subtitle: "A lovingly restored 1920s classical residence with courtyard reading alcoves, red oxide floors, and chef-guided Bengali feasts.",
          heroImg: "/kolkata_hero.png",
          statLabel: "Historic Heart",
          statValue: "1920s Heritage Townhouse",
          highlights: ["Courtyard Library", "Chef Masterclass", "Red-Oxide Verandah", "Victoria Memorial Nearby"]
        };
      case "sundarban":
        return {
          title: "Sundarban Estuarine Eco-Lodge",
          subtitle: "Sculpted directly onto the pristine shoreline of G-Plot Island where mangrove rivers meet golden sands.",
          heroImg: "/sundarban_hero.png",
          statLabel: "Ecosystem",
          statValue: "G-Plot Island Mangrove Coast",
          highlights: ["Private Boat Safaris", "Stilted River Villas", "Red Crab Beach Walk", "Estuarine Dining"]
        };
      case "lamahatta":
      default:
        return {
          title: "Lamahatta Mountain Sanctuary",
          subtitle: "Perched at 5,700 feet amidst whispering pine forests, offering private hearth decks and unobstructed Kanchenjunga vistas.",
          heroImg: "/lamahatta_hero.png",
          statLabel: "Altitude",
          statValue: "5,700 FT Alpine Ridge",
          highlights: ["Kanchenjunga Views", "Cedar Wood Hearth", "Sherpa Guided Treks", "Organic Tea Tastings"]
        };
    }
  };

  const heroConfig = getHeroConfig();

  return (
    <div className="animate-fade-in text-left">
      {/* Hero Showcase Section */}
      <section className="relative min-h-[560px] sm:min-h-[640px] w-full bg-[#1C352D] flex flex-col justify-between p-6 sm:p-12 overflow-hidden">
        {/* Full Cover Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${heroConfig.heroImg})` }}
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C352D] via-[#1C352D]/60 to-black/40" />

        {/* Top Quick Nav */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex justify-end items-center pt-4">
          <button
            onClick={() => onNavigate("home")}
            className="text-white/80 hover:text-white text-xs uppercase tracking-widest font-sans font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            ← All Destinations
          </button>
        </div>

        {/* Center Main Hero Typography */}
        <div className="relative z-10 max-w-7xl mx-auto w-full py-10">
          <div className="max-w-3xl">
            <span className="text-[#C5A059] text-xs sm:text-sm font-sans uppercase tracking-[0.3em] font-semibold block mb-3">
              {destination?.tagline}
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-bold text-white mb-4 italic leading-tight">
              {heroConfig.title}
            </h1>
            <p className="font-sans text-xs sm:text-base text-gray-200 font-light max-w-2xl leading-relaxed">
              {heroConfig.subtitle}
            </p>
          </div>
        </div>

        {/* Standard Luxury Bottom Hero Glass Bar */}
        <div className="relative z-10 max-w-7xl mx-auto w-full mt-6">
          <div className="bg-black/35 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-5 grid grid-cols-1 md:grid-cols-4 gap-4 items-center shadow-2xl">
            {/* Segment 1: Setting & Location */}
            <div className="flex items-center gap-3.5 text-white">
              <div className="p-2.5 bg-white/10 border border-white/15 rounded-xl text-[#E6C587] shrink-0">
                <MapPin size={18} />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-[#E6C587] font-bold">
                  {heroConfig.statLabel}
                </p>
                <p className="font-serif text-sm font-semibold text-white tracking-wide">
                  {heroConfig.statValue}
                </p>
              </div>
            </div>

            {/* Segment 2: Host Guarantee */}
            <div className="hidden md:flex items-center gap-3.5 text-white border-l border-white/15 pl-4">
              <div className="p-2.5 bg-white/10 border border-white/15 rounded-xl text-[#E6C587] shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-[#E6C587] font-bold">
                  Direct Host Perks
                </p>
                <p className="text-xs text-white/90 font-medium">
                  0% Fee • Daily Breakfast
                </p>
              </div>
            </div>

            {/* Segment 3: Inventory / Rates */}
            <div className="hidden md:flex items-center gap-3.5 text-white border-l border-white/15 pl-4">
              <div className="p-2.5 bg-white/10 border border-white/15 rounded-xl text-[#E6C587] shrink-0">
                <Sparkles size={18} />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-[#E6C587] font-bold">
                  Suites Available
                </p>
                <p className="text-xs text-white/90 font-medium">
                  {destRooms.length} Curated Sanctuaries
                </p>
              </div>
            </div>

            {/* Segment 4: Actions */}
            <div className="flex items-center gap-2.5 justify-end md:border-l md:border-white/15 md:pl-4">
              <button
                type="button"
                onClick={() => {
                  document.getElementById("suites-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex-1 md:flex-initial bg-white/15 hover:bg-white/25 text-white border border-white/25 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 text-center cursor-pointer"
              >
                View Suites
              </button>

              <button
                type="button"
                onClick={() => onNavigate("booking", destinationId)}
                className="flex-1 md:flex-initial bg-[#B85A32] hover:bg-[#A4502A] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Reserve Stay</span>
              </button>
            </div>
          </div>
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
      <section id="suites-section" className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-serif text-3xl font-bold text-[#1C352D] mb-6 text-center italic">
            {destination?.name} Suite Collection
          </h2>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {destRooms.map((room) => {
              return (
                <div key={room.id} className="border border-gray-200/80 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <SuitePhotoCarousel
                      suiteId={room.id}
                      suiteName={room.name}
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
                        {room.sqft} SQFT • Max {room.capacity} Guests • {room.type}
                      </p>

                      <p className="text-xs text-gray-600 leading-relaxed mb-6 font-sans">
                        {room.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={() => {
                        if (onSelectRoomModal) {
                          onSelectRoomModal(room);
                        } else {
                          onNavigate("booking", destinationId);
                        }
                      }}
                      className="w-full py-3 rounded-xl text-xs uppercase font-sans tracking-widest font-bold transition-all cursor-pointer bg-[#1C352D] hover:bg-[#B85A32] text-white shadow-md flex items-center justify-center text-center"
                    >
                      <span>Reserve</span>
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
