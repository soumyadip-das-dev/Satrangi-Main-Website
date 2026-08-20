import React from "react";
import { ArrowRight } from "lucide-react";
import { Blog } from "../types";

interface BlogsPageProps {
  blogs: Blog[];
  onNavigate: (view: string) => void;
}

export default function BlogsPage({ blogs, onNavigate }: BlogsPageProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 animate-fade-in text-left">
      <div className="text-center mb-10 sm:mb-16">
        <span className="text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#B85A32] font-bold block mb-2 sm:mb-3">
          TRAVEL JOURNAL
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold italic text-[#1C352D]">
          Stories & Reflections
        </h1>
        <div className="w-16 h-0.5 bg-[#B85A32] mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {blogs.map((post) => (
          <article
            key={post.id}
            className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="h-48 sm:h-64 overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-5 sm:p-8">
              <div className="flex items-center gap-3 text-[10px] text-gray-400 font-mono uppercase tracking-wider mb-3">
                <span>By {post.author}</span>
                <span>•</span>
                <span>{post.date}</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C352D] mb-3 group-hover:text-[#B85A32] transition-colors">
                {post.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-6 font-sans">
                {post.excerpt}
              </p>
              <button
                onClick={() => onNavigate("contact")}
                className="text-[#B85A32] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 focus:outline-none cursor-pointer"
              >
                Read Article <ArrowRight size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
