import { Link } from 'react-router-dom';

// Originalni OglasiStan logo. `inverted` -> bela verzija za tamne pozadine.
export default function Logo({ className = 'h-14 sm:h-16', inverted = false }) {
  return (
    <Link to='/' className='inline-flex shrink-0 items-center transition-opacity hover:opacity-85' aria-label='OglasiStan home'>
      <img
        src='/OglasiStan-FullLogo.svg'
        alt='OglasiStan'
        className={`w-auto ${className}`}
        style={inverted ? { filter: 'brightness(0) invert(1)' } : undefined}
      />
    </Link>
  );
}
