import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import BookingFlow from "./components/BookingFlow";
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

export default function App() {
  const [currentView, setCurrentView] = useState<string>("home");
  const [selectedDestIdForBooking, setSelectedDestIdForBooking] = useState<string>("lamahatta");
  const [checkInSelect, setCheckInSelect] = useState<string>("2026-07-25");
  const [checkOutSelect, setCheckOutSelect] = useState<string>("2026-07-27");
  const [currency, setCurrency] = useState<Currency>("INR");

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsSortBy, setReviewsSortBy] = useState<string>("latest");

  const [selectedRoomForModal, setSelectedRoomForModal] = useState<Room | null>(null);

  useEffect(() => {
    fetchInitialData().then(({ destinations, rooms, experiences }) => {
      if (destinations.length) setDestinations(destinations);
      if (rooms.length) setRooms(rooms);
      if (experiences.length) setExperiences(experiences);
    });

    fetchSecondaryData().then(({ blogs, gallery, faqs, bookings, reviews }) => {
      if (blogs.length) setBlogs(blogs);
      if (gallery.length) setGallery(gallery);
      if (faqs.length) setFaqs(faqs);
      if (bookings.length) setBookings(bookings);
      if (reviews.length) setReviews(reviews);
    });
  }, []);

  const handleNavigate = (view: string, subParam?: any) => {
    setCurrentView(view);
    if (subParam && typeof subParam === "string") {
      setSelectedDestIdForBooking(subParam);
    }
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
            bookings={bookings}
            currency={currency}
            checkInSelect={checkInSelect}
            setCheckInSelect={setCheckInSelect}
            checkOutSelect={checkOutSelect}
            setCheckOutSelect={setCheckOutSelect}
            reviewsSortBy={reviewsSortBy}
            setReviewsSortBy={setReviewsSortBy}
            onNavigate={handleNavigate}
            onReviewSubmitted={(newRev) => setReviews((prev) => [newRev, ...prev])}
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

        {/* VIEW: BOOKING FLOW */}
        {currentView === "booking" && (
          <div className="max-w-6xl mx-auto px-6 py-12">
            <BookingFlow
              destinations={destinations}
              rooms={rooms}
              bookings={bookings}
              currency={currency}
              initialDestId={selectedDestIdForBooking}
              initialCheckIn={checkInSelect}
              initialCheckOut={checkOutSelect}
              onBookingComplete={() => {
                fetchSecondaryData().then(({ bookings }) => setBookings(bookings));
              }}
            />
          </div>
        )}
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
              Our 3 Sanctuary Places
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li onClick={() => handleNavigate("kolkata")} className="hover:text-white transition cursor-pointer">
                Kolkata Classical Townhouse
              </li>
              <li onClick={() => handleNavigate("sundarban")} className="hover:text-white transition cursor-pointer">
                Sundarban Eco Safari Lodge
              </li>
              <li onClick={() => handleNavigate("lamahatta")} className="hover:text-white transition cursor-pointer">
                Lamahatta Mountain Suite
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

        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 font-light gap-4">
          <p>© 2026 Satrangi Homestay. Inspired by the Soil, Water, and Air of Bengal.</p>
          <div className="flex gap-8">
            <span className="hover:text-white transition cursor-pointer">Privacy Charter</span>
            <span className="hover:text-white transition cursor-pointer">Direct Terms of Use</span>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp CTA */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/919876543210?text=Hello%20Satrangi%20Host%2C%20I%20have%20a%20question%20about%20booking."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-3.5 rounded-full shadow-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 transform hover:scale-105"
        >
          <span>Ask a Curator</span>
        </a>
      </div>

      {/* Interactive Room Detail Modal */}
      {selectedRoomForModal && (
        <RoomDetailModal
          room={selectedRoomForModal}
          destination={destinations.find((d) => d.id === selectedRoomForModal.destinationId)}
          currency={currency}
          checkIn={checkInSelect}
          checkOut={checkOutSelect}
          bookings={bookings}
          onClose={() => setSelectedRoomForModal(null)}
          onBookNow={(destId, roomId, checkIn, checkOut) => {
            setSelectedDestIdForBooking(destId);
            setCheckInSelect(checkIn);
            setCheckOutSelect(checkOut);
            handleNavigate("booking", destId);
          }}
        />
      )}
    </div>
  );
}
