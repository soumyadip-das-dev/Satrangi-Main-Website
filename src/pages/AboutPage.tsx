import React from "react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 animate-fade-in text-left space-y-10 sm:space-y-16">
      <div className="text-center">
        <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold italic text-[#2D463E]">
          The Story of Satrangi
        </h1>
        <div className="w-16 h-0.5 bg-[#A45D3B] mx-auto mt-4" />
      </div>

      <div className="bg-white border border-gray-150 p-5 sm:p-8 md:p-12 space-y-5 sm:space-y-6 rounded-2xl">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2D463E] leading-snug">
          "Where Every Destination Tells A Different Story"
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
          Satrangi Homestay began with a simple, core directive: to offer direct, high-end escapes inside historically relevant regions of West Bengal that celebrate localized cultures rather than replicating sanitized urban motel formats.
        </p>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
          From our flagship cedar suites perched above mountain cloud lines in Lamahatta, to the stilted eco-lodges navigating tidal marsh waters in the Sundarbans, and the carefully conserved 1920s townhouse details of Kolkata—each property works with ancestral local designers, cooks, and materials.
        </p>
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
