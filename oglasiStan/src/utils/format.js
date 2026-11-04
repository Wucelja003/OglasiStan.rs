// Formatiranje za UI (engleski)

export const formatPrice = (value) =>
  `€${Number(value || 0).toLocaleString('en-US')}`;

export const pricePerM2 = (price, area) =>
  area > 0 ? Math.round(price / area) : null;

// Vrednosti u bazi ostaju 'prodaja' / 'izdavanje' — ovde ih samo prikazujemo na engleskom
export const typeLabel = (type) => (type === 'izdavanje' ? 'For rent' : 'For sale');
export const isRent = (type) => type === 'izdavanje';

export const floorLabel = (floor) => {
  if (!floor) return 'Ground floor';
  const n = Number(floor);
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]} floor`;
};

export const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0].slice(0, 2).toUpperCase();
};
