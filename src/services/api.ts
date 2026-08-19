import { Destination, Room, Experience, Blog, GalleryItem, FAQ, Booking, Review } from "../types";

export const fetchInitialData = async () => {
  try {
    const [destRes, roomsRes, expRes] = await Promise.all([
      fetch("/api/destinations"),
      fetch("/api/rooms"),
      fetch("/api/experiences")
    ]);
    const destinations: Destination[] = await destRes.json();
    const rooms: Room[] = await roomsRes.json();
    const experiences: Experience[] = await expRes.json();
    return { destinations: destinations || [], rooms: rooms || [], experiences: experiences || [] };
  } catch (error) {
    console.error("Error fetching core REST data", error);
    return { destinations: [], rooms: [], experiences: [] };
  }
};

export const fetchSecondaryData = async () => {
  try {
    const [blogsRes, galRes, faqsRes, bookingsRes, reviewsRes] = await Promise.all([
      fetch("/api/blogs"),
      fetch("/api/gallery"),
      fetch("/api/faqs"),
      fetch("/api/bookings"),
      fetch("/api/reviews")
    ]);
    const blogs: Blog[] = await blogsRes.json();
    const gallery: GalleryItem[] = await galRes.json();
    const faqs: FAQ[] = await faqsRes.json();
    const bookings: Booking[] = await bookingsRes.json();
    const reviews: Review[] = await reviewsRes.json();
    return {
      blogs: blogs || [],
      gallery: gallery || [],
      faqs: faqs || [],
      bookings: bookings || [],
      reviews: reviews || []
    };
  } catch (error) {
    console.error("Error fetching secondary REST data", error);
    return { blogs: [], gallery: [], faqs: [], bookings: [], reviews: [] };
  }
};
