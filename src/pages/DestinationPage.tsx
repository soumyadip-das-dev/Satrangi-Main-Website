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
          title: "Kolkata Heritage Townhouse",
          subtitle: "Where 1920s Colonial Elegance Meets Courtyard Tranquility & Cultural Masterclasses",
          eyebrow: "1920s COLONIAL RESIDENCE • BENGAL",
          heroImg: "/kolkata_hero.png",
          location: "Park Street & College Street Precinct",
          statLabel: "HERITAGE SPEC",
          statValue: "Conserved 1920s Red-Oxide Manor",
          icon: Landmark,
          highlights: ["Courtyard Library", "Chef Thali Workshop", "Solo & Couple Haven"],
        };
      case "sundarban":
        return {
          title: "Sundarban Eco Safari Lodge",
          subtitle: "Stilted High-Comfort Eco-Villas Where Estuary Rivers Meet Golden Sands",
          eyebrow: "DELTA ECO SAFARI • G-PLOT ISLAND",
          heroImg: "/sundarban_hero.png",
          location: "Saptamukhi Estuary Shoreline",
          statLabel: "ECOSYSTEM",
          statValue: "Untouched Coastal Mangrove Delta",
          icon: TreePine,
          highlights: ["Private River Boat Safaris", "Estuary View Stilts", "Fresh Catch Dining"],
        };
      case "lamahatta":
      default:
        return {
          title: "Lamahatta Mountain Sanctuary",
          subtitle: "Bespoke Mountain Villas Perched Above the Himalayan Mist & Pine Groves",
          eyebrow: "5,700 FT ALPINE RIDGE • DARJEELING",
          heroImg: "/lamahatta_hero.png",
          location: "Pine Forest Ridge, Darjeeling Hills",
          statLabel: "ALTITUDE",
          statValue: "5,700 FT Above Sea Level",
          icon: Compass,
          highlights: ["270° Kanchenjunga Vistas", "Cedar Wood Fireplaces", "Organic Tea Masterclass"],
        };
    }
  };

  const heroConfig = getHeroContent();
  const HeroIcon = heroConfig.icon;

  return (
    <div className="animate-fade-in text-left">
      {/* Refined Luxury Hero Section */}
      <section
        className="bg-cover bg-center min-h-[540px] relative flex flex-col justify-between pt-8 sm:pt-10 pb-12 sm:pb-14 px-6 sm:px-12 text-left"
        style={{ backgroundImage: `url('${heroConfig.heroImg}')` }}
      >
        {/* Layered Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C352D] via-black/45 to-black/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

        {/* Top Breadcrumb & Luxury Pill */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-white/80 text-xs font-sans tracking-widest uppercase">
            <span
              onClick={() => onNavigate("home")}
              className="hover:text-[#C5A059] transition cursor-pointer font-medium"
            >
              Satrangi
            </span>
            <span className="text-[#C5A059]">•</span>
            <span className="text-[#C5A059] font-bold">{destination?.name || heroConfig.title}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-[11px] text-white font-medium tracking-wider">
            <ShieldCheck size={13} className="text-[#C5A059]" />
            <span>Direct Guarantee • 0% Commission</span>
          </div>
        </div>

        {/* Center Main Hero Typography */}
        <div className="relative z-10 max-w-7xl mx-auto w-full my-auto py-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#C5A059]/20 border border-[#C5A059]/40 backdrop-blur-sm px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.35em] text-[#E6C587] mb-4">
              <HeroIcon size={12} className="text-[#C5A059]" />
              <span>{heroConfig.eyebrow}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4 tracking-tight">
              {heroConfig.title}
            </h1>

            <p className="font-sans text-xs sm:text-base text-gray-200 font-light max-w-2xl leading-relaxed mb-6">
              {heroConfig.subtitle}
            </p>

            {/* Quick Feature Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {heroConfig.highlights.map((h, i) => (
                <span
                  key={i}
                  className="bg-black/40 backdrop-blur-md border border-white/15 text-white/90 text-[10px] sm:text-[11px] font-sans px-3 py-1 sm:py-1.5 rounded-xl flex items-center gap-1.5 font-medium"
                >
                  <Sparkles size={11} className="text-[#C5A059]" />
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Hero Glass Bar */}
        <div className="relative z-10 max-w-7xl mx-auto w-full mt-6">
          <div className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
            <div className="flex items-center gap-4 text-white text-xs font-sans w-full md:w-auto">
              <div className="p-2.5 bg-[#C5A059]/20 border border-[#C5A059]/30 rounded-xl text-[#C5A059] shrink-0">
                <MapPin size={18} />
              </div>
              <div className="text-left">
                <p className="text-[9px] uppercase tracking-widest text-[#E6C587] font-bold">
                  {heroConfig.statLabel}
                </p>
                <p className="font-serif text-sm font-semibold text-white">
                  {heroConfig.statValue}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <a
                href="#suites-section"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("suites-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex-1 md:flex-initial bg-white/20 hover:bg-white/30 text-white border border-white/30 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 text-center cursor-pointer"
              >
                View Suites
              </a>

              <button
                onClick={() => onNavigate("booking", destinationId)}
                className="flex-1 md:flex-initial bg-[#C5A059] hover:bg-[#b08c48] text-[#1C352D] px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Reserve Stay</span>
                <ArrowRight size={14} />
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
                      className={`mb-4 flex items-center justify-between p-3 rounded-xl border text-xs font-sans tracking-wide transition-all ${available
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
                      className={`w-full py-3 rounded-xl text-xs uppercase font-sans tracking-widest font-bold transition-all cursor-pointer ${available
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
