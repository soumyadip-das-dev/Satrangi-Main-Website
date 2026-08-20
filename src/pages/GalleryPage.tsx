import React, { useState } from "react";
import { X } from "lucide-react";
import { GalleryItem } from "../types";

interface GalleryPageProps {
  gallery: GalleryItem[];
}

export default function GalleryPage({ gallery }: GalleryPageProps) {
  const [galleryFilter, setGalleryFilter] = useState<string>("all");
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 animate-fade-in text-left">
      <div className="text-center mb-10 sm:mb-12">
        <span className="text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#A45D3B] font-bold block mb-2 sm:mb-3">
          THE STUDIO
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold italic text-[#2D463E]">
          Glimpses of Satrangi Stays
        </h1>
        <div className="w-16 h-0.5 bg-[#A45D3B] mx-auto mt-4" />
      </div>

      {/* Masonry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {gallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxImg(item.url)}
              className="relative aspect-square overflow-hidden cursor-pointer bg-slate-50 border border-gray-200 group rounded-xl"
            >
              <img
                src={item.url}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center">
                <span className="text-white text-[11px] sm:text-xs font-sans font-semibold uppercase tracking-widest">
                  {item.alt}
                </span>
              </div>
            </div>
          ))}
      </div>

      {/* Lightbox dialog viewer */}
      {lightboxImg && (
        <div 
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4 sm:p-6 animate-fade-in"
        >
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white p-2 hover:bg-white/10 rounded-full focus:outline-none cursor-pointer"
          >
            <X size={24} className="sm:hidden" />
            <X size={28} className="hidden sm:block" />
          </button>
          <img
            onClick={(e) => e.stopPropagation()}
            src={lightboxImg}
            alt="Selected Lightbox Details"
            className="max-w-full max-h-[85vh] object-contain shadow-2xl border border-white/10 rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
