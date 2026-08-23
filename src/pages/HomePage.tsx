import React, { useState } from "react";
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
  ShieldCheck, 
  Coffee, 
  Landmark, 
  TreePine,
  ChevronRight,
  ChevronLeft,
  X,
  PhoneCall,
  MessageSquare
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
  return (
    <div className="bg-[#2D4536] min-h-screen p-2 sm:p-4 lg:p-6 font-sans antialiased text-[#1C352D] selection:bg-[#2B3E32]/20">
      
      {/* ─────────────────────────────────────────────────────────────
          OUTER CANVAS CONTAINER (WARM IVORY CARD WITH ROUNDED CORNERS)
      ────────────────────────────────────────────────────────────── */}
      <div className="bg-[#FAF7F2] rounded-[24px] sm:rounded-[36px] lg:rounded-[44px] overflow-hidden shadow-2xl max-w-[1440px] mx-auto border border-[#E5DEC9]">
        
        {/* SVG Clip Path Definitions & Watercolor Ink Bleed Distortion Filters */}
        <svg className="absolute w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <defs>
            {/* Organic Watercolor Ink Distortion Filter matching reference painting bleed */}
            <filter id="watercolor-distort" x="-25%" y="-25%" width="150%" height="150%">
              <feTurbulence type="fractalNoise" baseFrequency="0.038" numOctaves="5" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="34" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            </filter>

            <clipPath id="torn-deckle-1" clipPathUnits="objectBoundingBox">
              <path d="M 0.05,0.08 C 0.15,0.01 0.28,0.09 0.42,0.01 C 0.58,0.06 0.72,0.01 0.88,0.06 C 0.96,0.02 0.99,0.12 0.96,0.25 C 0.99,0.42 0.93,0.58 0.98,0.75 C 0.92,0.88 0.96,0.96 0.85,0.95 C 0.71,0.99 0.55,0.92 0.41,0.98 C 0.26,0.93 0.12,0.98 0.04,0.91 C 0.01,0.82 0.06,0.68 0.01,0.52 C 0.05,0.38 0.01,0.22 0.05,0.11 Z" />
            </clipPath>

            <clipPath id="torn-deckle-2" clipPathUnits="objectBoundingBox">
              <path d="M 0.08,0.04 C 0.24,0.01 0.48,0.08 0.71,0.02 C 0.86,0.06 0.97,0.11 0.94,0.26 C 0.98,0.41 0.92,0.59 0.97,0.76 C 0.92,0.89 0.84,0.98 0.69,0.95 C 0.52,0.99 0.35,0.92 0.18,0.97 C 0.07,0.91 0.02,0.81 0.04,0.65 C 0.01,0.49 0.05,0.32 0.01,0.18 Z" />
            </clipPath>

            <clipPath id="torn-deckle-3" clipPathUnits="objectBoundingBox">
              <path d="M 0.04,0.06 C 0.19,0.01 0.42,0.07 0.65,0.02 C 0.82,0.05 0.96,0.09 0.94,0.25 C 0.98,0.44 0.93,0.62 0.97,0.81 C 0.94,0.91 0.82,0.97 0.66,0.94 C 0.48,0.98 0.32,0.93 0.15,0.97 C 0.05,0.91 0.02,0.78 0.04,0.62 C 0.01,0.46 0.04,0.29 0.01,0.15 Z" />
            </clipPath>
          </defs>
        </svg>

        {/* ─────────────────────────────────────────────────────────────
            SECTION 1: ILLUSTRATED HERO WITH SCALLOPED EMERALD BADGE & QUICK BOOKING
        ────────────────────────────────────────────────────────────── */}
        <section className="relative pt-4 sm:pt-6 pb-12 sm:pb-20 px-3 sm:px-6 max-w-[1360px] mx-auto">
          
          {/* Illustrated Nature Canvas Container */}
          <div className="relative w-full min-h-[520px] sm:min-h-[620px] lg:min-h-[700px] rounded-[24px] sm:rounded-[36px] overflow-hidden shadow-xl border border-[#DCD5C9] bg-[#FAF7F2] flex items-center justify-center">
            
            {/* Background Botanical Watercolor Illustration */}
            <div 
              className="absolute inset-0 bg-cover bg-center sm:bg-bottom"
              style={{ backgroundImage: "url('/glamping_hero_illustrated.jpg')" }}
            />
            
            {/* Subtle Atmospheric Top Light Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/15 pointer-events-none" />

            {/* Flying Birds Decorative Accent in Sky */}
            <div className="absolute top-8 left-8 sm:top-12 sm:left-14 opacity-70 pointer-events-none select-none">
              <svg width="60" height="30" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 10,25 Q 25,10 40,25 Q 55,10 70,25" stroke="#1E2F25" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 45,38 Q 55,28 65,38 Q 75,28 85,38" stroke="#1E2F25" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            {/* ══════════════════════════════════════════════════════════
                CENTER SCALLOPED EMERALD GREEN BADGE (MATCHING REFERENCE)
            ══════════════════════════════════════════════════════════ */}
            <div className="relative z-20 max-w-sm sm:max-w-md mx-4 text-center">
              <div className="relative bg-[#274E39]/95 backdrop-blur-md text-white p-7 sm:p-10 rounded-[28px] sm:rounded-[36px] shadow-[0_20px_60px_rgba(20,40,28,0.4)] border-2 border-[#528A6B]/50">
                
                {/* Delicate Scalloped Dashed Border */}
                <div className="absolute inset-2 sm:inset-2.5 rounded-[22px] sm:rounded-[30px] border border-dashed border-[#A4CBB4]/40 pointer-events-none" />

                {/* Grand Serif Headline */}
                <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal text-[#FAF6ED] uppercase tracking-tight leading-[1.1] mb-3 sm:mb-4 drop-shadow-sm">
                  Your Retreat <br />
                  by the River
                </h1>

                {/* Refined Subtitle */}
                <p className="font-sans text-xs sm:text-sm text-[#E2EBE5] font-light leading-relaxed max-w-xs mx-auto">
                  Rental of cozy eco-villas and luxury safari tents across Bengal's pristine wilderness
                </p>

                {/* Botanical Blue Wildflower Accent at Corner */}
                <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-12 h-12 sm:w-14 sm:h-14 pointer-events-none select-none">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="14" fill="#3B82F6" />
                    <circle cx="35" cy="40" r="10" fill="#60A5FA" />
                    <circle cx="65" cy="40" r="10" fill="#60A5FA" />
                    <circle cx="40" cy="65" r="10" fill="#2563EB" />
                    <circle cx="60" cy="65" r="10" fill="#2563EB" />
                    <circle cx="50" cy="50" r="6" fill="#FBBF24" />
                    <path d="M 50,75 Q 40,95 25,98" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>

              </div>
            </div>

          </div>

          {/* ══════════════════════════════════════════════════════════
              FLOATING QUICK BOOKING PILL BAR (MATCHING REFERENCE)
          ══════════════════════════════════════════════════════════ */}
          <div className="relative z-30 -mt-8 sm:-mt-10 max-w-4xl mx-auto px-2 sm:px-4">
            <div className="bg-[#EBE5D8]/95 backdrop-blur-xl p-2.5 sm:p-3.5 rounded-2xl sm:rounded-full shadow-[0_20px_50px_rgba(20,35,25,0.18)] border border-[#DCD5C9] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 items-center">
              
              {/* Field 1: Check-In Pill */}
              <div className="bg-white rounded-xl sm:rounded-full px-4 py-2 sm:py-2.5 shadow-xs border border-gray-200/80 flex flex-col justify-center text-left">
                <label className="block text-[9px] text-gray-500 uppercase tracking-wider font-semibold">
                  Check-in
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
                  className="w-full bg-transparent text-xs sm:text-[13px] text-gray-900 font-medium outline-none cursor-pointer"
                />
              </div>

              {/* Field 2: Check-Out Pill */}
              <div className="bg-white rounded-xl sm:rounded-full px-4 py-2 sm:py-2.5 shadow-xs border border-gray-200/80 flex flex-col justify-center text-left">
                <label className="block text-[9px] text-gray-500 uppercase tracking-wider font-semibold">
                  Check-out
                </label>
                <input
                  type="date"
                  min={getFormattedDateString(1, checkInSelect)}
                  value={checkOutSelect}
                  onChange={(e) => setCheckOutSelect(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-[13px] text-gray-900 font-medium outline-none cursor-pointer"
                />
              </div>

              {/* Field 3: Number of Guests Stepper Pill */}
              <div className="bg-white rounded-xl sm:rounded-full px-4 py-2 sm:py-2.5 shadow-xs border border-gray-200/80 flex items-center justify-between">
                <div>
                  <label className="block text-[9px] text-gray-500 uppercase tracking-wider font-semibold text-left">
                    Guests
                  </label>
                  <span className="text-xs sm:text-[13px] font-semibold text-gray-900">
                    {guestsCountSelect} {guestsCountSelect === 1 ? "guest" : "guests"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (setGuestsCountSelect && guestsCountSelect > 1) {
                        setGuestsCountSelect(guestsCountSelect - 1);
                      }
                    }}
                    disabled={guestsCountSelect <= 1}
                    aria-label="Decrease guests"
                    className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Minus size={11} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (setGuestsCountSelect && guestsCountSelect < 10) {
                        setGuestsCountSelect(guestsCountSelect + 1);
                      }
                    }}
                    disabled={guestsCountSelect >= 10}
                    aria-label="Increase guests"
                    className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Plus size={11} />
                  </button>
                </div>
              </div>

              {/* Field 4: Primary Action Button */}
              <div>
                <button
                  type="button"
                  onClick={() => onNavigate("booking", selectedDestIdForBooking)}
                  className="w-full bg-[#274E39] hover:bg-[#1E3A2B] text-white py-3.5 sm:py-4 rounded-xl sm:rounded-full text-xs font-sans uppercase tracking-[0.2em] font-bold shadow-md hover:shadow-xl transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-white/20"
                >
                  <span>Check Availability</span>
                  <ArrowRight size={13} />
                </button>
              </div>

            </div>
          </div>

        </section>


        {/* ─────────────────────────────────────────────────────────────
            SECTION 2: "WE ARE SATRANGI" (POLAROID PHOTO + STORY EDITORIAL)
        ────────────────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-28 px-4 sm:px-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Authentic Polaroid Photo with Washi Tape & Flowers */}
            <div className="lg:col-span-5 relative flex justify-center order-2 lg:order-1">
              <div className="relative group">
                
                {/* Washi Tape at Top */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#EBE4D3]/90 backdrop-blur-xs border border-white/40 shadow-xs transform -rotate-2 z-30 pointer-events-none" />

                {/* White Polaroid Card */}
                <div className="bg-white p-3 sm:p-4 pb-12 sm:pb-14 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-200/90 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500 max-w-[320px] sm:max-w-[360px]">
                  <div className="w-full aspect-square overflow-hidden bg-stone-100">
                    <img 
                      src="/host_family_polaroid.jpg" 
                      alt="The Satrangi Family Hosts" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="mt-4 text-center font-serif text-sm italic text-gray-700">
                    "Where nature meets home" • Est. 2021
                  </div>
                </div>

                {/* Corner Lavender / Wildflower Sprig Accent */}
                <div className="absolute -bottom-4 -right-4 w-16 h-20 pointer-events-none select-none z-30">
                  <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 40,90 Q 30,50 45,15" stroke="#22543D" strokeWidth="2.5" strokeLinecap="round" />
                    <ellipse cx="43" cy="20" rx="5" ry="3" fill="#6366F1" transform="rotate(-20 43 20)" />
                    <ellipse cx="33" cy="35" rx="5" ry="3" fill="#818CF8" transform="rotate(30 33 35)" />
                    <ellipse cx="46" cy="45" rx="5" ry="3" fill="#4F46E5" transform="rotate(-15 46 45)" />
                    <ellipse cx="36" cy="60" rx="5" ry="3" fill="#6366F1" transform="rotate(25 36 60)" />
                  </svg>
                </div>

              </div>
            </div>

            {/* Right Column: Editorial Narrative & Host Philosophy */}
            <div className="lg:col-span-7 text-left lg:pl-4 relative order-1 lg:order-2">
              
              {/* Pine Needle Sprig Illustration in Top Right */}
              <div className="absolute -top-10 right-0 w-24 h-24 opacity-60 pointer-events-none select-none hidden sm:block">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 80,10 Q 50,40 20,80" stroke="#2D5A3F" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 75,18 L 88,8" stroke="#3D7554" strokeWidth="1.5" />
                  <path d="M 68,26 L 82,20" stroke="#3D7554" strokeWidth="1.5" />
                  <path d="M 60,34 L 74,32" stroke="#3D7554" strokeWidth="1.5" />
                  <path d="M 50,44 L 66,45" stroke="#3D7554" strokeWidth="1.5" />
                  <path d="M 40,55 L 56,58" stroke="#3D7554" strokeWidth="1.5" />
                </svg>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#1E3529] uppercase tracking-tight mb-5 leading-[1.1]">
                We are Satrangi Sanctuaries
              </h2>

              <p className="font-serif text-base sm:text-lg text-[#274E39] font-medium leading-relaxed mb-4">
                Satrangi is where Bengal’s untamed nature meets the warmth and comfort of thoughtful, modern living.
              </p>

              <div className="space-y-4 text-xs sm:text-sm text-gray-700 font-light leading-relaxed">
                <p>
                  We are a family-hosted collective of eco-sanctuaries across West Bengal. One day, tired of urban rush, we felt how deeply people crave a true breath of fresh air—without noise, without rush, but with genuine hospitality, cozy fireplaces, and handcrafted spaces.
                </p>
                <p>
                  We built our sanctuaries with our own hands and profound love for native ecosystems: from the alpine pine ridges of Lamahatta to the mangrove estuaries of Sundarban and restored colonial residences in Kolkata.
                </p>
                <p>
                  Here, everything is thoughtfully designed for you to slow down: starlit river skies, fresh estate-grown teas, warm wooden beds, and the gentle whisper of river breezes.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate("about")}
                  className="px-6 py-2.5 rounded-full bg-[#1C352D] hover:bg-[#274E39] text-white text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-md cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Our Philosophy & Story</span>
                  <ArrowRight size={13} />
                </button>
                <span className="text-xs text-gray-500 font-mono tracking-wider">
                  Hosted by local custodians
                </span>
              </div>

            </div>

          </div>
        </section>



        {/* ─────────────────────────────────────────────────────────────
            SECTION 4: THREE REGIONAL EXPEDITION ROUTES (TORN DECKLE CARDS)
        ────────────────────────────────────────────────────────────── */}
        <section className="relative py-24 sm:py-36 bg-[#FAF7F2] overflow-hidden border-b border-[#DCD5C9]/80">
          
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
            
            {/* Continuous Red/Terracotta & Gold Winding Expedition Threads (Behind Images) */}
            <div className="hidden lg:block absolute inset-0 pointer-events-none select-none z-0">
              <svg className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1000 1800">
                <defs>
                  <linearGradient id="trailGradientPrimary" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8A3828" stopOpacity="0.9" />
                    <stop offset="30%" stopColor="#A84832" stopOpacity="0.95" />
                    <stop offset="60%" stopColor="#C5A059" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#8A3828" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="trailGradientSecondary" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#C5A059" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#8A3828" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#C5A059" stopOpacity="0.7" />
                  </linearGradient>
                  <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Secondary Harmonic Topographic Echo Thread (Dashed) */}
                <path
                  d="M 160,30 C 260,80 320,180 290,270 C 260,360 190,410 270,480 C 350,550 510,560 630,640 C 760,720 850,770 820,880 C 790,980 670,1030 590,1080 C 440,1160 300,1210 240,1310"
                  stroke="url(#trailGradientSecondary)"
                  strokeWidth="1.25"
                  strokeDasharray="5 7"
                  opacity="0.7"
                />

                {/* Primary Fluid Explorer Thread Path */}
                <path
                  d="M 130,20 C 230,70 290,170 260,255 C 230,345 160,395 240,465 C 320,535 480,545 600,625 C 730,705 820,755 790,865 C 760,965 640,1015 560,1065 C 410,1145 270,1195 210,1295"
                  stroke="url(#trailGradientPrimary)"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />

                {/* Waypoints */}
                <g filter="url(#softGlow)">
                  <circle cx="260" cy="255" r="9" fill="#8A3828" fillOpacity="0.15" />
                  <circle cx="260" cy="255" r="5" fill="#8A3828" />
                  <circle cx="260" cy="255" r="2" fill="#FAF8F5" />
                </g>

                <g filter="url(#softGlow)">
                  <circle cx="790" cy="865" r="9" fill="#8A3828" fillOpacity="0.15" />
                  <circle cx="790" cy="865" r="5" fill="#8A3828" />
                  <circle cx="790" cy="865" r="2" fill="#FAF8F5" />
                </g>

                <g filter="url(#softGlow)">
                  <circle cx="210" cy="1295" r="9" fill="#8A3828" fillOpacity="0.15" />
                  <circle cx="210" cy="1295" r="5" fill="#8A3828" />
                  <circle cx="210" cy="1295" r="2" fill="#FAF8F5" />
                </g>
              </svg>
            </div>

            <div className="relative z-10 space-y-32 sm:space-y-44">
              
              {/* Route 01: Lamahatta */}
              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center text-left">
                <div className="lg:col-span-6 relative order-2 lg:order-1">
                  <div className="relative max-w-md mx-auto lg:max-w-none group">
                    <div 
                      className="absolute inset-0 bg-[#DECA9E]/80 rounded-2xl transform rotate-1 scale-105 filter blur-[1px] transition-transform duration-700 group-hover:rotate-2 pointer-events-none"
                      style={{ 
                        clipPath: "url(#torn-deckle-1)", 
                        WebkitClipPath: "url(#torn-deckle-1)"
                      }}
                    />
                    <div 
                      className="absolute inset-0 bg-[#C8B282]/45 rounded-2xl transform -rotate-1 scale-103 transition-transform duration-700 group-hover:-rotate-2 pointer-events-none"
                      style={{ 
                        clipPath: "url(#torn-deckle-1)", 
                        WebkitClipPath: "url(#torn-deckle-1)"
                      }}
                    />
                    <div 
                      className="relative w-full h-80 sm:h-[420px] overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] bg-[#141C19]"
                      style={{ 
                        clipPath: "url(#torn-deckle-1)", 
                        WebkitClipPath: "url(#torn-deckle-1)",
                        maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 80%, rgba(0,0,0,0.6) 94%, rgba(0,0,0,0) 100%)",
                        WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 80%, rgba(0,0,0,0.6) 94%, rgba(0,0,0,0) 100%)"
                      }}
                    >
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzEiAu-fkjC0NgmgIUPTFihWx0mHcqWI0hHW-EX-IDpcdyKCINRjMFuFJUK9lO5Vmfz1cF31rDvFgpmqQG6rR5CStyat8Z3wIJgEn_6g_nI-d-0SdQPayjDMsDpaGzVfdYUwdU17sFNB_dqk7D1Hk7LuniZNnaMqxlG9OsQWbfPabij4A0mxJLyE-H3uQN7S7GsCJxkwpJryjypBSxfhAmyumPBvPJXJDZa9y2zr-evpmrbhSOgU6izo91asyc_A5IecbRraWWpLqn0"
                        alt="Lamahatta Mountain Expedition"
                        className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 relative lg:pl-4 order-1 lg:order-2">
                  <div className="relative">
                    <div className="absolute -top-10 sm:-top-16 -left-2 sm:-left-6 font-['Alex_Brush',cursive] text-6xl sm:text-8xl lg:text-9xl text-[#DEB868]/35 pointer-events-none select-none tracking-normal leading-none z-0">
                      Lamahatta
                    </div>
                    <div className="lg:hidden flex items-center gap-2 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8A3828]" />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A3828] font-bold">Route 01</span>
                    </div>
                    <h3 className="relative z-10 font-serif text-2xl sm:text-4xl font-bold uppercase tracking-tight text-[#141C19] mb-4 leading-[1.15]">
                      Ascent to Kanchenjunga Ridge
                    </h3>
                    <div className="relative z-10 space-y-1.5 text-xs sm:text-sm text-[#4A5550] font-sans font-normal mb-5 leading-relaxed">
                      <p><strong className="text-[#141C19] font-medium">Duration:</strong> 3 to 7 Days</p>
                      <p><strong className="text-[#141C19] font-medium">Setting:</strong> 5,700 FT Alpine Pine Ridge</p>
                      <p><strong className="text-[#141C19] font-medium">Highlights:</strong> Cedar fireplaces, Kanchenjunga dawn panoramas, Sherpa tea trails</p>
                    </div>
                    <p className="relative z-10 text-xs sm:text-sm text-gray-600 font-light leading-relaxed mb-6 max-w-lg">
                      Perched high above Darjeeling's mist lines, this alpine haven offers solitary creators and romantic couples pure mountain stillness, private crackling hearths, and single-estate tea tastings.
                    </p>
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

              {/* Route 02: Sundarban */}
              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center text-left">
                <div className="lg:col-span-6 lg:order-1 relative lg:pr-4 order-1">
                  <div className="relative">
                    <div className="absolute -top-10 sm:-top-16 -left-2 sm:-left-6 font-['Alex_Brush',cursive] text-6xl sm:text-8xl lg:text-9xl text-[#DEB868]/35 pointer-events-none select-none tracking-normal leading-none z-0">
                      Sundarban
                    </div>
                    <div className="lg:hidden flex items-center gap-2 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8A3828]" />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A3828] font-bold">Route 02</span>
                    </div>
                    <h3 className="relative z-10 font-serif text-2xl sm:text-4xl font-bold uppercase tracking-tight text-[#141C19] mb-4 leading-[1.15]">
                      Expedition Across the Bengal Delta
                    </h3>
                    <div className="relative z-10 space-y-1.5 text-xs sm:text-sm text-[#4A5550] font-sans font-normal mb-5 leading-relaxed">
                      <p><strong className="text-[#141C19] font-medium">Duration:</strong> 2 to 5 Days</p>
                      <p><strong className="text-[#141C19] font-medium">Setting:</strong> G-Plot Island Mangrove Coast & River Estuary</p>
                      <p><strong className="text-[#141C19] font-medium">Highlights:</strong> Silent boat safaris, estuary bonfires, fresh coastal delicacies</p>
                    </div>
                    <p className="relative z-10 text-xs sm:text-sm text-gray-600 font-light leading-relaxed mb-6 max-w-lg">
                      Board silent wooden country boats to navigate pristine mangrove estuaries. Return at twilight to stilted eco-chalets, fireside feasts of freshly caught tiger prawns, and starlit river skies.
                    </p>
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

                <div className="lg:col-span-6 lg:order-2 relative order-2">
                  <div className="relative max-w-md mx-auto lg:max-w-none group">
                    <div 
                      className="absolute inset-0 bg-[#DECA9E]/80 rounded-2xl transform -rotate-1 scale-105 filter blur-[1px] transition-transform duration-700 group-hover:-rotate-2 pointer-events-none"
                      style={{ 
                        clipPath: "url(#torn-deckle-2)", 
                        WebkitClipPath: "url(#torn-deckle-2)"
                      }}
                    />
                    <div 
                      className="absolute inset-0 bg-[#C8B282]/45 rounded-2xl transform rotate-1 scale-103 transition-transform duration-700 group-hover:rotate-2 pointer-events-none"
                      style={{ 
                        clipPath: "url(#torn-deckle-2)", 
                        WebkitClipPath: "url(#torn-deckle-2)"
                      }}
                    />
                    <div 
                      className="relative w-full h-80 sm:h-[420px] overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] bg-[#141C19]"
                      style={{ 
                        clipPath: "url(#torn-deckle-2)", 
                        WebkitClipPath: "url(#torn-deckle-2)",
                        maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 80%, rgba(0,0,0,0.6) 94%, rgba(0,0,0,0) 100%)",
                        WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 80%, rgba(0,0,0,0.6) 94%, rgba(0,0,0,0) 100%)"
                      }}
                    >
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaYjy4e-XXFwdkagOoZsOEZkvT0V0piUX4M26-qP7uhiSca4muFrt42zavFFrNFiwrAxDnFlN8LLvbrUurlfDbK5s8Bb59J8Yy95kyAx0Eii7Ft-bg_tY1keeToWqrJlbuE0toY_YFwwB4HwIYwFZa2pt8_uL5pwNcAuFmHNLyW7ndRnGpJC5G0MVyYyn4KBS8PdBUSusvErNpb9zXUSizNvuOe_x2fWsvntUD5B8_J0zDSoQyXa9EXwR7IT8hfw8soEaOlhLwhEcdcaY"
                        alt="Sundarban Estuary Expedition"
                        className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Route 03: Kolkata */}
              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center text-left">
                <div className="lg:col-span-6 relative order-2 lg:order-1">
                  <div className="relative max-w-md mx-auto lg:max-w-none group">
                    <div 
                      className="absolute inset-0 bg-[#DECA9E]/80 rounded-2xl transform rotate-1 scale-105 filter blur-[1px] transition-transform duration-700 group-hover:rotate-2 pointer-events-none"
                      style={{ 
                        clipPath: "url(#torn-deckle-3)", 
                        WebkitClipPath: "url(#torn-deckle-3)"
                      }}
                    />
                    <div 
                      className="absolute inset-0 bg-[#C8B282]/45 rounded-2xl transform -rotate-1 scale-103 transition-transform duration-700 group-hover:-rotate-2 pointer-events-none"
                      style={{ 
                        clipPath: "url(#torn-deckle-3)", 
                        WebkitClipPath: "url(#torn-deckle-3)"
                      }}
                    />
                    <div 
                      className="relative w-full h-80 sm:h-[420px] overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] bg-[#141C19]"
                      style={{ 
                        clipPath: "url(#torn-deckle-3)", 
                        WebkitClipPath: "url(#torn-deckle-3)",
                        maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 80%, rgba(0,0,0,0.6) 94%, rgba(0,0,0,0) 100%)",
                        WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 80%, rgba(0,0,0,0.6) 94%, rgba(0,0,0,0) 100%)"
                      }}
                    >
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnzKOH3iNF2rtJp50aMwTUPfE6LBIKwBUk29LG1GsW5nI-Wnt035Nv3LKXlVnOaWWfLsZrutatdm9RRaKk4PjlZ2GHbmdsN5dUSyisa4-p2xQR8smK8hbIvkovo7gJcPKnPOsuPlwnXSgAAWVS9vpTnqDo_CYbRwMGZrMvQ8sNfHfEPbfkU7UgUQOSwJBWRhxFViwFHBe5Z4aldltBhV4xNeY0jEQNJ2XLBdi6Eifx_VbZPesRVTQvbdPBhLTTTPRlYq5RxPGzg48"
                        alt="Kolkata Heritage Expedition"
                        className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 relative lg:pl-4 order-1 lg:order-2">
                  <div className="relative">
                    <div className="absolute -top-10 sm:-top-16 -left-2 sm:-left-6 font-['Alex_Brush',cursive] text-6xl sm:text-8xl lg:text-9xl text-[#DEB868]/35 pointer-events-none select-none tracking-normal leading-none z-0">
                      Kolkata
                    </div>
                    <div className="lg:hidden flex items-center gap-2 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8A3828]" />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A3828] font-bold">Route 03</span>
                    </div>
                    <h3 className="relative z-10 font-serif text-2xl sm:text-4xl font-bold uppercase tracking-tight text-[#141C19] mb-4 leading-[1.15]">
                      Journey Through Historic Bengal
                    </h3>
                    <div className="relative z-10 space-y-1.5 text-xs sm:text-sm text-[#4A5550] font-sans font-normal mb-5 leading-relaxed">
                      <p><strong className="text-[#141C19] font-medium">Duration:</strong> 2 to 4 Days</p>
                      <p><strong className="text-[#141C19] font-medium">Setting:</strong> Restored 1920s Colonial Townhouse</p>
                      <p><strong className="text-[#141C19] font-medium">Highlights:</strong> Crimson red oxide verandahs, Kumartuli clay potter walks, private courtyard feasts</p>
                    </div>
                    <p className="relative z-10 text-xs sm:text-sm text-gray-600 font-light leading-relaxed mb-6 max-w-lg">
                      Step inside a 1920s classical residence with high-vaulted ceilings and antique teak furniture. Wander old bookstore lanes, watch generational idol sculptors, and savor authentic Bengali thalis in the courtyard.
                    </p>
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

          </div>
        </section>


        {/* ─────────────────────────────────────────────────────────────
            SECTION 5: BOTTOM HOST CONCIERGE CARD (MATCHING REFERENCE)
        ────────────────────────────────────────────────────────────── */}
        <section className="py-12 sm:py-16 px-4 sm:px-6">
          <div className="bg-[#244131] text-white p-6 sm:p-10 rounded-[28px] sm:rounded-[36px] shadow-2xl max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 border border-emerald-500/20">
            
            <div className="flex items-center gap-4 sm:gap-5 text-left">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[#C5A059] shrink-0 shadow-md">
                <img 
                  src="/host_family_polaroid.jpg" 
                  alt="Satrangi Concierge Host" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#E6C587] font-semibold block">
                  Direct Host Concierge
                </span>
                <h4 className="font-serif text-lg sm:text-xl font-normal text-white">
                  Have questions or custom dates?
                </h4>
                <p className="text-xs text-gray-300 font-light mt-0.5">
                  Talk directly with our local retreat hosts via WhatsApp or phone
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white text-xs uppercase tracking-wider font-bold transition-all shadow-lg text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare size={14} />
                <span>WhatsApp Hosts</span>
              </a>
              <button
                type="button"
                onClick={() => onNavigate("contact")}
                className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-wider font-semibold transition-all border border-white/20 text-center cursor-pointer"
              >
                Contact Us
              </button>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
