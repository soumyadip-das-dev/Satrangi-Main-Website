# Satrangi Homestays — CMS Integration Guide & Requirements

This document serves as the master blueprint and reference guide for developing the custom **Satrangi Headless CMS**.

---

## 📌 Master CMS Collections & Schemas

### 1. **Hero Slider & Banner Management (`/api/hero-slides`)**
- **Fields**:
  - `img`: File / Media upload (PNG, JPG, WEBP).
  - `tagline`: Uppercase tagline (e.g. `"SERENITY FOR SOLO TRAVELERS, COUPLES & FAMILIES"`).
  - `title`: Destination / Sanctuary title (e.g. `"Lamahatta Mountain Sanctuary"`).
  - `desc`: Short evocative description text.
  - `destinationId`: Target page navigation (`"lamahatta"`, `"sundarban"`, `"kolkata"`).
  - `displayOrder`: Number (1, 2, 3...).
  - `isPublished`: Boolean switch.

---

### 2. **Google Places Reviews Curation (`/api/google-places`)**
- **Workflow**:
  1. CMS fetches live reviews via Google Places API for Kolkata, Sundarban, and Lamahatta Place IDs.
  2. Moderation interface allows admin to select:
     - `isPublished`: Toggle to show/hide on website.
     - `isFeatured`: Toggle to feature on Homepage.
     - `assignedDestinationId`: Link review to specific homestay.
  3. Website REST API (`server.ts`) queries CMS for published reviews only.

---

### 3. **Destinations Collection (`/api/destinations`)**
- **Fields**:
  - `id`: `"kolkata"` | `"sundarban"` | `"lamahatta"`
  - `name`: String
  - `theme`: String
  - `tagline`: String
  - `propertyStory`: Paragraph story text
  - `highlights`: String Array
  - `coordinates`: `{ lat: number, lng: number }`

---

### 4. **Suites & Rooms Collection (`/api/rooms`)**
- **Fields**:
  - `id`: String
  - `destinationId`: String
  - `name`: String
  - `type`: String (`"Suite"`, `"Cottage"`, `"Villa"`, `"Studio"`)
  - `pricePerNight`: Number (base INR price)
  - `capacity`: Number (guest count)
  - `sqft`: Number
  - `description`: String
  - `amenities`: String Array
  - `imageUrls`: String Array (Media uploads)

---

### 5. **Guest Reviews Collection (`/api/reviews`)**
- **Fields**:
  - `authorName`: String
  - `rating`: Number (1 to 5 stars)
  - `text`: String
  - `date`: Date ISO String
  - `destinationId`: String
  - `roomName`: String
  - `photos`: Base64 / Media URLs Array (Uploaded guest stay pictures)
  - `isVerifiedStay`: Boolean (Auto-set if booking ID or stay photos attached)

---

### 6. **Direct Bookings Engine (`/api/bookings`)**
- **Fields**:
  - `id`: String (e.g. `SR-3291-B01`)
  - `destinationId`: String
  - `roomId`: String
  - `checkIn`: Date String
  - `checkOut`: Date String
  - `guestName`: String
  - `guestEmail`: String
  - `guestPhone`: String
  - `guestsCount`: Number
  - `totalPrice`: Number
  - `status`: `"pending"` | `"confirmed"` | `"cancelled"` | `"completed"`
  - `paymentStatus`: `"paid"` | `"pending"`

---

## 🛠️ Bridge Integration (`src/utils/cmsConnector.ts`)
The website is equipped with `cmsConnector.ts`. When the external CMS portal is deployed:
1. Update `CMS_API_KEY` and `CMS_URL` in `.env`.
2. The website will automatically connect and stream live data.
