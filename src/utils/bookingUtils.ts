import { Booking } from "../types";

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
