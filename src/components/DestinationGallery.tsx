import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  url: string;
  alt: string;
  category: string;
  description: string;
}

interface DestinationGalleryProps {
  destinationId: string; // "kolkata" | "sundarban" | "lamahatta"
  destinationName: string;
}

// Curated high-res authentic images from db_data and related visual vectors
const DESTINATION_PHOTOS: Record<string, GalleryImage[]> = {
  kolkata: [
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDnmnk2VSdJuGdSdYlDOdFHdYasPrCWQYFdSSEwLki6hNkTjCQxUw0nDUxcacQtwcJnZDbTCi_U23mQky-Skn6hZtk8oRLym3Hk_MwRlRYRwc_gsWAr2EdJXAAgQ_RScCD26Hw3gO2rHSJE0BTaUB6P8RMfhiCL01wbkVEKQECG5UDr4UO4juVZDNaXWx-p6_-KfxrdHQ6HhUd5tHSBYnUkf-3q1ppjZc2HlNCMgBsRxc6Su0bdj-62xQPNy_obvmaylwxRTg-Mla7",
      alt: "Yellow Cabs on Vintage Streets",
      category: "Landscape",
      description: "Iconic yellow taxis gliding through Kolkata's vintage streets alongside historic architecture."
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0cJeq_vj0KDUtJPIB7PTq-tylX6gWOLzTqaJlBtt9LK8HAh8VHrmqx-pnWFv14J_CNJLOXtWy6cgt5RHFfW4QWSYO1gtxXajpLH0quglHZTNI3a4rY7bCvtBBD_6GOuMPYDa024ftNuqGx5x6W0zM8p72QNgPOOu1SHRonQY2RCwC7Qv5v1RLyXVPh_k3eOCm8qNFoB1pgjLAOoYIDrBN6H5YjbsJ3DYVuwXqXepWn0bs2EZb8JNtvHk-OZaXxbcdj2Yb54ovIGO3RIA",
      alt: "Colonial Courtyard & Library",
      category: "Interiors",
      description: "Our conserved townhome study room, featuring high timber ceilings and curated antique collections."
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDj444XOzjH9AM-9irTf46WXsmEwmRpctkVYqvk7O2fsKFsdu71suPcdSw2Cn2AJ6HJ3aZ6qhJKtDoUjr8rUNCzszeSCzFIH2MI348s-Y1HED2PWBGpDpTTg3-2dnIieUeuSLZyzO_dqkCNrISQH5Bj41MZ_o_WJO3dUvKLVuC-Zx-zNpanUTF3qH3cLUU1m6YBCFfvub5m4hVSPdbUtuIDwEFkHcFE-ra_Jj139Vo7GyrJonarS_vNVg5nOT9inR4ZUMrvVCiXzLrj",
      alt: "Heritage Suite Living Area",
      category: "Interiors",
      description: "Original mahogany columns paired with cooling red oxide floors and traditional rattan accents."
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAte6SOFbSFkWTjz_KIGB56z3MardGLApjqH6JnOuzSHMVRPLbquOWZuK38PcfGcholgWvYz0z0uA6qJdxfgkn04VeB3cBn6Xl1CNFeq6WQ4Ax7K9ACWkw8FAMZ794rYo-vLcZK3OGvVQq3BwZV80a2PUOBeTVV9XXqE_WF58Ld4y7l7liuaF7NG-Z9GR--EPEBtT_sL9LG1kfe-h_ztZoVHJ_yLSSv0XJkCXUDEiTpMfTOJAGHSqTRjO34s2H9KklZYyCa-atnnj79",
      alt: "Historic College Street Bookstores",
      category: "Culture",
      description: "Exploring century-old classical paperbacks and antique library corridors of old Bengal."
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDF1N3PRu1GVI9D91FATGEol1YMngISQMmuHMpTk84xzr_Mt0Kwn3BSeJ4Rx4Xp-AtIBtEHwZ68eytDzPwanDbhsHs2u7VihIlA6gutQT457IhcxPSoXvQhX3ZLon0IgzVRGMiEE5JtEbrKFZpIB9ahz5Kgl9fBNvBN2zPpJvm4anIwSQEpo0winW5iGWLH-LNv__Nc6WAmkzwVtuyijxcJ4Px_3b4C1KSsqfNAuIljRm5xlphfEDzUzlgqc9IQjUhDWWEP9R2WZwKyIM4",
      alt: "Authentic Courtyard Thali Culinary",
      category: "Gastronomy",
      description: "Generational cookery sharing secret steam-mustard and classic spice infusions with guests."
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZpsNwwhu5Vc-haO1iWVIKL3RaDKJUYjfPmXsChme8pJNj3z05J9uS1sZIXYkQgpiIkY0UTm0CQasX_ESgIkxawWBDHisNQIACypQyp4z9KAQTtsZlkCq8t-DO-7pt4aYKTcAM4mt30DJBnXJGwq1486CbAtq7JH4mb72Ue5yOnAtJjSvmxBGp-M-PxpyLVHsO-_tDPeFL-oEMGhizMCefOeyNm1MD6LseWC2hUkFQoI30BQBRfuccIfETaeMmjNFxFQ091ZkZk2Kqn34",
      alt: "Kumartuli Clay Idol Artistry",
      category: "Culture",
      description: "Watching live generational artisans sculpting sacred statues out of sacred Ganges river silt."
    }
  ],
  sundarban: [
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-8jCUPK8lA8yx8afT_wUFH5VPn4vpihGsNM1SKzQLTjlpiOYnYq7z9qStjMDydKZKnZ0pM9jPCY4d3WPXAnSC5HkuOKweYszO_thhFFQps9gbkr3VXIijTjt8XbKurZzOvW7xZH-oXBrAgafvx0fjDVr5Pk0sRqJVsvZod4FLE7XmuPmSpqTj5pJUfxzukPLAPQkGDOlWGxM4b9j0-CcBMwMxXJSwkg1JCMeJqn5BB40QgZuXf3KLGp9tSnN86tEjfJJ1UqVUuOxw",
      alt: "Saptamukhi Estuary Country Skiff",
      category: "Landscape",
      description: "Sailing on a traditional wooden country boat through the quiet high-tide Saptamukhi estuary around G-Plot."
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaYjy4e-XXFwdkagOoZsOEZkvT0V0piUX4M26-qP7uhiSca4muFrt42zavFFrNFiwrAxDnFlN8LLvbrUurlfDbK5s8Bb59J8Yy95kyAx0Eii7Ft-bg_tY1keeToWqrJlbuE0toY_YFwwB4HwIYwFZa2pt8_uL5pwNcAuFmHNLyW7ndRnGpJC5G0MVyYyn4KBS8PdBUSusvErNpb9zXUSizNvuOe_x2fWsvntUD5B8_J0zDSoQyXa9EXwR7IT8hfw8soEaOlhLwhEcdcaY",
      alt: "Gplot Shoreline View Deck",
      category: "Exterior",
      description: "Our high-stilt estuarine observation balcony facing the sandy horizons of G-Plot Beach."
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqaoTmsJEgDonzKh4JUOZ3B8yD57jjCa5X56PHoUppLWjslQOecPRtdx-S5yBHcpueoc8SRSEtd2D6oZ9qFr-Ai5c7-tXHjHS3WF0c7iYNkvdIgRthjMW2pdiKu9UOx3paiLGsk3i16qE7q0saWW-zZGr3IqoEvsCIq6QXclc1EuMZiOTYoOpVtYXScT6y_9G3u9WqXSQaXN6MG3ec0mCVB1rOkhCDG7fiyHFbfV6ZWRsb7SobsuN1VfSBQ9bwi1GZZOEIemHroVeUQA8",
      alt: "Delta Mangroves on Mudflats",
      category: "Landscape",
      description: "Lush estuarine mangrove roots pointing skyward along the G-Plot tidal coast."
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoustqL1tEEtYmNh0CMBCDP2Cnz6L55i1uNsPB70IvKiz1RM4606YphO_ly5IaOmzabV3MP1OUWsgGyxuR9vsoY-U6xgbl2_kI8ppgXRfVwS77PbbBeGbBvZIsHPYqdaDkyGkaHUxaDLyAX9qt0HPgpc1EUCVQvHzDU0zq9OcDXZATa5P6ImUbCgW3rzEW_kT4FBsl1f6k44x80bvgb0e5jS2BIz3yhBNGUjPvsZzTibhhLGlXpsj_6iGExNs6gu1uclR-EFvtln2ET8k",
      alt: "Traditional G-Plot Local Weaving",
      category: "Culture",
      description: "Encountering Kakdwip island craftspeople custom-weaving traditional mangrove-leaf umbrellas and fishing lines."
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKxjEPOMmQ0a6cL1ITnl07z35ebEnXXmxjaqHzz4ppg1ig38uDvITIwbDc-ej5Cz4hI0Anmpwwd5qQb1CEdbqljCg6Cq08itkm3_S-LpupZt13sdFGoxgRJ979NBcUbsTbnkjk5EY1AHGiPa9brMd70x5MjXugCJIrSMDyY5dY5fTwKCo6JsVYxmYVw5cbnSmB_iFhW9B-ewvVYNOxswpDQZ-nttpChU-Pv1Uxnpoj8yFHiCEBpsR8kds8oIHmND3IZwNRbGA_ZbE-Dac",
      alt: "Sunset Beach Suite Bedroom",
      category: "Rooms",
      description: "Local thatched wood architecture detailing double beds facing the tranquil tides of the G-Plot estuary."
    }
  ],
  lamahatta: [
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEJV4sZuLSjd7dODAg4Xpz0tkCTY6VTi1r7g4CAtUiaIMCRMRSAqOSU50Go35fHs9ydmw-6mas1q8ogTi5OQv_N06gUDWG6rBUrE80LXK3QXwu05XllxVEA7t6txV0OT1pthX9ffPC1Zf46aichtO7KHD-MnwDolmmYgugM0XUWxhzKFuxsO6C9tONovyPWyaQTy-6yi2ezA1m4UIlohN6YxXzPWuSxfssIxn94QERavAIZOgNTLi_yT8Qy7WpCufhrTpoQRWuqCYj",
      alt: "Mist Hanging in Pine Trees",
      category: "Landscape",
      description: "Heavy mist rolling across the soaring, sacred pine and cedar forests of the Himalayan step."
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzEiAu-fkjC0NgmgIUPTFihWx0mHcqWI0hHW-EX-IDpcdyKCINRjMFuFJUK9lO5Vmfz1cF31rDvFgpmqQG6rR5CStyat8Z3wIJgEn_6g_nI-d-0SdQPayjDMsDpaGzVfdYUwdU17sFNB_dqk7D1Hk7LuniZNnaMqxlG9OsQWbfPabij4A0mxJLyE-H3uQN7S7GsCJxkwpJryjypBSxfhAmyumPBvPJXJDZa9y2zr-evpmrbhSOgU6izo91asyc_A5IecbRraWWpLqn0",
      alt: "Darjeeling Mountain Morning Brew",
      category: "Gastronomy",
      description: "A fresh cup of first flush organic Darjeeling black tea served overlooking Mt. Kanchenjunga."
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUMH2y7aYU5D-wIlejxtRNuVkjKP3DMWu46MYLQm1iEp8vNb9zDNyynqdhBt18OkspDhnUjobekeUtH8X9ZHO201vhKvoe9PKUBQXQWPFU8zncaWxoV6TQgpWtZnUfTlI48ZFHEDt5cOd6JXnu1ti_G4Aa9mfxn0DPiG2XixqVyc18ki8VfSWvmKycXF94j1Bi1AAlcxVMaR7sNQ8zAncl4Vu5Yxt5u2vLTEH5qkq9M1yNeNuzwrfd_-s-uG7VffMb1wkdRtkv6lcDysA",
      alt: "Traditional Mountain Cotton Looming",
      category: "Culture",
      description: "Generational weavers stitching thick organic hill cottons to ward off winter altitudes."
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_sK9ldKlz2J4A8BAmXZZpCEpARMvPX5QzXapH-nHi4PlYh-Sv3mDD3b3j8_nVQVrK_XXHbU7rJsP8yrNPC2tiy5w_XwTwFs2jGgHvmVlSXeTAzKP13EWgRY8fhlo_WyNrV60-0lPV-BHWSGF3mvcdVMBfkxRVHsnQQqF7tUF9E42oaZNlpq13GggJL6yVsFVP3erfBJO5IgWgBkIsIxBl1rY-Y_t8dAE_ZlDEim8nuEW_H4x5dbGKuI3L6XpwOyF3cyqKf_YgstJJrio",
      alt: "Travelers' Central Open Hearth",
      category: "Culture",
      description: "Guests gathering around our open pine cone fire to share travel journals and mountain legends."
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmLnwLvvmBMo_LEn4HXapXrg4o3CzJ0u_sAQxzu0Mspt-tAeH3n3JYdR4wdMYVuPKJzAhesuhz-p_MuPD6cOkTy9vMnpdGGFhye89muEOb2xfVy_8miZMwKyymfLB6Ku_lf1LnBabW_hMROSUOvHqh9zR0Vnh1YC_6kT5T67zhLwMgugbDlY_yO-PabasywOHuYivaAlvT4n1Dejvbkiv_larDzmnh8eFcKO7HeGRQPz0M7wM8AHct1rXpR4b9bYPAO0lWcIDsvq5wdgY",
      alt: "High Alpine Cloud Cabin Attic",
      category: "Rooms",
      description: "Natural pine paneling frames cozy mountain attic spaces featuring handmade warm bedding."
    }
  ]
};

export default function DestinationGallery({ destinationId, destinationName }: DestinationGalleryProps) {
  const images = DESTINATION_PHOTOS[destinationId] || [];
  const [activeTab, setActiveTab] = useState<string>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  // Extract unique categories dynamically based on defined photos
  const categories = ["All", ...Array.from(new Set(images.map((img) => img.category)))];

  // Filter images based on tab selection
  const filteredImages = activeTab === "All" 
    ? images 
    : images.filter((img) => img.category === activeTab);

  // Map filtered index to original photo index for seamless lightbox navigation
  const handleOpenLightbox = (imgUrl: string) => {
    const idx = images.findIndex((img) => img.url === imgUrl);
    setLightboxIndex(idx !== -1 ? idx : 0);
  };

  const handleNextLightbox = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev! + 1));
  };

  const handlePrevLightbox = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev! - 1));
  };

  return (
    <section id={`gallery-sec-${destinationId}`} className="py-24 bg-[#FDFBF7] border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#A45D3B] font-bold block mb-2">
              VISUAL CHRONICLES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2D463E] italic font-bold">
              The {destinationName} Gallery
            </h2>
            <p className="text-xs text-gray-500 mt-1 max-w-md">
              A curated collection of design details, local heritage encounters, and serene vistas.
            </p>
          </div>

          {/* Filtering Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold transition-all duration-300 border cursor-pointer ${
                  activeTab === cat
                    ? "bg-[#2D463E] text-[#FDFBF7] border-[#2D463E]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry / Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img) => (
              <motion.div
                key={img.url}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                onClick={() => handleOpenLightbox(img.url)}
                className="group relative cursor-pointer overflow-hidden border border-gray-200 bg-white shadow-xs aspect-[4/3] flex flex-col justify-end"
              >
                {/* Image */}
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                </div>

                {/* Content Overlay */}
                <div className="relative p-5 z-10 text-white transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-[8px] uppercase tracking-widest bg-[#A45D3B] text-[#FDFBF7] px-2 py-0.5 font-bold mb-2 inline-block">
                    {img.category}
                  </span>
                  <h4 className="font-serif text-base font-bold tracking-wide text-[#FDFBF7] flex items-center justify-between gap-1">
                    {img.alt}
                    <Maximize2 size={13} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#C5A059]" />
                  </h4>
                  <p className="text-[10px] text-gray-300 mt-1 font-light leading-relaxed line-clamp-2 max-w-xs opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {img.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Embedded Prompt */}
        <div className="mt-8 flex items-center justify-center gap-2 bg-[#FAF7F2] border border-gray-150 py-3.5 px-6 rounded-xs">
          <Camera size={13} className="text-[#A45D3B]" />
          <span className="text-[10px] text-gray-500 font-sans tracking-wide">
            Are you a photographer? Tag <strong className="text-[#2D463E] font-semibold">#SatrangiStays</strong> to be featured on our dynamic travel journal.
          </span>
        </div>

      </div>

      {/* Lightbox Immersive Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#1A2421]/95 z-[250] flex flex-col justify-between p-6 select-none"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Header controls */}
            <div className="flex items-center justify-between text-white w-full max-w-6xl mx-auto z-10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#C5A059] block">
                  {destinationName} Live Feed
                </span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              </div>

              {/* Close Button */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-[#FDFBF7] transition-all hover:scale-105 cursor-pointer focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Stage Image Slide viewer */}
            <div className="relative flex items-center justify-center flex-1 max-w-5xl w-full mx-auto my-6">
              {/* Prev Slide Control */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevLightbox();
                }}
                className="absolute left-2 sm:left-4 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 border border-white/10 text-white hover:bg-[#A45D3B] hover:border-[#A45D3B] transition-all duration-300 cursor-pointer focus:outline-none z-10"
              >
                <ChevronLeft size={22} />
              </button>

              {/* Slider Image Screen */}
              <div className="w-full h-full max-h-[60vh] sm:max-h-[70vh] flex items-center justify-center p-4">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={lightboxIndex}
                    src={images[lightboxIndex].url}
                    alt={images[lightboxIndex].alt}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-full max-h-full object-contain shadow-2xl border border-white/5 select-none pointer-events-none"
                    onClick={(e) => e.stopPropagation()}
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
              </div>

              {/* Next Slide Control */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextLightbox();
                }}
                className="absolute right-2 sm:right-4 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 border border-white/10 text-white hover:bg-[#A45D3B] hover:border-[#A45D3B] transition-all duration-300 cursor-pointer focus:outline-none z-10"
              >
                <ChevronRight size={22} />
              </button>
            </div>

            {/* Footer Captions */}
            <div className="w-full max-w-4xl mx-auto text-center text-[#FDFBF7] z-10 pb-4" onClick={(e) => e.stopPropagation()}>
              <div className="inline-block bg-[#111816]/75 border border-white/10 backdrop-blur-md rounded-md p-5 px-8 max-w-xl mx-auto shadow-2xl">
                <span className="text-[9px] uppercase tracking-widest font-extrabold text-[#C5A059] bg-[#C5A059]/15 px-3 py-1 rounded-sm mb-2.5 inline-block">
                  {images[lightboxIndex].category} • Slide {lightboxIndex + 1} of {images.length}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#FDFBF7]">
                  {images[lightboxIndex].alt}
                </h3>
                <p className="text-xs text-gray-400 mt-2 font-light leading-relaxed">
                  {images[lightboxIndex].description}
                </p>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
