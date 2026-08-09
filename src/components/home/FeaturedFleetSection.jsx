import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import ScrollReveal from '../common/ScrollReveal';
import MaterialIcon from '../common/MaterialIcon';
import FeaturedCarCard from '../cars/FeaturedCarCard';
import { carApi } from '../../api';
import { asArray, getCarSpecs } from '../../data/cars';

import 'swiper/css';
import 'swiper/css/pagination';

function toFeaturedCard(car) {
  return {
    id: car.id,
    name: car.name,
    price: car.price,
    image: car.image,
    alt: car.alt,
    badges: asArray(car.badges),
    specs: getCarSpecs(car),
  };
}

export default function FeaturedFleetSection() {
  const swiperRef = useRef(null);
  const paginationRef = useRef(null);
  const [cars, setCars] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    carApi
      .getFeatured()
      .then((res) => setCars((res.data || []).map(toFeaturedCard)))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <ScrollReveal id="fleet" className="py-10 sm:py-stack-lg overflow-hidden">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 sm:mb-10 gap-4">
          <div className="space-y-1.5 sm:space-y-2">
            <h2 className="text-2xl sm:text-headline-lg font-bold">Featured Fleet</h2>
            <p className="text-sm sm:text-base text-on-surface-variant">
              Our current most requested masterpieces.
            </p>
          </div>
          <Link
            to="/cars"
            className="text-label-sm border-b-2 border-primary pb-1 hover:text-secondary hover:border-secondary transition-all self-start sm:self-auto"
          >
            VIEW FULL CATALOG
          </Link>
        </div>

        {error && <p className="mb-4 text-sm text-error">{error}</p>}

        <div className="relative fleet-swiper -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={14}
            slidesPerView={1.12}
            rewind
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true }}
            breakpoints={{
              480: { slidesPerView: 1.25, spaceBetween: 16 },
              640: { slidesPerView: 1.5, spaceBetween: 18 },
              768: { slidesPerView: 2.15, spaceBetween: 20 },
              1024: { slidesPerView: 2.5, spaceBetween: 24 },
              1280: { slidesPerView: 2.85, spaceBetween: 24 },
            }}
            onBeforeInit={(swiper) => {
              swiper.params.pagination.el = paginationRef.current;
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

          <div className="fleet-controls mt-6 sm:mt-8">
            <button
              type="button"
              className="fleet-nav-btn"
              aria-label="Previous slide"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <MaterialIcon name="chevron_left" />
            </button>
            <div ref={paginationRef} className="fleet-pagination" />
            <button
              type="button"
              className="fleet-nav-btn"
              aria-label="Next slide"
              onClick={() => swiperRef.current?.slideNext()}
            >
              <MaterialIcon name="chevron_right" />
            </button>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
