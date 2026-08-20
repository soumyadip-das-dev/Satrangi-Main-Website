import React from "react";
import { Check, Calendar, Sprout, Wifi, Coffee, MapPin, Sparkles, ShieldCheck, ArrowRight, Compass, TreePine, Landmark, Instagram } from "lucide-react";
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
          title: "Kolkata - The City of Joy",
          subtitle: "Experience the vibrant soul of The City of Joy. Indulge in boutique luxury at our 1920s heritage townhouse—where colonial grandeur, authentic Bengali cuisine, and bespoke cultural tours deliver an unforgettable getaway.",
          heroImg: "/kolkata_hero.png",
          storyImages: [
            "/kolkata_hero.png",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDiJErL1NVsuFluLGmpkq_nb7AffVDvOyIm8pfr0dJVAEhu0QujGYI9LSR3xcJYfG0TpSVb3a_dXM9disYdO6UL52Rc9M60FpQnzH6dOlnshJCr7Gm_s2xgqEKYf85Mh_4Syu7ECBgMK6zUq5isZsis-t3SgK8_y5oZ9Y3To12rcIjUs-9dGJB4fZk-Lm_9PQFbs5HyqjBr1r3bvLiIAPG44_gdMRPIbJnEgkgeBtJwW6iDwUsdD3GucBCpzetUEtuA0oCvOfKB18He",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDF1N3PRu1GVI9D91FATGEol1YMngISQMmuHMpTk84xzr_Mt0Kwn3BSeJ4Rx4Xp-AtIBtEHwZ68eytDzPwanDbhsHs2u7VihIlA6gutQT457IhcxPSoXvQhX3ZLon0IgzVRGMiEE5JtEbrKFZpIB9ahz5Kgl9fBNvBN2zPpJvm4anIwSQEpo0winW5iGWLH-LNv__Nc6WAmkzwVtuyijxcJ4Px_3b4C1KSsqfNAuIljRm5xlphfEDzUzlgqc9IQjUhDWWEP9R2WZwKyIM4",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAte6SOFbSFkWTjz_KIGB56z3MardGLApjqH6JnOuzSHMVRPLbquOWZuK38PcfGcholgWvYz0z0uA6qJdxfgkn04VeB3cBn6Xl1CNFeq6WQ4Ax7K9ACWkw8FAMZ794rYo-vLcZK3OGvVQq3BwZV80a2PUOBeTVV9XXqE_WF58Ld4y7l7liuaF7NG-Z9GR--EPEBtT_sL9LG1kfe-h_ztZoVHJ_yLSSv0XJkCXUDEiTpMfTOJAGHSqTRjO34s2H9KklZYyCa-atnnj79",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBnzKOH3iNF2rtJp50aMwTUPfE6LBIKwBUk29LG1GsW5nI-Wnt035Nv3LKXlVnOaWWfLsZrutatdm9RRaKk4PjlZ2GHbmdsN5dUSyisa4-p2xQR8smK8hbIvkovo7gJcPKnPOsuPlwnXSgAAWVS9vpTnqDo_CYbRwMGZrMvQ8sNfHfEPbfkU7UgUQOSwJBWRhxFViwFHBe5Z4aldltBhV4xNeY0jEQNJ2XLBdi6Eifx_VbZPesRVTQvbdPBhLTTTPRlYq5RxPGzg48"
          ],
          statLabel: "Historic Heart",
          statValue: "1920s Heritage Townhouse",
          highlights: ["Courtyard Library", "Chef Masterclass", "Red-Oxide Verandah", "Victoria Memorial Nearby"]
        };
      case "sundarban":
        return {
          title: "Sundarban - The Bengal Delta",
          subtitle: "Step into the wild majesty of The Bengal Delta. Enjoy world-class eco-luxury on G-Plot Island with private river boat safaris, breathtaking estuary sunsets, and premium homestay comfort.",
          heroImg: "/sundarban_hero.png",
          storyImages: [
            "/sundarban_hero.png",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDKxjEPOMmQ0a6cL1ITnl07z35ebEnXXmxjaqHzz4ppg1ig38uDvITIwbDc-ej5Cz4hI0Anmpwwd5qQb1CEdbqljCg6Cq08itkm3_S-LpupZt13sdFGoxgRJ979NBcUbsTbnkjk5EY1AHGiPa9brMd70x5MjXugCJIrSMDyY5dY5fTwKCo6JsVYxmYVw5cbnSmB_iFhW9B-ewvVYNOxswpDQZ-nttpChU-Pv1Uxnpoj8yFHiCEBpsR8kds8oIHmND3IZwNRbGA_ZbE-Dac",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAaYjy4e-XXFwdkagOoZsOEZkvT0V0piUX4M26-qP7uhiSca4muFrt42zavFFrNFiwrAxDnFlN8LLvbrUurlfDbK5s8Bb59J8Yy95kyAx0Eii7Ft-bg_tY1keeToWqrJlbuE0toY_YFwwB4HwIYwFZa2pt8_uL5pwNcAuFmHNLyW7ndRnGpJC5G0MVyYyn4KBS8PdBUSusvErNpb9zXUSizNvuOe_x2fWsvntUD5B8_J0zDSoQyXa9EXwR7IT8hfw8soEaOlhLwhEcdcaY",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAqaoTmsJEgDonzKh4JUOZ3B8yD57jjCa5X56PHoUppLWjslQOecPRtdx-S5yBHcpueoc8SRSEtd2D6oZ9qFr-Ai5c7-tXHjHS3WF0c7iYNkvdIgRthjMW2pdiKu9UOx3paiLGsk3i16qE7q0saWW-zZGr3IqoEvsCIq6QXclc1EuMZiOTYoOpVtYXScT6y_9G3u9WqXSQaXN6MG3ec0mCVB1rOkhCDG7fiyHFbfV6ZWRsb7SobsuN1VfSBQ9bwi1GZZOEIemHroVeUQA8",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAsO-sTzou4Xlz-ymI800L2QQntaM1hpNvJXG0dut7_cNOqU_kLuKrxYUQ63L7h0mXVf8RYiTK6HdM4V0EjbalPn2K9BiBXPzEc-QvVbrA9hLamSIBEQQfes4J6LE5uQ4eOOZDungRqkJkvAg0CrqdpAanR3LM3LZvBDRHlI_5d_SOjPUANPDAqw8ETULWSsQiruY4-rn6oCQgQDZf8KF-_jXbk3BRnOERIg680fZP7juW2B8ZbJzMlrSRp7u8-LhxNihDwRjT1TlfF"
          ],
          statLabel: "Ecosystem",
          statValue: "G-Plot Island Mangrove Coast",
          highlights: ["Private Boat Safaris", "Stilted River Villas", "Red Crab Beach Walk", "Estuarine Dining"]
        };
      case "lamahatta":
      default:
        return {
          title: "Lamahatta - Hidden Gem of Darjeeling",
          subtitle: "Discover the enchanting serenity of Darjeeling's best-kept secret. Stay in luxury mountain villas 5,700 FT above the clouds with direct Kanchenjunga views and cozy hearth fire decks.",
          heroImg: "/lamahatta_hero.png",
          storyImages: [
            "/lamahatta_hero.png",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzEiAu-fkjC0NgmgIUPTFihWx0mHcqWI0hHW-EX-IDpcdyKCINRjMFuFJUK9lO5Vmfz1cF31rDvFgpmqQG6rR5CStyat8Z3wIJgEn_6g_nI-d-0SdQPayjDMsDpaGzVfdYUwdU17sFNB_dqk7D1Hk7LuniZNnaMqxlG9OsQWbfPabij4A0mxJLyE-H3uQN7S7GsCJxkwpJryjypBSxfhAmyumPBvPJXJDZa9y2zr-evpmrbhSOgU6izo91asyc_A5IecbRraWWpLqn0",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCoustqL1tEEtYmNh0CMBCDP2Cnz6L55i1uNsPB70IvKiz1RM4606YphO_ly5IaOmzabV3MP1OUWsgGyxuR9vsoY-U6xgbl2_kI8ppgXRfVwS77PbbBeGbBvZIsHPYqdaDkyGkaHUxaDLyAX9qt0HPgpc1EUCVQvHzDU0zq9OcDXZATa5P6ImUbCgW3rzEW_kT4FBsl1f6k44x80bvgb0e5jS2BIz3yhBNGUjPvsZzTibhhLGlXpsj_6iGExNs6gu1uclR-EFvtln2ET8k",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCl1Ad2B8af1S63zU9w336ggC4LQ4FK0-SpaR5bpJBnLPiJdZvVdJL8R3qUML5hJOGgxAfD9rXjNtIGwAtTFW3_AGADm0s_Sen0KOhklv4K7iCK54gzfGHSRaCWaKEYGLZcPVcG4CNBmZHnNJqpRVT8taDKlQBgGMhYCvUP9FaOF8Z4GK0lZgSd2aeSxecNqYQ0RZDy-fBXuLlU8tqm8xJwtMbvguB3EFZ3hu-qIVnElWsdD_yKLQ6vRKVMWVkfnz439MYL4o_dqcGzC00",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCEJV4sZuLSjd7dODAg4Xpz0tkCTY6VTi1r7g4CAtUiaIMCRMRSAqOSU50Go35fHs9ydmw-6mas1q8ogTi5OQv_N06gUDWG6rBUrE80LXK3QXwu05XllxVEA7t6txV0OT1pthX9ffPC1Zf46aichtO7KHD-MnwDolmmYgugM0XUWxhzKFuxsO6C9tONovyPWyaQTy-6yi2ezA1m4UIlohN6YxXzPWuSxfssIxn94QERavAIZOgNTLi_yT8Qy7WpCufhrTpoQRWuqCYj"
          ],
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
      <section className="relative min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] w-full bg-[#1C352D] flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-hidden">
        {/* Full Cover Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${heroConfig.heroImg})` }}
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C352D] via-[#1C352D]/60 to-black/40" />

        {/* Top Quick Nav */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex justify-end items-center pt-2 sm:pt-4">
          <button
            onClick={() => onNavigate("home")}
            className="text-white/80 hover:text-white text-xs uppercase tracking-widest font-sans font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            ← All Destinations
          </button>
        </div>

        {/* Center Main Hero Typography */}
        <div className="relative z-10 max-w-7xl mx-auto w-full py-6 sm:py-10">
          <div className="max-w-3xl">
            <span className="text-[#C5A059] text-[11px] sm:text-sm font-sans uppercase tracking-[0.2em] sm:tracking-[0.3em] font-semibold block mb-2 sm:mb-3">
              {destination?.tagline}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 italic leading-tight">
              {heroConfig.title}
            </h1>
            <p className="font-sans text-xs sm:text-sm md:text-base text-gray-200 font-light max-w-2xl leading-relaxed">
              {heroConfig.subtitle}
            </p>
          </div>
        </div>

        {/* Standard Luxury Bottom Hero Glass Bar */}
        <div className="relative z-10 max-w-7xl mx-auto w-full mt-4 sm:mt-6">
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-center shadow-2xl">
            {/* Segment 1: Setting & Location */}
            <div className="flex items-center gap-3 text-white">
              <div className="p-2.5 bg-white/10 border border-white/15 rounded-xl text-[#E6C587] shrink-0">
                <MapPin size={18} />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-[#E6C587] font-bold">
                  {heroConfig.statLabel}
                </p>
                <p className="font-serif text-xs sm:text-sm font-semibold text-white tracking-wide">
                  {heroConfig.statValue}
                </p>
              </div>
            </div>

            {/* Segment 2: Host Guarantee */}
            <div className="hidden sm:flex items-center gap-3 text-white sm:border-l sm:border-white/15 sm:pl-3 lg:pl-4">
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
            <div className="hidden lg:flex items-center gap-3 text-white lg:border-l lg:border-white/15 lg:pl-4">
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
            <div className="flex items-center gap-2 sm:gap-2.5 sm:col-span-2 lg:col-span-1 justify-end sm:border-t sm:border-white/15 lg:border-t-0 lg:border-l lg:border-white/15 pt-2 sm:pt-3 lg:pt-0 lg:pl-4">
              <button
                type="button"
                onClick={() => {
                  document.getElementById("suites-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex-1 bg-white/15 hover:bg-white/25 text-white border border-white/25 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 text-center cursor-pointer"
              >
                View Suites
              </button>

              <button
                type="button"
                onClick={() => onNavigate("booking", destinationId)}
                className="flex-1 bg-[#B85A32] hover:bg-[#A4502A] text-white px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg flex items-center justify-center gap-1.5 cursor-pointer text-center"
              >
                <span>Reserve</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Property Story Section */}
      <section className="py-12 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#B85A32] font-bold block mb-2 sm:mb-3">
              {destination?.theme || "CURATED SANCTUARY"}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C352D] mb-4 sm:mb-6">
              {destination?.name || "Sanctuary Overview"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4 sm:mb-6 font-light">
              {destination?.propertyStory}
            </p>
            <div className="space-y-2 mt-4">
              {destination?.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                  <Check size={14} className="text-[#B85A32] shrink-0" /> <span>{h}</span>
                </div>
              ))}
            </div>

            {destination?.instagramUrl && (
              <div className="pt-5 border-t border-gray-150 mt-5">
                <a
                  href={destination.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#1C352D] text-[#1C352D] hover:text-white border border-gray-200 transition-all duration-300 shadow-xs hover:shadow-md group cursor-pointer"
                >
                  <Instagram size={17} className="text-[#E1306C] group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="text-[10px] text-gray-500 group-hover:text-gray-300 font-sans uppercase tracking-wider font-bold">
                      Follow {destination.name} Stories
                    </div>
                    <div className="text-xs font-mono font-bold text-[#B85A32] group-hover:text-[#E6C587]">
                      {destination.instagramHandle || "@satrangihomestay"}
                    </div>
                  </div>
                </a>
              </div>
            )}
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-gray-100">
            <SuitePhotoCarousel
              suiteId={`story-${destinationId}`}
              images={heroConfig.storyImages}
              suiteName={`${destination?.name} Property Story`}
              heightClass="h-64 sm:h-80 md:h-[380px]"
            />
          </div>
        </div>
      </section>

      {/* Live Calendar Availability & Room Collection */}
      <section id="suites-section" className="py-12 sm:py-16 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C352D] mb-6 text-center italic">
            {destination?.name} Suite Collection
          </h2>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
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
      <section className="py-12 sm:py-16 bg-[#FAF8F5] border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-xs uppercase tracking-[0.3em] text-[#B85A32] font-bold block mb-2">
              GUEST STORIES
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C352D] italic">
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
            <div className="text-center py-10 sm:py-12 bg-white border border-gray-200 rounded-2xl text-xs text-gray-400 font-mono mb-10 sm:mb-12">
              No guest diaries compiled yet for {destination?.name}. Be the first to tell yours!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-12">
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
