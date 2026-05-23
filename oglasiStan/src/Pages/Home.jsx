import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const PLACEHOLDER = 'https://placehold.co/400x260/F2EDE3/B5AFA5?text=Nema+slike';

function ListingCard({ listing }) {
  const img = listing.imagesUrls?.[0] || PLACEHOLDER;
  return (
    <Link
      to={`/listing/${listing._id}`}
      className='block group rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1'
      style={{ background: '#FDF9F4', border: '1px solid #DDD7CC', boxShadow: '0 1px 4px rgba(26,22,18,0.06)' }}
    >
      <div className='relative overflow-hidden' style={{ aspectRatio: '3/2', background: '#F2EDE3' }}>
        <img src={img} alt={listing.name} className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105' />
        <span
          className='absolute top-3 left-3 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full'
          style={listing.type === 'prodaja' ? { background: '#221E1A', color: 'white' } : { background: '#E07B2A', color: 'white' }}
        >
          {listing.type === 'prodaja' ? 'Prodaja' : 'Izdavanje'}
        </span>
      </div>
      <div className='p-4'>
        <h3 className='font-semibold text-sm mb-1 truncate' style={{ color: '#1A1612' }}>{listing.name}</h3>
        <p className='text-xs mb-3 truncate flex items-center gap-1' style={{ color: '#B5AFA5' }}>
          <svg className='w-3 h-3 flex-shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z' />
          </svg>
          {listing.address}
        </p>
        <div className='flex items-center justify-between'>
          <p className='font-extrabold text-base' style={{ color: '#E07B2A' }}>
            {listing.regularPrice.toLocaleString('sr-RS')} €
            {listing.type === 'izdavanje' && <span className='text-xs font-normal ml-0.5' style={{ color: '#B5AFA5' }}>/mj</span>}
          </p>
          <div className='flex items-center gap-3 text-xs' style={{ color: '#6B6158' }}>
            <span>{listing.bedrooms} sobe</span>
            <span style={{ color: '#DDD7CC' }}>·</span>
            <span>{listing.bathrooms} kup.</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [ponude, setPonude] = useState([]);
  const [iznajmljivanje, setIznajmljivanje] = useState([]);

  useEffect(() => {
    const fetchPonude = async () => {
      try {
        const res = await fetch('/api/listing/search?sort=regularPrice&order=asc&limit=4');
        const data = await res.json();
        setPonude(data.listings || []);
      } catch { setPonude([]); }
    };
    const fetchIznajmljivanje = async () => {
      try {
        const res = await fetch('/api/listing/search?type=izdavanje&sort=regularPrice&order=asc&limit=4');
        const data = await res.json();
        setIznajmljivanje(data.listings || []);
      } catch { setIznajmljivanje([]); }
    };
    fetchPonude();
    fetchIznajmljivanje();
  }, []);

  return (
    <div>
      {/* ── HERO ── */}
      <section
        className='relative flex items-center justify-center overflow-hidden'
        style={{ minHeight: 'calc(100vh - 96px)' }}
      >
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(32px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes shimmer {
            0%   { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          .hero-badge   { animation: fadeUp 0.7s ease both; }
          .hero-title   { animation: fadeUp 0.7s 0.15s ease both; }
          .hero-sub     { animation: fadeUp 0.7s 0.3s ease both; }
          .hero-btns    { animation: fadeUp 0.7s 0.45s ease both; }
          .hero-stats   { animation: fadeUp 0.7s 0.6s ease both; }

          .btn-primary {
            position: relative; overflow: hidden;
            background: #E07B2A;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .btn-primary::after {
            content: '';
            position: absolute; inset: 0;
            background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%);
            background-size: 200% 100%;
            opacity: 0;
            transition: opacity 0.2s;
          }
          .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(224,123,42,0.55); }
          .btn-primary:hover::after { opacity: 1; animation: shimmer 0.6s linear; }
          .btn-primary:active { transform: translateY(0) scale(0.97); }

          .btn-ghost {
            position: relative; overflow: hidden;
            transition: transform 0.2s, background 0.2s;
          }
          .btn-ghost:hover { transform: translateY(-2px); background: rgba(255,255,255,0.2) !important; }
          .btn-ghost:active { transform: translateY(0) scale(0.97); }
        `}</style>

        {/* Pozadinska slika */}
        <img
          src='/NoviSad.jpg'
          alt='Novi Sad'
          className='absolute inset-0 w-full h-full object-cover'
          style={{ transform: 'scale(1.03)' }}
        />

        {/* Overlay — jači gradijent odozdo */}
        <div
          className='absolute inset-0'
          style={{ background: 'linear-gradient(to bottom, rgba(10,8,6,0.35) 0%, rgba(10,8,6,0.78) 100%)' }}
        />

        {/* Sadržaj */}
        <div className='relative z-10 text-center px-4 max-w-4xl mx-auto'>

          {/* Badge */}
          <div className='hero-badge inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7'
            style={{ background: 'rgba(224,123,42,0.18)', border: '1px solid rgba(224,123,42,0.45)' }}>
            <span className='w-1.5 h-1.5 rounded-full' style={{ background: '#E07B2A' }} />
            <span className='text-xs font-bold uppercase tracking-widest' style={{ color: '#E07B2A' }}>
              OglasiStan.rs
            </span>
          </div>

          {/* Naslov */}
          <h1 className='hero-title font-extrabold text-white leading-[1.08] mb-6'
            style={{ fontSize: 'clamp(2.6rem, 7vw, 5rem)', letterSpacing: '-0.02em' }}>
            Pronađi svoj{' '}
            <span style={{
              background: 'linear-gradient(135deg, #E07B2A 0%, #F5A623 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              novi dom
            </span>
          </h1>

          {/* Podtekst */}
          <p className='hero-sub text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed'
            style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>
            Kupovina, prodaja i iznajmljivanje nekretnina —
            <br className='hidden sm:block' /> bez posrednika, bez provizije.
          </p>

          {/* Dugmad */}
          <div className='hero-btns flex flex-col sm:flex-row items-center justify-center gap-4 mb-14'>
            <Link
              to='/create-listing'
              className='btn-primary w-full sm:w-auto flex items-center justify-center gap-2.5 px-9 py-4 rounded-2xl font-bold text-white'
              style={{ fontSize: '0.95rem', letterSpacing: '0.01em', boxShadow: '0 4px 24px rgba(224,123,42,0.4)' }}
            >
              <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
              </svg>
              Oglasi stan
            </Link>

            <Link
              to='/search'
              className='btn-ghost w-full sm:w-auto flex items-center justify-center gap-2.5 px-9 py-4 rounded-2xl font-bold text-white'
              style={{
                fontSize: '0.95rem',
                letterSpacing: '0.01em',
                background: 'rgba(255,255,255,0.1)',
                border: '1.5px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' />
              </svg>
              Pretraži ponude
            </Link>
          </div>

          {/* Statistike */}
          <div className='hero-stats flex items-center justify-center gap-8 sm:gap-12'>
            {[
              { value: '100%', label: 'Besplatno' },
              { value: '0', label: 'Provizija' },
              { value: '24/7', label: 'Dostupno' },
            ].map(({ value, label }) => (
              <div key={label} className='text-center'>
                <p className='text-2xl sm:text-3xl font-extrabold text-white' style={{ letterSpacing: '-0.02em' }}>{value}</p>
                <p className='text-xs uppercase tracking-widest mt-0.5' style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce'>
          <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.4)' strokeWidth={2}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
          </svg>
        </div>
      </section>
      {/* ── NAJPOVOLJNIJE PONUDE ── */}
      <section className='max-w-6xl mx-auto px-4 py-16'>

        {/* Naslov sekcije */}
        <div className='flex items-end justify-between mb-8'>
          <div>
            <p className='text-xs font-bold uppercase tracking-widest mb-1' style={{ color: '#E07B2A' }}>
              Izdvojeno
            </p>
            <h2 className='text-2xl sm:text-3xl font-extrabold' style={{ color: '#1A1612' }}>
              Naše najpovoljnije ponude
            </h2>
          </div>
          <Link
            to='/search?sort=regularPrice&order=asc'
            className='hidden sm:inline text-sm font-semibold transition-colors'
            style={{ color: '#6B6158' }}
            onMouseEnter={e => e.currentTarget.style.color = '#E07B2A'}
            onMouseLeave={e => e.currentTarget.style.color = '#6B6158'}
          >
            Pogledaj sve →
          </Link>
        </div>

        {/* Kartice */}
        {ponude.length === 0 ? (
          <div className='text-center py-16 rounded-2xl' style={{ background: '#FDF9F4', border: '1px solid #DDD7CC' }}>
            <p className='text-sm' style={{ color: '#B5AFA5' }}>Još nema objavljenih oglasa.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
            {ponude.map(l => <ListingCard key={l._id} listing={l} />)}
          </div>
        )}

        {/* Mobilan link */}
        <div className='text-center mt-6 sm:hidden'>
          <Link to='/search?sort=regularPrice&order=asc' className='text-sm font-semibold' style={{ color: '#E07B2A' }}>
            Pogledaj sve ponude →
          </Link>
        </div>
      </section>

      {/* ── IZNAJMLJIVANJE ── */}
      <section className='py-16' style={{ background: '#FDF9F4', borderTop: '1px solid #DDD7CC', borderBottom: '1px solid #DDD7CC' }}>
        <div className='max-w-6xl mx-auto px-4'>

          <div className='flex items-end justify-between mb-8'>
            <div>
              <p className='text-xs font-bold uppercase tracking-widest mb-1' style={{ color: '#E07B2A' }}>
                Iznajmljivanje
              </p>
              <h2 className='text-2xl sm:text-3xl font-extrabold' style={{ color: '#1A1612' }}>
                Najpovoljniji stanovi za iznajmljivanje
              </h2>
            </div>
            <Link
              to='/search?type=izdavanje&sort=regularPrice&order=asc'
              className='hidden sm:inline text-sm font-semibold transition-colors'
              style={{ color: '#6B6158' }}
              onMouseEnter={e => e.currentTarget.style.color = '#E07B2A'}
              onMouseLeave={e => e.currentTarget.style.color = '#6B6158'}
            >
              Pogledaj sve →
            </Link>
          </div>

          {iznajmljivanje.length === 0 ? (
            <div className='text-center py-16 rounded-2xl' style={{ background: '#FAF7F2', border: '1px solid #DDD7CC' }}>
              <p className='text-sm' style={{ color: '#B5AFA5' }}>Trenutno nema oglasa za iznajmljivanje.</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
              {iznajmljivanje.map(l => <ListingCard key={l._id} listing={l} />)}
            </div>
          )}

          <div className='text-center mt-6 sm:hidden'>
            <Link to='/search?type=izdavanje&sort=regularPrice&order=asc' className='text-sm font-semibold' style={{ color: '#E07B2A' }}>
              Pogledaj sve ponude →
            </Link>
          </div>
        </div>
      </section>

      {/* ── ZAŠTO OGLASISTAN ── */}
      <section className='max-w-6xl mx-auto px-4 py-16'>
        <div className='text-center mb-12'>
          <p className='text-xs font-bold uppercase tracking-widest mb-2' style={{ color: '#E07B2A' }}>
            Naše prednosti
          </p>
          <h2 className='text-2xl sm:text-3xl font-extrabold' style={{ color: '#1A1612' }}>
            Zašto baš OglasiStan.rs?
          </h2>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>

          {/* Kartica 1 */}
          <div className='flex flex-col items-center text-center rounded-2xl p-8 transition-all duration-200 hover:-translate-y-1'
            style={{ background: '#FDF9F4', border: '1px solid #DDD7CC', boxShadow: '0 1px 4px rgba(26,22,18,0.05)' }}>
            <div className='w-20 h-20 rounded-2xl flex items-center justify-center mb-6'
              style={{ background: 'rgba(224,123,42,0.1)' }}>
              <svg className='w-10 h-10' fill='none' viewBox='0 0 24 24' stroke='#E07B2A' strokeWidth={1.5}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' />
              </svg>
            </div>
            <h3 className='text-lg font-bold mb-3' style={{ color: '#1A1612' }}>Besplatno oglašavanje</h3>
            <p className='text-sm leading-relaxed' style={{ color: '#6B6158' }}>
              Postavljanje oglasa na OglasiStan.rs je potpuno besplatno. Bez skrivenih troškova, bez provizije — samo vi i vaš oglas.
            </p>
          </div>

          {/* Kartica 2 */}
          <div className='flex flex-col items-center text-center rounded-2xl p-8 transition-all duration-200 hover:-translate-y-1'
            style={{ background: '#FDF9F4', border: '1px solid #DDD7CC', boxShadow: '0 1px 4px rgba(26,22,18,0.05)' }}>
            <div className='w-20 h-20 rounded-2xl flex items-center justify-center mb-6'
              style={{ background: 'rgba(224,123,42,0.1)' }}>
              <svg className='w-10 h-10' fill='none' viewBox='0 0 24 24' stroke='#E07B2A' strokeWidth={1.5}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.135-3.026-2.74-3.207a48.394 48.394 0 00-5.51-.278c-1.605 0-3.192.074-4.76.222-1.605.15-2.74 1.555-2.74 3.177v4.286c0 1.136.847 2.1 1.98 2.193.34.027.68.052 1.02.072v3.091l3-3h.5' />
              </svg>
            </div>
            <h3 className='text-lg font-bold mb-3' style={{ color: '#1A1612' }}>Direktna komunikacija</h3>
            <p className='text-sm leading-relaxed' style={{ color: '#6B6158' }}>
              Komunicirajte direktno sa vlasnicima nekretnina bez posrednika. Brzo, lako i transparentno — samo par klikova do dogovora.
            </p>
          </div>

          {/* Kartica 3 */}
          <div className='flex flex-col items-center text-center rounded-2xl p-8 transition-all duration-200 hover:-translate-y-1'
            style={{ background: '#FDF9F4', border: '1px solid #DDD7CC', boxShadow: '0 1px 4px rgba(26,22,18,0.05)' }}>
            <div className='w-20 h-20 rounded-2xl flex items-center justify-center mb-6'
              style={{ background: 'rgba(224,123,42,0.1)' }}>
              <svg className='w-10 h-10' fill='none' viewBox='0 0 24 24' stroke='#E07B2A' strokeWidth={1.5}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z' />
              </svg>
            </div>
            <h3 className='text-lg font-bold mb-3' style={{ color: '#1A1612' }}>Provereni oglasi</h3>
            <p className='text-sm leading-relaxed' style={{ color: '#6B6158' }}>
              Svi oglasi na platformi objavljuju registrovani korisnici. Nema anonimnih lažnih ponuda — znate tačno s kim komunicirate.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
