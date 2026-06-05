// Cookie opcije zavisne od okruženja.
//
// PRODUKCIJA (HTTPS, front i back na različitim domenima):
//   secure: true  + sameSite: 'none'  -> cookie se šalje cross-site preko HTTPS-a.
//
// LOKALNI RAZVOJ (http://localhost):
//   secure: true + sameSite: 'none' NE radi preko HTTP-a (browser odbije cookie),
//   pa koristimo secure: false + sameSite: 'lax'.
//
// Bira se na osnovu NODE_ENV. Funkcija je (ne konstanta) da bi se NODE_ENV
// pročitao u trenutku poziva, nakon što dotenv učita .env.
export const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  };
};
