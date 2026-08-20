export interface Destination {
  id: string;
  name: string;
  theme: string;
  tagline: string;
  propertyStory: string;
  highlights: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  instagramUrl?: string;
  instagramHandle?: string;
}

export interface Room {
  id: string;
  destinationId: string;
  name: string;
  type: string;
  pricePerNight: number;
  capacity: number;
  sqft: number;
  description: string;
  amenities: string[];
  imageUrls: string[];
}

export interface SentEmail {
  id: string;
  bookingId: string;
  to: string;
  subject: string;
  bodyHtml: string;
  sentAt: string;
}

export interface Booking {
  id: string;
  destinationId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestsCount: number;
  specialRequests?: string;
  paymentMethod?: "pay_at_property" | "online_upi" | "online_card" | "advance_deposit" | string;
  totalPrice: number;
  paymentStatus: "pending" | "paid" | "Pay at Property" | "partial_paid";
  paymentId: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
  confirmationEmail?: SentEmail;
}

export interface Experience {
  id: string;
  title: string;
  category: "Nature" | "Adventure" | "Culture" | "Food" | "Photography" | "Village Life" | string;
  destinationId: string;
  description: string;
  imageUrl: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  category: "Interior" | "Exterior" | "Scenic" | "Experience" | string;
  alt: string;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  date: string;
  destinationId: string;
  roomName?: string;
  roomType?: string;
  photos?: string[];
  isVerifiedStay?: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  imageUrl: string;
}

export interface SystemSettings {
  brandName: string;
  tagline: string;
  whatsappNumber: string;
  contactEmail: string;
  phone: string;
}
