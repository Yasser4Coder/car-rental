export const COMPANY = {
  name: 'Green Rental Experience',
  city: 'Dubai',
  country: 'United Arab Emirates',
  address: 'Marina Plaza, Dubai Marina',
  fullAddress: 'Marina Plaza, Dubai Marina, Dubai, UAE',
  phone: '+971 4 555 0190',
  whatsapp: '+971501234567',
  email: 'concierge@greenrental.ae',
  hours: 'Open daily · 8:00 AM – 10:00 PM',
  currency: 'AED',
  tagline: 'Premium exotic & luxury car rental in Dubai',
};

/** Pickup areas used across the live fleet. */
export const LOCATIONS = [
  { value: 'dubai-marina', label: 'Dubai Marina' },
  { value: 'downtown', label: 'Downtown Dubai' },
  { value: 'palm-jumeirah', label: 'Palm Jumeirah' },
  { value: 'dxb-airport', label: 'DXB Airport' },
];

/** Fleet categories from the catalog (essential → supercar). */
export const CAR_TYPES = [
  { value: 'any', label: 'Any type' },
  { value: 'essential', label: 'Essential' },
  { value: 'premium', label: 'Premium' },
  { value: 'prestige', label: 'Prestige' },
  { value: 'supercar', label: 'Supercar' },
];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to high' },
  { value: 'price-desc', label: 'Price: High to low' },
  { value: 'name', label: 'Name A–Z' },
];

export function formatPrice(amount) {
  return `${COMPANY.currency} ${Number(amount).toLocaleString('en-AE')}`;
}

/** Normalize JSON/array fields that may arrive as strings from the API. */
export function asArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function getLocationLabel(value) {
  return LOCATIONS.find((item) => item.value === value)?.label || null;
}

export function getTypeLabel(value) {
  return CAR_TYPES.find((item) => item.value === value)?.label || null;
}

export function getCarSpecs(car) {
  const specs = [];
  if (car.year) specs.push({ icon: 'calendar_month', label: String(car.year) });
  if (car.transmission) {
    specs.push({
      icon: car.powertrain === 'Electric' ? 'bolt' : 'settings',
      label: car.powertrain === 'Electric' ? 'Electric' : car.transmission,
    });
  }
  if (car.seats) specs.push({ icon: 'airline_seat_recline_normal', label: `${car.seats} seats` });
  if (car.fuel) specs.push({ icon: 'local_gas_station', label: car.fuel });
  else if (car.horsepower) specs.push({ icon: 'speed', label: `${car.horsepower} HP` });
  return specs.slice(0, 4);
}

export function getDetailSpecs(car) {
  return [
    { icon: 'calendar_month', label: 'Year', value: String(car.year) },
    { icon: 'speed', label: 'Power', value: `${car.horsepower} hp` },
    { icon: 'timer', label: '0–100 km/h', value: car.acceleration },
    { icon: 'speed', label: 'Top speed', value: car.topSpeed },
    { icon: 'settings', label: 'Transmission', value: car.transmission },
    { icon: 'sync_alt', label: 'Drivetrain', value: car.drivetrain },
    { icon: 'airline_seat_recline_normal', label: 'Seats', value: String(car.seats) },
    { icon: 'sensor_door', label: 'Doors', value: String(car.doors) },
    { icon: 'local_gas_station', label: 'Fuel', value: car.fuel },
    { icon: 'palette', label: 'Colour', value: car.color },
    { icon: 'straighten', label: 'Daily limit', value: `${car.dailyKm} km` },
    { icon: 'payments', label: 'Deposit', value: formatPrice(car.deposit) },
  ];
}
