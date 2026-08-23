import React, { useState } from "react";
import { 
  Check, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Coffee, 
  Compass, 
  Utensils, 
  TreePine, 
  Landmark, 
  Instagram, 
  Star, 
  Heart,
  ChevronRight,
  Eye
} from "lucide-react";
import { Destination, Room, Experience, Review, Booking } from "../types";
import { Currency, formatPrice } from "../utils/currency";
import SuitePhotoCarousel from "../components/SuitePhotoCarousel";
import DestinationGallery from "../components/DestinationGallery";
import ReviewCard from "../components/ReviewCard";
import ReviewSubmission from "../components/ReviewSubmission";
import Destination3DArt from "../components/Destination3DArt";

interface DestinationPageProps {
  destinationId: "kolkata" | "sundarban" | "lamahatta";
  destinations: Destination[];
  rooms: Room[];
  experiences: Experience[];
  reviews: Review[];
  bookings?: Booking[];
  currency: Currency;
  checkInSelect: string;
  setCheckInSelect: (d: string) => void;
  checkOutSelect: string;
  setCheckOutSelect: (d: string) => void;
  reviewsSortBy: string;
  setReviewsSortBy: (s: string) => void;
  onNavigate: (view: string, subParam?: any) => void;
  onReviewSubmitted: (newReview: Review) => void;
  onSelectRoomModal?: (room: Room) => void;
}

export default function DestinationPage({
  destinationId,
  destinations,
  rooms,
  experiences,
  reviews,
  bookings = [],
  currency,
  checkInSelect,
  setCheckInSelect,
  checkOutSelect,
  setCheckOutSelect,
  reviewsSortBy,
  setReviewsSortBy,
  onNavigate,
  onReviewSubmitted,
  onSelectRoomModal,
}: DestinationPageProps) {
  const destination = destinations.find((d) => d.id === destinationId);
  const destRooms = rooms.filter((r) => r.destinationId === destinationId);
  const destExperiences = experiences.filter((e) => e.destinationId === destinationId);

  const [activeGalleryPreview, setActiveGalleryPreview] = useState<string | null>(null);

  const getSortedReviews = () => {
    const filtered = reviews.filter((r) => r.destinationId === destinationId);
    if (reviewsSortBy === "highest") {
      return [...filtered].sort((a, b) => b.rating - a.rating);
    }
    if (reviewsSortBy === "lowest") {
      return [...filtered].sort((a, b) => a.rating - b.rating);
    }
    return [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const sortedReviews = getSortedReviews();

  // Curated Content Configuration matching the Boutique Luxury Layout
  const getConfig = () => {
    switch (destinationId) {
      case "kolkata":
        return {
          heroHeadline: "Exceptional Heritage in a Timeless Setting",
          heroTagline: "Boutique, luxury heritage sanctuary tailored to every individual",
          heroImg: "/kolkata_hero.png",
          aboutTitle: "About Satrangi Kolkata",
          aboutLead: "At Satrangi Kolkata, we provide a refined welcoming environment where comfort, dignity, and colonial elegance come together.",
          aboutParagraph1: "Our boutique townhouse approach ensures every traveler receives personalized attention, creating a true sense of home in a luxurious setting.",
          aboutParagraph2: "We are dedicated to celebrating authentic Bengal heritage—from hand-polished crimson red oxide verandahs to quiet courtyard morning teas, offering peace of mind to both solo explorers and cherished families.",
          diamondImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuDiJErL1NVsuFluLGmpkq_nb7AffVDvOyIm8pfr0dJVAEhu0QujGYI9LSR3xcJYfG0TpSVb3a_dXM9disYdO6UL52Rc9M60FpQnzH6dOlnshJCr7Gm_s2xgqEKYf85Mh_4Syu7ECBgMK6zUq5isZsis-t3SgK8_y5oZ9Y3To12rcIjUs-9dGJB4fZk-Lm_9PQFbs5HyqjBr1r3bvLiIAPG44_gdMRPIbJnEgkgeBtJwW6iDwUsdD3GucBCpzetUEtuA0oCvOfKB18He",
          facadeImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnzKOH3iNF2rtJp50aMwTUPfE6LBIKwBUk29LG1GsW5nI-Wnt035Nv3LKXlVnOaWWfLsZrutatdm9RRaKk4PjlZ2GHbmdsN5dUSyisa4-p2xQR8smK8hbIvkovo7gJcPKnPOsuPlwnXSgAAWVS9vpTnqDo_CYbRwMGZrMvQ8sNfHfEPbfkU7UgUQOSwJBWRhxFViwFHBe5Z4aldltBhV4xNeY0jEQNJ2XLBdi6Eifx_VbZPesRVTQvbdPBhLTTTPRlYq5RxPGzg48",
          statLabel: "Historic Heart",
          statValue: "1920s Heritage Townhouse",
          servicesHeadline: "Unwavering Commitment to Your Care & Comfort",
          services: [
            {
              title: "Heritage Sanctuaries",
              description: "Restored 1920s high-ceiling suites with authentic teak beds and serene private balconies.",
              icon: Landmark,
            },
            {
              title: "Courtyard Gastronomy",
              description: "Artisanal homestyle Bengali thalis, slow-cooked mustard infusions, and morning brew tastings.",
              icon: Utensils,
            },
            {
              title: "Curated Cultural Trails",
              description: "Intimate guided walks through vintage book streets, clay potter colonies, and Victoria landmarks.",
              icon: Compass,
            }
          ],
          galleryTitle: "Discover Our Beautiful Sanctuaries",
          gallerySubtitle: "An intimate photo journey through Kolkata's colonial grace",
          galleryMontage: [
            { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDiJErL1NVsuFluLGmpkq_nb7AffVDvOyIm8pfr0dJVAEhu0QujGYI9LSR3xcJYfG0TpSVb3a_dXM9disYdO6UL52Rc9M60FpQnzH6dOlnshJCr7Gm_s2xgqEKYf85Mh_4Syu7ECBgMK6zUq5isZsis-t3SgK8_y5oZ9Y3To12rcIjUs-9dGJB4fZk-Lm_9PQFbs5HyqjBr1r3bvLiIAPG44_gdMRPIbJnEgkgeBtJwW6iDwUsdD3GucBCpzetUEtuA0oCvOfKB18He", label: "Grand Suite Sanctuary" },
            { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDF1N3PRu1GVI9D91FATGEol1YMngISQMmuHMpTk84xzr_Mt0Kwn3BSeJ4Rx4Xp-AtIBtEHwZ68eytDzPwanDbhsHs2u7VihIlA6gutQT457IhcxPSoXvQhX3ZLon0IgzVRGMiEE5JtEbrKFZpIB9ahz5Kgl9fBNvBN2zPpJvm4anIwSQEpo0winW5iGWLH-LNv__Nc6WAmkzwVtuyijxcJ4Px_3b4C1KSsqfNAuIljRm5xlphfEDzUzlgqc9IQjUhDWWEP9R2WZwKyIM4", label: "Courtyard Dining" },
            { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnzKOH3iNF2rtJp50aMwTUPfE6LBIKwBUk29LG1GsW5nI-Wnt035Nv3LKXlVnOaWWfLsZrutatdm9RRaKk4PjlZ2GHbmdsN5dUSyisa4-p2xQR8smK8hbIvkovo7gJcPKnPOsuPlwnXSgAAWVS9vpTnqDo_CYbRwMGZrMvQ8sNfHfEPbfkU7UgUQOSwJBWRhxFViwFHBe5Z4aldltBhV4xNeY0jEQNJ2XLBdi6Eifx_VbZPesRVTQvbdPBhLTTTPRlYq5RxPGzg48", label: "Tropical Courtyard" },
            { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0cJeq_vj0KDUtJPIB7PTq-tylX6gWOLzTqaJlBtt9LK8HAh8VHrmqx-pnWFv14J_CNJLOXtWy6cgt5RHFfW4QWSYO1gtxXajpLH0quglHZTNI3a4rY7bCvtBBD_6GOuMPYDa024ftNuqGx5x6W0zM8p72QNgPOOu1SHRonQY2RCwC7Qv5v1RLyXVPh_k3eOCm8qNFoB1pgjLAOoYIDrBN6H5YjbsJ3DYVuwXqXepWn0bs2EZb8JNtvHk-OZaXxbcdj2Yb54ovIGO3RIA", label: "Red Oxide Lounge" },
            { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAte6SOFbSFkWTjz_KIGB56z3MardGLApjqH6JnOuzSHMVRPLbquOWZuK38PcfGcholgWvYz0z0uA6qJdxfgkn04VeB3cBn6Xl1CNFeq6WQ4Ax7K9ACWkw8FAMZ794rYo-vLcZK3OGvVQq3BwZV80a2PUOBeTVV9XXqE_WF58Ld4y7l7liuaF7NG-Z9GR--EPEBtT_sL9LG1kfe-h_ztZoVHJ_yLSSv0XJkCXUDEiTpMfTOJAGHSqTRjO34s2H9KklZYyCa-atnnj79", label: "Townhouse Reading Room" },
          ],
          diningTitle: "Dining with Heritage & Quality",
          diningDesc: "We believe that dining is an essential part of warm hospitality. Our courtyard kitchen thoughtfully prepares meals using the finest local ingredients—featuring heirloom mustard fish, roasted lentils, aromatic Gobindobhog rice, and classical artisanal sweets served under the open sky.",
          diningImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuDF1N3PRu1GVI9D91FATGEol1YMngISQMmuHMpTk84xzr_Mt0Kwn3BSeJ4Rx4Xp-AtIBtEHwZ68eytDzPwanDbhsHs2u7VihIlA6gutQT457IhcxPSoXvQhX3ZLon0IgzVRGMiEE5JtEbrKFZpIB9ahz5Kgl9fBNvBN2zPpJvm4anIwSQEpo0winW5iGWLH-LNv__Nc6WAmkzwVtuyijxcJ4Px_3b4C1KSsqfNAuIljRm5xlphfEDzUzlgqc9IQjUhDWWEP9R2WZwKyIM4",
          livingSpacesLead: "Comfortable Living Spaces",
          livingSpacesSub: "Private, high-ceiling suites with classic furniture and serene balconies",
          ctaHeadline: "Seeking the Ideal Heritage Retreat?",
          ctaSub: "Connect with our hosts directly for personalized itineraries, private transfers, and bespoke dining.",
        };

      case "sundarban":
        return {
          heroHeadline: "Untamed Delta Majesty in Pure Eco-Comfort",
          heroTagline: "Sustainable, secluded island retreat on scenic G-Plot shorelines",
          heroImg: "/sundarban_hero.png",
          aboutTitle: "About Satrangi Sundarban",
          aboutLead: "Satrangi Sundarban is a secluded estuarine eco-lodge offering authentic tranquility where dense mangrove forests embrace the Bay of Bengal.",
          aboutParagraph1: "Our boutique island philosophy pairs peaceful stilted luxury with thrilling wildlife encounters, letting guests safely immerse in nature's greatest delta.",
          aboutParagraph2: "From silent wooden boat safaris seeking Gangetic dolphins to peaceful red-crab beach strolls and freshly caught river feasts, we deliver unforgettable island hospitality.",
          diamondImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaYjy4e-XXFwdkagOoZsOEZkvT0V0piUX4M26-qP7uhiSca4muFrt42zavFFrNFiwrAxDnFlN8LLvbrUurlfDbK5s8Bb59J8Yy95kyAx0Eii7Ft-bg_tY1keeToWqrJlbuE0toY_YFwwB4HwIYwFZa2pt8_uL5pwNcAuFmHNLyW7ndRnGpJC5G0MVyYyn4KBS8PdBUSusvErNpb9zXUSizNvuOe_x2fWsvntUD5B8_J0zDSoQyXa9EXwR7IT8hfw8soEaOlhLwhEcdcaY",
          facadeImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKxjEPOMmQ0a6cL1ITnl07z35ebEnXXmxjaqHzz4ppg1ig38uDvITIwbDc-ej5Cz4hI0Anmpwwd5qQb1CEdbqljCg6Cq08itkm3_S-LpupZt13sdFGoxgRJ979NBcUbsTbnkjk5EY1AHGiPa9brMd70x5MjXugCJIrSMDyY5dY5fTwKCo6JsVYxmYVw5cbnSmB_iFhW9B-ewvVYNOxswpDQZ-nttpChU-Pv1Uxnpoj8yFHiCEBpsR8kds8oIHmND3IZwNRbGA_ZbE-Dac",
          statLabel: "Ecosystem",
          statValue: "G-Plot Island Mangrove Coast",
          servicesHeadline: "Unwavering Commitment to Nature & Comfort",
          services: [
            {
              title: "Stilted River Chalets",
              description: "Bamboo architecture with unobstructed water views, cooling river breezes, and private sunset decks.",
              icon: TreePine,
            },
            {
              title: "Silent Mangrove Cruises",
              description: "Traditional wooden country boats cruising serene estuaries with seasoned local wildlife trackers.",
              icon: Compass,
            },
            {
              title: "Fresh Estuary Feasts",
              description: "Daily catch from local fishermen—giant river prawns, bhetki, and organic island vegetables.",
              icon: Utensils,
            }
          ],
          galleryTitle: "Discover Our Delta Island Sanctuaries",
          gallerySubtitle: "Glimpses of river mist, mangrove creeks, and golden sunset estuaries",
          galleryMontage: [
            { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKxjEPOMmQ0a6cL1ITnl07z35ebEnXXmxjaqHzz4ppg1ig38uDvITIwbDc-ej5Cz4hI0Anmpwwd5qQb1CEdbqljCg6Cq08itkm3_S-LpupZt13sdFGoxgRJ979NBcUbsTbnkjk5EY1AHGiPa9brMd70x5MjXugCJIrSMDyY5dY5fTwKCo6JsVYxmYVw5cbnSmB_iFhW9B-ewvVYNOxswpDQZ-nttpChU-Pv1Uxnpoj8yFHiCEBpsR8kds8oIHmND3IZwNRbGA_ZbE-Dac", label: "Stilted River Chalet" },
            { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaYjy4e-XXFwdkagOoZsOEZkvT0V0piUX4M26-qP7uhiSca4muFrt42zavFFrNFiwrAxDnFlN8LLvbrUurlfDbK5s8Bb59J8Yy95kyAx0Eii7Ft-bg_tY1keeToWqrJlbuE0toY_YFwwB4HwIYwFZa2pt8_uL5pwNcAuFmHNLyW7ndRnGpJC5G0MVyYyn4KBS8PdBUSusvErNpb9zXUSizNvuOe_x2fWsvntUD5B8_J0zDSoQyXa9EXwR7IT8hfw8soEaOlhLwhEcdcaY", label: "Sunset Boat Safari" },
            { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqaoTmsJEgDonzKh4JUOZ3B8yD57jjCa5X56PHoUppLWjslQOecPRtdx-S5yBHcpueoc8SRSEtd2D6oZ9qFr-Ai5c7-tXHjHS3WF0c7iYNkvdIgRthjMW2pdiKu9UOx3paiLGsk3i16qE7q0saWW-zZGr3IqoEvsCIq6QXclc1EuMZiOTYoOpVtYXScT6y_9G3u9WqXSQaXN6MG3ec0mCVB1rOkhCDG7fiyHFbfV6ZWRsb7SobsuN1VfSBQ9bwi1GZZOEIemHroVeUQA8", label: "Mangrove Wildlife Track" },
            { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsO-sTzou4Xlz-ymI800L2QQntaM1hpNvJXG0dut7_cNOqU_kLuKrxYUQ63L7h0mXVf8RYiTK6HdM4V0EjbalPn2K9BiBXPzEc-QvVbrA9hLamSIBEQQfes4J6LE5uQ4eOOZDungRqkJkvAg0CrqdpAanR3LM3LZvBDRHlI_5d_SOjPUANPDAqw8ETULWSsQiruY4-rn6oCQgQDZf8KF-_jXbk3BRnOERIg680fZP7juW2B8ZbJzMlrSRp7u8-LhxNihDwRjT1TlfF", label: "Pristine Estuary Beach" },
            { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKxjEPOMmQ0a6cL1ITnl07z35ebEnXXmxjaqHzz4ppg1ig38uDvITIwbDc-ej5Cz4hI0Anmpwwd5qQb1CEdbqljCg6Cq08itkm3_S-LpupZt13sdFGoxgRJ979NBcUbsTbnkjk5EY1AHGiPa9brMd70x5MjXugCJIrSMDyY5dY5fTwKCo6JsVYxmYVw5cbnSmB_iFhW9B-ewvVYNOxswpDQZ-nttpChU-Pv1Uxnpoj8yFHiCEBpsR8kds8oIHmND3IZwNRbGA_ZbE-Dac", label: "Waterside Dining Deck" },
          ],
          diningTitle: "Dining with Coastal Heritage & Freshness",
          diningDesc: "Experience the rich culinary soul of the Sundarban delta. Savor fresh river fish prepared with cold-pressed mustard oil, sweet island coconut curries, crisp country vegetables, and evening teas as the river tides gently turn.",
          diningImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqaoTmsJEgDonzKh4JUOZ3B8yD57jjCa5X56PHoUppLWjslQOecPRtdx-S5yBHcpueoc8SRSEtd2D6oZ9qFr-Ai5c7-tXHjHS3WF0c7iYNkvdIgRthjMW2pdiKu9UOx3paiLGsk3i16qE7q0saWW-zZGr3IqoEvsCIq6QXclc1EuMZiOTYoOpVtYXScT6y_9G3u9WqXSQaXN6MG3ec0mCVB1rOkhCDG7fiyHFbfV6ZWRsb7SobsuN1VfSBQ9bwi1GZZOEIemHroVeUQA8",
          livingSpacesLead: "Comfortable Living Spaces",
          livingSpacesSub: "Boutique eco-suites designed for peaceful relaxation along the water's edge",
          ctaHeadline: "Planning Your Delta Wildlife Adventure?",
          ctaSub: "Reserve early to secure private safari boats and the finest stilted estuary-facing chalets.",
        };

      case "lamahatta":
      default:
        return {
          heroHeadline: "Exceptional Serenity in an Alpine Setting",
          heroTagline: "Boutique, luxury mountain haven 5,700 FT above the clouds",
          heroImg: "/lamahatta_hero.png",
          aboutTitle: "About Satrangi Lamahatta",
          aboutLead: "Perched at 5,700 feet amidst towering pine forests, Satrangi Lamahatta provides a peaceful haven of warmth and Himalayan grace.",
          aboutParagraph1: "Designed for couples, honeymoons, and peaceful family holidays, our boutique alpine chalets feature unobstructed Kanchenjunga panoramas and cedar fireplaces.",
          aboutParagraph2: "Relax with underfloor heating, savor single-estate organic Darjeeling teas, and wander serene Sherpa forest trails away from crowded tourist centers.",
          diamondImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoustqL1tEEtYmNh0CMBCDP2Cnz6L55i1uNsPB70IvKiz1RM4606YphO_ly5IaOmzabV3MP1OUWsgGyxuR9vsoY-U6xgbl2_kI8ppgXRfVwS77PbbBeGbBvZIsHPYqdaDkyGkaHUxaDLyAX9qt0HPgpc1EUCVQvHzDU0zq9OcDXZATa5P6ImUbCgW3rzEW_kT4FBsl1f6k44x80bvgb0e5jS2BIz3yhBNGUjPvsZzTibhhLGlXpsj_6iGExNs6gu1uclR-EFvtln2ET8k",
          facadeImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzEiAu-fkjC0NgmgIUPTFihWx0mHcqWI0hHW-EX-IDpcdyKCINRjMFuFJUK9lO5Vmfz1cF31rDvFgpmqQG6rR5CStyat8Z3wIJgEn_6g_nI-d-0SdQPayjDMsDpaGzVfdYUwdU17sFNB_dqk7D1Hk7LuniZNnaMqxlG9OsQWbfPabij4A0mxJLyE-H3uQN7S7GsCJxkwpJryjypBSxfhAmyumPBvPJXJDZa9y2zr-evpmrbhSOgU6izo91asyc_A5IecbRraWWpLqn0",
          statLabel: "Altitude",
          statValue: "5,700 FT Alpine Ridge",
          servicesHeadline: "Unwavering Commitment to Your Mountain Retreat",
          services: [
            {
              title: "Alpine Chalets & Hearth",
              description: "Private cedar wood fireplaces, underfloor heating, and expansive valley view decks.",
              icon: Landmark,
            },
            {
              title: "Kanchenjunga Panoramas",
              description: "270-degree mountain views right from your private terrace and master bedroom suite.",
              icon: Compass,
            },
            {
              title: "Organic Tea Tastings",
              description: "Exclusive single-estate Darjeeling tastings paired with fireside evening bonfires.",
              icon: Coffee,
            }
          ],
          galleryTitle: "Discover Our Himalayan Sanctuaries",
          gallerySubtitle: "Whispering pine forests, mist-shrouded peaks, and cozy fireside retreats",
          galleryMontage: [
            { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNxu5fjp3EpBL0-wxfTnuJnjcZ29umAwQkZEFgLZQHOZ713GhPT4qw5yhndGcj41KOG55vs8fC72yKiifHdpOGoBlsDw5jTjfR9KG1tOwfJWGfJIHvqq6ZKUAwr8fvHmQaXul2P1I_x1QrduMesKUCvGgKdTrmJrWiKc_yP26Du7T1L6Njv9vkA1kukK_mwzl4iZKSSC7u9uxBeCEk7Msy3N5rWA0Y0eSwI_CG8lDyY1supnelM_IRdIpFvXw51sEXEwlvYPIcKqXd2w4", label: "Pine Attic Suite" },
            { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzEiAu-fkjC0NgmgIUPTFihWx0mHcqWI0hHW-EX-IDpcdyKCINRjMFuFJUK9lO5Vmfz1cF31rDvFgpmqQG6rR5CStyat8Z3wIJgEn_6g_nI-d-0SdQPayjDMsDpaGzVfdYUwdU17sFNB_dqk7D1Hk7LuniZNnaMqxlG9OsQWbfPabij4A0mxJLyE-H3uQN7S7GsCJxkwpJryjypBSxfhAmyumPBvPJXJDZa9y2zr-evpmrbhSOgU6izo91asyc_A5IecbRraWWpLqn0", label: "Himalayan Sunrise" },
            { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoustqL1tEEtYmNh0CMBCDP2Cnz6L55i1uNsPB70IvKiz1RM4606YphO_ly5IaOmzabV3MP1OUWsgGyxuR9vsoY-U6xgbl2_kI8ppgXRfVwS77PbbBeGbBvZIsHPYqdaDkyGkaHUxaDLyAX9qt0HPgpc1EUCVQvHzDU0zq9OcDXZATa5P6ImUbCgW3rzEW_kT4FBsl1f6k44x80bvgb0e5jS2BIz3yhBNGUjPvsZzTibhhLGlXpsj_6iGExNs6gu1uclR-EFvtln2ET8k", label: "Pine Cone Bonfire" },
            { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEJV4sZuLSjd7dODAg4Xpz0tkCTY6VTi1r7g4CAtUiaIMCRMRSAqOSU50Go35fHs9ydmw-6mas1q8ogTi5OQv_N06gUDWG6rBUrE80LXK3QXwu05XllxVEA7t6txV0OT1pthX9ffPC1Zf46aichtO7KHD-MnwDolmmYgugM0XUWxhzKFuxsO6C9tONovyPWyaQTy-6yi2ezA1m4UIlohN6YxXzPWuSxfssIxn94QERavAIZOgNTLi_yT8Qy7WpCufhrTpoQRWuqCYj", label: "Tea Estate Walk" },
            { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCl1Ad2B8af1S63zU9w336ggC4LQ4FK0-SpaR5bpJBnLPiJdZvVdJL8R3qUML5hJOGgxAfD9rXjNtIGwAtTFW3_AGADm0s_Sen0KOhklv4K7iCK54gzfGHSRaCWaKEYGLZcPVcG4CNBmZHnNJqpRVT8taDKlQBgGMhYCvUP9FaOF8Z4GK0lZgSd2aeSxecNqYQ0RZDy-fBXuLlU8tqm8xJwtMbvguB3EFZ3hu-qIVnElWsdD_yKLQ6vRKVMWVkfnz439MYL4o_dqcGzC00", label: "Valley Villa Vista" },
          ],
          diningTitle: "Dining with Mountain Warmth & Quality",
          diningDesc: "Indulge in nourishing Himalayan comfort food prepared over gentle wood fire. Savor steaming organic soups, handcrafted momos, wild mushroom delicacies, and artisanal rhododendron cordials by the hearth.",
          diningImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEJV4sZuLSjd7dODAg4Xpz0tkCTY6VTi1r7g4CAtUiaIMCRMRSAqOSU50Go35fHs9ydmw-6mas1q8ogTi5OQv_N06gUDWG6rBUrE80LXK3QXwu05XllxVEA7t6txV0OT1pthX9ffPC1Zf46aichtO7KHD-MnwDolmmYgugM0XUWxhzKFuxsO6C9tONovyPWyaQTy-6yi2ezA1m4UIlohN6YxXzPWuSxfssIxn94QERavAIZOgNTLi_yT8Qy7WpCufhrTpoQRWuqCYj",
          livingSpacesLead: "Comfortable Living Spaces",
          livingSpacesSub: "Cozy timber suites with private hearths and sweeping mountain views",
          ctaHeadline: "Seeking the Ideal Himalayan Escape?",
          ctaSub: "Reserve directly with our local Sherpa team for tailored mountain treks and private fireside dinners.",
        };
    }
  };

  const config = getConfig();

  return (
    <div className="animate-fade-in bg-[#FAF7F2] text-[#1C352D] font-sans antialiased overflow-x-hidden selection:bg-[#C5A059]/30">
      
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: HERO WITH ARCHED/CURVED FRAME & GOLD ACCENTS
      ────────────────────────────────────────────────────────────── */}
      <section className="relative pt-6 sm:pt-10 pb-12 sm:pb-16 px-3 sm:px-6 max-w-[1400px] mx-auto">
        <div className="relative rounded-t-3xl sm:rounded-t-[40px] rounded-b-[40px] sm:rounded-b-[80px] lg:rounded-b-[100px] overflow-hidden min-h-[540px] sm:min-h-[640px] lg:min-h-[700px] flex flex-col justify-between p-6 sm:p-12 lg:p-16 shadow-2xl border-b-2 border-[#C5A059]/40">
          
          {/* Background Cover Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
            style={{ backgroundImage: `url(${config.heroImg})` }}
          />

          {/* Luxury Multi-Stop Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/50 backdrop-blur-[0.5px]" />


          {/* Center Hero Typography */}
          <div className="relative z-10 max-w-3xl mx-auto text-center my-auto py-8 sm:py-12">
            <span className="text-[#E6C587] text-[11px] sm:text-xs font-sans uppercase tracking-[0.35em] font-semibold block mb-3 drop-shadow-sm">
              {destination?.tagline || config.heroTagline}
            </span>
            
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-white mb-5 sm:mb-6 tracking-tight leading-tight drop-shadow-md">
              {config.heroHeadline}
            </h1>

            <p className="font-sans text-xs sm:text-sm md:text-base text-gray-200 font-light max-w-xl mx-auto leading-relaxed mb-8 drop-shadow-sm">
              {config.heroTagline}
            </p>

            {/* Dual Pill CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => onNavigate("booking", destinationId)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-sans uppercase tracking-[0.2em] font-bold bg-[#C5A059] hover:bg-[#B85A32] text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                Make an Enquiry
              </button>
              <button
                type="button"
                onClick={() => {
                  document.getElementById("suites-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-sans uppercase tracking-[0.2em] font-bold bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/40 transition-all duration-300 cursor-pointer"
              >
                Explore Suites
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION: 3D SEGMENTED RIBBON ART POSTER (MATCHING REFERENCE)
      ────────────────────────────────────────────────────────────── */}
      <Destination3DArt
        destinationId={destinationId}
        title={destinationId.toUpperCase()}
        subtitle={
          destinationId === "kolkata"
            ? "1920s Colonial Elegance • Crimson Verandahs & Heritage Courtyards"
            : destinationId === "lamahatta"
            ? "5,700 FT Alpine Sanctuary • Whispering Pines & Kanchenjunga Dawn"
            : "Estuarine Eco-Sanctuary • Golden Mangrove Horizons & Silent Waters"
        }
        tagline={
          destinationId === "kolkata"
            ? "HISTORIC BENGAL ATELIER"
            : destinationId === "lamahatta"
            ? "EASTERN HIMALAYAN RETREAT"
            : "UNTOUCHED BENGAL DELTA"
        }
        imageSrc={config.heroImg}
      />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: "ABOUT [DESTINATION]" WITH DIAMOND EMBLEM & FACADE
      ────────────────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 overflow-hidden">
        
        {/* Soft Background Watermark */}
        <div className="absolute left-1/2 -translate-x-1/2 top-4 text-center pointer-events-none select-none text-[55px] sm:text-[90px] lg:text-[130px] font-serif font-extralight text-[#1C352D]/[0.035] whitespace-nowrap tracking-wider">
          About {destination?.name.split(" ")[0]}
        </div>

        {/* Narrative & Diamond Showcase */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-center mb-16 sm:mb-20">
          
          {/* Left Narrative Column */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#C5A059] font-bold block">
              {destination?.theme || "CURATED SANCTUARY"}
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1C352D] tracking-tight leading-tight">
              {config.aboutTitle}
            </h2>

            <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
              {config.aboutLead}
            </p>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
              {config.aboutParagraph1}
            </p>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
              {config.aboutParagraph2}
            </p>

            <div className="pt-3">
              <button
                type="button"
                onClick={() => onNavigate("about")}
                className="px-7 py-3 rounded-full text-xs font-sans uppercase tracking-[0.2em] font-bold bg-[#C5A059] hover:bg-[#B85A32] text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                Learn More About
              </button>
            </div>
          </div>

          {/* Right Diamond Image Column */}
          <div className="lg:col-span-5 flex justify-center py-6 sm:py-8">
            <div className="relative">
              {/* Outer Golden Glow Border */}
              <div className="w-56 h-56 sm:w-68 sm:h-68 rotate-45 rounded-3xl border-2 border-[#C5A059]/80 shadow-2xl p-2 bg-[#FAF7F2]/80 backdrop-blur-sm relative overflow-hidden group">
                <div className="w-full h-full rounded-2xl overflow-hidden relative">
                  <img
                    src={config.diamondImg}
                    alt={destination?.name}
                    className="w-full h-full object-cover -rotate-45 scale-145 group-hover:scale-160 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Bottom Diamond Crest / Emblem */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 rotate-45 bg-[#FAF7F2] border-2 border-[#C5A059] flex items-center justify-center shadow-lg rounded-lg z-20">
                <Sparkles size={16} className="-rotate-45 text-[#C5A059]" />
              </div>
            </div>
          </div>
        </div>

      </section>


      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: CURATED SERVICES ("UNWAVERING COMMITMENT TO YOUR CARE")
      ────────────────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24 bg-[#F5EFEB]/70 border-y border-[#E8DFD3]/80">
        
        {/* Soft Background Watermark */}
        <div className="absolute left-1/2 -translate-x-1/2 top-4 text-center pointer-events-none select-none text-[60px] sm:text-[100px] lg:text-[140px] font-serif font-extralight text-[#1C352D]/[0.03] whitespace-nowrap tracking-widest">
          Experiences
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#C5A059] font-bold block mb-2">
            SIGNATURE SERVICES
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1C352D] mb-12 sm:mb-16 tracking-tight max-w-2xl mx-auto leading-tight">
            {config.servicesHeadline}
          </h2>

          {/* 3 Luxury Service Cards with Gold Corner Brackets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 text-center">
            {config.services.map((srv, idx) => {
              const IconComp = srv.icon;
              return (
                <div
                  key={idx}
                  className="relative bg-white/95 backdrop-blur-sm border border-[#E8DFD3] rounded-2xl p-8 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                >
                  {/* Decorative Gold Corner Brackets */}
                  <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#C5A059]/50 pointer-events-none group-hover:border-[#C5A059] transition-colors" />
                  <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#C5A059]/50 pointer-events-none group-hover:border-[#C5A059] transition-colors" />
                  <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#C5A059]/50 pointer-events-none group-hover:border-[#C5A059] transition-colors" />
                  <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#C5A059]/50 pointer-events-none group-hover:border-[#C5A059] transition-colors" />

                  <div>
                    {/* Icon in gold-bordered circle */}
                    <div className="w-14 h-14 mx-auto rounded-full border border-[#C5A059]/40 bg-[#FAF7F2] flex items-center justify-center mb-6 group-hover:bg-[#C5A059] group-hover:text-white transition-colors duration-300 text-[#C5A059]">
                      <IconComp size={24} />
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#1C352D] mb-3 group-hover:text-[#B85A32] transition-colors">
                      {srv.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
                      {srv.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => onNavigate("experiences")}
            className="px-8 py-3.5 rounded-full text-xs font-sans uppercase tracking-[0.2em] font-bold bg-[#C5A059] hover:bg-[#B85A32] text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            View Our Experiences
          </button>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: PHOTO DISCOVERY MONTAGE ("DISCOVER OUR BEAUTIFUL SANCTUARIES")
      ────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#C5A059] font-bold block mb-2">
          CURATED GALLERY
        </span>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1C352D] mb-2 tracking-tight">
          {config.galleryTitle}
        </h2>

        {/* Delicate Dot Divider */}
        <div className="flex items-center justify-center gap-1.5 my-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/40" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/40" />
        </div>

        <p className="text-xs sm:text-sm text-gray-600 font-light max-w-md mx-auto mb-10 sm:mb-12">
          {config.gallerySubtitle}
        </p>

        {/* 5-Image Asymmetric Luxury Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 mb-10">
          
          {/* Main Large Portrait (Left) */}
          <div 
            onClick={() => setActiveGalleryPreview(config.galleryMontage[0].url)}
            className="md:col-span-4 h-72 sm:h-96 md:h-[480px] rounded-2xl overflow-hidden relative group cursor-pointer shadow-md border border-[#E8DFD3]"
          >
            <img
              src={config.galleryMontage[0].url}
              alt={config.galleryMontage[0].label}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
              <span className="text-white text-xs font-serif italic tracking-wide">{config.galleryMontage[0].label}</span>
            </div>
          </div>

          {/* Middle Stack (2 Landscape items) */}
          <div className="md:col-span-4 flex flex-col gap-4 sm:gap-6">
            <div 
              onClick={() => setActiveGalleryPreview(config.galleryMontage[1].url)}
              className="h-44 sm:h-56 md:h-[228px] rounded-2xl overflow-hidden relative group cursor-pointer shadow-md border border-[#E8DFD3]"
            >
              <img
                src={config.galleryMontage[1].url}
                alt={config.galleryMontage[1].label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-xs font-serif italic tracking-wide">{config.galleryMontage[1].label}</span>
              </div>
            </div>

            <div 
              onClick={() => setActiveGalleryPreview(config.galleryMontage[2].url)}
              className="h-44 sm:h-56 md:h-[228px] rounded-2xl overflow-hidden relative group cursor-pointer shadow-md border border-[#E8DFD3]"
            >
              <img
                src={config.galleryMontage[2].url}
                alt={config.galleryMontage[2].label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-xs font-serif italic tracking-wide">{config.galleryMontage[2].label}</span>
              </div>
            </div>
          </div>

          {/* Right Stack (2 items or 1 portrait + landscape) */}
          <div className="md:col-span-4 flex flex-col gap-4 sm:gap-6">
            <div 
              onClick={() => setActiveGalleryPreview(config.galleryMontage[3].url)}
              className="h-44 sm:h-56 md:h-[228px] rounded-2xl overflow-hidden relative group cursor-pointer shadow-md border border-[#E8DFD3]"
            >
              <img
                src={config.galleryMontage[3].url}
                alt={config.galleryMontage[3].label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-xs font-serif italic tracking-wide">{config.galleryMontage[3].label}</span>
              </div>
            </div>

            <div 
              onClick={() => setActiveGalleryPreview(config.galleryMontage[4].url)}
              className="h-44 sm:h-56 md:h-[228px] rounded-2xl overflow-hidden relative group cursor-pointer shadow-md border border-[#E8DFD3]"
            >
              <img
                src={config.galleryMontage[4].url}
                alt={config.galleryMontage[4].label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-xs font-serif italic tracking-wide">{config.galleryMontage[4].label}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("gallery")}
          className="px-8 py-3.5 rounded-full text-xs font-sans uppercase tracking-[0.2em] font-bold bg-[#C5A059] hover:bg-[#B85A32] text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          View Full Gallery
        </button>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: DINING & GASTRONOMY FEATURE ("DINING WITH CARE & QUALITY")
      ────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[#F5EFEB]/50 border-t border-[#E8DFD3]/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden border border-[#E8DFD3] shadow-xl grid grid-cols-1 lg:grid-cols-12 items-center bg-white">
            
            {/* Dining Photography */}
            <div className="lg:col-span-7 h-72 sm:h-96 lg:h-[480px] relative overflow-hidden">
              <img
                src={config.diningImg}
                alt="Dining with Quality & Heritage"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent lg:hidden" />
            </div>

            {/* Overlapping Floating Card with Gold Corner Marks */}
            <div className="lg:col-span-5 p-8 sm:p-12 relative bg-white flex flex-col justify-center text-left">
              
              {/* Decorative Corner Marks */}
              <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-[#C5A059]/60 pointer-events-none" />
              <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-[#C5A059]/60 pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-[#C5A059]/60 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-[#C5A059]/60 pointer-events-none" />

              <span className="text-[11px] uppercase tracking-[0.3em] text-[#C5A059] font-bold block mb-2">
                AUTHENTIC CULINARY
              </span>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1C352D] mb-4 tracking-tight leading-tight">
                {config.diningTitle}
              </h2>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light mb-6">
                {config.diningDesc}
              </p>

              <div>
                <button
                  type="button"
                  onClick={() => onNavigate("experiences")}
                  className="px-7 py-3 rounded-full text-xs font-sans uppercase tracking-[0.2em] font-bold bg-[#C5A059] hover:bg-[#B85A32] text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  Dining Experiences
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          SECTION 6: SUITES & PRIVATE LIVING ("COMFORTABLE LIVING SPACES")
      ────────────────────────────────────────────────────────────── */}
      <section id="suites-section" className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#C5A059] font-bold block mb-2">
          ACCOMMODATION
        </span>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1C352D] mb-3 tracking-tight">
          {config.livingSpacesLead}
        </h2>

        <p className="text-xs sm:text-sm text-gray-600 font-light max-w-lg mx-auto mb-12 sm:mb-16">
          {config.livingSpacesSub}
        </p>

        {/* Room Collection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {destRooms.map((room) => {
            return (
              <div
                key={room.id}
                className="relative bg-white rounded-2xl sm:rounded-3xl border border-[#E8DFD3] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-left group"
              >
                <div>
                  {/* Photo Carousel Header */}
                  <SuitePhotoCarousel
                    suiteId={room.id}
                    suiteName={room.name}
                    images={room.imageUrls}
                    altText={room.name}
                    heightClass="h-60 sm:h-68"
                  />

                  {/* Room Details */}
                  <div className="p-6 sm:p-7">
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="font-serif text-xl font-normal text-[#1C352D] group-hover:text-[#B85A32] transition-colors">
                        {room.name}
                      </h3>
                      <span className="font-serif text-lg font-bold text-[#B85A32]">
                        {formatPrice(room.pricePerNight, currency)}{" "}
                        <span className="text-[10px] text-gray-400 font-sans font-normal">/night</span>
                      </span>
                    </div>

                    <p className="text-[11px] text-[#C5A059] uppercase tracking-wider font-bold mb-3">
                      {room.sqft} SQFT • Max {room.capacity} Guests • {room.type}
                    </p>

                    <p className="text-xs text-gray-600 leading-relaxed font-light mb-5 line-clamp-3">
                      {room.description}
                    </p>

                    {/* Amenities tags */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {room.amenities.slice(0, 3).map((am, i) => (
                        <span key={i} className="text-[10px] bg-[#FAF7F2] text-gray-700 px-2.5 py-1 rounded-md border border-[#E8DFD3]/60">
                          {am}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="text-[10px] text-gray-400 self-center">
                          +{room.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="p-6 sm:p-7 pt-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectRoomModal) {
                        onSelectRoomModal(room);
                      } else {
                        onNavigate("booking", destinationId);
                      }
                    }}
                    className="w-full py-3 rounded-full text-xs font-sans uppercase tracking-[0.2em] font-bold bg-[#1C352D] hover:bg-[#C5A059] text-white transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer text-center flex items-center justify-center gap-2"
                  >
                    <span>Reserve Direct</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          SECTION 7: GUEST TESTIMONIALS & REVIEWS ("WHAT OUR GUESTS SAY")
      ────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[#F5EFEB]/70 border-t border-[#E8DFD3]/80">
        
        {/* Soft Background Watermark */}
        <div className="absolute left-1/2 -translate-x-1/2 top-4 text-center pointer-events-none select-none text-[60px] sm:text-[100px] lg:text-[140px] font-serif font-extralight text-[#1C352D]/[0.03] whitespace-nowrap tracking-widest">
          Testimonials
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#C5A059] font-bold block mb-2">
              AUTHENTIC REVIEWS
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1C352D] tracking-tight">
              What Our Guests Say
            </h2>

            <div className="flex items-center justify-center gap-1 my-3 text-[#C5A059]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="#C5A059" stroke="#C5A059" />
              ))}
            </div>
          </div>

          {/* Reviews Sort & Submit Bar */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#E8DFD3]">
            <p className="text-xs text-gray-600 font-medium">
              Showing <strong className="text-gray-900">{sortedReviews.length}</strong> verified guest stories
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold hidden sm:inline">Sort:</span>
              <select
                value={reviewsSortBy}
                onChange={(e) => setReviewsSortBy(e.target.value)}
                className="bg-white border border-[#E8DFD3] rounded-lg text-xs text-gray-700 px-3 py-1.5 focus:border-[#C5A059] outline-none font-sans font-medium"
              >
                <option value="latest">Latest First</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>
          </div>

          {/* Reviews Cards List */}
          {sortedReviews.length === 0 ? (
            <div className="text-center py-12 bg-white border border-[#E8DFD3] rounded-2xl text-xs text-gray-400 font-sans mb-12">
              No guest diaries compiled yet for {destination?.name}. Be the first to share your journey!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {sortedReviews.map((rev) => (
                <ReviewCard key={rev.id} review={rev} />
              ))}
            </div>
          )}
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          SECTION 8: CLOSING INVITATION BANNER ("LOOKING FOR THE RIGHT RETREAT?")
      ────────────────────────────────────────────────────────────── */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 bg-[#1C352D] text-white overflow-hidden text-center">
        {/* Background Subtle Silhouette */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 scale-105"
          style={{ backgroundImage: `url(${config.facadeImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C352D] via-[#1C352D]/85 to-[#1C352D]/90" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#E6C587] font-semibold block">
            RESERVE YOUR STAY
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-white leading-tight">
            {config.ctaHeadline}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-gray-300 font-light max-w-xl mx-auto leading-relaxed">
            {config.ctaSub}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate("booking", destinationId)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-sans uppercase tracking-[0.2em] font-bold bg-[#C5A059] hover:bg-[#B85A32] text-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              Check Availability & Rates
            </button>
            <button
              type="button"
              onClick={() => onNavigate("contact")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-sans uppercase tracking-[0.2em] font-bold bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-sm transition-all duration-300 cursor-pointer"
            >
              Contact Concierge
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Photo Click */}
      {activeGalleryPreview && (
        <div
          onClick={() => setActiveGalleryPreview(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
            <img
              src={activeGalleryPreview}
              alt="Gallery Preview"
              className="w-full h-full object-contain max-h-[80vh]"
            />
            <p className="text-center text-xs text-white/70 py-2 font-mono">Click anywhere to close</p>
          </div>
        </div>
      )}

    </div>
  );
}
