import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#221E1A', borderTop: '1px solid #2E2925' }}>
      <div className='max-w-6xl mx-auto px-4 py-12'>

        {/* Gornji red */}
        <div className='flex flex-col md:flex-row justify-between gap-10 mb-10'>

          {/* Lijeva strana — linkovi */}
          <div className='flex flex-col sm:flex-row gap-10'>

            <div>
              <p className='text-xs font-bold uppercase tracking-widest mb-4' style={{ color: '#E07B2A' }}>
                Navigacija
              </p>
              <ul className='flex flex-col gap-2'>
                {[
                  { to: '/', label: 'Početna' },
                  { to: '/search', label: 'Pretraži ponude' },
                  { to: '/about', label: 'O nama' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className='text-sm transition-colors'
                      style={{ color: '#B5AFA5' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#E07B2A'}
                      onMouseLeave={e => e.currentTarget.style.color = '#B5AFA5'}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className='text-xs font-bold uppercase tracking-widest mb-4' style={{ color: '#E07B2A' }}>
                Korisnici
              </p>
              <ul className='flex flex-col gap-2'>
                {[
                  { to: '/sign-in', label: 'Prijava' },
                  { to: '/sign-up', label: 'Registracija' },
                  { to: '/create-listing', label: 'Objavi oglas' },
                  { to: '/profile', label: 'Moj profil' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className='text-sm transition-colors'
                      style={{ color: '#B5AFA5' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#E07B2A'}
                      onMouseLeave={e => e.currentTarget.style.color = '#B5AFA5'}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Desna strana — logo */}
          <div className='flex flex-col items-start md:items-end justify-between gap-6'>
            <Link to='/'>
              <img
                src='/OglasiStan:FullLogo.svg'
                alt='OglasiStan'
                className='h-16 opacity-90 hover:opacity-100 transition-opacity'
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </Link>
            <p className='text-xs leading-relaxed max-w-xs md:text-right' style={{ color: '#6B6158' }}>
              Vaša pouzdana platforma za kupovinu,<br />prodaju i iznajmljivanje nekretnina u Srbiji.
            </p>
          </div>

        </div>

        {/* Separator */}
        <div style={{ borderTop: '1px solid #2E2925' }} className='pt-6 flex flex-col sm:flex-row items-center justify-between gap-3'>
          <p className='text-xs' style={{ color: '#6B6158' }}>
            © {new Date().getFullYear()} OglasiStan.rs — Sva prava zadržana.
          </p>
          <div className='flex items-center gap-4'>
            <span className='text-xs' style={{ color: '#6B6158' }}>Napravljeno u Srbiji 🇷🇸</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
