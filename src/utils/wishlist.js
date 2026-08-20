const KEY = 'gre-wishlist';

export function loadWishlist() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function saveWishlist(ids) {
  localStorage.setItem(KEY, JSON.stringify(ids));
}

/** @returns {boolean} true if now saved */
export function toggleWishlist(id) {
  const key = String(id);
  const current = loadWishlist();
  const next = current.includes(key) ? current.filter((x) => x !== key) : [...current, key];
  saveWishlist(next);
  return next.includes(key);
}
