import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DB_PATH = path.join(process.cwd(), "db_data.json");

// Enable CORS for external CMS portal connectivity
app.use((req, res, next) => {
  const allowedOrigins = process.env.CMS_ALLOWED_ORIGINS || "*";
  res.setHeader("Access-Control-Allow-Origin", allowedOrigins);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-cms-api-key, x-cms-webhook-secret, X-Requested-With");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());

// CMS API Security / Auth Middleware
function validateCmsAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const apiKey = process.env.CMS_API_KEY;
  if (!apiKey) {
    // If CMS_API_KEY environment variable is not explicitly set, allow access with dev notice
    return next();
  }

  const clientKey = req.headers["x-cms-api-key"] || (req.headers.authorization && req.headers.authorization.replace(/^Bearer\s+/i, ""));
  if (clientKey !== apiKey) {
    return res.status(401).json({ 
      error: "Unauthorized CMS Access", 
      message: "Invalid or missing 'x-cms-api-key' header or Bearer authorization token." 
    });
  }
  next();
}

// Initialize full database with core schemas & rich seeded content
function initDatabase() {
  if (fs.existsSync(DB_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
      if (!data.sentEmails) {
        data.sentEmails = [];
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
      }
      // Ensure all expected collections exist
      if (data.destinations && data.rooms && data.bookings && data.reviews) {
        return;
      }
    } catch (e) {
      console.error("Failed to parse database, re-seeding.", e);
    }
  }

  // Create robust seed data aligning with Kolkata, Sundarban, and Lamahatta properties
  const seedData = {
    destinations: [
      {
        id: "kolkata",
        name: "Kolkata",
        theme: "Heritage & Cultural Haven",
        tagline: "Where 1920s Colonial Elegance Meets Generational Warmth",
        propertyStory: "Step through soaring teak doorways into Satrangi Kolkata—a lovingly restored 1920s heritage townhouse crafted for curious solo travelers, romantic couples, and family staycations alike. High ceilings, cool red-oxide floors, quiet courtyard reading alcoves, and home-style Bengali meals create a welcoming sanctuary in the heart of historic Bengal.",
        highlights: [
          "Restored 1920s Heritage Townhouse & Courtyard Library",
          "Chef-Guided Bengali Thali & Cooking Masterclasses",
          "Peaceful Sanctuary Ideal for Solo Travelers & Couples",
          "Minutes from Historic Park Street & Victoria Memorial"
        ],
        coordinates: { lat: 22.5726, lng: 88.3639 }
      },
      {
        id: "sundarban",
        name: "Sundarban",
        theme: "Estuarine Eco-Lodge & Wildlife",
        tagline: "Eco-crafted Lodging where Mangrove Rivers Meet Untouched Shores",
        propertyStory: "Sculpted directly onto the pristine shoreline of G-Plot Island where the Saptamukhi estuary meets the Bay of Bengal, Satrangi Sundarban offers an unforgettable retreat. Designed for adventurous families, nature-loving couples, and solo explorers, our stilted eco-villas feature private sunset decks, guided river safaris, and organic local meals.",
        highlights: [
          "Private Guided Mangrove Safaris & Red Crab Beach Trails",
          "Stilted High-Comfort Eco-Villas with Estuary Views",
          "Safe, Kid-Friendly Family Excursions & Bird Watching",
          "Fresh Local Estuarine Seafood & Organic Homestyle Dining"
        ],
        coordinates: { lat: 21.9497, lng: 89.1833 }
      },
      {
        id: "lamahatta",
        name: "Lamahatta",
        theme: "Alpine Pine Serenity",
        tagline: "5,700 FT Mountain Sanctuary Above the Himalayan Mist",
        propertyStory: "Perched at 5,700 feet amidst whispering pine forests, Satrangi Lamahatta is a tranquil mountain haven for romantic honeymoons, inspiring solo writing retreats, and peaceful family holidays. Unobstructed Kanchenjunga mountain views, cedar wood fireplaces, underfloor heating, and guided Sherpa pine grove walks make every moment magical.",
        highlights: [
          "270-Degree Unobstructed Kanchenjunga Mountain Views",
          "Private Sunset Hearth Decks & Cedar Wood Fireplaces",
          "Romantic Couples' Sunset Teas & Fireside Stargazing",
          "Guided Pine Grove Forest Treks & Sherpa Village Trails"
        ],
        coordinates: { lat: 27.0145, lng: 88.3571 }
      }
    ],
    rooms: [
      {
        id: "kolkata-heritage-suite",
        destinationId: "kolkata",
        name: "Room 1",
        type: "Suite",
        pricePerNight: 12500,
        capacity: 2,
        sqft: 600,
        description: "A grand space featuring a signature four-poster teak wood king bed, high ceilings, classical brass fans, and a spacious private balcony overlooking our internal tropical courtyard.",
        amenities: ["California King Bed", "Private Balcony", "Courtyard View", "Writing Desk", "Premium Bath Kit", "High Speed WiFi"],
        imageUrls: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDiJErL1NVsuFluLGmpkq_nb7AffVDvOyIm8pfr0dJVAEhu0QujGYI9LSR3xcJYfG0TpSVb3a_dXM9disYdO6UL52Rc9M60FpQnzH6dOlnshJCr7Gm_s2xgqEKYf85Mh_4Syu7ECBgMK6zUq5isZsis-t3SgK8_y5oZ9Y3To12rcIjUs-9dGJB4fZk-Lm_9PQFbs5HyqjBr1r3bvLiIAPG44_gdMRPIbJnEgkgeBtJwW6iDwUsdD3GucBCpzetUEtuA0oCvOfKB18He"]
      },
      {
        id: "kolkata-colonial-room",
        destinationId: "kolkata",
        name: "Room 2",
        type: "Standard",
        pricePerNight: 8000,
        capacity: 2,
        sqft: 400,
        description: "Timeless refinement featuring original red oxide flooring, restored colonial arches, antique side tables, and integrated modern amenities.",
        amenities: ["Queen Bed", "Writing Desk", "Rain Shower", "Tea Maker", "Smart Thermostat"],
        imageUrls: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBnzKOH3iNF2rtJp50aMwTUPfE6LBIKwBUk29LG1GsW5nI-Wnt035Nv3LKXlVnOaWWfLsZrutatdm9RRaKk4PjlZ2GHbmdsN5dUSyisa4-p2xQR8smK8hbIvkovo7gJcPKnPOsuPlwnXSgAAWVS9vpTnqDo_CYbRwMGZrMvQ8sNfHfEPbfkU7UgUQOSwJBWRhxFViwFHBe5Z4aldltBhV4xNeY0jEQNJ2XLBdi6Eifx_VbZPesRVTQvbdPBhLTTTPRlYq5RxPGzg48p"]
      },
      {
        id: "kolkata-zen-studio",
        destinationId: "kolkata",
        name: "Room 3",
        type: "Studio",
        pricePerNight: 6500,
        capacity: 2,
        sqft: 350,
        description: "A compact urban oasis with clean lines, minimalist layout, soft natural wood aesthetics, and direct access to our roof-garden.",
        amenities: ["Double Bed", "Roof-garden Access", "Kitchenette", "Smart TV", "Organic Linens"],
        imageUrls: ["https://lh3.googleusercontent.com/aida-public/AB6AXuB-8jCUPK8lA8yx8afT_wUFH5VPn4vpihGsNM1SKzQLTjlpiOYnYq7z9qStjMDydKZKnZ0pM9jPCY4d3WPXAnSC5HkuOKweYszO_thhFFQps9gbkr3VXIijTjt8XbKurZzOvW7xZH-oXBrAgafvx0fjDVr5Pk0sRqJVsvZod4FLE7XmuPmSpqTj5pJUfxzukPLAPQkGDOlWGxM4b9j0-CcBMwMxXJSwkg1JCMeJqn5BB40QgZuXf3KLGp9tSnN86tEjfJJ1UqVUuOxw"]
      },
      {
        id: "sundarban-tiger-suite",
        destinationId: "sundarban",
        name: "Room 1",
        type: "Suite",
        pricePerNight: 12000,
        capacity: 2,
        sqft: 580,
        description: "Our signature luxury forest cabin. Floor-to-ceiling panoramic sliding doors look onto the winding river delta channels, coupled with a private wooden sun deck.",
        amenities: ["King Size Canopy Bed", "Private Mud-flat Deck", "Outdoor Rain Shower", "Coffee Bar", "Plush Daybeds"],
        imageUrls: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDKxjEPOMmQ0a6cL1ITnl07z35ebEnXXmxjaqHzz4ppg1ig38uDvITIwbDc-ej5Cz4hI0Anmpwwd5qQb1CEdbqljCg6Cq08itkm3_S-LpupZt13sdFGoxgRJ979NBcUbsTbnkjk5EY1AHGiPa9brMd70x5MjXugCJIrSMDyY5dY5fTwKCo6JsVYxmYVw5cbnSmB_iFhW9B-ewvVYNOxswpDQZ-nttpChU-Pv1Uxnpoj8yFHiCEBpsR8kds8oIHmND3IZwNRbGA_ZbE-Dac"]
      },
      {
        id: "sundarban-river-cottage",
        destinationId: "sundarban",
        name: "Room 2",
        type: "Cottage",
        pricePerNight: 8500,
        capacity: 2,
        sqft: 420,
        description: "A cozy independent cottage elevated on stilts at the forest fringe, where you can watch deers and kingfishers from your porch.",
        amenities: ["Queen Bed", "River View Porch", "Eco Air Conditioning", "Starlink WiFi", "Writing Bureau"],
        imageUrls: ["https://lh3.googleusercontent.com/aida-public/AB6AXuAsO-sTzou4Xlz-ymI800L2QQntaM1hpNvJXG0dut7_cNOqU_kLuKrxYUQ63L7h0mXVf8RYiTK6HdM4V0EjbalPn2K9BiBXPzEc-QvVbrA9hLamSIBEQQfes4J6LE5uQ4eOOZDungRqkJkvAg0CrqdpAanR3LM3LZvBDRHlI_5d_SOjPUANPDAqw8ETULWSsQiruY4-rn6oCQgQDZf8KF-_jXbk3BRnOERIg680fZP7juW2B8ZbJzMlrSRp7u8-LhxNihDwRjT1TlfF"]
      },
      {
        id: "lamahatta-cloud-suite",
        destinationId: "lamahatta",
        name: "Room 1",
        type: "Suite",
        pricePerNight: 12500,
        capacity: 2,
        sqft: 450,
        description: "Perched at the highest crown of our hillside retreat. A cedar-lined room with a private sunset deck and ceiling skylights for star-gazing.",
        amenities: ["California King Bed", "Glass Skylight", "Sunset Terrace", "Cedar Wood Hearth", "Mini Espresso Bar", "Sonos Sound System"],
        imageUrls: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBmLnwLvvmBMo_LEn4HXapXrg4o3CzJ0u_sAQxzu0Mspt-tAeH3n3JYdR4wdMYVuPKJzAhesuhz-p_MuPD6cOkTy9vMnpdGGFhye89muEOb2xfVy_8miZMwKyymfLB6Ku_lf1LnBabW_hMROSUOvHqh9zR0Vnh1YC_6kT5T67zhLwMgugbDlY_yO-PabasywOHuYivaAlvT4n1Dejvbkiv_larDzmnh8eFcKO7HeGRQPz0M7wM8AHct1rXpR4b9bYPAO0lWcIDsvq5wdgY"]
      },
      {
        id: "lamahatta-pine-cottage",
        destinationId: "lamahatta",
        name: "Room 2",
        type: "Cottage",
        pricePerNight: 9000,
        capacity: 2,
        sqft: 380,
        description: "An intimate cabin with triangular high-vaulted roof trusses, completely encircled by whispering pines and morning mist.",
        amenities: ["Queen Bed", "Forest View Deck", "Underfloor Heating", "Tea Selection Bar", "Organic Linens"],
        imageUrls: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDNxu5fjp3EpBL0-wxfTnuJnjcZ29umAwQkZEFgLZQHOZ713GhPT4qw5yhndGcj41KOG55vs8fC72yKiifHdpOGoBlsDw5jTjfR9KG1tOwfJWGfJIHvqq6ZKUAwr8fvHmQaXul2P1I_x1QrduMesKUCvGgKdTrmJrWiKc_yP26Du7T1L6Njv9vkA1kukK_mwzl4iZKSSC7u9uxBeCEk7Msy3N5rWA0Y0eSwI_CG8lDyY1supnelM_IRdIpFvXw51sEXEwlvYPIcKqXd2w4"]
      },
      {
        id: "lamahatta-valley-villa",
        destinationId: "lamahatta",
        name: "Room 3",
        type: "Villa",
        pricePerNight: 18000,
        capacity: 4,
        sqft: 820,
        description: "A sprawling two-bedroom mountain sanctuary. Features a generous fireplace, local hand-woven rugs, and panoramic glass vistas overlooking Darjeeling valley.",
        amenities: ["2 King Beds", "Central Fireplace", "Valley Balcony", "Kitchenette", "Premium Bath Kit", "Custom Audio Setup"],
        imageUrls: ["https://lh3.googleusercontent.com/aida-public/AB6AXuCl1Ad2B8af1S63zU9w336ggC4LQ4FK0-SpaR5bpJBnLPiJdZvVdJL8R3qUML5hJOGgxAfD9rXjNtIGwAtTFW3_AGADm0s_Sen0KOhklv4K7iCK54gzfGHSRaCWaKEYGLZcPVcG4CNBmZHnNJqpRVT8taDKlQBgGMhYCvUP9FaOF8Z4GK0lZgSd2aeSxecNqYQ0RZDy-fBXuLlU8tqm8xJwtMbvguB3EFZ3hu-qIVnElWsdD_yKLQ6vRKVMWVkfnz439MYL4o_dqcGzC00"]
      }
    ],
    bookings: [
      {
        id: "SR-3291-B01",
        destinationId: "lamahatta",
        roomId: "lamahatta-cloud-suite",
        checkIn: "2026-06-25",
        checkOut: "2026-06-28",
        guestName: "Arunav Sen",
        guestEmail: "arunav@gmail.com",
        guestPhone: "+91 98310 98310",
        guestsCount: 2,
        totalPrice: 37500,
        paymentStatus: "paid",
        paymentId: "pay_Kk92Asj39",
        status: "confirmed",
        createdAt: "2026-06-18T10:12:00.000Z"
      },
      {
        id: "SR-3291-B02",
        destinationId: "kolkata",
        roomId: "kolkata-heritage-suite",
        checkIn: "2026-07-02",
        checkOut: "2026-07-04",
        guestName: "Sarah Jenkins",
        guestEmail: "sarah.j@traveltimes.co.uk",
        guestPhone: "+44 7911 123456",
        guestsCount: 1,
        totalPrice: 25000,
        paymentStatus: "paid",
        paymentId: "pay_Kk981Asoq",
        status: "confirmed",
        createdAt: "2026-06-17T15:30:00.000Z"
      },
      {
        id: "SR-3291-B03",
        destinationId: "sundarban",
        roomId: "sundarban-tiger-suite",
        checkIn: "2026-06-21",
        checkOut: "2026-06-24",
        guestName: "Priyanshi Mehta",
        guestEmail: "priyanshi@yahoo.com",
        guestPhone: "+91 91234 56789",
        guestsCount: 2,
        totalPrice: 36000,
        paymentStatus: "pending",
        paymentId: "",
        status: "pending",
        createdAt: "2026-06-18T22:45:00.000Z"
      }
    ],
    experiences: [
      {
        id: "ex-mangrove-safari",
        title: "Mangrove Safari Expedition",
        category: "Adventure",
        destinationId: "sundarban",
        description: "Navigate the deep channels of the Sundarban Delta on a silent electric-assisted wood boat to spot the Royal Bengal Tiger and saltwater crocodiles.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaYjy4e-XXFwdkagOoZsOEZkvT0V0piUX4M26-qP7uhiSca4muFrt42zavFFrNFiwrAxDnFlN8LLvbrUurlfDbK5s8Bb59J8Yy95kyAx0Eii7Ft-bg_tY1keeToWqrJlbuE0toY_YFwwB4HwIYwFZa2pt8_uL5pwNcAuFmHNLyW7ndRnGpJC5G0MVyYyn4KBS8PdBUSusvErNpb9zXUSizNvuOe_x2fWsvntUD5B8_J0zDSoQyXa9EXwR7IT8hfw8soEaOlhLwhEcdcaY"
      },
      {
        id: "ex-forest-bonfire",
        title: "Himalayan Bonfire & Infusions",
        category: "Nature",
        destinationId: "lamahatta",
        description: "Unwind on stone patios surrounded by towering blue pines under a crystalline starlit sky, enjoying hand-roasted snacks and indigenous rhododendron teas.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoustqL1tEEtYmNh0CMBCDP2Cnz6L55i1uNsPB70IvKiz1RM4606YphO_ly5IaOmzabV3MP1OUWsgGyxuR9vsoY-U6xgbl2_kI8ppgXRfVwS77PbbBeGbBvZIsHPYqdaDkyGkaHUxaDLyAX9qt0HPgpc1EUCVQvHzDU0zq9OcDXZATa5P6ImUbCgW3rzEW_kT4FBsl1f6k44x80bvgb0e5jS2BIz3yhBNGUjPvsZzTibhhLGlXpsj_6iGExNs6gu1uclR-EFvtln2ET8k"
      },
      {
        id: "ex-tea-making",
        title: "Tea Estate Picking & Tasters",
        category: "Food",
        destinationId: "lamahatta",
        description: "A private stroll through adjacent organic fields, learning plucking with estate team members followed by a custom brewing masterclass.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEJV4sZuLSjd7dODAg4Xpz0tkCTY6VTi1r7g4CAtUiaIMCRMRSAqOSU50Go35fHs9ydmw-6mas1q8ogTi5OQv_N06gUDWG6rBUrE80LXK3QXwu05XllxVEA7t6txV0OT1pthX9ffPC1Zf46aichtO7KHD-MnwDolmmYgugM0XUWxhzKFuxsO6C9tONovyPWyaQTy-6yi2ezA1m4UIlohN6YxXzPWuSxfssIxn94QERavAIZOgNTLi_yT8Qy7WpCufhrTpoQRWuqCYj"
      },
      {
        id: "ex-heritage-walk",
        title: "Colonial Core & Bookstores Walk",
        category: "Culture",
        destinationId: "kolkata",
        description: "A quiet walking exploration focusing on College Street's old library townhouses, traditional coffee houses, and architectural remains of early Bengal.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAte6SOFbSFkWTjz_KIGB56z3MardGLApjqH6JnOuzSHMVRPLbquOWZuK38PcfGcholgWvYz0z0uA6qJdxfgkn04VeB3cBn6Xl1CNFeq6WQ4Ax7K9ACWkw8FAMZ794rYo-vLcZK3OGvVQq3BwZV80a2PUOBeTVV9XXqE_WF58Ld4y7l7liuaF7NG-Z9GR--EPEBtT_sL9LG1kfe-h_ztZoVHJ_yLSSv0XJkCXUDEiTpMfTOJAGHSqTRjO34s2H9KklZYyCa-atnnj79"
      },
      {
        id: "ex-bengali-thali",
        title: "Classical Bengali Thali Workshop",
        category: "Food",
        destinationId: "kolkata",
        description: "An intimate workshop inside our courtyard kitchen learning the secrets behind mustard-steamed fish (bhetki paturi) and custom spices.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDF1N3PRu1GVI9D91FATGEol1YMngISQMmuHMpTk84xzr_Mt0Kwn3BSeJ4Rx4Xp-AtIBtEHwZ68eytDzPwanDbhsHs2u7VihIlA6gutQT457IhcxPSoXvQhX3ZLon0IgzVRGMiEE5JtEbrKFZpIB9ahz5Kgl9fBNvBN2zPpJvm4anIwSQEpo0winW5iGWLH-LNv__Nc6WAmkzwVtuyijxcJ4Px_3b4C1KSsqfNAuIljRm5xlphfEDzUzlgqc9IQjUhDWWEP9R2WZwKyIM4"
      },
      {
        id: "ex-kumartuli-pottery",
        title: "Kumartuli Clay Craft & Artisans",
        category: "Village Life",
        destinationId: "kolkata",
        description: "Wander through Kolkata's famous clay artisan district with our gallery curators, watching clay idols being brought to life entirely by hand.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZpsNwwhu5Vc-haO1iWVIKL3RaDKJUYjfPmXsChme8pJNj3z05J9uS1sZIXYkQgpiIkY0UTm0CQasX_ESgIkxawWBDHisNQIACypQyp4z9KAQTtsZlkCq8t-DO-7pt4aYKTcAM4mt30DJBnXJGwq1486CbAtq7JH4mb72Ue5yOnAtJjSvmxBGp-M-PxpyLVHsO-_tDPeFL-oEMGhizMCefOeyNm1MD6LseWC2hUkFQoI30BQBRfuccIfETaeMmjNFxFQ091ZkZk2Kqn34"
      }
    ],
    gallery: [
      { id: "g1", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzEiAu-fkjC0NgmgIUPTFihWx0mHcqWI0hHW-EX-IDpcdyKCINRjMFuFJUK9lO5Vmfz1cF31rDvFgpmqQG6rR5CStyat8Z3wIJgEn_6g_nI-d-0SdQPayjDMsDpaGzVfdYUwdU17sFNB_dqk7D1Hk7LuniZNnaMqxlG9OsQWbfPabij4A0mxJLyE-H3uQN7S7GsCJxkwpJryjypBSxfhAmyumPBvPJXJDZa9y2zr-evpmrbhSOgU6izo91asyc_A5IecbRraWWpLqn0", category: "Scenic", alt: "Himalayan Sunrise with Hot Darjeeling Tea" },
      { id: "g2", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqaoTmsJEgDonzKh4JUOZ3B8yD57jjCa5X56PHoUppLWjslQOecPRtdx-S5yBHcpueoc8SRSEtd2D6oZ9qFr-Ai5c7-tXHjHS3WF0c7iYNkvdIgRthjMW2pdiKu9UOx3paiLGsk3i16qE7q0saWW-zZGr3IqoEvsCIq6QXclc1EuMZiOTYoOpVtYXScT6y_9G3u9WqXSQaXN6MG3ec0mCVB1rOkhCDG7fiyHFbfV6ZWRsb7SobsuN1VfSBQ9bwi1GZZOEIemHroVeUQA8", category: "Experience", alt: "Silent Delta Roots of the Mangroves" },
      { id: "g3", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0cJeq_vj0KDUtJPIB7PTq-tylX6gWOLzTqaJlBtt9LK8HAh8VHrmqx-pnWFv14J_CNJLOXtWy6cgt5RHFfW4QWSYO1gtxXajpLH0quglHZTNI3a4rY7bCvtBBD_6GOuMPYDa024ftNuqGx5x6W0zM8p72QNgPOOu1SHRonQY2RCwC7Qv5v1RLyXVPh_k3eOCm8qNFoB1pgjLAOoYIDrBN6H5YjbsJ3DYVuwXqXepWn0bs2EZb8JNtvHk-OZaXxbcdj2Yb54ovIGO3RIA", category: "Interior", alt: "Boutique library reading space" },
      { id: "g4", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUMH2y7aYU5D-wIlejxtRNuVkjKP3DMWu46MYLQm1iEp8vNb9zDNyynqdhBt18OkspDhnUjobekeUtH8X9ZHO201vhKvoe9PKUBQXQWPFU8zncaWxoV6TQgpWtZnUfTlI48ZFHEDt5cOd6JXnu1ti_G4Aa9mfxn0DPiG2XixqVyc18ki8VfSWvmKycXF94j1Bi1AAlcxVMaR7sNQ8zAncl4Vu5Yxt5u2vLTEH5qkq9M1yNeNuzwrfd_-s-uG7VffMb1wkdRtkv6lcDysA", category: "Experience", alt: "Artisanal handloom fabric draping details" },
      { id: "g5", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_sK9ldKlz2J4A8BAmXZZpCEpARMvPX5QzXapH-nHi4PlYh-Sv3mDD3b3j8_nVQVrK_XXHbU7rJsP8yrNPC2tiy5w_XwTwFs2jGgHvmVlSXeTAzKP13EWgRY8fhlo_WyNrV60-0lPV-BHWSGF3mvcdVMBfkxRVHsnQQqF7tUF9E42oaZNlpq13GggJL6yVsFVP3erfBJO5IgWgBkIsIxBl1rY-Y_t8dAE_ZlDEim8nuEW_H4x5dbGKuI3L6XpwOyF3cyqKf_YgstJJrio", category: "Experience", alt: "Travelers gathered around a community dinner table" }
    ],
    blogs: [
      {
        id: "blog-1",
        title: "Chasing Darjeeling Dews in Lamahatta",
        excerpt: "An intimate record of spending cold Himalayan mornings in pine groves watching the Kanchenjunga transform from pink to dynamic gold.",
        content: "High altitude living carries a silent signature. In Lamahatta, the morning mist isn't merely weather; it's a breathing entity that winds gracefully around deep blue pine thickets and private balconies. Under our underfloor heating, we sat cradling hot Darjeeling tea as we watched the first light wash the snow-cap of Kanchenjunga into a glorious, dynamic gold slate. We spent the day cataloging local orchids along high ridges with our Sherpa guide, finishing with an ancestral organic bonfire experience as twilight turned into deep indigo.",
        date: "2026-06-15",
        author: "Ananya Roy",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzEiAu-fkjC0NgmgIUPTFihWx0mHcqWI0hHW-EX-IDpcdyKCINRjMFuFJUK9lO5Vmfz1cF31rDvFgpmqQG6rR5CStyat8Z3wIJgEn_6g_nI-d-0SdQPayjDMsDpaGzVfdYUwdU17sFNB_dqk7D1Hk7LuniZNnaMqxlG9OsQWbfPabij4A0mxJLyE-H3uQN7S7GsCJxkwpJryjypBSxfhAmyumPBvPJXJDZa9y2zr-evpmrbhSOgU6izo91asyc_A5IecbRraWWpLqn0"
      },
      {
        id: "blog-2",
        title: "The Architecture of Restoring Kolkata's Heritage",
        excerpt: "Exploring the delicate balance of preserving historical red-oxide floors and shuttered colonial windows while integrating true luxury utilities.",
        content: "To touch North Kolkata's townhouses is to feel the heartbeat of direct heritage. When rebuilding our Kolkata residence—a 1920s classic—our chief challenge was the preservation of the material soul. The brilliant crimson red oxide floors, created via natural iron ores, were carefully cataloged and repolished by local generational craftsmen. Alongside these classic layouts, we installed high-efficiency modern climate networks and silent underfloor water lines so guests experience pristine luxury while enveloped in the architectural romance of early Bengal.",
        date: "2026-06-10",
        author: "Elena Rossi",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDj444XOzjH9AM-9irTf46WXsmEwmRpctkVYqvk7O2fsKFsdu71suPcdSw2Cn2AJ6HJ3aZ6qhJKtDoUjr8rUNCzszeSCzFIH2MI348s-Y1HED2PWBGpDpTTg3-2dnIieUeuSLZyzO_dqkCNrISQH5Bj41MZ_o_WJO3dUvKLVuC-Zx-zNpanUTF3qH3cLUU1m6YBCFfvub5m4hVSPdbUtuIDwEFkHcFE-ra_Jj139Vo7GyrJonarS_vNVg5nOT9inR4ZUMrvVCiXzLrj"
      }
    ],
    reviews: [
      {
        id: "rev-1",
        authorName: "Sarah Jenkins",
        rating: 5,
        text: "The Cloud Suite is arguably the best stay in the Eastern Himalayas. The high-timber architecture, the warm Sherpa hospitality, and those morning Kanchenjunga vistas are life-changing. We will return every winter.",
        date: "2026-06-14",
        destinationId: "lamahatta"
      },
      {
        id: "rev-2",
        authorName: "Ananya Roy",
        rating: 5,
        text: "Kolkata feels entirely different from the sanctuary of the courtyard suite. Restful, deeply cultural, with excellent home-cooked meals.",
        date: "2026-06-18",
        destinationId: "kolkata"
      },
      {
        id: "rev-3",
        authorName: "Julian & Elena",
        rating: 5,
        text: "Sustainable luxury done right! The tiger suite in Sundarban is perched delicately right where the mud flats meet the mangroves. Electric boat safaris were peaceful and highly educational.",
        date: "2026-06-16",
        destinationId: "sundarban"
      }
    ],
    faqs: [
      { id: "faq-1", question: "Is Satrangi safe for solo female and solo travelers?", answer: "Absolutely. All our retreats feature 24/7 resident caretakers, gated private entries, secure door locks, and host families who ensure solo wanderers feel safe, comfortable, and genuinely cared for throughout their journey.", category: "Solo Travel" },
      { id: "faq-2", question: "Are children and family groups welcome at all locations?", answer: "Yes! We offer connected family suites, extra rollaway beds, kid-friendly mild Bengali meals, and safe guided nature walks in both Lamahatta and Sundarban.", category: "Family Stay" },
      { id: "faq-3", question: "Can you organize romantic setups like candlelit dinners or anniversary surprises?", answer: "With pleasure! We can arrange private candlelit courtyard dinners in Kolkata, fireside rhododendron teas in Lamahatta, or private sunset boat rides in Sundarban. Simply mention your occasion when booking.", category: "Couples" },
      { id: "faq-4", question: "Do you accommodate pure vegetarian, Jain, or vegan diets?", answer: "Yes! While Bengal is famous for fresh estuarine seafood, our in-house cooks prepare dedicated vegetarian, Jain, and vegan traditional thalis using separate cookware and fresh organic local produce.", category: "Dining" },
      { id: "faq-5", question: "Is high-speed Wi-Fi available for remote work or workations?", answer: "Yes! All our retreats feature high-speed Starlink / optical fiber Wi-Fi networks (100+ Mbps) and comfortable writing desks, making them ideal for quiet mountain or heritage workations.", category: "Services" },
      { id: "faq-6", question: "Do you arrange pickups from Kolkata Airport, Bagdogra, or NJP Station?", answer: "Yes, we arrange private, air-conditioned luxury transport directly from Kolkata Airport (CCU), Bagdogra Airport (IXB), or NJP Station straight to our homestays upon request.", category: "Travel" },
      { id: "faq-7", question: "What are the benefits of booking directly on your website?", answer: "Direct bookings guarantee 0% platform booking fees, complimentary traditional Bengali breakfasts, early check-in preference, and 100% free cancellation up to 48 hours prior to check-in.", category: "Booking" },
      { id: "faq-8", question: "Are pets allowed at Satrangi Homestays?", answer: "We are pet-friendly at our Lamahatta mountain retreat and Sundarban eco-lodge in select ground-floor suites with private garden access. Please inform us in advance so we can prepare.", category: "Policies" }
    ],
    settings: {
      brandName: "Satrangi Homestay",
      tagline: "Where Every Destination Tells A Different Story",
      whatsappNumber: "+91 98765 43210",
      contactEmail: "reservations@satrangihomestay.com",
      phone: "+91 98765 43210"
    }
  };

  fs.writeFileSync(DB_PATH, JSON.stringify(seedData, null, 2), "utf-8");
  console.log("Database seeded successfully at", DB_PATH);
}

// Ensure database is ready before routing
initDatabase();

function getDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function writeDb(data: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// ==========================================
// DEDICATED EXTERNAL CMS API INTEGRATION
// ==========================================

// CMS Health & Connection Status
app.get("/api/cms/health", (req, res) => {
  const db = getDb();
  res.json({
    status: "online",
    message: "Satrangi Homestay Website API is ready to connect with your external CMS portal.",
    timestamp: new Date().toISOString(),
    authConfigured: Boolean(process.env.CMS_API_KEY),
    allowedOrigins: process.env.CMS_ALLOWED_ORIGINS || "*",
    collections: {
      destinations: db.destinations?.length || 0,
      rooms: db.rooms?.length || 0,
      experiences: db.experiences?.length || 0,
      blogs: db.blogs?.length || 0,
      gallery: db.gallery?.length || 0,
      faqs: db.faqs?.length || 0,
      reviews: db.reviews?.length || 0,
      bookings: db.bookings?.length || 0
    }
  });
});

// CMS API Configuration & Schema Spec
app.get("/api/cms/config", (req, res) => {
  const host = req.get("host") || "localhost:3000";
  const protocol = req.protocol || "http";
  const baseUrl = `${protocol}://${host}`;

  res.json({
    portalName: "Satrangi Headless CMS Connector",
    version: "1.0.0",
    baseUrl,
    authentication: {
      headerName: "x-cms-api-key",
      bearerSupported: true,
      envVariable: "CMS_API_KEY"
    },
    endpoints: {
      destinations: { get: "/api/destinations", post: "/api/destinations", put: "/api/destinations/:id", delete: "/api/destinations/:id" },
      rooms: { get: "/api/rooms", post: "/api/rooms", put: "/api/rooms/:id", delete: "/api/rooms/:id" },
      experiences: { get: "/api/experiences", post: "/api/experiences", put: "/api/experiences/:id", delete: "/api/experiences/:id" },
      blogs: { get: "/api/blogs", getOne: "/api/blogs/:id", post: "/api/blogs", put: "/api/blogs/:id", delete: "/api/blogs/:id" },
      gallery: { get: "/api/gallery", post: "/api/gallery", put: "/api/gallery/:id", delete: "/api/gallery/:id" },
      faqs: { get: "/api/faqs", post: "/api/faqs", put: "/api/faqs/:id", delete: "/api/faqs/:id" },
      reviews: { get: "/api/reviews", post: "/api/reviews", put: "/api/reviews/:id", delete: "/api/reviews/:id" },
      bookings: { get: "/api/bookings", put: "/api/bookings/:id/status", delete: "/api/bookings/:id" },
      settings: { get: "/api/settings", put: "/api/settings" },
      webhook: { post: "/api/cms/webhook" }
    }
  });
});

// CMS Webhook Receiver (for external CMS content sync / publish events)
app.post("/api/cms/webhook", (req, res) => {
  const webhookSecret = process.env.CMS_WEBHOOK_SECRET;
  const clientSecret = req.headers["x-cms-webhook-secret"] || req.headers["x-webhook-secret"];

  if (webhookSecret && clientSecret !== webhookSecret) {
    return res.status(401).json({ error: "Invalid webhook signature or secret" });
  }

  const { event, collection, data } = req.body || {};
  console.log(`[CMS Webhook Received] Event: ${event}, Collection: ${collection}`);

  const db = getDb();

  if (collection && data && Array.isArray(db[collection])) {
    if (event === "create" || event === "publish") {
      const idx = db[collection].findIndex((item: any) => item.id === data.id);
      if (idx !== -1) {
        db[collection][idx] = { ...db[collection][idx], ...data };
      } else {
        db[collection].unshift(data);
      }
      writeDb(db);
    } else if (event === "update") {
      const idx = db[collection].findIndex((item: any) => item.id === data.id);
      if (idx !== -1) {
        db[collection][idx] = { ...db[collection][idx], ...data };
        writeDb(db);
      }
    } else if (event === "delete") {
      db[collection] = db[collection].filter((item: any) => item.id !== data.id);
      writeDb(db);
    }
  }

  res.json({ success: true, message: "Webhook processed successfully", timestamp: new Date().toISOString() });
});

// --- DESTINATIONS API ---
app.get("/api/destinations", (req, res) => {
  const db = getDb();
  res.json(db.destinations || []);
});

app.get("/api/destinations/:id", (req, res) => {
  const db = getDb();
  const dest = db.destinations.find((d: any) => d.id === req.params.id);
  if (!dest) return res.status(404).json({ error: "Destination not found" });
  res.json(dest);
});

app.post("/api/destinations", validateCmsAuth, (req, res) => {
  const db = getDb();
  const newDest = { id: req.body.id || `dest-${Date.now()}`, ...req.body };
  db.destinations.unshift(newDest);
  writeDb(db);
  res.status(201).json(newDest);
});

app.put("/api/destinations/:id", validateCmsAuth, (req, res) => {
  const db = getDb();
  const idx = db.destinations.findIndex((d: any) => d.id === req.params.id);
  if (idx !== -1) {
    db.destinations[idx] = { ...db.destinations[idx], ...req.body };
    writeDb(db);
    return res.json(db.destinations[idx]);
  }
  res.status(404).json({ error: "Destination not found" });
});

app.put("/api/cms/destinations/:id", validateCmsAuth, (req, res) => {
  const db = getDb();
  const idx = db.destinations.findIndex((d: any) => d.id === req.params.id);
  if (idx !== -1) {
    db.destinations[idx] = { ...db.destinations[idx], ...req.body };
    writeDb(db);
    return res.json(db.destinations[idx]);
  }
  res.status(404).json({ error: "Destination not found" });
});

app.delete("/api/destinations/:id", validateCmsAuth, (req, res) => {
  const db = getDb();
  const initialLen = db.destinations.length;
  db.destinations = db.destinations.filter((d: any) => d.id !== req.params.id);
  if (db.destinations.length === initialLen) {
    return res.status(404).json({ error: "Destination not found" });
  }
  writeDb(db);
  res.json({ success: true, message: `Destination ${req.params.id} deleted.` });
});

// --- ROOMS API ---
app.get("/api/rooms", (req, res) => {
  const db = getDb();
  let rooms = db.rooms || [];
  if (req.query.destinationId) {
    rooms = rooms.filter((r: any) => r.destinationId === req.query.destinationId);
  }
  res.json(rooms);
});

app.get("/api/rooms/:id", (req, res) => {
  const db = getDb();
  const room = db.rooms.find((r: any) => r.id === req.params.id);
  if (!room) return res.status(404).json({ error: "Room not found" });
  res.json(room);
});

app.post("/api/rooms", validateCmsAuth, (req, res) => {
  const db = getDb();
  const newRoom = { id: req.body.id || `room-${Date.now()}`, ...req.body };
  db.rooms.unshift(newRoom);
  writeDb(db);
  res.status(201).json(newRoom);
});

app.put("/api/rooms/:id", validateCmsAuth, (req, res) => {
  const db = getDb();
  const idx = db.rooms.findIndex((r: any) => r.id === req.params.id);
  if (idx !== -1) {
    db.rooms[idx] = { ...db.rooms[idx], ...req.body };
    writeDb(db);
    return res.json(db.rooms[idx]);
  }
  res.status(404).json({ error: "Room not found" });
});

app.put("/api/cms/rooms/:id", validateCmsAuth, (req, res) => {
  const db = getDb();
  const idx = db.rooms.findIndex((r: any) => r.id === req.params.id);
  if (idx !== -1) {
    db.rooms[idx] = { ...db.rooms[idx], ...req.body };
    writeDb(db);
    return res.json(db.rooms[idx]);
  }
  res.status(404).json({ error: "Room not found" });
});

app.delete("/api/rooms/:id", validateCmsAuth, (req, res) => {
  const db = getDb();
  const initialLen = db.rooms.length;
  db.rooms = db.rooms.filter((r: any) => r.id !== req.params.id);
  if (db.rooms.length === initialLen) {
    return res.status(404).json({ error: "Room not found" });
  }
  writeDb(db);
  res.json({ success: true, message: `Room ${req.params.id} deleted.` });
});

// --- EXPERIENCES API ---
app.get("/api/experiences", (req, res) => {
  const db = getDb();
  let experiences = db.experiences || [];
  if (req.query.destinationId) {
    experiences = experiences.filter((e: any) => e.destinationId === req.query.destinationId);
  }
  res.json(experiences);
});

app.get("/api/experiences/:id", (req, res) => {
  const db = getDb();
  const exp = db.experiences.find((e: any) => e.id === req.params.id);
  if (!exp) return res.status(404).json({ error: "Experience not found" });
  res.json(exp);
});

app.post("/api/experiences", validateCmsAuth, (req, res) => {
  const db = getDb();
  const newExp = { id: req.body.id || `ex-${Date.now()}`, ...req.body };
  db.experiences.unshift(newExp);
  writeDb(db);
  res.status(201).json(newExp);
});

app.put("/api/experiences/:id", validateCmsAuth, (req, res) => {
  const db = getDb();
  const idx = db.experiences.findIndex((e: any) => e.id === req.params.id);
  if (idx !== -1) {
    db.experiences[idx] = { ...db.experiences[idx], ...req.body };
    writeDb(db);
    return res.json(db.experiences[idx]);
  }
  res.status(404).json({ error: "Experience not found" });
});

app.delete("/api/experiences/:id", validateCmsAuth, (req, res) => {
  const db = getDb();
  const initialLen = db.experiences.length;
  db.experiences = db.experiences.filter((e: any) => e.id !== req.params.id);
  if (db.experiences.length === initialLen) {
    return res.status(404).json({ error: "Experience not found" });
  }
  writeDb(db);
  res.json({ success: true, message: `Experience ${req.params.id} deleted.` });
});

// --- BLOGS API ---
app.get("/api/blogs", (req, res) => {
  const db = getDb();
  res.json(db.blogs || []);
});

app.get("/api/blogs/:id", (req, res) => {
  const db = getDb();
  const blog = db.blogs.find((b: any) => b.id === req.params.id);
  if (!blog) return res.status(404).json({ error: "Blog post not found" });
  res.json(blog);
});

app.post("/api/blogs", validateCmsAuth, (req, res) => {
  const db = getDb();
  const newBlog = { id: req.body.id || `blog-${Date.now()}`, date: new Date().toISOString().split("T")[0], ...req.body };
  db.blogs.unshift(newBlog);
  writeDb(db);
  res.status(201).json(newBlog);
});

app.put("/api/blogs/:id", validateCmsAuth, (req, res) => {
  const db = getDb();
  const idx = db.blogs.findIndex((b: any) => b.id === req.params.id);
  if (idx !== -1) {
    db.blogs[idx] = { ...db.blogs[idx], ...req.body };
    writeDb(db);
    return res.json(db.blogs[idx]);
  }
  res.status(404).json({ error: "Blog post not found" });
});

app.delete("/api/blogs/:id", validateCmsAuth, (req, res) => {
  const db = getDb();
  const initialLen = db.blogs.length;
  db.blogs = db.blogs.filter((b: any) => b.id !== req.params.id);
  if (db.blogs.length === initialLen) {
    return res.status(404).json({ error: "Blog post not found" });
  }
  writeDb(db);
  res.json({ success: true, message: `Blog ${req.params.id} deleted.` });
});

// --- GALLERY API ---
app.get("/api/gallery", (req, res) => {
  const db = getDb();
  res.json(db.gallery || []);
});

app.post("/api/gallery", validateCmsAuth, (req, res) => {
  const db = getDb();
  const newItem = { id: req.body.id || `g-${Date.now()}`, ...req.body };
  db.gallery.unshift(newItem);
  writeDb(db);
  res.status(201).json(newItem);
});

app.put("/api/gallery/:id", validateCmsAuth, (req, res) => {
  const db = getDb();
  const idx = db.gallery.findIndex((g: any) => g.id === req.params.id);
  if (idx !== -1) {
    db.gallery[idx] = { ...db.gallery[idx], ...req.body };
    writeDb(db);
    return res.json(db.gallery[idx]);
  }
  res.status(404).json({ error: "Gallery item not found" });
});

app.delete("/api/gallery/:id", validateCmsAuth, (req, res) => {
  const db = getDb();
  const initialLen = db.gallery.length;
  db.gallery = db.gallery.filter((g: any) => g.id !== req.params.id);
  if (db.gallery.length === initialLen) {
    return res.status(404).json({ error: "Gallery item not found" });
  }
  writeDb(db);
  res.json({ success: true, message: `Gallery item ${req.params.id} deleted.` });
});

// --- FAQS API ---
app.get("/api/faqs", (req, res) => {
  const db = getDb();
  res.json(db.faqs || []);
});

app.post("/api/faqs", validateCmsAuth, (req, res) => {
  const db = getDb();
  const newFaq = { id: req.body.id || `faq-${Date.now()}`, ...req.body };
  db.faqs.unshift(newFaq);
  writeDb(db);
  res.status(201).json(newFaq);
});

app.put("/api/faqs/:id", validateCmsAuth, (req, res) => {
  const db = getDb();
  const idx = db.faqs.findIndex((f: any) => f.id === req.params.id);
  if (idx !== -1) {
    db.faqs[idx] = { ...db.faqs[idx], ...req.body };
    writeDb(db);
    return res.json(db.faqs[idx]);
  }
  res.status(404).json({ error: "FAQ item not found" });
});

app.delete("/api/faqs/:id", validateCmsAuth, (req, res) => {
  const db = getDb();
  const initialLen = db.faqs.length;
  db.faqs = db.faqs.filter((f: any) => f.id !== req.params.id);
  if (db.faqs.length === initialLen) {
    return res.status(404).json({ error: "FAQ item not found" });
  }
  writeDb(db);
  res.json({ success: true, message: `FAQ ${req.params.id} deleted.` });
});

// --- REVIEWS API ---
app.get("/api/reviews", (req, res) => {
  const db = getDb();
  let reviews = db.reviews || [];
  if (req.query.destinationId) {
    reviews = reviews.filter((r: any) => r.destinationId === req.query.destinationId);
  }
  res.json(reviews);
});

app.post("/api/reviews", (req, res) => {
  const db = getDb();
  const { authorName, rating, text, destinationId, roomName, roomType, photos, isVerifiedStay } = req.body;
  if (!authorName || !rating || !text || !destinationId) {
    return res.status(400).json({ error: "Missing review parameters" });
  }
  const newReview = {
    id: `rev-${Date.now()}`,
    authorName,
    rating: Number(rating),
    text,
    date: new Date().toISOString().split("T")[0],
    destinationId,
    roomName: roomName || undefined,
    roomType: roomType || undefined,
    photos: Array.isArray(photos) ? photos : (photos ? [photos] : undefined),
    isVerifiedStay: Boolean(isVerifiedStay || (photos && photos.length > 0))
  };
  db.reviews.unshift(newReview);
  writeDb(db);
  res.status(201).json(newReview);
});

app.put("/api/reviews/:id", validateCmsAuth, (req, res) => {
  const db = getDb();
  const idx = db.reviews.findIndex((r: any) => r.id === req.params.id);
  if (idx !== -1) {
    db.reviews[idx] = { ...db.reviews[idx], ...req.body };
    writeDb(db);
    return res.json(db.reviews[idx]);
  }
  res.status(404).json({ error: "Review not found" });
});

app.delete("/api/reviews/:id", validateCmsAuth, (req, res) => {
  const db = getDb();
  const initialLen = db.reviews.length;
  db.reviews = db.reviews.filter((r: any) => r.id !== req.params.id);
  if (db.reviews.length === initialLen) {
    return res.status(404).json({ error: "Review not found" });
  }
  writeDb(db);
  res.json({ success: true, message: `Review ${req.params.id} deleted.` });
});

// Email generator helper function
function generateBookingEmail(booking: any, room: any, destination: any) {
  const destName = destination ? destination.name : "Satrangi Sanctuary";
  const roomName = room ? room.name : "Luxury Suite";
  const roomType = room ? room.type : "Boutique Room";
  const subject = `Booking Confirmation - Satrangi Homestay (${destName}) #${booking.id}`;
  
  const bodyHtml = `
    <div style="font-family: 'Georgia', serif; max-width: 620px; margin: 0 auto; background-color: #FAF9F6; border: 1px solid #E5E7EB; color: #2D463E; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #2D463E; color: #ffffff; padding: 36px 30px; text-align: center;">
        <h1 style="font-family: Georgia, serif; font-size: 26px; font-weight: bold; margin: 0; letter-spacing: 2px;">SATRANGI HOMESTAY</h1>
        <p style="font-size: 10px; font-family: sans-serif; text-transform: uppercase; letter-spacing: 3px; color: #C5A059; margin-top: 8px; margin-bottom: 0;">Simulated Confirmation Voucher</p>
      </div>
      
      <div style="padding: 32px 30px; background-color: #ffffff;">
        <h2 style="font-family: Georgia, serif; font-size: 22px; color: #2D463E; margin-top: 0; margin-bottom: 12px; font-style: italic;">Namaste ${booking.guestName},</h2>
        <p style="font-size: 14px; font-family: sans-serif; line-height: 1.6; color: #4B5563; margin-bottom: 24px;">
          Your reservation at <strong>Satrangi Homestay (${destName})</strong> has been successfully confirmed and logged. Here is your official booking summary and voucher details:
        </p>

        <div style="background-color: #FAF9F6; border-left: 4px solid #A45D3B; padding: 20px; margin-bottom: 28px; border-radius: 0 6px 6px 0;">
          <table style="width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 13px;">
            <tr>
              <td style="padding: 6px 0; color: #6B7280; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">Booking Reference:</td>
              <td style="padding: 6px 0; font-weight: bold; font-family: monospace; color: #A45D3B; font-size: 14px;">${booking.id}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B7280; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">Destination:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #111827;">${destName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B7280; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">Room / Suite:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #111827;">${roomName} (${roomType})</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B7280; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">Check-In Date:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #111827;">${booking.checkIn} (Standard Check-in: 14:00)</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B7280; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">Check-Out Date:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #111827;">${booking.checkOut} (Standard Check-out: 11:00)</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B7280; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">Travelers Capacity:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #111827;">${booking.guestsCount} Adult(s)</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B7280; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">Payment Status:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #166534;"><span style="background-color: #DCFCE7; color: #166534; padding: 2px 8px; border-radius: 4px; font-size: 11px;">PAID IN FULL</span> (${booking.paymentId || 'direct_pay'})</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B7280; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">Total Amount:</td>
              <td style="padding: 6px 0; font-weight: bold; font-size: 16px; color: #A45D3B;">₹${Number(booking.totalPrice).toLocaleString('en-IN')}</td>
            </tr>
          </table>
        </div>

        <h3 style="font-family: Georgia, serif; font-size: 16px; color: #2D463E; margin-top: 20px; margin-bottom: 10px;">Guest Coordinates</h3>
        <p style="font-size: 13px; font-family: sans-serif; color: #4B5563; line-height: 1.5; margin-bottom: 20px;">
          <strong>Name:</strong> ${booking.guestName}<br/>
          <strong>Email:</strong> ${booking.guestEmail}<br/>
          <strong>Phone:</strong> ${booking.guestPhone}
        </p>

        <h3 style="font-family: Georgia, serif; font-size: 16px; color: #2D463E; margin-top: 20px; margin-bottom: 10px;">Guest Stay Policies</h3>
        <ul style="font-size: 12px; font-family: sans-serif; color: #4B5563; line-height: 1.6; padding-left: 20px; margin-bottom: 24px;">
          <li>Complimentary breakfast bar and morning tea/coffee are included each day.</li>
          <li>A valid government-issued photo ID is required at check-in.</li>
          <li>For transfer arrangements or dietary requests, reply to this email or contact +91 98765 43210.</li>
        </ul>

        <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #E5E7EB; text-align: center; font-family: sans-serif; font-size: 11px; color: #9CA3AF;">
          <p style="margin: 0 0 4px 0;"><strong>Satrangi Homestay Atelier</strong> • Kolkata | Sundarban (G-Plot) | Lamahatta</p>
          <p style="margin: 0; font-size: 10px; color: #D1D5DB;">Simulated confirmation email dispatched to ${booking.guestEmail}.</p>
        </div>
      </div>
    </div>
  `;

  return { subject, bodyHtml };
}

// Bookings Routing & Availability Check
app.post("/api/bookings", (req, res) => {
  const db = getDb();
  const { destinationId, roomId, checkIn, checkOut, guestName, guestEmail, guestPhone, guestsCount } = req.body;

  if (!destinationId || !roomId || !checkIn || !checkOut || !guestName || !guestEmail || !guestPhone) {
    return res.status(400).json({ error: "Missing required booking details." });
  }

  const room = db.rooms.find((r: any) => r.id === roomId);
  if (!room) {
    return res.status(404).json({ error: "Selected room inventory not found." });
  }

  const destination = db.destinations.find((d: any) => d.id === destinationId);

  // Calculate nights
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  const totalPrice = room.pricePerNight * nights;

  // Check simple overlapping availability
  const isOverlapping = db.bookings.some((b: any) => {
    if (b.roomId !== roomId || b.status === "cancelled") return false;
    const bStart = new Date(b.checkIn);
    const bEnd = new Date(b.checkOut);
    return start < bEnd && end > bStart;
  });

  if (isOverlapping) {
    return res.status(409).json({ error: "The requested room has an existing reservation for these dates." });
  }

  const bookingId = `SR-${Math.floor(1000 + Math.random() * 9000)}-B${db.bookings.length + 1}`;
  const newBooking = {
    id: bookingId,
    destinationId,
    roomId,
    checkIn,
    checkOut,
    guestName,
    guestEmail,
    guestPhone,
    guestsCount: Number(guestsCount) || 2,
    totalPrice,
    paymentStatus: "paid", // Direct auto-payment confirmation simulation for client booking flow
    paymentId: `pay_direct_${Math.random().toString(36).substr(2, 9)}`,
    status: "confirmed",
    createdAt: new Date().toISOString()
  };

  // Generate simulated confirmation email
  const emailData = generateBookingEmail(newBooking, room, destination);
  const sentEmail = {
    id: `email-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    bookingId: newBooking.id,
    to: newBooking.guestEmail,
    subject: emailData.subject,
    bodyHtml: emailData.bodyHtml,
    sentAt: new Date().toISOString()
  };

  if (!db.sentEmails) db.sentEmails = [];
  db.sentEmails.unshift(sentEmail);
  db.bookings.unshift(newBooking);
  writeDb(db);

  res.status(201).json({
    ...newBooking,
    confirmationEmail: sentEmail
  });
});

// Explicit confirmation email trigger / re-send endpoint
app.post("/api/send-confirmation-email", (req, res) => {
  const db = getDb();
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({ error: "Missing bookingId parameter." });
  }

  const booking = db.bookings.find((b: any) => b.id === bookingId);
  if (!booking) {
    return res.status(404).json({ error: "Booking reference not found." });
  }

  const room = db.rooms.find((r: any) => r.id === booking.roomId);
  const destination = db.destinations.find((d: any) => d.id === booking.destinationId);

  const emailData = generateBookingEmail(booking, room, destination);
  const sentEmail = {
    id: `email-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    bookingId: booking.id,
    to: booking.guestEmail,
    subject: emailData.subject,
    bodyHtml: emailData.bodyHtml,
    sentAt: new Date().toISOString()
  };

  if (!db.sentEmails) db.sentEmails = [];
  db.sentEmails.unshift(sentEmail);
  writeDb(db);

  res.status(200).json({
    success: true,
    message: `Confirmation email dispatched to ${booking.guestEmail}`,
    confirmationEmail: sentEmail
  });
});

// Retrieve sent email logs
app.get("/api/sent-emails", (req, res) => {
  const db = getDb();
  let emails = db.sentEmails || [];
  if (req.query.bookingId) {
    emails = emails.filter((e: any) => e.bookingId === req.query.bookingId);
  }
  res.json(emails);
});

app.get("/api/bookings", (req, res) => {
  const db = getDb();
  res.json(db.bookings);
});

app.put("/api/bookings/:id/status", validateCmsAuth, (req, res) => {
  const db = getDb();
  const { status, paymentStatus } = req.body;
  const booking = db.bookings.find((b: any) => b.id === req.params.id);

  if (!booking) {
    return res.status(404).json({ error: "Booking order not found" });
  }

  if (status) booking.status = status;
  if (paymentStatus) booking.paymentStatus = paymentStatus;

  writeDb(db);
  res.json(booking);
});

app.delete("/api/bookings/:id", validateCmsAuth, (req, res) => {
  const db = getDb();
  const initialLen = db.bookings.length;
  db.bookings = db.bookings.filter((b: any) => b.id !== req.params.id);
  if (db.bookings.length === initialLen) {
    return res.status(404).json({ error: "Booking order not found" });
  }
  writeDb(db);
  res.json({ success: true, message: `Booking ${req.params.id} deleted.` });
});

// CMS Stats aggregator for external CMS portals
app.get("/api/cms/stats", (req, res) => {
  const db = getDb();
  const bookings = db.bookings || [];

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b: any) => b.status === "confirmed");
  const completedBookings = bookings.filter((b: any) => b.status === "completed" || b.status === "confirmed");
  
  const revenue = completedBookings.reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0);
  const totalRooms = db.rooms?.length || 1;
  const occupancyPercentage = Math.round((confirmedBookings.length / totalRooms) * 100);

  res.json({
    totalBookings,
    revenue,
    occupancyPercentage,
    recentPayments: bookings.filter((b: any) => b.paymentStatus === "paid").slice(0, 5)
  });
});

app.get("/api/settings", (req, res) => {
  const db = getDb();
  res.json(db.settings || {});
});

app.put("/api/settings", validateCmsAuth, (req, res) => {
  const db = getDb();
  db.settings = { ...db.settings, ...req.body };
  writeDb(db);
  res.json(db.settings);
});


async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite middleware for dev mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production statics
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Satrangi Backend] Running on http://localhost:${PORT}`);
  });
}

startServer();
