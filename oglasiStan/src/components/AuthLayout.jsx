import { Link } from 'react-router-dom';
import { LuArrowLeft, LuCheck, LuHouse } from 'react-icons/lu';
import RotatingText from './rb/RotatingText';

const PERKS = ['Zero commission, ever', 'Message owners directly', 'Up to 15 photos per listing'];

export default function AuthLayout({ eyebrow, title, subtitle, children, footer }) {
  return (
    <div className='flex min-h-[calc(100svh-6rem)] gap-6 p-0 lg:p-4'>
      {/* Leva — vizual (tamni espresso panel) */}
      <div className='noise relative hidden w-[46%] overflow-hidden rounded-[2.5rem] bg-espresso text-white lg:flex'>
        <div className='absolute -left-32 top-10 h-[28rem] w-[28rem] animate-drift rounded-full bg-accent/35 blur-[120px]' />
        <div className='absolute -bottom-40 right-0 h-[26rem] w-[26rem] animate-drift rounded-full bg-accent-amber/20 blur-[120px]' style={{ animationDelay: '-6s' }} />
        <LuHouse className='absolute -bottom-16 -right-16 h-80 w-80 rotate-[-10deg] text-white/[0.04]' />

        <div className='relative flex w-full flex-col justify-between p-12 xl:p-16'>
          <Link to='/' className='group inline-flex w-fit items-center gap-2 text-sm text-white/60 hover:text-white'>
            <LuArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-1' /> Back home
          </Link>

          <div>
            <h2 className='font-display text-6xl font-semibold leading-[1] tracking-tightest xl:text-7xl'>
              Your next<br />
              <RotatingText
                texts={['apartment', 'house', 'studio', 'tenant', 'buyer']}
                mainClassName='accent-italic'
                splitLevelClassName='overflow-hidden pb-[0.12em] pr-[0.08em]'
                staggerFrom='last'
                staggerDuration={0.02}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-120%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                rotationInterval={2200}
              />
              <span className='block'>is one click away.</span>
            </h2>
            <ul className='mt-10 space-y-3'>
              {PERKS.map((p) => (
                <li key={p} className='flex items-center gap-3 text-white/80'>
                  <span className='grid h-6 w-6 place-items-center rounded-full bg-accent/15 text-accent'>
                    <LuCheck className='h-3.5 w-3.5' strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <p className='text-xs text-white/40'>© {new Date().getFullYear()} OglasiStan.com</p>
        </div>
      </div>

      {/* Desna — forma */}
      <div className='relative flex flex-1 items-center justify-center px-5 py-12 sm:px-8'>
        <div className='bg-grid mask-radial absolute inset-0 lg:hidden' />
        <div className='relative w-full max-w-md animate-fade-up'>
          <p className='eyebrow mb-4'><span className='h-px w-6 bg-accent' />{eyebrow}</p>
          <h1 className='h-display text-5xl leading-[0.95]'>{title}</h1>
          {subtitle && <p className='mt-3 text-muted'>{subtitle}</p>}
          <div className='mt-10'>{children}</div>
          {footer && <div className='mt-8 text-center text-sm text-muted'>{footer}</div>}
        </div>
      </div>
    </div>
  );
}
