
import { useState, useRef, useEffect } from "react";
import { Compass, Menu, X, Landmark, TreePine, Map, Image, Info, PhoneCall, ShieldCheck, ChevronDown } from "lucide-react";
import { Currency } from "../utils/currency";

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, subParam?: any) => void;
  currency?: Currency;
  onCurrencyChange?: (currency: Currency) => void;
}

export default function Header({
  currentView,
  onNavigate,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [destinationsOpen, setDestinationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const destinationItems = [
    { label: "Kolkata", view: "kolkata", desc: "The City of Joy", icon: Landmark },
    { label: "Sundarban", view: "sundarban", desc: "The Bengal Delta", icon: TreePine },
    { label: "Lamahatta", view: "lamahatta", desc: "Hidden Gem of Darjeeling", icon: Map },
  ];

  const mainNavItems = [
    { label: "Home", view: "home", icon: Compass },
    { label: "Gallery", view: "gallery", icon: Image },
    { label: "About Us", view: "about", icon: Info },
    { label: "Contact", view: "contact", icon: PhoneCall },
  ];

  const isDestinationActive = ["kolkata", "sundarban", "lamahatta"].includes(currentView);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDestinationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 glass-header">
      {/* Top Banner Notice */}
      <div className="bg-[#1C352D] text-white text-[11px] py-1 px-4 text-center tracking-wider justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 hidden sm:flex">
        <div className="flex items-center gap-2 text-[#E6C587] truncate">
          <ShieldCheck size={13} className="text-[#C5A059] shrink-0" />
          <span className="font-medium truncate">Direct Booking Guarantee: 0% Platform Fee & Complimentary Breakfast</span>
        </div>
        <div className="flex items-center gap-4 text-gray-300 text-[11px] shrink-0">
          <a href="tel:+919876543210" className="hover:text-white transition-colors flex items-center gap-1.5">
            <PhoneCall size={11} className="text-[#C5A059]" />
            <span>+91 98765 43210</span>
          </a>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex justify-between items-center">
        {/* Logo and Brand Name */}
        <button
          onClick={() => {
            onNavigate("home");
            setMobileOpen(false);
          }}
          className="flex flex-col text-left group cursor-pointer focus:outline-none max-w-[200px] sm:max-w-none"
          id="brand-logo-btn"
        >
          <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#1C352D] tracking-tight group-hover:text-[#B85A32] transition-colors leading-none uppercase">
            Satrangi
          </span>
          <span className="text-[8px] sm:text-[9px] font-sans text-[#B85A32] uppercase tracking-[0.15em] sm:tracking-[0.25em] font-semibold leading-none mt-1 truncate">
            Best Luxury Eco-Retreats in Bengal
          </span>
        </button>

        {/* Desktop & Tablet Navigation */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-7">
          {/* Home Link */}
          <button
            onClick={() => {
              onNavigate("home");
              setDestinationsOpen(false);
            }}
            className={`font-sans text-xs font-semibold uppercase tracking-wider pb-1 cursor-pointer transition-all duration-200 relative ${currentView === "home"
              ? "text-[#B85A32]"
              : "text-gray-600 hover:text-[#1C352D]"
              }`}
          >
            Home
            {currentView === "home" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B85A32] rounded-full" />
            )}
          </button>

          {/* Dropdown for Destinations */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDestinationsOpen(!destinationsOpen)}
              onMouseEnter={() => setDestinationsOpen(true)}
              className={`font-sans text-xs font-semibold uppercase tracking-wider pb-1 cursor-pointer transition-all duration-200 flex items-center gap-1 relative ${isDestinationActive
                ? "text-[#B85A32]"
                : "text-gray-600 hover:text-[#1C352D]"
                }`}
            >
              <span>Destinations</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${destinationsOpen ? "rotate-180 text-[#B85A32]" : ""}`} />
              {isDestinationActive && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B85A32] rounded-full" />
              )}
            </button>

            {/* Dropdown Menu Popup */}
            {destinationsOpen && (
              <div
                onMouseLeave={() => setDestinationsOpen(false)}
                className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-2xl shadow-2xl p-2.5 z-50 animate-fade-in text-left"
              >
                <div className="px-3 py-1.5 text-[9px] font-sans font-bold uppercase tracking-widest text-[#B85A32] border-b border-gray-100 mb-1">
                  Our 3 Ecosystems
                </div>
                {destinationItems.map((dest) => {
                  const Icon = dest.icon;
                  const isActive = currentView === dest.view;
                  return (
                    <button
                      key={dest.view}
                      onClick={() => {
                        onNavigate(dest.view);
                        setDestinationsOpen(false);
                      }}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer ${isActive
                        ? "bg-[#1C352D]/10 text-[#B85A32]"
                        : "hover:bg-gray-50 text-gray-700 hover:text-[#1C352D]"
                        }`}
                    >
                      <div className={`p-2 rounded-lg mt-0.5 ${isActive ? "bg-[#B85A32] text-white" : "bg-gray-100 text-[#1C352D]"}`}>
                        <Icon size={15} />
                      </div>
                      <div>
                        <div className="font-serif font-bold text-sm leading-tight flex items-center gap-1.5">
                          {dest.label}
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#B85A32]" />}
                        </div>
                        <div className="text-[10px] text-gray-500 font-sans mt-0.5 leading-tight">
                          {dest.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Remaining Main Nav Links */}
          {mainNavItems.slice(1).map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => {
                  onNavigate(item.view);
                  setDestinationsOpen(false);
                }}
                className={`font-sans text-xs font-semibold uppercase tracking-wider pb-1 cursor-pointer transition-all duration-200 relative ${isActive
                  ? "text-[#B85A32]"
                  : "text-gray-600 hover:text-[#1C352D]"
                  }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B85A32] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Desktop Call to Action */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => onNavigate("booking")}
            className="bg-[#1C352D] hover:bg-[#B85A32] text-white px-5 xl:px-6 py-2.5 rounded-full font-sans text-xs uppercase tracking-widest font-bold transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none cursor-pointer"
          >
            Book Your Stay
          </button>
        </div>

        {/* Mobile & Tablet controls */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => onNavigate("booking")}
            className="bg-[#1C352D] hover:bg-[#B85A32] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs uppercase tracking-wider font-bold transition-all cursor-pointer shadow-xs"
          >
            Book
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-[#1C352D] p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
            aria-label="Toggle navigation list"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel with Scroll Container */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 sm:top-[104px] bottom-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-2xl z-50 overflow-y-auto animate-fade-in text-left">
          <div className="py-5 px-5 sm:px-6 max-w-lg mx-auto flex flex-col min-h-full justify-between">
            <div>
              {/* Home */}
              <button
                onClick={() => {
                  onNavigate("home");
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl mb-3 text-left transition-all ${currentView === "home" ? "bg-[#1C352D]/10 text-[#B85A32] font-semibold" : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <Compass size={18} className={currentView === "home" ? "text-[#B85A32]" : "text-gray-400"} />
                <span className="text-sm font-sans font-medium">Home</span>
              </button>

              {/* Grouped Destinations Section */}
              <div className="bg-gray-50/90 rounded-2xl p-3 mb-4 border border-gray-100 shadow-xs">
                <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#B85A32] px-2 mb-2">
                  Destinations (3 Sanctuaries)
                </div>
                <div className="space-y-1.5">
                  {destinationItems.map((dest) => {
                    const Icon = dest.icon;
                    const isActive = currentView === dest.view;
                    return (
                      <button
                        key={dest.view}
                        onClick={() => {
                          onNavigate(dest.view);
                          setMobileOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${isActive
                          ? "bg-white text-[#B85A32] font-bold shadow-xs border border-gray-200"
                          : "text-gray-700 hover:bg-white/70"
                          }`}
                      >
                        <Icon size={16} className={isActive ? "text-[#B85A32]" : "text-[#1C352D]"} />
                        <div>
                          <div className="text-xs font-serif font-bold">{dest.label}</div>
                          <div className="text-[9px] text-gray-500 font-sans">{dest.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Nav Items Grid */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {mainNavItems.slice(1).map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.view;
                  return (
                    <button
                      key={item.view}
                      onClick={() => {
                        onNavigate(item.view);
                        setMobileOpen(false);
                      }}
                      className={`flex items-center gap-2.5 p-3 rounded-xl text-left transition-all ${isActive
                        ? "bg-[#1C352D]/10 text-[#B85A32] font-semibold"
                        : "text-gray-700 hover:bg-gray-50 bg-white border border-gray-100"
                        }`}
                    >
                      <Icon size={16} className={isActive ? "text-[#B85A32]" : "text-gray-400"} />
                      <span className="text-xs font-sans font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions in Mobile Menu */}
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3 pb-8">
              <button
                onClick={() => {
                  onNavigate("booking");
                  setMobileOpen(false);
                }}
                className="w-full bg-[#1C352D] hover:bg-[#B85A32] text-white text-center py-3.5 rounded-xl text-xs font-sans uppercase tracking-widest font-bold transition-colors shadow-lg"
              >
                Book Direct Now
              </button>
              <div className="flex justify-center items-center gap-4 text-xs text-gray-500 pt-2">
                <a href="tel:+919876543210" className="flex items-center gap-1.5 text-gray-700 hover:text-[#B85A32]">
                  <PhoneCall size={12} />
                  <span>+91 98765 43210</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
