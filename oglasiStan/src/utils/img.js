// Cloudinary optimizacija slika.
// Ubacuje transformacije posle "/upload/" — automatski format (f_auto, npr. WebP),
// automatski kvalitet (q_auto) i ograničenje širine, pa su slike i do 10x lakše.
// Ako URL nije sa Cloudinary-ja, vraća original nepromenjen.
export const optimizeImg = (url, width = 600) => {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`);
};
