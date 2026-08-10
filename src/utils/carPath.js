/** Public car detail path: /cars/audi-a3-s-line (never expose numeric ids in URLs). */
export function getCarPath(car, query = {}) {
  const slug = car?.slug || (car?.id != null ? String(car.id) : '');
  if (!slug) return '/cars';

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `/cars/${slug}?${qs}` : `/cars/${slug}`;
}
