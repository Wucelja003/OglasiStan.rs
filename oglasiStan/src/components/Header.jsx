import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

// Inicijali iz korisničkog imena (npr. "Marko Petrović" -> "MP", "marko" -> "MA")
const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0].slice(0, 2).toUpperCase();
};

export default function Header() {
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  // Sync search bar with URL when on search page
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const term = params.get('searchTerm');
    if (term) setSearchTerm(term);
    else setSearchTerm('');
  }, [location.search]);

  // Zatvori mobilni meni pri promeni stranice
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    params.set('searchTerm', searchTerm);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <header
      className='shadow-sm'
      style={{
        background: '#FDF9F4',
        borderBottom: '1px solid #DDD7CC',
        animation: 'slideDown 2s cubic-bezier(0.16, 1, 0.3, 1) both',
      }}
    >
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }

        /* Ulazna animacija grupe dugmadi */
        @keyframes authIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .auth-actions { animation: authIn 0.6s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both; }

        /* Bazni stil dugmadi + shine-sweep efekat */
        .auth-btn {
          position: relative;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          border-radius: 0.6rem;
          padding: 0.55rem 1.1rem;
          font-size: 0.875rem;
          font-weight: 600;
          white-space: nowrap;
          transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        }
        .auth-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -130%;
          width: 70%; height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.5), transparent);
          transform: skewX(-20deg);
          transition: left 0.6s ease;
        }
        .auth-btn:hover::before { left: 140%; }
        .auth-btn:hover { transform: translateY(-2px); }

        /* Narandžasto "Prijavi se" sa suptilnim glow pulsom */
        .auth-btn-orange {
          background: #E07B2A;
          color: #fff;
          animation: glowPulse 2.6s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 4px 14px rgba(224,123,42,0.35); }
          50%      { box-shadow: 0 6px 22px rgba(224,123,42,0.6); }
        }

        /* Tamno "Registruj se" */
        .auth-btn-dark {
          background: #221E1A;
          color: #fff;
        }
        .auth-btn-dark:hover { background: #E07B2A; }

        /* Mobilni meni — spuštanje */
        @keyframes menuDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-menu { animation: menuDown 0.25s ease both; }

        /* Hamburger linije -> X */
        .burger-line {
          display: block;
          width: 22px;
          height: 2px;
          background: #1A1612;
          border-radius: 2px;
          transition: transform 0.3s ease, opacity 0.2s ease;
        }
        .burger-line + .burger-line { margin-top: 5px; }
        .burger-open .burger-line:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .burger-open .burger-line:nth-child(2) { opacity: 0; }
        .burger-open .burger-line:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
      `}</style>
      <div className='flex justify-between items-center max-w-6xl mx-auto px-4 py-3 gap-2 sm:gap-4'>

        <Link to='/' className='flex items-center flex-shrink-0'>
          <img src='/OglasiStan-FullLogo.svg' alt='OglasiStan' className='h-12 sm:h-20' />
        </Link>

        <form
          onSubmit={handleSubmit}
          className='flex items-center rounded-full px-3 sm:px-4 py-2 gap-2 transition-colors flex-1 min-w-0 max-w-xs sm:max-w-none sm:flex-none'
          style={{ background: '#F2EDE3', border: '1px solid #DDD7CC' }}
        >
          <input
            type='text'
            placeholder='Pretražite ponude...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='bg-transparent focus:outline-none text-sm w-full sm:w-64'
            style={{ color: '#1A1612' }}
          />
          <button type='submit'>
            <FaSearch style={{ color: '#B5AFA5' }} className='text-sm flex-shrink-0' />
          </button>
        </form>

        {/* Desktop navigacija */}
        <nav className='hidden sm:block'>
          <ul className='flex items-center gap-1'>
            <li>
              <Link
                to='/'
                className='px-3 py-2 rounded-lg text-sm font-medium transition-colors'
                style={{ color: '#6B6158' }}
                onMouseEnter={e => e.currentTarget.style.color = '#E07B2A'}
                onMouseLeave={e => e.currentTarget.style.color = '#6B6158'}
              >
                Početna
              </Link>
            </li>
            <li>
              <Link
                to='/about'
                className='px-3 py-2 rounded-lg text-sm font-medium transition-colors'
                style={{ color: '#6B6158' }}
                onMouseEnter={e => e.currentTarget.style.color = '#E07B2A'}
                onMouseLeave={e => e.currentTarget.style.color = '#6B6158'}
              >
                O nama
              </Link>
            </li>
            {currentUser ? (
              <li>
                <Link to='/profile'>
                  <div
                    className='w-9 h-9 rounded-full flex items-center justify-center select-none'
                    style={{ border: '2px solid #E07B2A', background: 'linear-gradient(135deg, #E07B2A 0%, #C45F12 100%)' }}
                  >
                    <span className='text-xs font-extrabold text-white tracking-wide'>{getInitials(currentUser.username)}</span>
                  </div>
                </Link>
              </li>
            ) : (
              <li className='auth-actions flex items-center gap-2'>
                <Link to='/sign-in' className='auth-btn auth-btn-orange'>
                  Prijavi se
                </Link>
                <Link to='/sign-up' className='auth-btn auth-btn-dark'>
                  Registruj se
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Mobilni: avatar (ako je ulogovan) + hamburger */}
        <div className='flex sm:hidden items-center gap-2 flex-shrink-0'>
          {currentUser && (
            <Link to='/profile'>
              <div
                className='w-9 h-9 rounded-full flex items-center justify-center select-none'
                style={{ border: '2px solid #E07B2A', background: 'linear-gradient(135deg, #E07B2A 0%, #C45F12 100%)' }}
              >
                <span className='text-xs font-extrabold text-white tracking-wide'>{getInitials(currentUser.username)}</span>
              </div>
            </Link>
          )}
          <button
            type='button'
            onClick={() => setMenuOpen(o => !o)}
            aria-label='Otvori meni'
            aria-expanded={menuOpen}
            className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center ${menuOpen ? 'burger-open' : ''}`}
            style={{ background: '#F2EDE3', border: '1px solid #DDD7CC' }}
          >
            <span className='burger-line' />
            <span className='burger-line' />
            <span className='burger-line' />
          </button>
        </div>

      </div>

      {/* Mobilni dropdown meni */}
      {menuOpen && (
        <div className='mobile-menu sm:hidden' style={{ borderTop: '1px solid #DDD7CC', background: '#FDF9F4' }}>
          <ul className='flex flex-col px-4 py-3 gap-1'>
            <li>
              <Link to='/' className='block px-3 py-2.5 rounded-lg text-sm font-medium' style={{ color: '#6B6158' }}>
                Početna
              </Link>
            </li>
            <li>
              <Link to='/about' className='block px-3 py-2.5 rounded-lg text-sm font-medium' style={{ color: '#6B6158' }}>
                O nama
              </Link>
            </li>
            {currentUser ? (
              <li>
                <Link to='/profile' className='block px-3 py-2.5 rounded-lg text-sm font-medium' style={{ color: '#6B6158' }}>
                  Moj profil
                </Link>
              </li>
            ) : (
              <li className='flex flex-col gap-2 pt-2'>
                <Link to='/sign-in' className='auth-btn auth-btn-orange justify-center'>
                  Prijavi se
                </Link>
                <Link to='/sign-up' className='auth-btn auth-btn-dark justify-center'>
                  Registruj se
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  )
}
