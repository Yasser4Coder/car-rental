import { useId, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DateRangePicker from '../common/DateRangePicker';
import MaterialIcon from '../common/MaterialIcon';
import { CAR_TYPES, LOCATIONS } from '../../data/cars';
import { QUICK_FILTERS } from '../../data/homeContent';
import { addDaysISO, todayISO } from '../../utils/bookingsStorage';

export default function HeroSearchBar() {
  const navigate = useNavigate();
  const baseId = useId();
  const locationId = `${baseId}-location`;
  const typeId = `${baseId}-type`;

  const minDate = useMemo(() => todayISO(), []);
  const [location, setLocation] = useState('');
  const [pickupDate, setPickupDate] = useState(minDate);
  const [returnDate, setReturnDate] = useState(addDaysISO(minDate, 2));
  const [carType, setCarType] = useState('any');

  const goToFleet = (extra = {}) => {
    const params = new URLSearchParams();
    const loc = extra.location ?? location;
    const type = extra.type ?? carType;
    const pickup = extra.date ?? pickupDate;
    const ret = extra.returnDate ?? returnDate;
    const sort = extra.sort;
    const q = extra.q;

    if (loc) params.set('location', loc);
    if (type && type !== 'any') params.set('type', type);
    if (pickup) params.set('date', pickup);
    if (ret) params.set('returnDate', ret);
    if (sort) params.set('sort', sort);
    if (q) params.set('q', q);
    const query = params.toString();
    navigate(query ? `/cars?${query}` : '/cars');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    goToFleet();
  };

  return (
    <form onSubmit={handleSubmit} className="hero-search" aria-label="Find a vehicle in Dubai">
      <div className="hero-search__quick" aria-label="Quick filters">
        {QUICK_FILTERS.map((filter) => (
          <button
            key={filter.label}
            type="button"
            className="hero-search__chip"
            onClick={() =>
              goToFleet({
                type: filter.type || 'any',
                sort: filter.sort || undefined,
                q: filter.query || undefined,
              })
            }
          >
            <MaterialIcon name={filter.icon} className="text-base" />
            {filter.label}
          </button>
        ))}
      </div>

      <div className="hero-search__panel">
        <div className="hero-search__fields hero-search__fields--with-cal">
          <div className="hero-search__field">
            <label htmlFor={locationId} className="hero-search__label">
              <MaterialIcon name="location_on" className="hero-search__icon" />
              Location
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

          <div className="hero-search__field hero-search__field--dates">
            <span className="hero-search__label">
              <MaterialIcon name="calendar_month" className="hero-search__icon" />
              Dates
            </span>
            <div className="hero-search__control hero-search__control--cal">
              <DateRangePicker
                variant="hero"
                startDate={pickupDate}
                endDate={returnDate}
                minDate={minDate}
                onChange={({ startDate, endDate }) => {
                  if (startDate) setPickupDate(startDate);
                  if (endDate) setReturnDate(endDate);
                  else if (startDate) setReturnDate(addDaysISO(startDate, 2));
                }}
              />
            </div>
          </div>

          <div className="hero-search__field">
            <label htmlFor={typeId} className="hero-search__label">
              <MaterialIcon name="directions_car" className="hero-search__icon" />
              Category
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
          <span>Search</span>
        </button>
      </div>

      <p className="hero-search__foot">
        Or{' '}
        <Link to="/cars" className="font-semibold underline-offset-2 hover:underline">
          browse the full fleet
        </Link>
      </p>
    </form>
  );
}
