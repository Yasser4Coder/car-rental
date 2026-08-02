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

export const FEATURED_CARS = [
  {
    id: 1,
    name: 'Porsche 911 GT3',
    price: 799,
    image: '/images/car-porsche-gt3.png',
    alt: 'A side view of a metallic silver Porsche 911 GT3 in a clean studio setting.',
    badges: [
      { label: 'SPORT', className: 'bg-primary/80 backdrop-blur text-on-primary' },
      { label: 'MOST POPULAR', className: 'bg-secondary-container text-on-secondary-container' },
    ],
    specs: [
      { icon: 'settings', label: 'Auto' },
      { icon: 'airline_seat_recline_normal', label: '2 Seats' },
    ],
  },
  {
    id: 2,
    name: 'Range Rover Autobiography',
    price: 550,
    image: '/images/car-range-rover.png',
    alt: 'A luxury charcoal gray Range Rover Autobiography parked in an elegant driveway.',
    badges: [{ label: 'SUV', className: 'bg-primary/80 backdrop-blur text-on-primary' }],
    specs: [
      { icon: 'settings', label: 'Auto' },
      { icon: 'airline_seat_recline_normal', label: '5 Seats' },
    ],
  },
  {
    id: 3,
    name: 'Tesla Model S Plaid',
    price: 450,
    image: '/images/car-tesla-plaid.png',
    alt: 'A pearl white Tesla Model S Plaid charging at a modern charging station.',
    badges: [
      { label: 'ELECTRIC', className: 'bg-primary/80 backdrop-blur text-on-primary' },
      { label: 'NEW ARRIVAL', className: 'bg-tertiary text-on-tertiary' },
    ],
    specs: [
      { icon: 'bolt', label: 'Electric' },
      { icon: 'airline_seat_recline_normal', label: '5 Seats' },
    ],
  },
];

export const JOURNEY_STEPS = [
  { step: '01', title: 'Search', description: 'Browse our curated collection of elite vehicles.' },
  { step: '02', title: 'Choose', description: 'Pick the performance and style that fits your mood.' },
  { step: '03', title: 'Confirm', description: 'Seamless digital verification and booking.' },
  { step: '04', title: 'Enjoy', description: 'Drive into the horizon with absolute confidence.' },
];

export const STATS = [
  { value: '15k+', label: 'Rentals Delivered' },
  { value: '120', label: 'Cities Worldwide' },
  { value: '500+', label: 'Premium Cars' },
  { value: '24/7', label: 'Elite Support' },
];

export const TESTIMONIALS = [
  {
    quote:
      'The seamless booking process and the quality of the Porsche I rented were beyond my expectations. This is my go-to whenever I\'m in LA.',
    name: 'Julian Vancore',
    role: 'TECH FOUNDER',
    avatar: '/images/avatar-julian.png',
  },
  {
    quote:
      'Renting the Range Rover for our family trip was the best decision. The car was pristine, and the concierge service was incredibly helpful.',
    name: 'Elena Rossi',
    role: 'INTERIOR DESIGNER',
    avatar: '/images/avatar-elena.png',
  },
  {
    quote:
      'Absolute performance and absolute professionalism. The pickup was handled with true white-glove service. Highly recommended.',
    name: 'Marcus Thorne',
    role: 'REAL ESTATE AGENT',
    avatar: '/images/avatar-marcus.png',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'What documents do I need to rent?',
    answer:
      'You will need a valid driver\'s license, a valid passport, and a credit card in your name for the security deposit. International drivers may require an International Driving Permit.',
    defaultOpen: true,
  },
  {
    question: 'Is there a minimum age requirement?',
    answer:
      'For our standard luxury fleet, the minimum age is 25. For our Supercar collection, the minimum age is 30 with a clean driving record.',
    defaultOpen: false,
  },
];

export const NAV_LINKS = [
  { label: 'Fleet', href: '#fleet', active: true },
  { label: 'Services', href: '#services' },
  { label: 'Experience', href: '#experience' },
  { label: 'Locations', href: '#locations' },
];

export const FOOTER_FLEET_LINKS = ['Hypercars', 'Luxury Sedans', 'Electric Performance', 'Convertibles'];
export const FOOTER_COMPANY_LINKS = ['Privacy Policy', 'Terms of Service', 'Fleet Guide', 'Contact Us'];
