import React from "react";
import { ArrowRight } from "lucide-react";
import { Experience } from "../types";

interface ExperiencesPageProps {
  experiences: Experience[];
  onNavigate: (view: string) => void;
}

export default function ExperiencesPage({ experiences, onNavigate }: ExperiencesPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 animate-fade-in text-left">
      <div className="text-center mb-10 sm:mb-16">
        <span className="text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#A45D3B] font-bold block mb-2 sm:mb-3">
          THE SENSORY TRAIL
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl text-[#2D463E] italic font-bold">
          Premium Guest Excursions
        </h1>
        <div className="w-16 h-0.5 bg-[#A45D3B] mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="bg-white border border-gray-200 overflow-hidden shadow-xs flex flex-col justify-between group rounded-2xl"
          >
            <div className="h-48 sm:h-56 bg-gray-50 overflow-hidden">
              <img
                src={exp.imageUrl}
                alt={exp.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5 sm:p-6">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#A45D3B] bg-[#A45D3B]/5 px-2 py-1 inline-block mb-3 rounded-md">
                {exp.category}
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2D463E] mb-2">{exp.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-6">
                {exp.description}
              </p>
              <button
                onClick={() => onNavigate("contact")}
                className="text-[#2D463E] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 focus:outline-none cursor-pointer"
              >
                Enquire Directly <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
