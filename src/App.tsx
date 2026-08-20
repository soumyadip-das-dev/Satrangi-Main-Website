import { useState, useEffect } from "react";
import Header from "./components/Header";
import BookingModal from "./components/BookingModal";
import RoomDetailModal from "./components/RoomDetailModal";
import { Helmet, getSEOConfig } from "./components/common/Helmet";
import { Currency } from "./utils/currency";
import { Destination, Room, Experience, GalleryItem, Review, Blog, FAQ, Booking } from "./types";
import { fetchInitialData, fetchSecondaryData } from "./services/api";

import HomePage from "./pages/HomePage";
import DestinationPage from "./pages/DestinationPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ReviewsPage from "./pages/ReviewsPage";
import BlogsPage from "./pages/BlogsPage";
import GalleryPage from "./pages/GalleryPage";

import { getFormattedDateString } from "./utils/bookingUtils";

export default function App() {
  const [currentView, setCurrentView] = useState<string>("home");
  const [selectedDestIdForBooking, setSelectedDestIdForBooking] = useState<string>("lamahatta");
  const [selectedRoomIdForBooking, setSelectedRoomIdForBooking] = useState<string | undefined>(undefined);
  const [checkInSelect, setCheckInSelect] = useState<string>(() => getFormattedDateString(0));
  const [checkOutSelect, setCheckOutSelect] = useState<string>(() => getFormattedDateString(3));
  const [guestsCountSelect, setGuestsCountSelect] = useState<number>(2);
  const [currency, setCurrency] = useState<Currency>("INR");

  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingModalInitialStep, setBookingModalInitialStep] = useState<number>(1);

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsSortBy, setReviewsSortBy] = useState<string>("latest");

  const [selectedRoomForModal, setSelectedRoomForModal] = useState<Room | null>(null);

  useEffect(() => {
    fetchInitialData().then(({ destinations, rooms, experiences }) => {
      if (destinations.length) setDestinations(destinations);
      if (rooms.length) setRooms(rooms);
      if (experiences.length) setExperiences(experiences);
    });

    fetchSecondaryData().then(({ blogs, gallery, faqs, reviews }) => {
      if (blogs.length) setBlogs(blogs);
      if (gallery.length) setGallery(gallery);
      if (faqs.length) setFaqs(faqs);
      if (reviews.length) setReviews(reviews);
    });
  }, []);

  const handleNavigate = (view: string, subParam?: any, stepParam?: number) => {
    if (subParam && typeof subParam === "string") {
      setSelectedDestIdForBooking(subParam);
    }
    if (view === "booking") {
      setBookingModalInitialStep(stepParam || 1);
      setIsBookingModalOpen(true);
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const seo = getSEOConfig(currentView);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-gray-800 font-sans selection:bg-[#B85A32] selection:text-white flex flex-col justify-between">
      <Helmet title={seo.title} description={seo.description} />

      {/* Header Navigation Bar */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        currency={currency}
        onCurrencyChange={(curr) => setCurrency(curr)}
      />

      <main className="pt-20 sm:pt-24 flex-grow">
        {/* VIEW: HOME */}
        {currentView === "home" && (
          <HomePage
            destinations={destinations}
            rooms={rooms}
            currency={currency}
            selectedDestIdForBooking={selectedDestIdForBooking}
            setSelectedDestIdForBooking={setSelectedDestIdForBooking}
            checkInSelect={checkInSelect}
            setCheckInSelect={setCheckInSelect}
            checkOutSelect={checkOutSelect}
            setCheckOutSelect={setCheckOutSelect}
            guestsCountSelect={guestsCountSelect}
            setGuestsCountSelect={setGuestsCountSelect}
            onNavigate={handleNavigate}
            onSelectRoomModal={(room) => setSelectedRoomForModal(room)}
          />
        )}

        {/* VIEWS: DESTINATIONS (Kolkata, Sundarban, Lamahatta) */}
        {["kolkata", "sundarban", "lamahatta"].includes(currentView) && (
          <DestinationPage
            destinationId={currentView as "kolkata" | "sundarban" | "lamahatta"}
            destinations={destinations}
            rooms={rooms}
            experiences={experiences}
            reviews={reviews}
            currency={currency}
            checkInSelect={checkInSelect}
            setCheckInSelect={setCheckInSelect}
            checkOutSelect={checkOutSelect}
            setCheckOutSelect={setCheckOutSelect}
            reviewsSortBy={reviewsSortBy}
            setReviewsSortBy={setReviewsSortBy}
            onNavigate={handleNavigate}
            onReviewSubmitted={(newRev) => setReviews((prev) => [newRev, ...prev])}
            onSelectRoomModal={(room) => setSelectedRoomForModal(room)}
          />
        )}

        {/* VIEW: GALLERY */}
        {currentView === "gallery" && <GalleryPage gallery={gallery} />}

        {/* VIEW: ABOUT */}
        {currentView === "about" && <AboutPage />}

        {/* VIEW: CONTACT */}
        {currentView === "contact" && <ContactPage faqs={faqs} />}

        {/* VIEW: REVIEWS */}
        {currentView === "reviews" && (
          <ReviewsPage
            reviews={reviews}
            reviewsSortBy={reviewsSortBy}
            setReviewsSortBy={setReviewsSortBy}
            onReviewSubmitted={(newRev) => setReviews((prev) => [newRev, ...prev])}
          />
        )}

        {/* VIEW: BLOGS */}
        {currentView === "blogs" && <BlogsPage blogs={blogs} onNavigate={handleNavigate} />}
      </main>

      {/* Site Footer */}
      <footer className="bg-[#1C352D] text-white pt-16 pb-12 border-t border-[#2D463E]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12 text-left">
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-[#C5A059] uppercase tracking-wider">
              Satrangi
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed font-light">
              Curated heritage homestays & eco-lodges across West Bengal's Kolkata classical townhouse, Sundarban delta marshes, and Lamahatta pine ridge.
            </p>
          </div>
          <div>
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-widest mb-4">
              Our Places
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li onClick={() => handleNavigate("kolkata")} className="hover:text-white transition cursor-pointer">
                Kolkata
              </li>
              <li onClick={() => handleNavigate("sundarban")} className="hover:text-white transition cursor-pointer">
                Sundarban
              </li>
              <li onClick={() => handleNavigate("lamahatta")} className="hover:text-white transition cursor-pointer">
                Lamahatta
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-widest mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li onClick={() => handleNavigate("about")} className="hover:text-white transition cursor-pointer">
                About Our Vision
              </li>
              <li onClick={() => handleNavigate("reviews")} className="hover:text-white transition cursor-pointer">
                Verified Guest Reviews
              </li>
              <li onClick={() => handleNavigate("contact")} className="hover:text-white transition cursor-pointer">
                Contact Concierge
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-widest mb-4">
              Direct Host Contact
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed font-light mb-2">
              WhatsApp / Call: +91 98765 43210
            </p>
            <p className="text-xs text-gray-300 leading-relaxed font-light">
              Email: reservations@satrangihomestay.com
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-center items-center text-center text-xs text-gray-400 font-light gap-6">
          <p>© 2026 Satrangi Homestay.</p>
          <div className="flex gap-8">
            <span className="hover:text-white transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition cursor-pointer">Terms & conditions</span>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp CTA */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/919876543210?text=Hello%20Satrangi%20Host%2C%20I%20have%20a%20question%20about%20staying%20at%20Satrangi."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-3.5 rounded-full shadow-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 transform hover:scale-105"
        >
          <span>Ask a Curator</span>
        </a>
      </div>

      {/* Global Booking Modal Popup */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedRoomIdForBooking(undefined);
          setBookingModalInitialStep(1);
        }}
        destinations={destinations}
        rooms={rooms}
        currency={currency}
        initialDestId={selectedDestIdForBooking}
        initialRoomId={selectedRoomIdForBooking}
        initialCheckIn={checkInSelect}
        initialCheckOut={checkOutSelect}
        initialGuestsCount={guestsCountSelect}
        initialStep={bookingModalInitialStep}
      />

      {/* Interactive Room Detail Modal */}
      {selectedRoomForModal && (
        <RoomDetailModal
          room={selectedRoomForModal}
          destination={destinations.find((d) => d.id === selectedRoomForModal.destinationId)}
          currency={currency}
          checkIn={checkInSelect}
          checkOut={checkOutSelect}
          initialGuestsCount={guestsCountSelect}
          onClose={() => setSelectedRoomForModal(null)}
          onBookNow={(destId, roomId, checkIn, checkOut, guestsCount) => {
            setSelectedDestIdForBooking(destId);
            setSelectedRoomIdForBooking(roomId);
            setCheckInSelect(checkIn);
            setCheckOutSelect(checkOut);
            setGuestsCountSelect(guestsCount);
            setSelectedRoomForModal(null);
            setBookingModalInitialStep(3);
            setIsBookingModalOpen(true);
          }}
        />
      )}
    </div>
  );
}
