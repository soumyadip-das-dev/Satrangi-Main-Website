import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface SuitePhotoCarouselProps {
  suiteId?: string;
  defaultImage?: string;
  suiteName?: string;
  images?: string[];
  altText?: string;
  heightClass?: string;
  onImageClick?: () => void;
}

// Map high-quality coordinate angles for each suite to avoid generic broken links
const SUITE_ANGLES_MAP: Record<string, string[]> = {
  "kolkata-heritage-suite": [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDiJErL1NVsuFluLGmpkq_nb7AffVDvOyIm8pfr0dJVAEhu0QujGYI9LSR3xcJYfG0TpSVb3a_dXM9disYdO6UL52Rc9M60FpQnzH6dOlnshJCr7Gm_s2xgqEKYf85Mh_4Syu7ECBgMK6zUq5isZsis-t3SgK8_y5oZ9Y3To12rcIjUs-9dGJB4fZk-Lm_9PQFbs5HyqjBr1r3bvLiIAPG44_gdMRPIbJnEgkgeBtJwW6iDwUsdD3GucBCpzetUEtuA0oCvOfKB18He",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD0cJeq_vj0KDUtJPIB7PTq-tylX6gWOLzTqaJlBtt9LK8HAh8VHrmqx-pnWFv14J_CNJLOXtWy6cgt5RHFfW4QWSYO1gtxXajpLH0quglHZTNI3a4rY7bCvtBBD_6GOuMPYDa024ftNuqGx5x6W0zM8p72QNgPOOu1SHRonQY2RCwC7Qv5v1RLyXVPh_k3eOCm8qNFoB1pgjLAOoYIDrBN6H5YjbsJ3DYVuwXqXepWn0bs2EZb8JNtvHk-OZaXxbcdj2Yb54ovIGO3RIA",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB-8jCUPK8lA8yx8afT_wUFH5VPn4vpihGsNM1SKzQLTjlpiOYnYq7z9qStjMDydKZKnZ0pM9jPCY4d3WPXAnSC5HkuOKweYszO_thhFFQps9gbkr3VXIijTjt8XbKurZzOvW7xZH-oXBrAgafvx0fjDVr5Pk0sRqJVsvZod4FLE7XmuPmSpqTj5pJUfxzukPLAPQkGDOlWGxM4b9j0-CcBMwMxXJSwkg1JCMeJqn5BB40QgZuXf3KLGp9tSnN86tEjfJJ1UqVUuOxw"
  ],
  "kolkata-colonial-room": [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBnzKOH3iNF2rtJp50aMwTUPfE6LBIKwBUk29LG1GsW5nI-Wnt035Nv3LKXlVnOaWWfLsZrutatdm9RRaKk4PjlZ2GHbmdsN5dUSyisa4-p2xQR8smK8hbIvkovo7gJcPKnPOsuPlwnXSgAAWVS9vpTnqDo_CYbRwMGZrMvQ8sNfHfEPbfkU7UgUQOSwJBWRhxFViwFHBe5Z4aldltBhV4xNeY0jEQNJ2XLBdi6Eifx_VbZPesRVTQvbdPBhLTTTPRlYq5RxPGzg48p",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDUMH2y7aYU5D-wIlejxtRNuVkjKP3DMWu46MYLQm1iEp8vNb9zDNyynqdhBt18OkspDhnUjobekeUtH8X9ZHO201vhKvoe9PKUBQXQWPFU8zncaWxoV6TQgpWtZnUfTlI48ZFHEDt5cOd6JXnu1ti_G4Aa9mfxn0DPiG2XixqVyc18ki8VfSWvmKycXF94j1Bi1AAlcxVMaR7sNQ8zAncl4Vu5Yxt5u2vLTEH5qkq9M1yNeNuzwrfd_-s-uG7VffMb1wkdRtkv6lcDysA",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA_sK9ldKlz2J4A8BAmXZZpCEpARMvPX5QzXapH-nHi4PlYh-Sv3mDD3b3j8_nVQVrK_XXHbU7rJsP8yrNPC2tiy5w_XwTwFs2jGgHvmVlSXeTAzKP13EWgRY8fhlo_WyNrV60-0lPV-BHWSGF3mvcdVMBfkxRVHsnQQqF7tUF9E42oaZNlpq13GggJL6yVsFVP3erfBJO5IgWgBkIsIxBl1rY-Y_t8dAE_ZlDEim8nuEW_H4x5dbGKuI3L6XpwOyF3cyqKf_YgstJJrio"
  ],
  "sundarban-tiger-suite": [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDKxjEPOMmQ0a6cL1ITnl07z35ebEnXXmxjaqHzz4ppg1ig38uDvITIwbDc-ej5Cz4hI0Anmpwwd5qQb1CEdbqljCg6Cq08itkm3_S-LpupZt13sdFGoxgRJ979NBcUbsTbnkjk5EY1AHGiPa9brMd70x5MjXugCJIrSMDyY5dY5fTwKCo6JsVYxmYVw5cbnSmB_iFhW9B-ewvVYNOxswpDQZ-nttpChU-Pv1Uxnpoj8yFHiCEBpsR8kds8oIHmND3IZwNRbGA_ZbE-Dac",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAqaoTmsJEgDonzKh4JUOZ3B8yD57jjCa5X56PHoUppLWjslQOecPRtdx-S5yBHcpueoc8SRSEtd2D6oZ9qFr-Ai5c7-tXHjHS3WF0c7iYNkvdIgRthjMW2pdiKu9UOx3paiLGsk3i16qE7q0saWW-zZGr3IqoEvsCIq6QXclc1EuMZiOTYoOpVtYXScT6y_9G3u9WqXSQaXN6MG3ec0mCVB1rOkhCDG7fiyHFbfV6ZWRsb7SobsuN1VfSBQ9bwi1GZZOEIemHroVeUQA8",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAaYjy4e-XXFwdkagOoZsOEZkvT0V0piUX4M26-qP7uhiSca4muFrt42zavFFrNFiwrAxDnFlN8LLvbrUurlfDbK5s8Bb59J8Yy95kyAx0Eii7Ft-bg_tY1keeToWqrJlbuE0toY_YFwwB4HwIYwFZa2pt8_uL5pwNcAuFmHNLyW7ndRnGpJC5G0MVyYyn4KBS8PdBUSusvErNpb9zXUSizNvuOe_x2fWsvntUD5B8_J0zDSoQyXa9EXwR7IT8hfw8soEaOlhLwhEcdcaY"
  ],
  "sundarban-river-cottage": [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAsO-sTzou4Xlz-ymI800L2QQntaM1hpNvJXG0dut7_cNOqU_kLuKrxYUQ63L7h0mXVf8RYiTK6HdM4V0EjbalPn2K9BiBXPzEc-QvVbrA9hLamSIBEQQfes4J6LE5uQ4eOOZDungRqkJkvAg0CrqdpAanR3LM3LZvBDRHlI_5d_SOjPUANPDAqw8ETULWSsQiruY4-rn6oCQgQDZf8KF-_jXbk3BRnOERIg680fZP7juW2B8ZbJzMlrSRp7u8-LhxNihDwRjT1TlfF",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCoustqL1tEEtYmNh0CMBCDP2Cnz6L55i1uNsPB70IvKiz1RM4606YphO_ly5IaOmzabV3MP1OUWsgGyxuR9vsoY-U6xgbl2_kI8ppgXRfVwS77PbbBeGbBvZIsHPYqdaDkyGkaHUxaDLyAX9qt0HPgpc1EUCVQvHzDU0zq9OcDXZATa5P6ImUbCgW3rzEW_kT4FBsl1f6k44x80bvgb0e5jS2BIz3yhBNGUjPvsZzTibhhLGlXpsj_6iGExNs6gu1uclR-EFvtln2ET8k",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCEJV4sZuLSjd7dODAg4Xpz0tkCTY6VTi1r7g4CAtUiaIMCRMRSAqOSU50Go35fHs9ydmw-6mas1q8ogTi5OQv_N06gUDWG6rBUrE80LXK3QXwu05XllxVEA7t6txV0OT1pthX9ffPC1Zf46aichtO7KHD-MnwDolmmYgugM0XUWxhzKFuxsO6C9tONovyPWyaQTy-6yi2ezA1m4UIlohN6YxXzPWuSxfssIxn94QERavAIZOgNTLi_yT8Qy7WpCufhrTpoQRWuqCYj"
  ],
  "lamahatta-cloud-suite": [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBmLnwLvvmBMo_LEn4HXapXrg4o3CzJ0u_sAQxzu0Mspt-tAeH3n3JYdR4wdMYVuPKJzAhesuhz-p_MuPD6cOkTy9vMnpdGGFhye89muEOb2xfVy_8miZMwKyymfLB6Ku_lf1LnBabW_hMROSUOvHqh9zR0Vnh1YC_6kT5T67zhLwMgugbDlY_yO-PabasywOHuYivaAlvT4n1Dejvbkiv_larDzmnh8eFcKO7HeGRQPz0M7wM8AHct1rXpR4b9bYPAO0lWcIDsvq5wdgY",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAte6SOFbSFkWTjz_KIGB56z3MardGLApjqH6JnOuzSHMVRPLbquOWZuK38PcfGcholgWvYz0z0uA6qJdxfgkn04VeB3cBn6Xl1CNFeq6WQ4Ax7K9ACWkw8FAMZ794rYo-vLcZK3OGvVQq3BwZV80a2PUOBeTVV9XXqE_WF58Ld4y7l7liuaF7NG-Z9GR--EPEBtT_sL9LG1kfe-h_ztZoVHJ_yLSSv0XJkCXUDEiTpMfTOJAGHSqTRjO34s2H9KklZYyCa-atnnj79",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzEiAu-fkjC0NgmgIUPTFihWx0mHcqWI0hHW-EX-IDpcdyKCINRjMFuFJUK9lO5Vmfz1cF31rDvFgpmqQG6rR5CStyat8Z3wIJgEn_6g_nI-d-0SdQPayjDMsDpaGzVfdYUwdU17sFNB_dqk7D1Hk7LuniZNnaMqxlG9OsQWbfPabij4A0mxJLyE-H3uQN7S7GsCJxkwpJryjypBSxfhAmyumPBvPJXJDZa9y2zr-evpmrbhSOgU6izo91asyc_A5IecbRraWWpLqn0"
  ],
  "lamahatta-pine-cottage": [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDNxu5fjp3EpBL0-wxfTnuJnjcZ29umAwQkZEFgLZQHOZ713GhPT4qw5yhndGcj41KOG55vs8fC72yKiifHdpOGoBlsDw5jTjfR9KG1tOwfJWGfJIHvqq6ZKUAwr8fvHmQaXul2P1I_x1QrduMesKUCvGgKdTrmJrWiKc_yP26Du7T1L6Njv9vkA1kukK_mwzl4iZKSSC7u9uxBeCEk7Msy3N5rWA0Y0eSwI_CG8lDyY1supnelM_IRdIpFvXw51sEXEwlvYPIcKqXd2w4",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDF1N3PRu1GVI9D91FATGEol1YMngISQMmuHMpTk84xzr_Mt0Kwn3BSeJ4Rx4Xp-AtIBtEHwZ68eytDzPwanDbhsHs2u7VihIlA6gutQT457IhcxPSoXvQhX3ZLon0IgzVRGMiEE5JtEbrKFZpIB9ahz5Kgl9fBNvBN2zPpJvm4anIwSQEpo0winW5iGWLH-LNv__Nc6WAmkzwVtuyijxcJ4Px_3b4C1KSsqfNAuIljRm5xlphfEDzUzlgqc9IQjUhDWWEP9R2WZwKyIM4",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAQaoTmsJEgDonzKh4JUOZ3B8yD57jjCa5X56PHoUppLWjslQOecPRtdx-S5yBHcpueoc8SRSEtd2D6oZ9qFr-Ai5c7-tXHjHS3WF0c7iYNkvdIgRthjMW2pdiKu9UOx3paiLGsk3i16qE7q0saWW-zZGr3IqoEvsCIq6QXclc1EuMZiOTYoOpVtYXScT6y_9G3u9WqXSQaXN6MG3ec0mCVB1rOkhCDG7fiyHFbfV6ZWRsb7SobsuN1VfSBQ9bwi1GZZOEIemHroVeUQA8"
  ],
  "lamahatta-valley-villa": [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCl1Ad2B8af1S63zU9w336ggC4LQ4FK0-SpaR5bpJBnLPiJdZvVdJL8R3qUML5hJOGgxAfD9rXjNtIGwAtTFW3_AGADm0s_Sen0KOhklv4K7iCK54gzfGHSRaCWaKEYGLZcPVcG4CNBmZHnNJqpRVT8taDKlQBgGMhYCvUP9FaOF8Z4GK0lZgSd2aeSxecNqYQ0RZDy-fBXuLlU8tqm8xJwtMbvguB3EFZ3hu-qIVnElWsdD_yKLQ6vRKVMWVkfnz439MYL4o_dqcGzC00",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzEiAu-fkjC0NgmgIUPTFihWx0mHcqWI0hHW-EX-IDpcdyKCINRjMFuFJUK9lO5Vmfz1cF31rDvFgpmqQG6rR5CStyat8Z3wIJgEn_6g_nI-d-0SdQPayjDMsDpaGzVfdYUwdU17sFNB_dqk7D1Hk7LuniZNnaMqxlG9OsQWbfPabij4A0mxJLyE-H3uQN7S7GsCJxkwpJryjypBSxfhAmyumPBvPJXJDZa9y2zr-evpmrbhSOgU6izo91asyc_A5IecbRraWWpLqn0",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD0cJeq_vj0KDUtJPIB7PTq-tylX6gWOLzTqaJlBtt9LK8HAh8VHrmqx-pnWFv14J_CNJLOXtWy6cgt5RHFfW4QWSYO1gtxXajpLH0quglHZTNI3a4rY7bCvtBBD_6GOuMPYDa024ftNuqGx5x6W0zM8p72QNgPOOu1SHRonQY2RCwC7Qv5v1RLyXVPh_k3eOCm8qNFoB1pgjLAOoYIDrBN6H5YjbsJ3DYVuwXqXepWn0bs2EZb8JNtvHk-OZaXxbcdj2Yb54ovIGO3RIA"
  ]
};

export default function SuitePhotoCarousel({
  suiteId = "",
  defaultImage = "",
  suiteName = "",
  images,
  altText = "",
  heightClass = "h-64",
  onImageClick,
}: SuitePhotoCarouselProps) {
  const angles = images && images.length > 0 ? images : (SUITE_ANGLES_MAP[suiteId] || (defaultImage ? [defaultImage] : []));
  const [index, setIndex] = useState(0);

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((prev) => (prev === 0 ? angles.length - 1 : prev - 1));
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((prev) => (prev === angles.length - 1 ? 0 : prev + 1));
  };

  return (
    <div id={`carousel-${suiteId}`} className={`${heightClass} relative overflow-hidden group bg-gray-100 select-none`}>
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={index}
          src={angles[index]}
          alt={`${suiteName} - Angle ${index + 1}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full object-cover select-none pointer-events-none"
        />
      </AnimatePresence>

      {/* Angle caption overlay */}
      <div className="absolute top-3 left-3 bg-[#1A2421]/60 backdrop-blur-xs px-2.5 py-1 text-[9px] font-mono tracking-widest text-[#FDFBF7] uppercase border border-[#FDFBF7]/20 rounded-xs select-none">
        Angle {index + 1} / {angles.length}
      </div>

      {angles.length > 1 && (
        <>
          {/* Nav Controls */}
          <button
            onClick={prevSlide}
            aria-label="Previous image angle"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1A2421]/50 hover:bg-[#1A2421]/80 backdrop-blur-xs border border-white/20 flex items-center justify-center text-[#FDFBF7] opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-1 group-hover:translate-x-0"
          >
            <ArrowLeft size={14} />
          </button>
          
          <button
            onClick={nextSlide}
            aria-label="Next image angle"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1A2421]/50 hover:bg-[#1A2421]/80 backdrop-blur-xs border border-white/20 flex items-center justify-center text-[#FDFBF7] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0"
          >
            <ArrowRight size={14} />
          </button>

          {/* Indicators dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {angles.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(dotIdx);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  dotIdx === index 
                    ? "bg-[#C49B55] w-3.5" 
                    : "bg-[#FDFBF7]/50 hover:bg-[#FDFBF7]/80"
                }`}
                aria-label={`Go to angle ${dotIdx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
