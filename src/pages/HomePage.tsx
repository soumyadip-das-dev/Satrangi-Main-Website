import React, { useState, useEffect } from "react";
import { 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Users, 
  Compass, 
  Sparkles, 
  Star, 
  Plus, 
  Minus, 
  Leaf, 
  ShieldCheck, 
  Coffee, 
  Landmark, 
  TreePine,
  ChevronRight
} from "lucide-react";
import { Destination, Room } from "../types";
import { Currency, formatPrice } from "../utils/currency";
import { getFormattedDateString } from "../utils/bookingUtils";

interface HomePageProps {
  destinations: Destination[];
  rooms: Room[];
  currency: Currency;
  selectedDestIdForBooking: string;
  setSelectedDestIdForBooking: (id: string) => void;
  checkInSelect: string;
  setCheckInSelect: (d: string) => void;
  checkOutSelect: string;
  setCheckOutSelect: (d: string) => void;
  guestsCountSelect?: number;
  setGuestsCountSelect?: (g: number) => void;
  onNavigate: (view: string, subParam?: any) => void;
  onSelectRoomModal: (room: Room) => void;
}

export default function HomePage({
  destinations,
  rooms,
  currency,
  selectedDestIdForBooking,
  setSelectedDestIdForBooking,
  checkInSelect,
  setCheckInSelect,
  checkOutSelect,
  setCheckOutSelect,
  guestsCountSelect = 2,
  setGuestsCountSelect,
  onNavigate,
  onSelectRoomModal,
}: HomePageProps) {
  const [heroIndex, setHeroIndex] = useState(0);

  const heroSlides = [
    {
      img: "/lamahatta_hero.png",
      tagline: "5,700 FT ALPINE SANCTUARY • DARJEELING",
      title: "Lamahatta Mountain Sanctuary",
      destinationId: "lamahatta",
      desc: "Wake up above the Himalayan clouds with unobstructed Kanchenjunga panoramas, cedar hearths, and Sherpa hospitality."
    },
    {
      img: "/sundarban_hero.png",
      tagline: "WILDLIFE ECO-LODGE • G-PLOT DELTA",
      title: "Sundarban Estuarine Lodge",
      destinationId: "sundarban",
      desc: "Stilted waterside eco-villas where river estuaries meet the Bay of Bengal, paired with private silent boat safaris."
    },
    {
      img: "/kolkata_hero.png",
      tagline: "1920S BOUTIQUE TOWNHOUSE • CITY OF JOY",
      title: "Kolkata Heritage Residence",
      destinationId: "kolkata",
      desc: "Immerse in colonial elegance with polished red oxide floors, internal tropical courtyards, and artisanal Bengali cuisine."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="animate-fade-in bg-[#F5F2EC] text-[#1C352D] font-sans antialiased overflow-x-hidden selection:bg-[#2B3E32]/20">
      
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: EDITORIAL HERO WITH ORGANIC FLUID WAVY FRAME
      ────────────────────────────────────────────────────────────── */}
      <section className="pt-6 sm:pt-10 pb-10 sm:pb-16 px-4 sm:px-6 max-w-[1360px] mx-auto text-center">
        
        {/* Top Centered Brand Tag */}
        <div className="mb-4 sm:mb-6">
          <span className="text-[11px] sm:text-xs font-serif uppercase tracking-[0.35em] text-[#385242] font-semibold">
            Satrangi Homestay Atelier • West Bengal
          </span>
        </div>

        {/* Grand Editorial Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-[#1E2F25] tracking-tight uppercase leading-[1.08] max-w-5xl mx-auto mb-6 sm:mb-8">
          Sustainable Luxury <br className="hidden sm:inline" />
          in Bengal
        </h1>

        {/* Organic Double-Curved Wavy Hero Frame */}
        <div className="relative max-w-6xl mx-auto mt-2">
          
          {/* Floating Olive Pill Action */}
          <div className="absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 z-30">
            <button
              type="button"
              onClick={() => onNavigate("booking", heroSlides[heroIndex].destinationId)}
              className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#2B3E32] hover:bg-[#1E2F25] text-white text-[10px] sm:text-xs uppercase tracking-[0.25em] font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 border border-white/20"
            >
              <Leaf size={13} className="text-emerald-300" />
              <span>Explore Escape</span>
            </button>
          </div>

          {/* Organic Shape Container */}
          <div className="relative w-full h-[360px] sm:h-[480px] lg:h-[580px] rounded-[36px_90px_36px_90px] sm:rounded-[50px_140px_50px_140px] md:rounded-[70px_180px_70px_180px] overflow-hidden shadow-2xl border-2 border-[#DCD5C9] bg-stone-900 group">
            
            {/* Background Carousel Slides */}
            {heroSlides.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === heroIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[6s] scale-105"
                  style={{ backgroundImage: `url(${slide.img})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30" />

                {/* Bottom Caption Overlay */}
                <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-12 right-6 sm:right-12 text-left text-white z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="max-w-xl">
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-semibold text-[#E6C587] block mb-1">
                      {slide.tagline}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-4xl font-normal text-white drop-shadow-md">
                      {slide.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-200 font-light mt-1 max-w-md hidden sm:block">
                      {slide.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => onNavigate(slide.destinationId)}
                    className="self-start sm:self-auto px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md text-white text-xs uppercase tracking-widest font-semibold transition-all border border-white/40 cursor-pointer"
                  >
                    View Sanctuary →
                  </button>
                </div>
              </div>
            ))}

            {/* Slider Navigation Dots */}
            <div className="absolute top-6 right-6 sm:right-10 flex gap-2 z-30">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setHeroIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === heroIndex ? "w-8 bg-[#C5A059]" : "w-2 bg-white/50 hover:bg-white"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            QUICK BOOKING SEARCH BAR (GLASSMORPHISED WITH +/- STEPPER)
        ────────────────────────────────────────────────────────────── */}
        <div className="relative z-30 -mt-6 sm:-mt-8 max-w-5xl mx-auto px-2 sm:px-4">
          <div className="bg-white/95 backdrop-blur-xl p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-[#DCD5C9] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 items-center">
            
            {/* Field 1: Retreat */}
            <div className="text-left">
              <label className="block text-[10px] text-[#2B3E32] uppercase tracking-widest mb-1 font-bold flex items-center gap-1">
                <MapPin size={12} className="text-[#385242]" /> Select Retreat
              </label>
              <select
                onChange={(e) => setSelectedDestIdForBooking(e.target.value)}
                value={selectedDestIdForBooking}
                className="w-full bg-[#F5F2EC] border border-[#DCD5C9] rounded-xl text-xs py-2.5 px-3 text-gray-800 outline-none focus:border-[#2B3E32] font-semibold cursor-pointer"
              >
                <option value="lamahatta">Lamahatta</option>
                <option value="sundarban">Sundarban</option>
                <option value="kolkata">Kolkata</option>
              </select>
            </div>

            {/* Field 2: Check-In */}
            <div className="text-left">
              <label className="block text-[10px] text-[#2B3E32] uppercase tracking-widest mb-1 font-bold flex items-center gap-1">
                <Calendar size={12} className="text-[#385242]" /> Check-In
              </label>
              <input
                type="date"
                min={getFormattedDateString(0)}
                value={checkInSelect}
                onChange={(e) => {
                  const newIn = e.target.value;
                  setCheckInSelect(newIn);
                  if (checkOutSelect <= newIn) {
                    setCheckOutSelect(getFormattedDateString(1, newIn));
                  }
                }}
                className="w-full bg-[#F5F2EC] border border-[#DCD5C9] rounded-xl text-xs py-2 px-3 text-gray-800 outline-none focus:border-[#2B3E32] font-medium cursor-pointer"
              />
            </div>

            {/* Field 3: Check-Out */}
            <div className="text-left">
              <label className="block text-[10px] text-[#2B3E32] uppercase tracking-widest mb-1 font-bold flex items-center gap-1">
                <Calendar size={12} className="text-[#385242]" /> Check-Out
              </label>
              <input
                type="date"
                min={getFormattedDateString(1, checkInSelect)}
                value={checkOutSelect}
                onChange={(e) => setCheckOutSelect(e.target.value)}
                className="w-full bg-[#F5F2EC] border border-[#DCD5C9] rounded-xl text-xs py-2 px-3 text-gray-800 outline-none focus:border-[#2B3E32] font-medium cursor-pointer"
              />
            </div>

            {/* Field 4: Guests Stepper with +/- */}
            <div className="text-left">
              <label className="block text-[10px] text-[#2B3E32] uppercase tracking-widest mb-1 font-bold flex items-center gap-1">
                <Users size={12} className="text-[#385242]" /> Guests
              </label>
              <div className="w-full bg-[#F5F2EC] border border-[#DCD5C9] rounded-xl h-[38px] px-2 text-gray-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (setGuestsCountSelect && guestsCountSelect > 1) {
                      setGuestsCountSelect(guestsCountSelect - 1);
                    }
                  }}
                  disabled={guestsCountSelect <= 1}
                  aria-label="Decrease guests"
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-600 hover:text-[#2B3E32] hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Minus size={13} />
                </button>
                
                <span className="text-xs font-semibold text-gray-900 select-none">
                  {guestsCountSelect} {guestsCountSelect === 1 ? "Guest" : "Guests"}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    if (setGuestsCountSelect && guestsCountSelect < 10) {
                      setGuestsCountSelect(guestsCountSelect + 1);
                    }
                  }}
                  disabled={guestsCountSelect >= 10}
                  aria-label="Increase guests"
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-600 hover:text-[#2B3E32] hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>

            {/* Field 5: Action Button */}
            <div className="sm:col-span-2 lg:col-span-1">
              <button
                onClick={() => onNavigate("booking", selectedDestIdForBooking)}
                className="w-full bg-[#2B3E32] hover:bg-[#1E2F25] text-white py-3 rounded-xl text-xs font-sans uppercase tracking-widest font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-1 sm:mt-0"
              >
                <span>Check Availability</span>
                <ArrowRight size={13} />
              </button>
            </div>

          </div>
        </div>

      </section>





      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: "CRAFTED FOR EVERY TRAVELER'S JOURNEY" (EXPEDITION TRAIL)
      ────────────────────────────────────────────────────────────── */}
      <section className="relative py-24 sm:py-36 bg-white overflow-hidden border-b border-[#DCD5C9]/80">
        
        {/* Subtle Topographical Mountain Contour Background Silhouette */}
        <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(#141C19_1.5px,transparent_1.5px)] [background-size:32px_32px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Continuous Red/Terracotta Winding Expedition Trail Line */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none select-none z-10">
            <svg className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1000 1800">
              <path
                d="M 520,60 C 580,60 620,80 620,120 C 620,200 480,240 280,310 C 80,380 40,460 70,540 C 100,620 400,670 680,720 C 920,770 940,860 900,940 C 840,1040 520,1080 300,1140 C 80,1200 50,1300 120,1380 C 200,1480 600,1520 850,1580"
                stroke="#8A3828"
                strokeWidth="1.25"
                opacity="0.85"
              />
              {/* Waypoint Milestone Dots */}
              <circle cx="620" cy="120" r="4.5" fill="#8A3828" />
              <circle cx="70" cy="540" r="4.5" fill="#8A3828" />
              <circle cx="900" cy="940" r="4.5" fill="#8A3828" />
            </svg>
          </div>

          <div className="space-y-32 sm:space-y-44">
            
            {/* ══════════════════════════════════════════════════════════
                ROUTE 01: LAMAHATTA (Left: Mountain Ridge, Right: Text)
            ══════════════════════════════════════════════════════════ */}
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center text-left">
              
              {/* Left: Dramatic Mountain Rocky Peak with Watercolor Ragged Edge */}
              <div className="lg:col-span-6 relative">
                <div className="relative max-w-md mx-auto lg:max-w-none">
                  {/* Organic Watercolor / Torn Feathered Mask */}
                  <div 
                    className="relative w-full h-80 sm:h-[420px] overflow-hidden"
                    style={{
                      maskImage: "radial-gradient(ellipse 92% 88% at 50% 50%, black 50%, rgba(0,0,0,0.8) 75%, transparent 100%)",
                      WebkitMaskImage: "radial-gradient(ellipse 92% 88% at 50% 50%, black 50%, rgba(0,0,0,0.8) 75%, transparent 100%)",
                    }}
                  >
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzEiAu-fkjC0NgmgIUPTFihWx0mHcqWI0hHW-EX-IDpcdyKCINRjMFuFJUK9lO5Vmfz1cF31rDvFgpmqQG6rR5CStyat8Z3wIJgEn_6g_nI-d-0SdQPayjDMsDpaGzVfdYUwdU17sFNB_dqk7D1Hk7LuniZNnaMqxlG9OsQWbfPabij4A0mxJLyE-H3uQN7S7GsCJxkwpJryjypBSxfhAmyumPBvPJXJDZa9y2zr-evpmrbhSOgU6izo91asyc_A5IecbRraWWpLqn0"
                      alt="Lamahatta Mountain Expedition"
                      className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-1000"
                    />
                  </div>
                </div>
              </div>

              {/* Right: Typography with Floating Golden Cursive Script */}
              <div className="lg:col-span-6 relative lg:pl-4">
                <div className="relative">
                  
                  {/* Golden Cursive Signature Script in Background */}
                  <div className="absolute -top-10 sm:-top-16 -left-2 sm:-left-6 font-['Alex_Brush',cursive] text-6xl sm:text-8xl lg:text-9xl text-[#DEB868]/35 pointer-events-none select-none tracking-normal leading-none z-0">
                    Lamahatta
                  </div>

                  {/* Red Waypoint Dot (Mobile/Tablet Indicator) */}
                  <div className="lg:hidden flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8A3828]" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A3828] font-bold">Route 01</span>
                  </div>

                  {/* Bold Condensed Explorer Headline */}
                  <h3 className="relative z-10 font-serif text-2xl sm:text-4xl font-bold uppercase tracking-tight text-[#141C19] mb-4 leading-[1.15]">
                    Ascent to Kanchenjunga Ridge
                  </h3>

                  {/* Concise 3-Line Specifications */}
                  <div className="relative z-10 space-y-1.5 text-xs sm:text-sm text-[#4A5550] font-sans font-normal mb-5 leading-relaxed">
                    <p>
                      <strong className="text-[#141C19] font-medium">Duration of expedition:</strong> 3 to 7 Days
                    </p>
                    <p>
                      <strong className="text-[#141C19] font-medium">Altitude & setting:</strong> 5,700 FT Alpine Pine Ridge
                    </p>
                    <p>
                      <strong className="text-[#141C19] font-medium">Key highlights:</strong> Cedar fireplaces, Kanchenjunga dawn panoramas, Sherpa tea trails
                    </p>
                  </div>

                  <p className="relative z-10 text-xs sm:text-sm text-gray-600 font-light leading-relaxed mb-6 max-w-lg">
                    Perched high above Darjeeling's mist lines, this alpine haven offers solitary creators and romantic couples pure mountain stillness, private crackling hearths, and single-estate tea tastings.
                  </p>

                  {/* Minimal Explorer Action Button */}
                  <div className="relative z-10">
                    <button
                      type="button"
                      onClick={() => onNavigate("lamahatta")}
                      className="px-6 py-2.5 rounded-sm border border-[#141C19]/40 hover:border-[#8A3828] hover:bg-[#8A3828] text-[#141C19] hover:text-white text-[11px] font-sans uppercase tracking-[0.2em] font-bold transition-all duration-300 shadow-xs cursor-pointer inline-flex items-center gap-2"
                    >
                      <span>Explore Route</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                </div>
              </div>

            </div>


            {/* ══════════════════════════════════════════════════════════
                ROUTE 02: SUNDARBAN (Left: Text, Right: Campfire Photo)
            ══════════════════════════════════════════════════════════ */}
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center text-left">
              
              {/* Left: Typography with Floating Golden Cursive Script */}
              <div className="lg:col-span-6 lg:order-1 relative lg:pr-4">
                <div className="relative">
                  
                  {/* Golden Cursive Signature Script in Background */}
                  <div className="absolute -top-10 sm:-top-16 -left-2 sm:-left-6 font-['Alex_Brush',cursive] text-6xl sm:text-8xl lg:text-9xl text-[#DEB868]/35 pointer-events-none select-none tracking-normal leading-none z-0">
                    Sundarban
                  </div>

                  {/* Red Waypoint Dot (Mobile/Tablet Indicator) */}
                  <div className="lg:hidden flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8A3828]" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A3828] font-bold">Route 02</span>
                  </div>

                  {/* Bold Condensed Explorer Headline */}
                  <h3 className="relative z-10 font-serif text-2xl sm:text-4xl font-bold uppercase tracking-tight text-[#141C19] mb-4 leading-[1.15]">
                    Expedition Across the Bengal Delta
                  </h3>

                  {/* Concise 3-Line Specifications */}
                  <div className="relative z-10 space-y-1.5 text-xs sm:text-sm text-[#4A5550] font-sans font-normal mb-5 leading-relaxed">
                    <p>
                      <strong className="text-[#141C19] font-medium">Duration of expedition:</strong> 2 to 5 Days
                    </p>
                    <p>
                      <strong className="text-[#141C19] font-medium">Setting & ecology:</strong> G-Plot Island Mangrove Coast & River Estuary
                    </p>
                    <p>
                      <strong className="text-[#141C19] font-medium">Key highlights:</strong> Silent boat safaris, estuary bonfires, fresh coastal delicacies
                    </p>
                  </div>

                  <p className="relative z-10 text-xs sm:text-sm text-gray-600 font-light leading-relaxed mb-6 max-w-lg">
                    Board silent wooden country boats to navigate pristine mangrove estuaries. Return at twilight to stilted eco-chalets, fireside feasts of freshly caught tiger prawns, and starlit river skies.
                  </p>

                  {/* Minimal Explorer Action Button */}
                  <div className="relative z-10">
                    <button
                      type="button"
                      onClick={() => onNavigate("sundarban")}
                      className="px-6 py-2.5 rounded-sm border border-[#141C19]/40 hover:border-[#8A3828] hover:bg-[#8A3828] text-[#141C19] hover:text-white text-[11px] font-sans uppercase tracking-[0.2em] font-bold transition-all duration-300 shadow-xs cursor-pointer inline-flex items-center gap-2"
                    >
                      <span>Explore Route</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                </div>
              </div>

              {/* Right: Campfire / Twilight Estuary with Watercolor Ragged Edge */}
              <div className="lg:col-span-6 lg:order-2 relative">
                <div className="relative max-w-md mx-auto lg:max-w-none">
                  {/* Organic Watercolor / Torn Feathered Mask */}
                  <div 
                    className="relative w-full h-80 sm:h-[420px] overflow-hidden"
                    style={{
                      maskImage: "radial-gradient(ellipse 92% 88% at 50% 50%, black 50%, rgba(0,0,0,0.8) 75%, transparent 100%)",
                      WebkitMaskImage: "radial-gradient(ellipse 92% 88% at 50% 50%, black 50%, rgba(0,0,0,0.8) 75%, transparent 100%)",
                    }}
                  >
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaYjy4e-XXFwdkagOoZsOEZkvT0V0piUX4M26-qP7uhiSca4muFrt42zavFFrNFiwrAxDnFlN8LLvbrUurlfDbK5s8Bb59J8Yy95kyAx0Eii7Ft-bg_tY1keeToWqrJlbuE0toY_YFwwB4HwIYwFZa2pt8_uL5pwNcAuFmHNLyW7ndRnGpJC5G0MVyYyn4KBS8PdBUSusvErNpb9zXUSizNvuOe_x2fWsvntUD5B8_J0zDSoQyXa9EXwR7IT8hfw8soEaOlhLwhEcdcaY"
                      alt="Sundarban Estuary Expedition"
                      className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-1000"
                    />
                  </div>
                </div>
              </div>

            </div>


            {/* ══════════════════════════════════════════════════════════
                ROUTE 03: KOLKATA (Left: Townhouse Walk, Right: Text)
            ══════════════════════════════════════════════════════════ */}
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center text-left">
              
              {/* Left: Historic Townhouse & Artisan Quarter with Watercolor Ragged Edge */}
              <div className="lg:col-span-6 relative">
                <div className="relative max-w-md mx-auto lg:max-w-none">
                  {/* Organic Watercolor / Torn Feathered Mask */}
                  <div 
                    className="relative w-full h-80 sm:h-[420px] overflow-hidden"
                    style={{
                      maskImage: "radial-gradient(ellipse 92% 88% at 50% 50%, black 50%, rgba(0,0,0,0.8) 75%, transparent 100%)",
                      WebkitMaskImage: "radial-gradient(ellipse 92% 88% at 50% 50%, black 50%, rgba(0,0,0,0.8) 75%, transparent 100%)",
                    }}
                  >
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnzKOH3iNF2rtJp50aMwTUPfE6LBIKwBUk29LG1GsW5nI-Wnt035Nv3LKXlVnOaWWfLsZrutatdm9RRaKk4PjlZ2GHbmdsN5dUSyisa4-p2xQR8smK8hbIvkovo7gJcPKnPOsuPlwnXSgAAWVS9vpTnqDo_CYbRwMGZrMvQ8sNfHfEPbfkU7UgUQOSwJBWRhxFViwFHBe5Z4aldltBhV4xNeY0jEQNJ2XLBdi6Eifx_VbZPesRVTQvbdPBhLTTTPRlYq5RxPGzg48"
                      alt="Kolkata Heritage Expedition"
                      className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-1000"
                    />
                  </div>
                </div>
              </div>

              {/* Right: Typography with Floating Golden Cursive Script */}
              <div className="lg:col-span-6 relative lg:pl-4">
                <div className="relative">
                  
                  {/* Golden Cursive Signature Script in Background */}
                  <div className="absolute -top-10 sm:-top-16 -left-2 sm:-left-6 font-['Alex_Brush',cursive] text-6xl sm:text-8xl lg:text-9xl text-[#DEB868]/35 pointer-events-none select-none tracking-normal leading-none z-0">
                    Kolkata
                  </div>

                  {/* Red Waypoint Dot (Mobile/Tablet Indicator) */}
                  <div className="lg:hidden flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8A3828]" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A3828] font-bold">Route 03</span>
                  </div>

                  {/* Bold Condensed Explorer Headline */}
                  <h3 className="relative z-10 font-serif text-2xl sm:text-4xl font-bold uppercase tracking-tight text-[#141C19] mb-4 leading-[1.15]">
                    Journey Through Historic Bengal
                  </h3>

                  {/* Concise 3-Line Specifications */}
                  <div className="relative z-10 space-y-1.5 text-xs sm:text-sm text-[#4A5550] font-sans font-normal mb-5 leading-relaxed">
                    <p>
                      <strong className="text-[#141C19] font-medium">Duration of expedition:</strong> 2 to 4 Days
                    </p>
                    <p>
                      <strong className="text-[#141C19] font-medium">Setting & ecology:</strong> Restored 1920s Colonial Townhouse
                    </p>
                    <p>
                      <strong className="text-[#141C19] font-medium">Key highlights:</strong> Crimson red oxide verandahs, Kumartuli clay potter walks, private courtyard feasts
                    </p>
                  </div>

                  <p className="relative z-10 text-xs sm:text-sm text-gray-600 font-light leading-relaxed mb-6 max-w-lg">
                    Step inside a 1920s classical residence with high-vaulted ceilings and antique teak furniture. Wander old bookstore lanes, watch generational idol sculptors, and savor authentic Bengali thalis in the courtyard.
                  </p>

                  {/* Minimal Explorer Action Button */}
                  <div className="relative z-10">
                    <button
                      type="button"
                      onClick={() => onNavigate("kolkata")}
                      className="px-6 py-2.5 rounded-sm border border-[#141C19]/40 hover:border-[#8A3828] hover:bg-[#8A3828] text-[#141C19] hover:text-white text-[11px] font-sans uppercase tracking-[0.2em] font-bold transition-all duration-300 shadow-xs cursor-pointer inline-flex items-center gap-2"
                    >
                      <span>Explore Route</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                </div>
              </div>

            </div>

          </div>

          {/* Bottom Trail Concierge Card */}
          <div className="mt-28 sm:mt-36 text-center border-t border-gray-200/80 pt-12 max-w-xl mx-auto space-y-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#8A3828] font-bold block">
              Multi-Stop Expedition
            </span>
            <h4 className="font-serif text-2xl font-normal text-[#141C19]">
              Custom Bengal Itineraries
            </h4>
            <p className="text-xs text-gray-500 font-light">
              Combine all three regional routes into a unified direct-hosted experience with private concierge transfers.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate("booking")}
                className="px-7 py-3 rounded-full bg-[#141C19] hover:bg-[#8A3828] text-white text-xs uppercase tracking-widest font-bold shadow-md transition-all cursor-pointer"
              >
                Plan Full Journey
              </button>
            </div>
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: "LOCATIONS" & "TESTIMONIALS" SPLIT SHOWCASE (JUST ABOVE FOOTER)
      ────────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
          
          {/* LEFT: LOCATIONS EXPLORER */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1E2F25] tracking-tight">
              Locations
            </h2>

            {/* Stylized Interactive Map / Location Canvas Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCD5C9] shadow-sm relative overflow-hidden space-y-6">
              
              {/* Top Map Visual Representation */}
              <div className="relative h-48 sm:h-56 rounded-2xl bg-[#E8E4DC] border border-[#D4CEBF] p-4 flex flex-col justify-between overflow-hidden">
                {/* Subtle topographic / road grid lines pattern */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#2B3E32_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Location Pins */}
                <div className="relative z-10 flex justify-between">
                  <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-200 shadow-sm text-xs font-semibold text-[#1C352D]">
                    <MapPin size={13} className="text-[#385242]" /> Lamahatta (5,700 FT)
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-200 shadow-sm text-xs font-semibold text-[#1C352D]">
                    <MapPin size={13} className="text-[#385242]" /> Kolkata (Colonial)
                  </div>
                </div>

                <div className="relative z-10 flex justify-center">
                  <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-200 shadow-sm text-xs font-semibold text-[#1C352D]">
                    <MapPin size={13} className="text-[#385242]" /> Sundarban (G-Plot Delta)
                  </div>
                </div>
              </div>

              {/* Location Selector Items */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  onClick={() => onNavigate("kolkata")}
                  className="p-3.5 rounded-2xl bg-[#F5F2EC] hover:bg-[#E1E8DF] border border-[#DCD5C9] text-left transition-colors cursor-pointer group"
                >
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Urban Haven</p>
                  <p className="font-serif text-sm font-bold text-[#1E2F25] group-hover:text-[#2B3E32]">Kolkata</p>
                </button>

                <button
                  onClick={() => onNavigate("sundarban")}
                  className="p-3.5 rounded-2xl bg-[#F5F2EC] hover:bg-[#E1E8DF] border border-[#DCD5C9] text-left transition-colors cursor-pointer group"
                >
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Estuary Eco</p>
                  <p className="font-serif text-sm font-bold text-[#1E2F25] group-hover:text-[#2B3E32]">Sundarban</p>
                </button>

                <button
                  onClick={() => onNavigate("lamahatta")}
                  className="p-3.5 rounded-2xl bg-[#F5F2EC] hover:bg-[#E1E8DF] border border-[#DCD5C9] text-left transition-colors cursor-pointer group"
                >
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Himalayan</p>
                  <p className="font-serif text-sm font-bold text-[#1E2F25] group-hover:text-[#2B3E32]">Lamahatta</p>
                </button>
              </div>
            </div>
          </div>


          {/* RIGHT: TESTIMONIALS & RESERVE DIRECT FEATURE */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1E2F25] tracking-tight">
              Testimonials
            </h2>

            {/* Deep Olive Green Feature Card */}
            <div className="bg-[#2B3E32] rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col justify-between min-h-[360px] relative overflow-hidden group">
              
              {/* Subtle background motif */}
              <div className="absolute right-4 bottom-4 text-white/[0.04] pointer-events-none select-none font-serif text-[120px] leading-none">
                ❖
              </div>

              <div>
                <div className="flex items-center gap-1 text-[#E6C587] mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#E6C587" stroke="#E6C587" />
                  ))}
                </div>

                <blockquote className="font-serif text-xl sm:text-2xl font-light italic leading-snug mb-6 text-gray-100">
                  "From our sunrise tea overlooking Kanchenjunga to the serene boat safaris in Sundarban, Satrangi made our family holiday unforgettable. Genuine hospitality rooted in the soil of Bengal."
                </blockquote>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm text-[#E6C587]">
                    S
                  </div>
                  <div>
                    <p className="font-serif text-sm font-bold text-white">Soumyadip Das & Family</p>
                    <p className="text-[11px] text-emerald-300 font-light">Verified Guest • Lamahatta & Sundarban</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/15 mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#E6C587] font-bold block">Direct Host Perks</span>
                  <span className="text-xs text-gray-300 font-light">Best price guaranteed with no middleman fee</span>
                </div>

                <button
                  onClick={() => onNavigate("booking")}
                  className="px-6 py-3 rounded-full bg-[#E6C587] hover:bg-white text-[#1E2F25] text-xs uppercase tracking-widest font-bold transition-all shadow-md cursor-pointer"
                >
                  Reserve Today
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
