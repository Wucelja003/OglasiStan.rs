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
      `}</style>
      <div className='flex justify-between items-center max-w-6xl mx-auto px-4 py-3'>

        <Link to='/' className='flex items-center'>
          <img src='/OglasiStan:FullLogo.svg' alt='OglasiStan' className='h-20' />
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
            <Link to='/profile'>
              {currentUser ? (
                <img
                  src={currentUser.avatar}
                  alt="profile"
                  className='w-9 h-9 rounded-full object-cover'
                  style={{ border: '2px solid #E07B2A' }}
                />
              ) : (
                <li
                  className='px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer transition-all duration-200'
                  style={{ background: '#221E1A' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#E07B2A'}
                  onMouseLeave={e => e.currentTarget.style.background = '#221E1A'}
                >
                  Registruj se
                </li>
              )}
            </Link>
          </ul>
        </nav>

      </div>
    </header>
  )
}
