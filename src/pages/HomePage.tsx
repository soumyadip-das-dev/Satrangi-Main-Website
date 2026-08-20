import React, { useState, useEffect } from "react";
import { ArrowRight, MapPin, Calendar, Users, Compass, Sparkles, Star } from "lucide-react";
import { Destination, Room } from "../types";
import { Currency, formatPrice } from "../utils/currency";
import SuitePhotoCarousel from "../components/SuitePhotoCarousel";
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
      <section className="relative h-[80vh] sm:h-[85vh] min-h-[520px] sm:min-h-[580px] w-full overflow-hidden bg-[#2D463E]">
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
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#faf9f6]/95" />

            {/* Hero Content Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 z-20">
              <span className="text-[#E6C587] mb-2 sm:mb-4 text-[10px] sm:text-xs font-semibold tracking-[0.25em] sm:tracking-[0.4em] uppercase opacity-95">
                {slide.tagline}
              </span>
              <h1 className="font-serif text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold max-w-4xl mb-4 sm:mb-6 italic leading-tight">
                {slide.title}
              </h1>
              <p className="text-white/85 font-sans text-xs sm:text-sm md:text-base max-w-xl mb-6 sm:mb-8 leading-relaxed font-light px-2">
                {slide.desc}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none">
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
                  className="w-full sm:w-auto bg-white hover:bg-[#A45D3B] hover:text-white text-[#2D463E] px-6 sm:px-8 py-3 sm:py-3.5 text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-lg cursor-pointer text-center"
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
                  className="w-full sm:w-auto border border-white/60 hover:bg-white/10 text-white px-6 sm:px-8 py-3 sm:py-3.5 text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer text-center"
                >
                  Book Your Stay
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Dots */}
        <div className="absolute bottom-16 sm:bottom-12 left-1/2 -translate-x-1/2 flex gap-2.5 sm:gap-3 z-30">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroIndex(idx)}
              className={`h-1.5 sm:h-1 rounded-full transition-all ${
                idx === heroIndex ? "w-8 sm:w-10 bg-[#C5A059]" : "w-4 sm:w-6 bg-white/40 hover:bg-white"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Floating Glassmorphic Quick Booking Search Bar */}
      <section className="relative z-30 -mt-10 sm:-mt-12 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white/95 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 items-center">
          <div>
            <label className="block text-[10px] text-[#B85A32] uppercase tracking-widest mb-1 font-bold flex items-center gap-1">
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
            <label className="block text-[10px] text-[#B85A32] uppercase tracking-widest mb-1 font-bold flex items-center gap-1">
              <Calendar size={12} /> Check-In
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
              className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs py-2 px-3 text-gray-800 outline-none focus:border-[#B85A32] font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] text-[#B85A32] uppercase tracking-widest mb-1 font-bold flex items-center gap-1">
              <Calendar size={12} /> Check-Out
            </label>
            <input
              type="date"
              min={getFormattedDateString(1, checkInSelect)}
              value={checkOutSelect}
              onChange={(e) => setCheckOutSelect(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs py-2 px-3 text-gray-800 outline-none focus:border-[#B85A32] font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] text-[#B85A32] uppercase tracking-widest mb-1 font-bold flex items-center gap-1">
              <Users size={12} /> Guests
            </label>
            <select
              value={guestsCountSelect}
              onChange={(e) => {
                if (setGuestsCountSelect) setGuestsCountSelect(Number(e.target.value));
              }}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs py-2.5 px-3 text-gray-800 outline-none focus:border-[#B85A32] font-semibold"
            >
              <option value={1}>1 Guest (Solo)</option>
              <option value={2}>2 Guests (Couple)</option>
              <option value={3}>3 Guests (Family)</option>
              <option value={4}>4 Guests (Suite)</option>
              <option value={5}>5 Guests (Group)</option>
              <option value={6}>6 Guests (Large)</option>
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <button
              onClick={() => onNavigate("booking", selectedDestIdForBooking)}
              className="w-full bg-[#1C352D] hover:bg-[#B85A32] text-white py-3.5 rounded-full text-xs font-sans uppercase tracking-widest font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer mt-1 sm:mt-0"
            >
              <span>Check Availability</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Tailored Escapes Section - Vertical Alternating Layout */}
      <section className="py-12 sm:py-20 bg-[#FAF8F5] border-y border-gray-200/60 my-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-[#1C352D] tracking-tight">
              Crafted For Every Traveler's Journey
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-sans max-w-2xl mx-auto mt-3 leading-relaxed">
              Whether you are traveling solo, reconnecting as a couple, vacationing with family, or seeking deep cultural immersion.
            </p>
          </div>

          <div className="space-y-16 lg:space-y-24">
            {[
              {
                category: "Solo Explorers & Writers",
                title: "Finding Stillness in the Quiet Sanctuaries",
                story: "For the solitary wanderer and the creative mind, our retreats are designed as peaceful havens. Spend uninterrupted mornings writing beside sunlit verandahs, recharge in leafy courtyard alcoves with freshly pressed Darjeeling teas, and enjoy fast, reliable connectivity whenever inspiration strikes. Here, you are wrapped in gentle, unobtrusive Bengali hospitality—cherished and safe, yet entirely free to reflect and create.",
                vignette: "“A quiet desk, a view of whispering casuarinas, and time that slows down just for you.”",
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDiJErL1NVsuFluLGmpkq_nb7AffVDvOyIm8pfr0dJVAEhu0QujGYI9LSR3xcJYfG0TpSVb3a_dXM9disYdO6UL52Rc9M60FpQnzH6dOlnshJCr7Gm_s2xgqEKYf85Mh_4Syu7ECBgMK6zUq5isZsis-t3SgK8_y5oZ9Y3To12rcIjUs-9dGJB4fZk-Lm_9PQFbs5HyqjBr1r3bvLiIAPG44_gdMRPIbJnEgkgeBtJwW6iDwUsdD3GucBCpzetUEtuA0oCvOfKB18He"
              },
              {
                category: "Couples & Romantic Getaways",
                title: "Moments of Pure Connection & Mountain Mist",
                story: "Celebrate love where the mountains meet the clouds and rivers murmur beneath stilted wooden balconies. Watch the sunrise paint the snowfields of Kanchenjunga in gold from your private cedar deck, share quiet conversations by glowing wood fires, and drift along tranquil estuary waters on a private sundown boat ride. Every detail is curated to nurture presence, warmth, and timeless romance.",
                vignette: "“Starlit dinners, hearthside warmth, and sunrises you will remember forever.”",
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmLnwLvvmBMo_LEn4HXapXrg4o3CzJ0u_sAQxzu0Mspt-tAeH3n3JYdR4wdMYVuPKJzAhesuhz-p_MuPD6cOkTy9vMnpdGGFhye89muEOb2xfVy_8miZMwKyymfLB6Ku_lf1LnBabW_hMROSUOvHqh9zR0Vnh1YC_6kT5T67zhLwMgugbDlY_yO-PabasywOHuYivaAlvT4n1Dejvbkiv_larDzmnh8eFcKO7HeGRQPz0M7wM8AHct1rXpR4b9bYPAO0lWcIDsvq5wdgY"
              },
              {
                category: "Families & Multi-Generational Stays",
                title: "Joyful Spaces Where Generations Gather",
                story: "Family vacations are about shared laughter over wholesome meals and discoveries across untamed trails. Our interconnected suites and generous heritage living rooms provide ample space for grandparents to relax while children safely explore organic gardens and guided nature walks. Enjoy mild, comforting Bengali culinary feasts prepared with fresh harvest ingredients that bring everyone happily together.",
                vignette: "“Spacious heritage suites, family-style feasting, and stories told under the stars.”",
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKxjEPOMmQ0a6cL1ITnl07z35ebEnXXmxjaqHzz4ppg1ig38uDvITIwbDc-ej5Cz4hI0Anmpwwd5qQb1CEdbqljCg6Cq08itkm3_S-LpupZt13sdFGoxgRJ979NBcUbsTbnkjk5EY1AHGiPa9brMd70x5MjXugCJIrSMDyY5dY5fTwKCo6JsVYxmYVw5cbnSmB_iFhW9B-ewvVYNOxswpDQZ-nttpChU-Pv1Uxnpoj8yFHiCEBpsR8kds8oIHmND3IZwNRbGA_ZbE-Dac"
              },
              {
                category: "Cultural Enthusiasts & Heritage Seekers",
                title: "Living Bengal’s Living Heritage & Artistry",
                story: "Step beyond the tourist trail and enter the living rhythm of Bengal. Sleep beneath classical high-vaulted ceilings on polished red-oxide floors, meet generational clay sculptors in historic potters' quarters, and savor heirloom recipes slow-cooked on traditional earthen hearths. This is not just a place to stay—it is an authentic cultural dialogue rooted in craft, poetry, and architectural heritage.",
                vignette: "“Centennial architecture, heirloom flavors, and the soul of Bengal’s artisan traditions.”",
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnzKOH3iNF2rtJp50aMwTUPfE6LBIKwBUk29LG1GsW5nI-Wnt035Nv3LKXlVnOaWWfLsZrutatdm9RRaKk4PjlZ2GHbmdsN5dUSyisa4-p2xQR8smK8hbIvkovo7gJcPKnPOsuPlwnXSgAAWVS9vpTnqDo_CYbRwMGZrMvQ8sNfHfEPbfkU7UgUQOSwJBWRhxFViwFHBe5Z4aldltBhV4xNeY0jEQNJ2XLBdi6Eifx_VbZPesRVTQvbdPBhLTTTPRlYq5RxPGzg48p"
              },
              {
                category: "Culinary & Soulful Gastronomy",
                title: "Heirloom Flavors & Farm-to-Table Dining",
                story: "Every meal at Satrangi is an authentic culinary journey rooted in ancestral recipes and fertile regional harvests. Wake up to fragrant Darjeeling teas and fluffy luchi with spiced alur dom, savor freshly caught coastal bhetki and coconut prawns in Sundarban, and enjoy slow-simmered mountain broths in Lamahatta. Prepared with freshly stone-ground spices and organic produce, each dish is served with the warmth of a home kitchen.",
                vignette: "“Heirloom recipes, stone-ground spices, and feasts prepared with genuine home warmth.”",
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDF1N3PRu1GVI9D91FATGEol1YMngISQMmuHMpTk84xzr_Mt0Kwn3BSeJ4Rx4Xp-AtIBtEHwZ68eytDzPwanDbhsHs2u7VihIlA6gutQT457IhcxPSoXvQhX3ZLon0IgzVRGMiEE5JtEbrKFZpIB9ahz5Kgl9fBNvBN2zPpJvm4anIwSQEpo0winW5iGWLH-LNv__Nc6WAmkzwVtuyijxcJ4Px_3b4C1KSsqfNAuIljRm5xlphfEDzUzlgqc9IQjUhDWWEP9R2WZwKyIM4"
              }
            ].map((journey, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={journey.category}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center text-left"
                >
                  {/* Image Column */}
                  <div className={`lg:col-span-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                    <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-200/80 group">
                      <div className="aspect-[4/3] w-full overflow-hidden">
                        <img
                          src={journey.image}
                          alt={journey.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                    </div>
                  </div>

                  {/* Story Text Column */}
                  <div className={`lg:col-span-6 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                    <div className="lg:max-w-xl">
                      <h3 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#1C352D] mb-5 leading-[1.2] tracking-tight">
                        {journey.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-sans mb-6 font-normal">
                        {journey.story}
                      </p>

                      {/* Lyrical Vignette Quote */}
                      <div className="border-l-2 border-[#B85A32] pl-4 py-1.5 italic font-serif text-sm sm:text-base text-gray-600">
                        {journey.vignette}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Destinations Portfolio Grid */}
      <section className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16 max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold italic text-[#1C352D] mb-3">
            Our Stays: Where Stories Unfold
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-sans leading-relaxed">
            Three distinct landscapes across Bengal, each thoughtfully curated for timeless comfort, heritage charm, and warm homestyle hospitality.
          </p>
          <div className="w-16 h-0.5 bg-[#B85A32] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left mb-12 sm:mb-20">
          {/* Kolkata */}
          <div
            onClick={() => onNavigate("kolkata")}
            className="group cursor-pointer bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
          >
            <div>
              <div className="h-56 sm:h-64 overflow-hidden relative">
                <img
                  src="/kolkata_hero.png"
                  alt="Kolkata Heritage Residence"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C352D] mb-2 group-hover:text-[#B85A32] transition-colors">
                  Kolkata - The City of Joy
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed font-light mb-4">
                  Immerse yourself in the soulful charm of The City of Joy. Experience luxury heritage living in our restored 1920s townhouse with courtyard dining and central city convenience.
                </p>
              </div>
            </div>
            <div className="p-5 sm:p-6 pt-0 flex justify-between items-center text-xs font-semibold text-[#1C352D] border-t border-gray-100 mt-4">
              <span>Explore</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#B85A32]" />
            </div>
          </div>

          {/* Sundarban */}
          <div
            onClick={() => onNavigate("sundarban")}
            className="group cursor-pointer bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
          >
            <div>
              <div className="h-56 sm:h-64 overflow-hidden relative">
                <img
                  src="/sundarban_hero.png"
                  alt="Sundarban Estuarine Sanctuary"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C352D] mb-2 group-hover:text-[#B85A32] transition-colors">
                  Sundarban - The Bengal Delta
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed font-light mb-4">
                  Unlock the untamed beauty of The Bengal Delta. Stay in eco-luxury stilted villas on pristine island shores, complete with private river safaris and fresh coastal feasts.
                </p>
              </div>
            </div>
            <div className="p-5 sm:p-6 pt-0 flex justify-between items-center text-xs font-semibold text-[#1C352D] border-t border-gray-100 mt-4">
              <span>Explore</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#B85A32]" />
            </div>
          </div>

          {/* Lamahatta */}
          <div
            onClick={() => onNavigate("lamahatta")}
            className="group cursor-pointer bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
          >
            <div>
              <div className="h-56 sm:h-64 overflow-hidden relative">
                <img
                  src="/lamahatta_hero.png"
                  alt="Lamahatta Mountain Sanctuary"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C352D] mb-2 group-hover:text-[#B85A32] transition-colors">
                  Lamahatta - Hidden Gem of Darjeeling
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed font-light mb-4">
                  Escape to the Hidden Gem of Darjeeling at 5,700 FT. Indulge in private alpine chalets featuring sweeping Kanchenjunga mountain panoramas and cozy hearth fireplaces.
                </p>
              </div>
            </div>
            <div className="p-5 sm:p-6 pt-0 flex justify-between items-center text-xs font-semibold text-[#1C352D] border-t border-gray-100 mt-4">
              <span>Explore</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#B85A32]" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
