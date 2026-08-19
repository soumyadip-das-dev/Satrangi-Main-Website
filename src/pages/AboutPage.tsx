import React from "react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 animate-fade-in text-left space-y-16">
      <div className="text-center">
        <h1 className="font-serif text-3xl sm:text-5xl font-bold italic text-[#2D463E]">
          The Story of Satrangi
        </h1>
        <div className="w-16 h-0.5 bg-[#A45D3B] mx-auto mt-4" />
      </div>

      <div className="bg-white border border-gray-150 p-8 sm:p-12 space-y-6">
        <h3 className="font-serif text-2xl font-bold text-[#2D463E] leading-snug">
          "Where Every Destination Tells A Different Story"
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed font-light text-base">
          Satrangi Homestay began with a simple, core directive: to offer direct, high-end escapes inside historically relevant regions of West Bengal that celebrate localized cultures rather than replicating sanitized urban motel formats.
        </p>
        <p className="text-xs text-gray-600 leading-relaxed font-light text-base">
          From our flagship cedar suites perched above mountain cloud lines in Lamahatta, to the stilted eco-lodges navigating tidal marsh waters in the Sundarbans, and the carefully conserved 1920s townhouse details of Kolkata—each property works with ancestral local designers, cooks, and materials.
        </p>
      </div>

      {/* Meet Your Host Section */}
      <div className="space-y-8 pt-4">
        <div className="text-center">
          <h3 className="font-serif text-2xl font-bold text-[#2D463E]">Meet Your Host</h3>
          <div className="w-12 h-0.5 bg-[#A45D3B] mx-auto mt-3" />
        </div>

        <div className="max-w-xl mx-auto">
          {/* Single Host Card */}
          <div className="bg-white border border-gray-200 p-8 sm:p-10 rounded-3xl shadow-lg hover:shadow-xl transition-shadow text-left">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-[#2D463E]/10 rounded-2xl flex items-center justify-center text-[#2D463E] shrink-0">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" />
                </svg>
              </div>
              <div>
                <h4 className="font-serif text-xl font-bold text-[#1C352D]">Satrangi Host & Founder</h4>
                <span className="text-xs text-[#B85A32] font-mono uppercase tracking-wider font-bold block mt-0.5">
                  Founder & Primary Curator
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed font-light italic mb-6 text-sm">
              "Satrangi is a labor of love dedicated to preserving the authentic spirit of Bengal hospitality across Kolkata, Sundarban, and Lamahatta. Every guest is welcomed like family, with personalized care, curated local experiences, and peaceful comfort."
            </p>

            <div className="border-t border-gray-100 pt-4 flex flex-wrap gap-4 text-xs font-mono">
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
