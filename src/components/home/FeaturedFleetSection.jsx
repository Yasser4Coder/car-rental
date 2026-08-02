import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ScrollReveal from '../common/ScrollReveal';
import MaterialIcon from '../common/MaterialIcon';
import FeaturedCarCard from '../cars/FeaturedCarCard';
import { FEATURED_CARS } from '../../data/homeContent';

import 'swiper/css';

export default function FeaturedFleetSection() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);

  const bindSwiperControls = (swiper) => {
    if (!prevRef.current || !nextRef.current || !paginationRef.current) return;

    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;
    swiper.params.pagination.el = paginationRef.current;

    swiper.navigation.destroy();
    swiper.pagination.destroy();
    swiper.navigation.init();
    swiper.pagination.init();
  };

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

        <div className="relative fleet-swiper -mx-margin-mobile px-margin-mobile sm:mx-0 sm:px-0">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1.08}
            loop
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            onBeforeInit={bindSwiperControls}
            onInit={bindSwiperControls}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 1.2, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
          >
            {FEATURED_CARS.map((car) => (
              <SwiperSlide key={car.id} className="!h-auto">
                <FeaturedCarCard car={car} />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="fleet-controls mt-6 sm:mt-8">
            <button
              ref={prevRef}
              type="button"
              className="fleet-nav-btn"
              aria-label="Previous slide"
            >
              <MaterialIcon name="chevron_left" />
            </button>

            <div ref={paginationRef} className="fleet-pagination" />

            <button
              ref={nextRef}
              type="button"
              className="fleet-nav-btn"
              aria-label="Next slide"
            >
              <MaterialIcon name="chevron_right" />
            </button>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
