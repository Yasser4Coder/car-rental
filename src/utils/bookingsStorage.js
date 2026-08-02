const STORAGE_KEY = 'gre-bookings-dubai';

export function loadBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveBookings(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function createBookingId() {
  return `BK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function addBooking(booking) {
  const next = [booking, ...loadBookings()];
  saveBookings(next);
  return next;
}

export function updateBookingStatus(id, status) {
  const next = loadBookings().map((item) =>
    item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item,
  );
  saveBookings(next);
  return next;
}

export function rentalDays(pickupDate, returnDate) {
  if (!pickupDate || !returnDate) return 1;
  const start = new Date(`${pickupDate}T00:00:00`);
  const end = new Date(`${returnDate}T00:00:00`);
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff);
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysISO(baseISO, days) {
  const date = new Date(`${baseISO}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}
