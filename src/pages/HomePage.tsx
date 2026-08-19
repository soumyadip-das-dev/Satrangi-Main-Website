import React, { useState, useEffect } from "react";
import { ArrowRight, MapPin, Calendar, Users, Compass, Sparkles, Star } from "lucide-react";
import { Destination, Room } from "../types";
import { Currency, formatPrice } from "../utils/currency";
import SuitePhotoCarousel from "../components/SuitePhotoCarousel";

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
  onNavigate,
  onSelectRoomModal,
}: HomePageProps) {
  const [heroIndex, setHeroIndex] = useState(0);

  const heroSlides = [
    {
      img: "/lamahatta_hero.png",
      tagline: "SERENITY FOR SOLO TRAVELERS, COUPLES & FAMILIES",
      title: "Lamahatta Mountain Sanctuary",
      desc: "Wake up above the Himalayan mist at 5,700 feet. A peaceful mountain retreat featuring private hearth decks, skylights for stargazing, and fireside teas."
    },
    {
      img: "/sundarban_hero.png",
      tagline: "UNFORGETTABLE WILDLIFE SAFARIS & FAMILY ECO-LODGING",
      title: "Sundarban Estuarine Sanctuary",
      desc: "High-comfort stilted cabins where mangrove rivers meet golden shores. Guided electric boat safaris, red crab colonies, and organic homestyle Bengal feasts."
    },
    {
      img: "/kolkata_hero.png",
      tagline: "HISTORIC CHARM, BOUTIQUE COMFORT & CULTURAL IMMERSION",
      title: "Kolkata Heritage Residence",
      desc: "Step inside a lovingly restored 1920s colonial townhouse. Courtyard reading alcoves, hand-curated art libraries, and chef-guided Bengali thali workshops."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Carousel Slider */}
      <section className="relative h-[85vh] min-h-[500px] w-full overflow-hidden bg-[#2D463E]">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === heroIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-referrer scale-105 transition-transform duration-[6s]"
              style={{ backgroundImage: `url(${slide.img})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-[#faf9f6]/95" />

            {/* Hero Content Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20">
              <span className="text-white mb-4 text-xs font-semibold tracking-[0.4em] uppercase opacity-95">
                {slide.tagline}
              </span>
              <h1 className="font-serif text-white text-5xl sm:text-7xl font-bold max-w-4xl mb-6 italic leading-tight">
                {slide.title}
              </h1>
              <p className="text-white/80 font-sans text-sm sm:text-base max-w-xl mb-8 leading-relaxed font-light">
                {slide.desc}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() =>
                    onNavigate(
                      slide.title.toLowerCase().includes("kolkata")
                        ? "kolkata"
                        : slide.title.toLowerCase().includes("sundarban")
                        ? "sundarban"
                        : "lamahatta"
                    )
                  }
                  className="bg-white hover:bg-[#A45D3B] hover:text-white text-[#2D463E] px-8 py-3.5 text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-lg cursor-pointer"
                >
                  Explore Escape
                </button>
                <button
                  onClick={() =>
                    onNavigate(
                      "booking",
                      slide.title.toLowerCase().includes("kolkata")
                        ? "kolkata"
                        : slide.title.toLowerCase().includes("sundarban")
                        ? "sundarban"
                        : "lamahatta"
                    )
                  }
                  className="border border-white/50 hover:bg-white/10 text-white px-8 py-3.5 text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer"
                >
                  Book Your Stay
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroIndex(idx)}
              className={`w-10 h-1 transition-all ${
                idx === heroIndex ? "bg-[#A45D3B]" : "bg-white/40 hover:bg-white"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Floating Glassmorphic Quick Booking Search Bar */}
      <section className="relative z-30 -mt-12 max-w-5xl mx-auto px-6">
        <div className="bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-gray-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
          <div>
            <label className="block text-[10px] text-[#B85A32] uppercase tracking-widest mb-1.5 font-bold flex items-center gap-1">
              <MapPin size={12} /> Select Retreat
            </label>
            <select
              onChange={(e) => setSelectedDestIdForBooking(e.target.value)}
              value={selectedDestIdForBooking}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs py-2.5 px-3 text-gray-800 outline-none focus:border-[#B85A32] font-semibold"
            >
              <option value="lamahatta">Lamahatta (Alpine)</option>
              <option value="sundarban">Sundarban (Delta Safari)</option>
              <option value="kolkata">Kolkata (Urban Heritage)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-[#B85A32] uppercase tracking-widest mb-1.5 font-bold flex items-center gap-1">
              <Calendar size={12} /> Check-In
            </label>
            <input
              type="date"
              value={checkInSelect}
              onChange={(e) => setCheckInSelect(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs py-2 px-3 text-gray-800 outline-none focus:border-[#B85A32] font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] text-[#B85A32] uppercase tracking-widest mb-1.5 font-bold flex items-center gap-1">
              <Calendar size={12} /> Check-Out
            </label>
            <input
              type="date"
              value={checkOutSelect}
              onChange={(e) => setCheckOutSelect(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs py-2 px-3 text-gray-800 outline-none focus:border-[#B85A32] font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] text-[#B85A32] uppercase tracking-widest mb-1.5 font-bold flex items-center gap-1">
              <Users size={12} /> Guests
            </label>
            <select
              value={2}
              onChange={() => {}}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs py-2.5 px-3 text-gray-800 outline-none focus:border-[#B85A32] font-semibold"
            >
              <option value={1}>1 Guest</option>
              <option value={2}>2 Guests</option>
              <option value={3}>3 Guests</option>
              <option value={4}>4 Guests</option>
            </select>
          </div>

          <button
            onClick={() => onNavigate("booking", selectedDestIdForBooking)}
            className="w-full bg-[#1C352D] hover:bg-[#B85A32] text-white py-3.5 rounded-full text-xs font-sans uppercase tracking-widest font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer mt-2 sm:mt-0"
          >
            <span>Check Suites</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* Tailored Escapes Section */}
      <section className="py-16 bg-[#FAF8F5] border-y border-gray-200/60 my-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] text-[#B85A32] font-sans font-bold uppercase tracking-[0.3em] block mb-2">
              Tailored Hospitality
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C352D]">
              Crafted For Every Traveler's Journey
            </h2>
            <p className="text-xs text-gray-500 font-sans max-w-xl mx-auto mt-2 leading-relaxed">
              Whether you are traveling solo, reconnecting as a couple, vacationing with family, or seeking deep cultural immersion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Solo */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#1C352D]/10 text-[#1C352D] flex items-center justify-center mb-4">
                <Compass size={20} />
              </div>
              <span className="text-[9px] uppercase font-bold text-[#B85A32] tracking-widest block mb-1">
                Solo Explorers & Writers
              </span>
              <h3 className="font-serif text-lg font-bold text-[#1C352D] mb-2">
                Quiet Sanctuaries & Safe Immersion
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-sans">
                Restful reading nooks, ultra-fast Starlink Wi-Fi, peaceful garden alcoves, and genuine family-style Bengali warmth where you are always treated like kin.
              </p>
            </div>

            {/* Couples */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#B85A32]/10 text-[#B85A32] flex items-center justify-center mb-4">
                <Sparkles size={20} />
              </div>
              <span className="text-[9px] uppercase font-bold text-[#B85A32] tracking-widest block mb-1">
                Couples & Romantic Getaways
              </span>
              <h3 className="font-serif text-lg font-bold text-[#1C352D] mb-2">
                Intimate Views & Fireside Hearths
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-sans">
                Private sunset decks overlooking Kanchenjunga, stilted estuarine cabins, fireside rhododendron teas, and moonlit river boat cruises.
              </p>
            </div>

            {/* Families */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center mb-4">
                <Users size={20} />
              </div>
              <span className="text-[9px] uppercase font-bold text-[#B85A32] tracking-widest block mb-1">
                Families & Small Groups
              </span>
              <h3 className="font-serif text-lg font-bold text-[#1C352D] mb-2">
                Spacious Suites & Shared Memories
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-sans">
                Connected family rooms, extra rollaway beds, kid-friendly mild Bengali meals, and safe guided nature walks in Lamahatta and Sundarban.
              </p>
            </div>

            {/* Cultural Enthusiasts */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-800/10 text-emerald-800 flex items-center justify-center mb-4">
                <Star size={20} />
              </div>
              <span className="text-[9px] uppercase font-bold text-[#B85A32] tracking-widest block mb-1">
                Cultural Enthusiasts
              </span>
              <h3 className="font-serif text-lg font-bold text-[#1C352D] mb-2">
                Authentic Heritage & Local Crafts
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-sans">
                Restored 1920s red oxide floor suites, artisan clay workshops in Kolkata, and organic farm-to-table dining prepared by local generational cooks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Portfolio Grid */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.4em] text-[#B85A32] font-bold block mb-3">
            CURATED PORTFOLIO
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold italic text-[#1C352D]">
            Three Distinct Ecosystems
          </h2>
          <div className="w-16 h-0.5 bg-[#B85A32] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-20">
          {/* Kolkata */}
          <div
            onClick={() => onNavigate("kolkata")}
            className="group cursor-pointer bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
          >
            <div>
              <div className="h-64 overflow-hidden relative">
                <img
                  src="/kolkata_hero.png"
                  alt="Kolkata Heritage Residence"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[#1C352D] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow">
                  Urban Heritage
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-2xl font-bold text-[#1C352D] mb-2 group-hover:text-[#B85A32] transition-colors">
                  Kolkata Heritage
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed font-light mb-4">
                  A lovingly conserved 1920s classical townhouse in central Kolkata with courtyard reading alcoves and regional libraries.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0 flex justify-between items-center text-xs font-semibold text-[#1C352D] border-t border-gray-100 mt-4">
              <span>Explore Residence</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#B85A32]" />
            </div>
          </div>

          {/* Sundarban */}
          <div
            onClick={() => onNavigate("sundarban")}
            className="group cursor-pointer bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
          >
            <div>
              <div className="h-64 overflow-hidden relative">
                <img
                  src="/sundarban_hero.png"
                  alt="Sundarban Estuarine Sanctuary"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[#1C352D] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow">
                  Delta Eco Safari
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-2xl font-bold text-[#1C352D] mb-2 group-hover:text-[#B85A32] transition-colors">
                  Sundarban Delta
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed font-light mb-4">
                  High-comfort stilted cabins perched on G-Plot island shoreline with electric mangrove boat safaris and fresh estuarine feasts.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0 flex justify-between items-center text-xs font-semibold text-[#1C352D] border-t border-gray-100 mt-4">
              <span>Explore Eco Lodge</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#B85A32]" />
            </div>
          </div>

          {/* Lamahatta */}
          <div
            onClick={() => onNavigate("lamahatta")}
            className="group cursor-pointer bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
          >
            <div>
              <div className="h-64 overflow-hidden relative">
                <img
                  src="/lamahatta_hero.png"
                  alt="Lamahatta Mountain Sanctuary"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[#1C352D] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow">
                  5,700 FT Alpine Retreat
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-2xl font-bold text-[#1C352D] mb-2 group-hover:text-[#B85A32] transition-colors">
                  Lamahatta Alpine
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed font-light mb-4">
                  Himalayan mountain villas above pine cloud lines featuring private hearth fire decks and stargazing roof windows.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0 flex justify-between items-center text-xs font-semibold text-[#1C352D] border-t border-gray-100 mt-4">
              <span>Explore Mountain Sanctuary</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#B85A32]" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
