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
    <div className="max-w-7xl mx-auto px-6 py-16 animate-fade-in text-left">
      <div className="text-center mb-12">
        <span className="text-xs uppercase tracking-[0.4em] text-[#A45D3B] font-bold block mb-3">
          THE STUDIO
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold italic text-[#2D463E]">
          Glimpses of Satrangi Stays
        </h1>
        <div className="w-16 h-0.5 bg-[#A45D3B] mx-auto mt-4" />
      </div>

      {/* Masonry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {gallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxImg(item.url)}
              className="relative aspect-square overflow-hidden cursor-pointer bg-slate-50 border border-gray-200 group"
            >
              <img
                src={item.url}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center">
                <span className="text-white text-xs font-sans font-semibold uppercase tracking-widest">
                  {item.alt}
                </span>
              </div>
            </div>
          ))}
      </div>

      {/* Lightbox dialog viewer */}
      {lightboxImg && (
        <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-6 animate-fade-in">
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full focus:outline-none"
          >
            <X size={28} />
          </button>
          <img
            src={lightboxImg}
            alt="Selected Lightbox Details"
            className="max-w-full max-h-[85vh] object-contain shadow-2xl border border-white/10"
          />
        </div>
      )}
    </div>
  );
}
