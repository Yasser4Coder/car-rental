import { useId } from 'react';
import MaterialIcon from '../common/MaterialIcon';
import { CAR_TYPES, LOCATIONS, SORT_OPTIONS } from '../../data/cars';

export default function CarsFilterBar({
  location,
  type,
  sort,
  query,
  onLocationChange,
  onTypeChange,
  onSortChange,
  onQueryChange,
  onClear,
  resultCount,
}) {
  const baseId = useId();
  const hasActiveFilters = Boolean(location || (type && type !== 'any') || query);

  return (
    <div className="cars-filters">
      <div className="cars-filters__search">
        <MaterialIcon name="search" className="cars-filters__search-icon" />
        <input
          id={`${baseId}-query`}
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search brand or model"
          className="cars-filters__search-input"
          aria-label="Search cars"
        />
      </div>

      <div className="cars-filters__row">
        <label className="cars-filters__field">
          <span className="cars-filters__label">
            <MaterialIcon name="location_on" className="text-base text-secondary" />
            Pickup area
          </span>
          <select
            value={location || ''}
            onChange={(e) => onLocationChange(e.target.value)}
            className="cars-filters__select"
          >
            <option value="">All Dubai areas</option>
            {LOCATIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="cars-filters__field">
          <span className="cars-filters__label">
            <MaterialIcon name="directions_car" className="text-base text-secondary" />
            Car type
          </span>
          <select
            value={type || 'any'}
            onChange={(e) => onTypeChange(e.target.value)}
            className="cars-filters__select"
          >
            {CAR_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="cars-filters__field">
          <span className="cars-filters__label">
            <MaterialIcon name="swap_vert" className="text-base text-secondary" />
            Sort by
          </span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="cars-filters__select"
          >
            {SORT_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="cars-filters__meta">
        <p className="text-sm text-on-surface-variant">
          <span className="font-bold text-on-surface">{resultCount}</span>{' '}
          {resultCount === 1 ? 'vehicle' : 'vehicles'} available
        </p>
        {hasActiveFilters && (
          <button type="button" onClick={onClear} className="cars-filters__clear">
            <MaterialIcon name="close" className="text-base" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
