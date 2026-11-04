import { Link } from 'react-router-dom';
import { LuArrowUpRight } from 'react-icons/lu';
import Logo from './Logo';

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      { to: '/search', label: 'All listings' },
      { to: '/search?type=prodaja', label: 'For sale' },
      { to: '/search?type=izdavanje', label: 'For rent' },
      { to: '/search?sort=regularPrice&order=asc', label: 'Best prices' },
    ],
  },
  {
    title: 'Account',
    links: [
      { to: '/sign-up', label: 'Create account' },
      { to: '/sign-in', label: 'Sign in' },
      { to: '/create-listing', label: 'Post a listing' },
      { to: '/profile', label: 'Your profile' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About us' },
      { to: '/about#faq', label: 'FAQ' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className='section-dark'>
      <div className='absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-accent/15 blur-[110px]' />
      <div className='container-x relative pt-16 sm:pt-20'>
        <div className='grid gap-12 lg:grid-cols-[1.4fr_2fr]'>
          <div>
            <Logo inverted className='h-16 sm:h-20' />
            <p className='mt-5 max-w-sm text-sm leading-relaxed text-white/60'>
              The simple way to buy, sell and rent property in Serbia. No agents, no commission — just you and the owner.
            </p>
            <Link to='/create-listing' className='btn-primary mt-7 !px-5 !py-3'>
              List your property for free <LuArrowUpRight className='h-4 w-4' />
            </Link>
          </div>

          <div className='grid grid-cols-2 gap-10 sm:grid-cols-3'>
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className='mb-5 text-xs font-bold uppercase tracking-[0.14em] text-accent'>{col.title}</p>
                <ul className='space-y-3'>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className='text-sm text-white/60 transition-colors hover:text-white'>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className='mt-16 flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-white/40 sm:flex-row'>
          <p>© {new Date().getFullYear()} OglasiStan.com — All rights reserved.</p>
          <p>Made with care in Serbia</p>
        </div>
      </div>
    </footer>
  );
}
