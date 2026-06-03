import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

export default function Header() {
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  // Sync search bar with URL when on search page
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const term = params.get('searchTerm');
    if (term) setSearchTerm(term);
    else setSearchTerm('');
  }, [location.search]);

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
      `}</style>
      <div className='flex justify-between items-center max-w-6xl mx-auto px-4 py-3'>

        <Link to='/' className='flex items-center'>
          <img src='/OglasiStan-FullLogo.svg' alt='OglasiStan' className='h-20' />
        </Link>

        <form
          onSubmit={handleSubmit}
          className='flex items-center rounded-full px-4 py-2 gap-2 transition-colors'
          style={{ background: '#F2EDE3', border: '1px solid #DDD7CC' }}
        >
          <input
            type='text'
            placeholder='Pretražite ponude...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='bg-transparent focus:outline-none text-sm w-40 sm:w-64'
            style={{ color: '#1A1612' }}
          />
          <button type='submit'>
            <FaSearch style={{ color: '#B5AFA5' }} className='text-sm flex-shrink-0' />
          </button>
        </form>

        <nav>
          <ul className='flex items-center gap-1'>
            <li className='hidden sm:inline'>
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
            <li className='hidden sm:inline'>
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
                  <img
                    src={currentUser.avatar}
                    alt="profile"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(currentUser.username || 'U')}&backgroundColor=E07B2A`;
                    }}
                    className='w-9 h-9 rounded-full object-cover'
                    style={{ border: '2px solid #E07B2A' }}
                  />
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

      </div>
    </header>
  )
}
