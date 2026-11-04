import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { LuSearch, LuPlus, LuArrowUpRight } from 'react-icons/lu';
import Logo from './Logo';
import { getInitials } from '../utils/format';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/search', label: 'Browse' },
  { to: '/search?type=izdavanje', label: 'Rentals' },
  { to: '/about', label: 'About' },
];

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const term = new URLSearchParams(location.search).get('searchTerm');
    setSearchTerm(term || '');
  }, [location.search]);

  useEffect(() => { setMenuOpen(false); }, [location.pathname, location.search]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Zaključaj skrol dok je mobilni meni otvoren
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.pathname === '/search' ? location.search : '');
    if (searchTerm.trim()) params.set('searchTerm', searchTerm.trim());
    else params.delete('searchTerm');
    navigate(`/search?${params.toString()}`);
  };

  const isActive = (item) => {
    const [path, query] = item.to.split('?');
    if (item.end) return location.pathname === path;
    if (location.pathname !== path) return false;
    if (query) return location.search.includes(query);
    return !location.search.includes('type=izdavanje');
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled || menuOpen
            ? 'border-b border-line bg-cream/90 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className='container-x flex h-24 items-center gap-4'>
          <Logo className='h-[72px] sm:h-20' />

          {/* Desktop nav — "pilula" */}
          <nav className='ml-4 hidden items-center gap-0.5 rounded-full border border-line bg-card/80 p-1 shadow-sm lg:flex'>
            {NAV.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive(item) ? 'bg-espresso text-white shadow' : 'text-muted hover:bg-sand hover:text-ink'
                }`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className='ml-auto flex items-center gap-2'>
            {/* Desktop search */}
            <form
              onSubmit={handleSubmit}
              className='group hidden items-center gap-2 rounded-full border border-line bg-card/80 px-4 py-2.5 transition-all focus-within:border-accent focus-within:bg-white xl:flex'
            >
              <LuSearch className='h-4 w-4 text-dim transition-colors group-focus-within:text-accent' />
              <input
                type='text'
                placeholder='Search city, street…'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-40 bg-transparent text-sm text-ink outline-none placeholder:text-dim xl:w-56'
              />
              <kbd className='hidden rounded border border-line px-1.5 font-sans text-[10px] text-dim xl:block'>↵</kbd>
            </form>

            {currentUser ? (
              <>
                <Link to='/create-listing' className='btn-primary hidden !px-4 !py-2.5 sm:inline-flex'>
                  <LuPlus className='h-4 w-4' /> Post listing
                </Link>
                <Link
                  to='/profile'
                  aria-label='Your profile'
                  className='grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-deep font-display text-xs font-bold text-white ring-2 ring-line transition-transform hover:scale-105 hover:ring-accent/50'
                >
                  {getInitials(currentUser.username)}
                </Link>
              </>
            ) : (
              <>
                <Link to='/sign-in' className='btn-primary hidden !px-5 !py-2.5 sm:inline-flex'>
                  Sign in
                </Link>
                <Link to='/sign-up' className='btn-dark hidden !px-5 !py-2.5 sm:inline-flex'>
                  Sign up <LuArrowUpRight className='h-4 w-4' />
                </Link>
              </>
            )}

            {/* Hamburger (mobilni) */}
            <button
              type='button'
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className='relative grid h-11 w-11 place-items-center rounded-full border border-line bg-card lg:hidden'
            >
              <span className={`absolute h-[1.5px] w-5 bg-espresso transition-all duration-300 ${menuOpen ? 'rotate-45' : '-translate-y-[5px]'}`} />
              <span className={`absolute h-[1.5px] w-5 bg-espresso transition-all duration-300 ${menuOpen ? '-rotate-45' : 'translate-y-[5px]'}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobilni meni — preko celog ekrana */}
      <div
        className={`fixed inset-0 z-40 bg-cream transition-all duration-500 lg:hidden ${
          menuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div className='pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-accent/15 blur-[90px]' />
        <div className='container-x relative flex h-full flex-col pb-8 pt-32'>
          <form onSubmit={handleSubmit} className='mb-8 flex items-center gap-3 rounded-full border border-line bg-card px-5 py-3.5'>
            <LuSearch className='h-5 w-5 text-accent' />
            <input
              type='text'
              placeholder='Search city, street…'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full bg-transparent text-base text-ink outline-none placeholder:text-dim'
            />
          </form>

          <nav className='flex flex-col'>
            {[...NAV, ...(currentUser ? [{ to: '/profile', label: 'Profile' }] : [])].map((item, i) => (
              <Link
                key={item.label}
                to={item.to}
                style={{ transitionDelay: menuOpen ? `${80 + i * 60}ms` : '0ms' }}
                className={`group flex items-center justify-between border-b border-line py-4 font-display text-4xl font-bold tracking-tight transition-all duration-500 ${
                  menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                } ${isActive(item) ? 'text-accent' : 'text-ink'}`}
              >
                {item.label}
                <LuArrowUpRight className='h-6 w-6 text-dim transition-all group-hover:rotate-45 group-hover:text-accent' />
              </Link>
            ))}
          </nav>

          <div className='mt-auto flex flex-col gap-3'>
            {currentUser ? (
              <Link to='/create-listing' className='btn-primary w-full !py-4 text-base'>
                <LuPlus className='h-5 w-5' /> Post a listing
              </Link>
            ) : (
              <>
                <Link to='/sign-up' className='btn-primary w-full !py-4 text-base'>Get started — it's free</Link>
                <Link to='/sign-in' className='btn-ghost w-full !py-4 text-base'>Sign in</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
