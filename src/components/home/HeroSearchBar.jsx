import { useId, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MaterialIcon from '../common/MaterialIcon';
import { CAR_TYPES, LOCATIONS } from '../../data/cars';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function HeroSearchBar() {
  const navigate = useNavigate();
  const baseId = useId();
  const locationId = `${baseId}-location`;
  const dateId = `${baseId}-date`;
  const typeId = `${baseId}-type`;

  const minDate = useMemo(() => todayISO(), []);
  const [location, setLocation] = useState('');
  const [pickupDate, setPickupDate] = useState(minDate);
  const [carType, setCarType] = useState('any');

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (carType && carType !== 'any') params.set('type', carType);
    if (pickupDate) params.set('date', pickupDate);
    const query = params.toString();
    navigate(query ? `/cars?${query}` : '/cars');
  };

  return (
    <form onSubmit={handleSubmit} className="hero-search" aria-label="Find a vehicle in Dubai">
      <div className="hero-search__intro">
        <h2 className="hero-search__title">Start your booking</h2>
        <p className="hero-search__help">
          Choose a Dubai pickup area, date, and fleet category — Essential to Supercar.
        </p>
      </div>

      <div className="hero-search__panel">
        <div className="hero-search__fields">
          <div className="hero-search__field">
            <label htmlFor={locationId} className="hero-search__label">
              <MaterialIcon name="location_on" className="hero-search__icon" />
              Pickup area
            </label>
            <div className="hero-search__control">
              <select
                id={locationId}
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="hero-search__input"
              >
                <option value="">All Dubai areas</option>
                {LOCATIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <MaterialIcon name="expand_more" className="hero-search__chevron" />
            </div>
          </div>

          <div className="hero-search__field">
            <label htmlFor={dateId} className="hero-search__label">
              <MaterialIcon name="calendar_month" className="hero-search__icon" />
              Pickup date
            </label>
            <div className="hero-search__control">
              <input
                id={dateId}
                name="date"
                type="date"
                min={minDate}
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className={`hero-search__input ${pickupDate ? '' : 'hero-search__input--empty'}`}
                required
              />
            </div>
          </div>

          <div className="hero-search__field">
            <label htmlFor={typeId} className="hero-search__label">
              <MaterialIcon name="directions_car" className="hero-search__icon" />
              Car type
            </label>
            <div className="hero-search__control">
              <select
                id={typeId}
                name="type"
                value={carType}
                onChange={(e) => setCarType(e.target.value)}
                className="hero-search__input"
              >
                {CAR_TYPES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <MaterialIcon name="expand_more" className="hero-search__chevron" />
            </div>
          </div>
        </div>

        <button type="submit" className="hero-search__submit">
          <MaterialIcon name="search" className="text-[1.25rem]" />
          <span>Find vehicle</span>
        </button>
      </div>
    </form>
  );
}
