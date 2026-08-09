export const HERO_IMAGE = '/images/hero-porsche.png';

export const BRANDS = ['PORSCHE', 'MERCEDES', 'LAMBORGHINI', 'BENTLEY', 'FERRARI'];

export const WHY_CHOOSE_US = [
  {
    icon: 'directions_car',
    title: 'Wide Selection',
    description: 'From grand tourers to rugged off-road luxury SUVs.',
  },
  {
    icon: 'payments',
    title: 'Fair Pricing',
    description: 'Transparent rates with no hidden luxury surcharges.',
  },
  {
    icon: 'speed',
    title: 'Instant Booking',
    description: 'Secure your vehicle in under 60 seconds flat.',
  },
  {
    icon: 'support_agent',
    title: '24/7 Support',
    description: 'Dedicated concierge for your entire journey.',
  },
];

export const JOURNEY_STEPS = [
  { step: '01', title: 'Search', description: 'Browse our curated collection of elite vehicles.' },
  { step: '02', title: 'Choose', description: 'Pick the performance and style that fits your mood.' },
  { step: '03', title: 'Confirm', description: 'Seamless digital verification and booking.' },
  { step: '04', title: 'Enjoy', description: 'Drive into the horizon with absolute confidence.' },
];

export const STATS = [
  { value: '8k+', label: 'Dubai Rentals' },
  { value: '4', label: 'Pickup Areas' },
  { value: '50+', label: 'Premium Cars' },
  { value: '24/7', label: 'Concierge Support' },
];

export const TESTIMONIALS = [
  {
    quote:
      'Booked a Porsche for a Marina weekend — delivery to my hotel was seamless and the car was spotless. My go-to whenever I’m in Dubai.',
    name: 'Omar Al Farsi',
    role: 'TECH FOUNDER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    quote:
      'We took the Range Rover from DXB to Palm Jumeirah with kids and luggage. Concierge support in the UAE heat made everything easy.',
    name: 'Elena Rossi',
    role: 'INTERIOR DESIGNER',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  {
    quote:
      'White-glove pickup in Downtown for a client dinner. Absolute professionalism — highly recommended for Dubai business travel.',
    name: 'Marcus Thorne',
    role: 'REAL ESTATE AGENT',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'What documents do I need to rent in Dubai?',
    answer:
      'Bring a valid UAE or international driving licence, your passport or Emirates ID, and a credit card in your name for the refundable deposit. Visitors may also need an International Driving Permit depending on their licence origin.',
    defaultOpen: true,
  },
  {
    question: 'Is there a minimum age requirement?',
    answer:
      'For our standard luxury fleet the minimum age is 25. For supercars the minimum age is 30 with a clean driving record, in line with UAE insurer requirements.',
    defaultOpen: false,
  },
  {
    question: 'Where can I pick up or return the car?',
    answer:
      'We operate from Dubai Marina with pickup and delivery across Dubai Marina, Downtown Dubai, Palm Jumeirah, and Dubai International Airport (DXB).',
    defaultOpen: false,
  },
];

export const MAIN_NAV = [
  { label: 'Fleet', to: '/cars', icon: 'directions_car' },
  { label: 'Services', to: '/#services', icon: 'verified' },
  { label: 'How it works', to: '/#experience', icon: 'route' },
  { label: 'Reviews', to: '/#locations', icon: 'star' },
  { label: 'Bookings', to: '/bookings', icon: 'receipt_long' },
];

/** @deprecated use MAIN_NAV */
export const NAV_LINKS = MAIN_NAV;

export const FOOTER_FLEET_LINKS = ['Hypercars', 'Luxury Sedans', 'Electric Performance', 'Convertibles'];
export const FOOTER_COMPANY_LINKS = ['Privacy Policy', 'Terms of Service', 'Fleet Guide', 'Contact Us'];
