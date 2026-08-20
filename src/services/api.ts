import { 
  destinationsData, 
  roomsData, 
  experiencesData, 
  galleryData, 
  blogsData, 
  reviewsData, 
  faqsData,
  settingsData
} from "../data/mockData";

export const fetchInitialData = async () => {
  return {
    destinations: destinationsData,
    rooms: roomsData,
    experiences: experiencesData
  };
};

export const fetchSecondaryData = async () => {
  return {
    blogs: blogsData,
    gallery: galleryData,
    faqs: faqsData,
    reviews: reviewsData,
    settings: settingsData
  };
};
