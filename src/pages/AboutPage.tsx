import React from "react";
import { 
  Leaf, 
  CheckCircle2, 
  ShieldCheck, 
  TreePine, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  Coffee, 
  Landmark, 
  Heart,
  MapPin
} from "lucide-react";
import ReviewSubmission from "../components/ReviewSubmission";

interface AboutPageProps {
  onNavigate?: (view: string, subParam?: any) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  const handleNav = (view: string, subParam?: any) => {
    if (onNavigate) {
      onNavigate(view, subParam);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="animate-fade-in bg-[#F9FAF8] text-[#1C352D] font-sans antialiased overflow-x-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: HERO HEADER (VILLAGEX STYLE)
      ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[320px] sm:min-h-[400px] lg:min-h-[460px] flex flex-col justify-center items-center text-center px-4 sm:px-6 overflow-hidden">
        {/* Lush Greenery Cover Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url('/lamahatta_hero.png')` }}
        />
        {/* Emerald Green / Forest Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C352D]/85 via-[#1C352D]/75 to-[#1C352D]/90" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-3 sm:space-y-4 pt-12 sm:pt-16">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            About Us
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-gray-200 font-light max-w-xl mx-auto leading-relaxed">
            Discover the authentic soul, sustainable eco-sanctuaries, and generational warmth of Satrangi Homestays across Bengal.
          </p>

          {/* Breadcrumb Navigation */}
          <div className="pt-2 flex items-center justify-center gap-2 text-xs sm:text-sm text-emerald-300 font-medium">
            <button
              onClick={() => handleNav("home")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="text-emerald-400 font-bold">&gt;&gt;</span>
            <span className="text-white font-semibold">About Us</span>
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: 3-COLUMN MAIN STORY SHOWCASE (A PARADISE SANCTUARY)
      ────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-center">
          
          {/* LEFT COLUMN: ABOUT INTRO & 4 STAT COUNTERS */}
          <div className="lg:col-span-4 space-y-6 text-left">
            <span className="text-xs uppercase tracking-[0.25em] text-[#2F6B4F] font-bold block">
              About Satrangi
            </span>

            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1C352D] leading-tight">
              A Paradise of Living Sanctuaries
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
              Satrangi began with a simple directive: to curate peaceful retreats across West Bengal that honor authentic regional cultures, ancestral architecture, and pristine natural serenity.
            </p>

            {/* 4 Stat Counters (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-2">
              <div className="space-y-1">
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2F6B4F]">
                  10,000+
                </div>
                <div className="text-[11px] text-gray-500 font-medium leading-tight">
                  Happy Travelers Welcomed
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2F6B4F]">
                  98%
                </div>
                <div className="text-[11px] text-gray-500 font-medium leading-tight">
                  Direct Guest Satisfaction
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2F6B4F]">
                  Top 10
                </div>
                <div className="text-[11px] text-gray-500 font-medium leading-tight">
                  Heritage Retreats in Bengal
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2F6B4F]">
                  3
                </div>
                <div className="text-[11px] text-gray-500 font-medium leading-tight">
                  Curated Sanctuaries
                </div>
              </div>
            </div>


          </div>


          {/* CENTER COLUMN: STAGGERED PHOTO MONTAGE WITH FLOATING BADGE */}
          <div className="lg:col-span-4 flex flex-col items-center gap-3 sm:gap-4 relative py-4">
            
            {/* Top Image */}
            <div className="w-full h-36 sm:h-44 rounded-2xl overflow-hidden shadow-md border border-gray-200">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF1N3PRu1GVI9D91FATGEol1YMngISQMmuHMpTk84xzr_Mt0Kwn3BSeJ4Rx4Xp-AtIBtEHwZ68eytDzPwanDbhsHs2u7VihIlA6gutQT457IhcxPSoXvQhX3ZLon0IgzVRGMiEE5JtEbrKFZpIB9ahz5Kgl9fBNvBN2zPpJvm4anIwSQEpo0winW5iGWLH-LNv__Nc6WAmkzwVtuyijxcJ4Px_3b4C1KSsqfNAuIljRm5xlphfEDzUzlgqc9IQjUhDWWEP9R2WZwKyIM4"
                alt="Satrangi Courtyard Dining"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Middle Image with "Home sweet Home" Cursive Overlay */}
            <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden shadow-md border border-gray-200 group">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzEiAu-fkjC0NgmgIUPTFihWx0mHcqWI0hHW-EX-IDpcdyKCINRjMFuFJUK9lO5Vmfz1cF31rDvFgpmqQG6rR5CStyat8Z3wIJgEn_6g_nI-d-0SdQPayjDMsDpaGzVfdYUwdU17sFNB_dqk7D1Hk7LuniZNnaMqxlG9OsQWbfPabij4A0mxJLyE-H3uQN7S7GsCJxkwpJryjypBSxfhAmyumPBvPJXJDZa9y2zr-evpmrbhSOgU6izo91asyc_A5IecbRraWWpLqn0"
                alt="Satrangi Himalayan Sanctuary"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.85]"
              />
              <div className="absolute inset-0 bg-black/25 flex items-center justify-center p-4">
                <span className="font-['Alex_Brush',cursive] text-4xl sm:text-5xl lg:text-6xl text-[#FAF7F2] drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] select-none">
                  Home sweet Home
                </span>
              </div>
            </div>

            {/* Bottom Image */}
            <div className="w-full h-36 sm:h-44 rounded-2xl overflow-hidden shadow-md border border-gray-200">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKxjEPOMmQ0a6cL1ITnl07z35ebEnXXmxjaqHzz4ppg1ig38uDvITIwbDc-ej5Cz4hI0Anmpwwd5qQb1CEdbqljCg6Cq08itkm3_S-LpupZt13sdFGoxgRJ979NBcUbsTbnkjk5EY1AHGiPa9brMd70x5MjXugCJIrSMDyY5dY5fTwKCo6JsVYxmYVw5cbnSmB_iFhW9B-ewvVYNOxswpDQZ-nttpChU-Pv1Uxnpoj8yFHiCEBpsR8kds8oIHmND3IZwNRbGA_ZbE-Dac"
                alt="Satrangi Estuary Lodge"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>


          {/* RIGHT COLUMN: CULTURE, CHARM & BULLET HIGHLIGHTS */}
          <div className="lg:col-span-4 space-y-6 text-left">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C352D] leading-snug">
              Authentic Culture and Charm, Where Beauty Knows No Bounds
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
              We replace sterile hotel corridors with authentic cultural discovery. Whether savoring slow-cooked Bengali thalis, watching Kanchenjunga dawn breaks, or cruising mangrove waterways, each stay reconnects you with nature.
            </p>

            {/* 4 Feature Bullet Points */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#2F6B4F] shrink-0 mt-0.5" />
                <span className="text-xs text-gray-800 font-medium">
                  <strong>Fresh Air & Pure Nature:</strong> Pine groves at 5,700 FT & untouched coastal deltas.
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#2F6B4F] shrink-0 mt-0.5" />
                <span className="text-xs text-gray-800 font-medium">
                  <strong>Peaceful & Secluded:</strong> Private chalets, verandahs, and peaceful courtyard libraries.
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#2F6B4F] shrink-0 mt-0.5" />
                <span className="text-xs text-gray-800 font-medium">
                  <strong>Rich Regional Culture:</strong> Restored 1920s red oxide floors & indigenous arts.
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#2F6B4F] shrink-0 mt-0.5" />
                <span className="text-xs text-gray-800 font-medium">
                  <strong>Far from City Chaos:</strong> Restful sanctuaries crafted for mindful relaxation.
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200/80">
              <p className="text-[10px] text-gray-400 font-mono">
                * 100% Direct host verified homestays • ** Authentic Bengal Eco-hospitality
              </p>
            </div>
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: MID-PAGE CINEMATIC CALLOUT BANNER
      ────────────────────────────────────────────────────────────── */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 bg-[#1C352D] text-white overflow-hidden text-center">
        {/* Full-Cover Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35 transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url('/sundarban_hero.png')` }}
        />
        {/* Dark Emerald Gradient Veil */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C352D]/90 via-[#1C352D]/80 to-[#1C352D]/90" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-emerald-400 font-bold block">
            Discover Satrangi
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Endless beauty, natural charm
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-gray-200 font-light max-w-xl mx-auto leading-relaxed">
            Where every morning mist, estuarine breeze, and colonial courtyard welcomes you home to authentic Bengal serenity.
          </p>

          <div className="pt-4">
            <button
              type="button"
              onClick={() => handleNav("gallery")}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#1C352D] hover:bg-[#2F6B4F] hover:text-white text-xs uppercase tracking-widest font-bold shadow-xl transition-all duration-300 cursor-pointer"
            >
              <Compass size={14} />
              <span>Discover More</span>
            </button>
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: "WHY SATRANGI" (PERFECT DESTINATION FOR PEACEFUL VACATION)
      ────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-center">
          
          {/* LEFT: 2 STAGGERED PHOTOS & OVERLAPPING PILLARS CARD */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-12 gap-4 items-end">
              
              {/* Top/Left Photo */}
              <div className="col-span-5 h-44 sm:h-56 rounded-2xl overflow-hidden shadow-md border border-gray-200">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiJErL1NVsuFluLGmpkq_nb7AffVDvOyIm8pfr0dJVAEhu0QujGYI9LSR3xcJYfG0TpSVb3a_dXM9disYdO6UL52Rc9M60FpQnzH6dOlnshJCr7Gm_s2xgqEKYf85Mh_4Syu7ECBgMK6zUq5isZsis-t3SgK8_y5oZ9Y3To12rcIjUs-9dGJB4fZk-Lm_9PQFbs5HyqjBr1r3bvLiIAPG44_gdMRPIbJnEgkgeBtJwW6iDwUsdD3GucBCpzetUEtuA0oCvOfKB18He"
                  alt="Satrangi Heritage Suite"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Bottom/Right Main Photo */}
              <div className="col-span-7 h-64 sm:h-80 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnzKOH3iNF2rtJp50aMwTUPfE6LBIKwBUk29LG1GsW5nI-Wnt035Nv3LKXlVnOaWWfLsZrutatdm9RRaKk4PjlZ2GHbmdsN5dUSyisa4-p2xQR8smK8hbIvkovo7gJcPKnPOsuPlwnXSgAAWVS9vpTnqDo_CYbRwMGZrMvQ8sNfHfEPbfkU7UgUQOSwJBWRhxFViwFHBe5Z4aldltBhV4xNeY0jEQNJ2XLBdi6Eifx_VbZPesRVTQvbdPBhLTTTPRlYq5RxPGzg48"
                  alt="Satrangi Tropical Grounds"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Overlapping Floating Dual Pillar Card */}
            <div className="mt-4 sm:mt-6 bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-xl grid grid-cols-2 gap-4 text-left">
              <div className="border-r border-gray-150 pr-4">
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#1C352D] mb-1">
                  Serenity
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-600 font-light leading-relaxed">
                  Immerse in peaceful stillness amidst nature, heritage, and quiet morning tea rituals.
                </p>
              </div>

              <div className="pl-1">
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#1C352D] mb-1">
                  Tranquility
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-600 font-light leading-relaxed">
                  Every suite crafted for deep restorative rest, underfloor warmth, and scenic balconies.
                </p>
              </div>
            </div>
          </div>


          {/* RIGHT: WHY SATRANGI & 3 GREEN BADGE ROWS */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="text-xs uppercase tracking-[0.25em] text-[#2F6B4F] font-bold block">
              Why Satrangi
            </span>

            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1C352D] leading-tight">
              Perfect Destination for Peaceful Vacation
            </h2>

            <div className="space-y-5 pt-2">
              
              {/* Row 1: Affordable Luxury */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-150 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#2F6B4F] flex items-center justify-center text-white shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-[#1C352D] mb-1">
                    Affordable Luxury & Direct Guarantee
                  </h4>
                  <p className="text-xs text-gray-600 font-light leading-relaxed">
                    Transparent rates with 0% platform surcharge, complimentary breakfast, and direct host perks.
                  </p>
                </div>
              </div>

              {/* Row 2: Nature Destination */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-150 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#2F6B4F] flex items-center justify-center text-white shrink-0">
                  <TreePine size={20} />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-[#1C352D] mb-1">
                    Pristine Nature & Heritage Locations
                  </h4>
                  <p className="text-xs text-gray-600 font-light leading-relaxed">
                    Kolkata's 1920s townhouse, Sundarban's estuarine eco-lodge, and Lamahatta's 5,700 FT alpine chalets.
                  </p>
                </div>
              </div>

              {/* Row 3: Friendly Community */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-150 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#2F6B4F] flex items-center justify-center text-white shrink-0">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-[#1C352D] mb-1">
                    Generational Homestay Hospitality
                  </h4>
                  <p className="text-xs text-gray-600 font-light leading-relaxed">
                    Dedicated local families, Sherpa trekking guides, and chefs who treat every guest like family.
                  </p>
                </div>
              </div>

            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => handleNav("contact")}
                className="px-6 py-3 rounded-full bg-[#1C352D] hover:bg-[#2F6B4F] text-white text-xs uppercase tracking-widest font-bold shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                Contact Concierge
              </button>
              <button
                type="button"
                onClick={() => handleNav("booking")}
                className="px-6 py-3 rounded-full bg-white border border-gray-300 hover:border-[#1C352D] text-[#1C352D] text-xs uppercase tracking-widest font-bold shadow-xs transition-all duration-300 cursor-pointer"
              >
                Book Your Stay
              </button>
            </div>
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: GUEST FEEDBACK FORM (RELOCATED FROM DESTINATION PAGES)
      ────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[#F5EFEB]/60 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <ReviewSubmission />
        </div>
      </section>

    </div>
  );
}
