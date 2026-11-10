// Б2: перенесите сюда countSeats, импортируйте Booking через import type.
import type { Booking } from '../models/booking';

export function countSeats(bookings: Booking[]): number {
  let total = 0;
  bookings.forEach((b) => {
    total += b.seats;
  });
  return total;
}
