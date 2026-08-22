import React from "react";

interface Destination3DArtProps {
  destinationId: "kolkata" | "sundarban" | "lamahatta";
  title: string;
  subtitle?: string;
  imageSrc: string;
  tagline?: string;
}

export const Destination3DArt: React.FC<Destination3DArtProps> = ({
  destinationId,
  title,
  subtitle,
  imageSrc,
  tagline
}) => {
  const letters = title.toUpperCase().split("");
  const totalLetters = letters.length;

  return (
    <div className="relative w-full -mt-20 sm:-mt-32 lg:-mt-44 mb-10 sm:mb-16 z-30 px-2 sm:px-6 max-w-[1360px] mx-auto select-none pointer-events-none">
      
      {/* Horizontal 3D Typography Strip Overlapping & Attached to Hero Edge */}
      <div className="relative bg-transparent flex items-center justify-center">
        
        {/* Horizontal Row of Image-Filled 3D Letters */}
        <div className="flex items-center justify-center -space-x-1 sm:-space-x-2 md:-space-x-4 lg:-space-x-6 max-w-4xl mx-auto">
          {letters.map((char, idx) => {
            return (
              <div 
                key={idx} 
                className="relative flex justify-center items-center flex-1 transition-transform duration-500 hover:-translate-y-3 pointer-events-auto cursor-pointer group"
              >
                <svg
                  className="w-full h-24 sm:h-36 md:h-48 lg:h-64 filter drop-shadow-[0_22px_45px_rgba(0,0,0,0.65)] transform transition-transform duration-300 group-hover:scale-105"
                  viewBox="0 0 140 180"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    {/* Continuous Image Pattern Mask for Letter Interior */}
                    <pattern
                      id={`img-letter-pattern-${destinationId}-${idx}`}
                      patternUnits="userSpaceOnUse"
                      width="140"
                      height="180"
                    >
                      <image
                        href={imageSrc}
                        width="140"
                        height="180"
                        preserveAspectRatio="xMidYMid slice"
                      />
                    </pattern>
                  </defs>

                  {/* Outer Dark 3D Shadow Base */}
                  <text
                    x="50%"
                    y="60%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fontFamily="Playfair Display, Georgia, serif"
                    fontSize="135"
                    fontWeight="900"
                    fill="none"
                    stroke="rgba(0,0,0,0.4)"
                    strokeWidth="16"
                    strokeLinejoin="round"
                  >
                    {char}
                  </text>

                  {/* Thick Crisp White Outline Stroke Layer (Matching Travel Reference) */}
                  <text
                    x="50%"
                    y="60%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fontFamily="Playfair Display, Georgia, serif"
                    fontSize="135"
                    fontWeight="900"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="10"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  >
                    {char}
                  </text>

                  {/* Image-Filled Center Text Layer */}
                  <text
                    x="50%"
                    y="60%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fontFamily="Playfair Display, Georgia, serif"
                    fontSize="135"
                    fontWeight="900"
                    fill={`url(#img-letter-pattern-${destinationId}-${idx})`}
                  >
                    {char}
                  </text>
                </svg>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};

export default Destination3DArt;
