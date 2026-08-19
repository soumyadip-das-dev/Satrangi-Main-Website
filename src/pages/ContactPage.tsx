import React from "react";
import { Phone, Mail, HelpCircle } from "lucide-react";
import { FAQ } from "../types";

interface ContactPageProps {
  faqs: FAQ[];
}

export default function ContactPage({ faqs }: ContactPageProps) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 animate-fade-in text-left">
      <div className="text-center mb-14">
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C352D] tracking-wide uppercase">
          GET IN TOUCH
        </h1>
        <p className="text-xs text-gray-500 font-sans max-w-md mx-auto mt-3">
          Connect directly with our guest coordination team via WhatsApp or Phone call.
        </p>
        <div className="w-16 h-0.5 bg-[#B85A32] mx-auto mt-4" />
      </div>

      {/* Single Unified Direct Communication Card */}
      <div className="max-w-3xl mx-auto mb-16">
        <div className="bg-[#1C352D] text-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-[#2D463E] relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#B85A32]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
              How can I help you?
            </h3>
            <p className="text-xs text-gray-300 font-sans max-w-lg mx-auto leading-relaxed mb-8">
              Connect directly with our host for real-time room availability, transports, or custom preferences.
            </p>

            {/* 2-Column Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-6">
              {/* WhatsApp Action */}
              <a
                href="https://wa.me/919876543210?text=Hello%20Satrangi%20Homestays%2C%20I%20would%20like%20to%20inquire%20about%20suite%20reservations."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 px-6 rounded-2xl text-xs font-sans uppercase tracking-widest font-extrabold transition-all duration-300 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.705 1.456h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>Start WhatsApp Chat</span>
              </a>

              {/* Phone Call Action */}
              <a
                href="tel:+919876543210"
                className="bg-[#B85A32] hover:bg-[#C5A059] text-white py-3.5 px-6 rounded-2xl text-xs font-sans uppercase tracking-widest font-extrabold transition-all duration-300 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone size={14} />
                <span>Call +91 98765 43210</span>
              </a>
            </div>

            {/* Email Footer */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 pt-2 border-t border-white/10 font-sans">
              <Mail size={13} className="text-[#C5A059]" />
              <span>Email:</span>
              <a href="mailto:reservations@satrangihomestay.com" className="text-gray-200 hover:underline">
                reservations@satrangihomestay.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs List Section */}
      <div className="pt-12 border-t border-gray-200">
        <h3 className="font-serif text-3xl font-bold text-[#2D463E] mb-12 text-center italic">
          Frequently Questions Answered
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white border border-gray-200 p-6 shadow-xs">
              <h4 className="font-serif text-lg font-bold text-[#2D463E] mb-3 flex items-start gap-2.5">
                <HelpCircle size={18} className="text-[#A45D3B] shrink-0 mt-1" />
                <span>{faq.question}</span>
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed font-light pl-7">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
