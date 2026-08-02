export default function BrandMark({ className = 'h-9 w-9', title = 'Green Rental Experience' }) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      <rect width="40" height="40" rx="10" fill="#003417" />
      <path
        d="M10 26c4.5-8 7.5-12 10-12s5.5 4 10 12"
        stroke="#8ff940"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="20" cy="14" r="2.4" fill="#92fc43" />
      <path
        d="M12 22.5h16"
        stroke="#adf3bb"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}
