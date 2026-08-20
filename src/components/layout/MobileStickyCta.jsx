import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { COMPANY } from '../../data/cars';

function whatsappHref() {
  const digits = String(COMPANY.whatsapp || COMPANY.phone).replace(/\D/g, '');
  return `https://wa.me/${digits}`;
}

/** Sticky dual CTA for mobile booking conversion. */
export default function MobileStickyCta() {
  return (
    <div className="mobile-sticky-cta" role="region" aria-label="Quick booking actions">
      <Link to="/cars" className="mobile-sticky-cta__book">
        Book now
      </Link>
      <a
        href={whatsappHref()}
        target="_blank"
        rel="noreferrer"
        className="mobile-sticky-cta__wa"
      >
        <FaWhatsapp aria-hidden />
        WhatsApp
      </a>
    </div>
  );
}
