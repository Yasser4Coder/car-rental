import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import ScrollReveal from '../common/ScrollReveal';
import MaterialIcon from '../common/MaterialIcon';
import FeaturedCarCard from '../cars/FeaturedCarCard';
import { carApi } from '../../api';
import { asArray, getCarSpecs } from '../../data/cars';
import { RECENT_BOOKINGS } from '../../data/homeContent';
import { resolveMediaUrl } from '../../utils/media';

import 'swiper/css';
import 'swiper/css/pagination';

function toFeaturedCard(car, index) {
  return {
    ...car,
    image: resolveMediaUrl(car.image),
    badges: asArray(car.badges),
    specs: getCarSpecs(car),
    popular: Boolean(car.featured) || Number(car.rating) >= 4.8 || index < 3,
  };
}

export default function FeaturedFleetSection() {
  const swiperRef = useRef(null);
  const [paginationEl, setPaginationEl] = useState(null);
  const [cars, setCars] = useState([]);
  const [error, setError] = useState('');
  const [ticket, setTicket] = useState(0);

  useEffect(() => {
    carApi
      .getFeatured()
      .then((res) => setCars((res.data || []).map(toFeaturedCard)))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTicket((i) => (i + 1) % RECENT_BOOKINGS.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, []);

  const recent = RECENT_BOOKINGS[ticket];

  return (
    <ScrollReveal id="fleet" className="py-10 sm:py-stack-lg overflow-hidden">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 sm:mb-10 gap-4">
          <div className="space-y-1.5 sm:space-y-2">
            <h2 className="text-2xl sm:text-headline-lg font-bold">Featured fleet</h2>
            <p className="text-sm sm:text-base text-on-surface-variant">
              Premium cars ready for delivery across Dubai.
            </p>
          </div>
          <Link
            to="/cars"
            className="text-label-sm border-b-2 border-primary pb-1 hover:text-secondary hover:border-secondary transition-all self-start sm:self-auto"
          >
            View full catalog
          </Link>
        </div>

        {recent && (
          <p
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-on-surface/10 bg-surface-container-low px-3.5 py-2 text-sm text-on-surface-variant"
            aria-live="polite"
          >
            <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" aria-hidden />
            <span>
              <strong className="text-on-surface">{recent.name}</strong> booked{' '}
              <strong className="text-on-surface">{recent.car}</strong> · {recent.minutesAgo} min ago
            </span>
          </p>
        )}

        {error && <p className="mb-4 text-sm text-error">{error}</p>}

        <div className="relative fleet-swiper -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0">
          <div className="fleet-controls">
            <button
              type="button"
              className="fleet-nav-btn"
              aria-label="Previous slide"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <MaterialIcon name="chevron_left" />
            </button>
            <div ref={setPaginationEl} className="fleet-pagination" />
            <button
              type="button"
              className="fleet-nav-btn"
              aria-label="Next slide"
              onClick={() => swiperRef.current?.slideNext()}
            >
              <MaterialIcon name="chevron_right" />
            </button>
          </div>

          {paginationEl && cars.length > 0 && (
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={14}
              slidesPerView={1.12}
              rewind
              autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              pagination={{
                clickable: true,
                el: paginationEl,
              }}
              breakpoints={{
                480: { slidesPerView: 1.25, spaceBetween: 16 },
                640: { slidesPerView: 1.5, spaceBetween: 18 },
                768: { slidesPerView: 2.15, spaceBetween: 20 },
                1024: { slidesPerView: 2.5, spaceBetween: 24 },
                1280: { slidesPerView: 2.85, spaceBetween: 24 },
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
            >
              {cars.map((car) => (
                <SwiperSlide key={car.id} className="h-auto!">
                  <FeaturedCarCard car={car} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}
