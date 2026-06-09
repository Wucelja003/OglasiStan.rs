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
    // Trajanje cookie-ja: 7 dana. Bez ovoga je "session cookie" koji browser
    // obriše čim zatvoriš prozor -> token nestane, a redux-persist i dalje misli
    // da si ulogovan, pa zaštićeni pozivi (npr. moji oglasi) vraćaju 401.
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};
