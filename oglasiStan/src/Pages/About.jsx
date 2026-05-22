import { Link } from 'react-router-dom';

const stats = [
  { value: '100%', label: 'Besplatno oglašavanje' },
  { value: '24/7', label: 'Dostupnost platforme' },
  { value: '0', label: 'Skrivenih troškova' },
];

const team = [
  {
    name: 'Osnivač & Developer',
    desc: 'OglasiStan.rs je zamišljen kao jednostavna, moderna i besplatna alternativa komplikovanim portalima za nekretnine.',
    icon: (
      <svg className='w-7 h-7' fill='none' viewBox='0 0 24 24' stroke='#E07B2A' strokeWidth={1.5}>
        <path strokeLinecap='round' strokeLinejoin='round' d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z' />
      </svg>
    ),
  },
];

export default function About() {
  return (
    <div style={{ background: '#FAF7F2' }}>

      {/* ── HERO ── */}
      <section
        className='relative flex items-center justify-center'
        style={{ minHeight: '380px', background: '#221E1A' }}
      >
        {/* Dekorativni krug */}
        <div
          className='absolute right-0 top-0 w-96 h-96 rounded-full opacity-10'
          style={{ background: '#E07B2A', transform: 'translate(40%, -40%)' }}
        />
        <div
          className='absolute left-0 bottom-0 w-64 h-64 rounded-full opacity-5'
          style={{ background: '#E07B2A', transform: 'translate(-40%, 40%)' }}
        />

        <div className='relative z-10 text-center px-4 max-w-2xl mx-auto py-16'>
          <p className='text-xs font-bold uppercase tracking-widest mb-3' style={{ color: '#E07B2A' }}>
            Ko smo mi
          </p>
          <h1 className='text-4xl sm:text-5xl font-extrabold text-white mb-5'>
            O nama
          </h1>
          <p className='text-base leading-relaxed' style={{ color: 'rgba(255,255,255,0.65)' }}>
            OglasiStan.rs je besplatna platforma za kupovinu, prodaju i iznajmljivanje
            nekretnina u Srbiji — bez posrednika, bez provizije.
          </p>
        </div>
      </section>

      {/* ── STATISTIKE ── */}
      <section className='max-w-4xl mx-auto px-4 -mt-8 relative z-10'>
        <div className='grid grid-cols-3 gap-4'>
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className='text-center rounded-2xl p-6'
              style={{ background: '#FDF9F4', border: '1px solid #DDD7CC', boxShadow: '0 4px 24px rgba(26,22,18,0.07)' }}
            >
              <p className='text-3xl font-extrabold mb-1' style={{ color: '#E07B2A' }}>{value}</p>
              <p className='text-xs font-medium' style={{ color: '#6B6158' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRIČA ── */}
      <section className='max-w-4xl mx-auto px-4 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 items-center'>

          <div>
            <p className='text-xs font-bold uppercase tracking-widest mb-2' style={{ color: '#E07B2A' }}>
              Naša misija
            </p>
            <h2 className='text-2xl sm:text-3xl font-extrabold mb-5' style={{ color: '#1A1612' }}>
              Traženje stana ne treba da bude komplikovano
            </h2>
            <p className='text-sm leading-relaxed mb-4' style={{ color: '#6B6158' }}>
              Pokrenuli smo OglasiStan.rs sa jednim ciljem — da pronalaženje nekretnine bude brzo,
              transparentno i besplatno. Bez skrivenih naknada, bez agenata koji ne odgovaraju,
              bez komplikovanih formulara.
            </p>
            <p className='text-sm leading-relaxed' style={{ color: '#6B6158' }}>
              Vjerujemo da svako zaslužuje da pronađe dom bez stresa. Zato smo napravili platformu
              gdje vlasnici direktno komuniciraju sa potencijalnim kupcima i stanarima.
            </p>
          </div>

          <div className='flex flex-col gap-4'>
            {[
              { title: 'Transparentnost', desc: 'Svi oglasi su od registrovanih korisnika. Znate tačno s kim razgovarate.' },
              { title: 'Jednostavnost', desc: 'Objavite oglas za manje od 5 minuta. Bez komplikovanih koraka.' },
              { title: 'Zajednica', desc: 'Gradimo povjerenje između vlasnika i stanara širom Srbije.' },
            ].map(({ title, desc }) => (
              <div
                key={title}
                className='flex gap-4 items-start rounded-2xl p-5'
                style={{ background: '#FDF9F4', border: '1px solid #DDD7CC' }}
              >
                <div
                  className='w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5'
                  style={{ background: 'rgba(224,123,42,0.1)' }}
                >
                  <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='#E07B2A' strokeWidth={2.5}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                  </svg>
                </div>
                <div>
                  <p className='font-bold text-sm mb-1' style={{ color: '#1A1612' }}>{title}</p>
                  <p className='text-xs leading-relaxed' style={{ color: '#6B6158' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── CTA ── */}
      <section className='py-16' style={{ background: '#221E1A' }}>
        <div className='max-w-2xl mx-auto px-4 text-center'>
          <h2 className='text-2xl sm:text-3xl font-extrabold text-white mb-4'>
            Spreman/na da počneš?
          </h2>
          <p className='text-sm mb-8' style={{ color: 'rgba(255,255,255,0.6)' }}>
            Pregledaj dostupne oglase ili objavi svoju nekretninu danas — besplatno.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
            <Link
              to='/search'
              className='w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider text-white transition-all duration-200'
              style={{ background: '#E07B2A' }}
              onMouseEnter={e => e.currentTarget.style.background = '#C45F12'}
              onMouseLeave={e => e.currentTarget.style.background = '#E07B2A'}
            >
              Pretraži oglase
            </Link>
            <Link
              to='/create-listing'
              className='w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200'
              style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1.5px solid rgba(255,255,255,0.2)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              Objavi oglas
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
