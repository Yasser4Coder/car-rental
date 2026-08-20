import { FaWhatsapp } from 'react-icons/fa';
import { COMPANY } from '../../data/cars';

function whatsappHref() {
  const digits = String(COMPANY.whatsapp || COMPANY.phone).replace(/\D/g, '');
  const text = encodeURIComponent('Hi — I’d like to book a car with Green Rental Experience.');
  return `https://wa.me/${digits}?text=${text}`;
}

export default function WhatsAppFab() {
  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noreferrer"
      className="whatsapp-fab"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp aria-hidden />
    </a>
  );
}
