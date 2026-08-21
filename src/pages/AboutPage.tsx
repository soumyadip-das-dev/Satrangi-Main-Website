import React from "react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 animate-fade-in text-left space-y-12 sm:space-y-16">
      <div className="text-center">
        <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold italic text-[#2D463E]">
          The Story of Satrangi
        </h1>
        <div className="w-16 h-0.5 bg-[#A45D3B] mx-auto mt-4" />
      </div>

      {/* Story & Home Sweet Home 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left: Story Text */}
        <div className="lg:col-span-7 space-y-5 text-left">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D463E] leading-snug tracking-tight">
            "Where Every Destination Tells A Different Story"
          </h3>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-light">
            Satrangi Homestay began with a simple, core directive: to offer direct, high-end escapes inside historically relevant regions of West Bengal that celebrate localized cultures rather than replicating sanitized urban motel formats.
          </p>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-light">
            From our flagship cedar suites perched above mountain cloud lines in Lamahatta, to the stilted eco-lodges navigating tidal marsh waters in the Sundarbans, and the carefully conserved 1920s townhouse details of Kolkata—each property works with ancestral local designers, cooks, and materials.
          </p>
          <div className="border-l-2 border-[#A45D3B] pl-4 py-1 italic font-serif text-sm sm:text-base text-gray-600">
            “Hospitality rooted in ancestral soil, crafted for the mindful traveler.”
          </div>
        </div>

        {/* Right: Home Sweet Home Design */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="relative group p-4 sm:p-6 w-full max-w-sm sm:max-w-md flex justify-center">
            {/* Ambient Warm Tone Backdrop Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#2D463E]/15 via-[#A45D3B]/20 to-transparent rounded-full blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <img
              src="/home_sweet_home.png"
              alt="Home Sweet Home"
              className="relative w-60 sm:w-72 md:w-80 lg:w-88 h-auto object-contain transition-transform duration-700 group-hover:scale-105 drop-shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Meet Your Host Section */}
      <div className="space-y-6 sm:space-y-8 pt-2 sm:pt-4">
        <div className="text-center">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D463E]">Meet Your Host</h3>
          <div className="w-12 h-0.5 bg-[#A45D3B] mx-auto mt-3" />
        </div>

        <div className="max-w-xl mx-auto">
          {/* Single Host Card */}
          <div className="bg-white border border-gray-200 p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-shadow text-left">
            <div className="flex items-center gap-4 mb-5 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#2D463E]/10 rounded-2xl flex items-center justify-center text-[#2D463E] shrink-0">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" />
                </svg>
              </div>
              <div>
                <h4 className="font-serif text-lg sm:text-xl font-bold text-[#1C352D]">Satrangi Host & Founder</h4>
                <span className="text-[11px] sm:text-xs text-[#B85A32] font-mono uppercase tracking-wider font-bold block mt-0.5">
                  Founder & Primary Curator
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light italic mb-5 sm:mb-6">
              "Satrangi is a labor of love dedicated to preserving the authentic spirit of Bengal hospitality across Kolkata, Sundarban, and Lamahatta. Every guest is welcomed like family, with personalized care, curated local experiences, and peaceful comfort."
            </p>

            <div className="border-t border-gray-100 pt-4 flex flex-wrap gap-2.5 sm:gap-4 text-[11px] sm:text-xs font-mono">
              <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-150">
                <span className="font-bold text-[#1C352D]">Locations:</span> Kolkata • Sundarban • Lamahatta
              </div>
              <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-150">
                <span className="font-bold text-[#1C352D]">Languages:</span> English, Bengali, Hindi
              </div>
              <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-150">
                <span className="font-bold text-[#1C352D]">Expertise:</span> Regional Heritage & Eco-Hospitality
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
