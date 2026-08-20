import { Booking } from "../types";

export const getFormattedDateString = (offsetDays: number = 0, baseDateStr?: string): string => {
  const d = baseDateStr ? new Date(baseDateStr) : new Date();
  if (isNaN(d.getTime())) {
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + offsetDays);
    const year = fallback.getFullYear();
    const month = String(fallback.getMonth() + 1).padStart(2, "0");
    const day = String(fallback.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const isRoomAvailable = (
  roomId: string,
  checkIn: string,
  checkOut: string,
  bookingsList: Booking[]
): boolean => {
  if (!checkIn || !checkOut) return true;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
    return true;
  }
  return !bookingsList.some((b: Booking) => {
    if (b.roomId !== roomId || b.status === "cancelled") return false;
    const bStart = new Date(b.checkIn);
    const bEnd = new Date(b.checkOut);
    return start < bEnd && end > bStart;
  });
};

export const getTotalNights = (startStr: string, endStr: string): number => {
  const start = new Date(startStr);
  const end = new Date(endStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
    return 1;
  }
  const diff = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
};

export const getAmenityEmoji = (amenity: string): string => {
  const lower = amenity.toLowerCase();
  if (lower.includes("wifi") || lower.includes("internet") || lower.includes("starlink")) return "📶";
  if (lower.includes("coffee") || lower.includes("espresso")) return "☕";
  if (lower.includes("tea")) return "🍵";
  if (lower.includes("breakfast") || lower.includes("food") || lower.includes("meal")) return "🍳";
  if (lower.includes("king") || lower.includes("queen") || lower.includes("double") || lower.includes("bed") || lower.includes("canopy")) return "🛏️";
  if (lower.includes("linen") || lower.includes("towel")) return "🧺";
  if (lower.includes("balcony") || lower.includes("deck") || lower.includes("terrace") || lower.includes("porch")) return "🌅";
  if (lower.includes("view") || lower.includes("garden") || lower.includes("mud-flat") || lower.includes("forest") || lower.includes("river") || lower.includes("valley") || lower.includes("courtyard")) return "🌿";
  if (lower.includes("shower") || lower.includes("bath") || lower.includes("toilet")) return "🚿";
  if (lower.includes("desk") || lower.includes("bureau") || lower.includes("writing")) return "✍️";
  if (lower.includes("air") || lower.includes("thermostat") || lower.includes("cooling")) return "❄️";
  if (lower.includes("heating") || lower.includes("hearth") || lower.includes("fireplace")) return "🔥";
  if (lower.includes("tv") || lower.includes("audio") || lower.includes("sonos") || lower.includes("sound")) return "🎵";
  if (lower.includes("skylight") || lower.includes("glass")) return "🌌";
  if (lower.includes("kitchen") || lower.includes("kitchenette") || lower.includes("bar")) return "🍽️";
  if (lower.includes("daybed") || lower.includes("lounge") || lower.includes("sofa")) return "🛋️";
  return "✨";
};
