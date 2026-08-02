import { Link } from 'react-router-dom';
import MaterialIcon from '../common/MaterialIcon';
import HeroSearchBar from './HeroSearchBar';
import { HERO_IMAGE } from '../../data/homeContent';
import { COMPANY } from '../../data/cars';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-section__media" aria-hidden="true">
        <img src={HERO_IMAGE} alt="" className="hero-section__image" />
        <div className="hero-section__scrim" />
      </div>

      <div className="hero-section__content">
        <div className="hero-section__copy">
          <p className="hero-section__brand">Green Rental Experience</p>
          <p className="hero-section__place">
            <MaterialIcon name="location_on" className="text-base" />
            {COMPANY.city}, UAE · {COMPANY.address}
          </p>

          <h1 className="hero-section__title">
            Drive Dubai with <span>Confidence</span>
          </h1>

          <p className="hero-section__subtitle">
            Curated supercars, luxury SUVs, and EVs — hotel delivery across Dubai Marina,
            Downtown, Palm Jumeirah, and DXB.
          </p>

          <div className="hero-section__actions">
            <a href="#search" className="hero-section__primary">
              <MaterialIcon name="search" />
              Find a car
            </a>
            <Link to="/cars" className="hero-section__secondary">
              Browse fleet
            </Link>
          </div>

          <ul className="hero-section__trust" aria-label="Why rent with us">
            <li>
              <MaterialIcon name="verified" className="text-secondary" />
              Instant booking
            </li>
            <li>
              <MaterialIcon name="local_shipping" className="text-secondary" />
              Dubai delivery
            </li>
            <li>
              <MaterialIcon name="support_agent" className="text-secondary" />
              24/7 concierge
            </li>
          </ul>
        </div>

        <div id="search" className="hero-section__search scroll-mt-28">
          <HeroSearchBar />
        </div>
      </div>
    </section>
  );
}
