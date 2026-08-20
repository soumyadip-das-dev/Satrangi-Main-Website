import { useState } from "react";
import { Pin, Landmark, TreePine, MapPin, Compass, ArrowRight } from "lucide-react";

interface MapComponentProps {
  onSelectDestination: (id: string) => void;
}

export default function MapComponent({ onSelectDestination }: MapComponentProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>("lamahatta");

  const markers = [
    {
      id: "lamahatta",
      name: "Lamahatta Mountains",
      tagline: "Mountain Serenity",
      altitude: "5,700 FT",
      coords: "Lat: 27.1° N, Lng: 88.3° E",
      icon: MapPin,
      top: "12%",
      left: "48%",
      color: "border-[#C5A059] bg-[#2D463E]",
      description: "Cozy cedar-lined sanctuaries elevated deep inside pine forests of the Eastern Himalayas, overlooking Kanchenjunga.",
    },
    {
      id: "kolkata",
      name: "Kolkata City Boutique",
      tagline: "Culture & Comfort",
      altitude: "30 FT",
      coords: "Lat: 22.5° N, Lng: 88.3° E",
      icon: Landmark,
      top: "65%",
      left: "52%",
      color: "border-[#A45D3B] bg-[#2D463E]",
      description: "Meticulously restored high-ceilinged 1920s classic townhouse detailing Kolkata's rich cultural and artistic roots.",
    },
    {
      id: "sundarban",
      name: "Sundarban Safari Lodge",
      tagline: "Wildlife & Adventure",
      altitude: "5 FT",
      coords: "Lat: 21.9° N, Lng: 89.1° E",
      icon: TreePine,
      top: "78%",
      left: "64%",
      color: "border-[#b4cdb8] bg-[#2D463E]",
      description: "Deluxe bamboo & stilted eco-cabins perched at the edge of the world's most untamed delta waters.",
    },
  ];

  const currentMarker = markers.find(m => m.id === selectedRegion) || markers[0];

  return (
    <div className="bg-white border border-gray-100 p-4 sm:p-8 rounded-none shadow-sm flex flex-col lg:flex-row gap-6 sm:gap-12 items-center text-left">
      {/* Visual Vector Map Column */}
      <div className="w-full lg:w-1/2 flex justify-center relative bg-[#faf9f6] p-4 sm:p-6 lg:p-12 overflow-hidden h-[340px] sm:h-[420px] lg:h-[450px] border border-gray-100">
        <div className="absolute inset-0 opacity-[0.03] select-none pointer-events-none flex items-center justify-center font-serif text-[80px] sm:text-[120px] font-bold text-gray-900 tracking-tighter uppercase whitespace-nowrap">
          Bengal
        </div>

        {/* Abstract Schematic SVG drawing of West Bengal Map Boundaries */}
        <svg
          viewBox="0 0 400 500"
          className="w-full h-full text-slate-200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {/* North Highlands region */}
          <path d="M 180 30 Q 210 20 220 40 T 190 80 T 170 120 Z" fill="#2D463E" fillOpacity="0.04" stroke="#2D463E" strokeOpacity="0.1" />
          {/* Main corridor */}
          <path d="M 170 120 Q 200 180 180 240 T 190 320 T 170 410" stroke="#2D463E" strokeOpacity="0.08" strokeDasharray="3,3" />
          {/* South Delta region */}
          <path d="M 170 410 Q 150 440 190 480 T 260 480 T 240 400 Z" fill="#A45D3B" fillOpacity="0.03" stroke="#A45D3B" strokeOpacity="0.1" />
          
          {/* Connector Paths to make it look highly cartographic/editorial */}
          <line x1="195" y1="60" x2="208" y2="325" stroke="#A45D3B" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="208" y1="325" x2="256" y2="390" stroke="#A45D3B" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="2,2" />
        </svg>

        {/* Map Markers overlay */}
        {markers.map((marker) => {
          const IconComponent = marker.icon;
          const isSelected = selectedRegion === marker.id;
          const isHovered = hoveredRegion === marker.id;

          return (
            <button
              key={marker.id}
              onClick={() => setSelectedRegion(marker.id)}
              onMouseEnter={() => setHoveredRegion(marker.id)}
              onMouseLeave={() => setHoveredRegion(null)}
              className="absolute group transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 focus:outline-none cursor-pointer"
              style={{ top: marker.top, left: marker.left }}
              id={`map-pin-${marker.id}`}
            >
              {/* Pulsing ring */}
              <span className={`absolute -inset-3 sm:-inset-4 rounded-full border ${
                isSelected ? "animate-ping opacity-30 border-[#A45D3B]" : "opacity-0 group-hover:opacity-100 group-hover:animate-pulse border-gray-400"
              } transition-opacity`} />

              {/* Pin design */}
              <div className={`relative flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300 shadow-md ${
                isSelected ? "scale-110 sm:scale-125 border-[#A45D3B] bg-white text-[#A45D3B]" : "scale-100 border-[#2D463E]/20 bg-white text-[#2D463E]"
              }`}>
                <IconComponent size={16} className={`sm:hidden ${isSelected ? "text-[#A45D3B]" : "text-gray-700"}`} />
                <IconComponent size={20} className={`hidden sm:block ${isSelected ? "text-[#A45D3B]" : "text-gray-700"}`} />

                {/* Micro Label */}
                <div className={`absolute left-1/2 -translate-x-1/2 top-11 sm:top-14 px-2 py-0.5 whitespace-nowrap bg-[#2D463E] text-white text-[8px] sm:text-[9px] font-sans uppercase tracking-widest rounded shadow transition-all ${
                  isSelected || isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
                }`}>
                  {marker.name}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Narrative Guide Sidebar Column */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gray-400 font-sans block mb-2 sm:mb-3">
          Interactive Explorer
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#2D463E] mb-3 sm:mb-6 leading-tight">
          Explore the Extreme Diversity of Bengal
        </h3>
        <p className="text-gray-600 font-sans text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">
          West Bengal is India's only state extending from the snowy peaks of the mighty Himalayas in the North down to the world's largest mangrove forest on the maritime Southern coast.
        </p>

        {/* Dynamic Detail Card based on selected pin */}
        <div className="bg-[#faf9f6] border-l-4 border-[#A45D3B] p-4 sm:p-6 lg:p-8 animate-fade-in relative overflow-hidden shadow-xs">
          <div className="text-[10px] sm:text-xs font-mono font-medium text-[#A45D3B] mb-2 sm:mb-0 sm:absolute sm:top-4 sm:right-4">
            {currentMarker.coords}
          </div>

          <div className="flex items-center gap-3 mb-2 sm:mb-3">
            <span className="text-[11px] sm:text-xs font-sans tracking-widest uppercase font-semibold text-gray-500">
              Altitude: {currentMarker.altitude}
            </span>
          </div>

          <h4 className="font-serif text-xl sm:text-2xl text-[#2D463E] font-bold mb-1.5 sm:mb-2">
            {currentMarker.name}
          </h4>
          <p className="text-[11px] sm:text-xs font-sans text-[#A45D3B] tracking-widest uppercase font-bold mb-3 sm:mb-4">
            {currentMarker.tagline}
          </p>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-5 sm:mb-6">
            {currentMarker.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={() => onSelectDestination(currentMarker.id)}
              className="group bg-[#2D463E] hover:bg-[#A45D3B] text-white px-5 py-2.5 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>Explore Destination</span>
              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
            <button
              onClick={() => onSelectDestination("booking")}
              className="border border-gray-300 hover:border-gray-900 text-gray-800 hover:bg-white px-5 py-2.5 text-xs uppercase tracking-widest font-semibold cursor-pointer transition-all text-center"
            >
              Check Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
