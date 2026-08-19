import React, { useEffect } from "react";

interface HelmetProps {
  title: string;
  description: string;
}

export const Helmet: React.FC<HelmetProps> = ({ title, description }) => {
  useEffect(() => {
    document.title = title;

    // Manage description meta
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    // Manage Open Graph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", title);

    // Manage Open Graph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement("meta");
      ogDesc.setAttribute("property", "og:description");
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute("content", description);
  }, [title, description]);

  return null;
};

export const getSEOConfig = (view: string) => {
  switch (view) {
    case "kolkata":
      return {
        title: "Kolkata Classical Townhouse | Satrangi Stays",
        description: "Stay in our elegantly conserved townhouse in the heart of historic Kolkata. Rich books, local stories, and classical architecture.",
      };
    case "sundarban":
      return {
        title: "Sundarban Eco Safari Lodge | Satrangi Stays",
        description: "Immersive and peaceful eco-safari lodging in the Sundarban mangroves. Guide-led river cruises and traditional boatman meals.",
      };
    case "lamahatta":
      return {
        title: "Lamahatta Mountain Suites | Satrangi Stays",
        description: "Bespoke mountain villas with panoramic views of Mt. Kanchenjunga. Fireside tea sessions and traditional Himalayan hospitality.",
      };
    case "about":
      return {
        title: "About Satrangi | Heritage & Curators of Bengal",
        description: "Learn more about the vision behind Satrangi, our preservation philosophy, and meet our passionate local hosts and curators.",
      };
    case "contact":
      return {
        title: "Get in Touch | Satrangi Homestays Concierge",
        description: "Direct guest coordination and concierge support via WhatsApp and phone call for Satrangi Homestays.",
      };
    case "reviews":
      return {
        title: "Verified Guest Reviews | Satrangi Homestays",
        description: "Read real stories and verified stay experiences from travelers across our Kolkata, Sundarban, and Lamahatta homestays.",
      };
    case "blogs":
      return {
        title: "Travel Journal & Articles | Satrangi Homestays",
        description: "Deep dive into regional history, wildlife safari logs, and high-altitude living in Bengal.",
      };
    case "gallery":
      return {
        title: "Sanctuary Photo Gallery | Satrangi Homestays",
        description: "Explore high-resolution photography of our mountain suites, delta eco-lodges, and heritage townhouses.",
      };
    case "booking":
      return {
        title: "Direct Reservation Engine | Satrangi Homestays",
        description: "Reserve your luxury homestay direct with 0% platform fees and complimentary Bengali breakfast.",
      };
    case "home":
    default:
      return {
        title: "Satrangi Homestays | Curated Luxury Stays in Bengal",
        description: "Curated heritage stays and eco-retreats in Kolkata, Sundarbans, and Lamahatta.",
      };
  }
};
