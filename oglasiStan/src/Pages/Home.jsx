import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  LuSearch, LuArrowRight, LuArrowUpRight, LuMessageSquare, LuCalculator, LuSlidersHorizontal,
  LuShieldCheck, LuSmartphone, LuSparkles, LuMapPin, LuBedDouble, LuRuler, LuCheck, LuHouse,
} from 'react-icons/lu';
import RotatingText from '../components/rb/RotatingText';
import BlurText from '../components/rb/BlurText';
import CountUp from '../components/rb/CountUp';
import ScrollVelocity from '../components/rb/ScrollVelocity';
import SpotlightCard from '../components/rb/SpotlightCard';
import FadeContent from '../components/rb/FadeContent';
import ListingCard, { ListingCardSkeleton } from '../components/ListingCard';
import SectionHeading from '../components/SectionHeading';
import { formatPrice, pricePerM2, typeLabel } from '../utils/format';

const CITIES = ['Belgrade', 'Novi Sad', 'Niš', 'Kragujevac', 'Subotica', 'Zlatibor'];
// Adrese u oglasima su na srpskom, pa pretraga koristi lokalni naziv
const CITY_QUERY = { Belgrade: 'Beograd' };

const getJSON = async (url) => {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch {
    return null;
  }
};

/* ───────────── Hero ilustracija: lebdeće UI kartice (bez fotografija) ───────────── */
function HeroCollage({ listing }) {
  const name = listing?.name || 'Bright 2-bedroom flat';
  const address = listing?.address || 'Novi Sad';
  const price = listing?.regularPrice || 98000;
  const area = listing?.area || 54;
  const beds = listing?.bedrooms || 2;
  const perM2 = pricePerM2(price, area);

  return (
    <div className='relative mx-auto h-[440px] w-full max-w-md lg:h-[520px]'>
      {/* Pozadinski oblik */}
      <div className='absolute inset-6 rotate-3 rounded-[2.5rem] bg-sand' />
      <div className='absolute inset-6 -rotate-2 rounded-[2.5rem] border border-line bg-card/60' />

      {/* Glavna kartica oglasa */}
      <div className='absolute left-1/2 top-12 w-[86%] -translate-x-1/2'>
      <div className='animate-float rounded-3xl border border-line bg-white p-6 shadow-[0_30px_60px_-25px_rgba(34,30,26,0.35)]' style={{ '--r': '-2deg' }}>
        <div className='bg-grid grid h-28 place-items-center rounded-2xl bg-sand'>
          <LuHouse className='h-10 w-10 text-accent' />
        </div>
        <div className='mt-5 flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <span className='rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent'>
              {typeLabel(listing?.type)}
            </span>
            <p className='mt-2.5 truncate font-display text-lg font-semibold text-ink'>{name}</p>
            <p className='mt-0.5 flex items-center gap-1 truncate text-xs text-muted'><LuMapPin className='h-3 w-3 shrink-0' />{address}</p>
          </div>
        </div>
        <div className='mt-4 flex items-end justify-between border-t border-line pt-4'>
          <p className='font-display text-2xl font-semibold text-ink'>{formatPrice(price)}</p>
          <div className='flex gap-3 text-xs text-muted'>
            <span className='flex items-center gap-1'><LuBedDouble className='h-3.5 w-3.5' />{beds}</span>
            <span className='flex items-center gap-1'><LuRuler className='h-3.5 w-3.5' />{area} m²</span>
          </div>
        </div>
      </div>
      </div>

      {/* Cena po m² */}
      {perM2 && (
        <div className='absolute -left-2 bottom-24 animate-float rounded-2xl bg-espresso px-5 py-4 text-white shadow-2xl sm:-left-6' style={{ animationDelay: '-2s', '--r': '-4deg' }}>
          <p className='text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60'>Price per m²</p>
          <p className='mt-1 font-display text-2xl font-semibold'>{formatPrice(perM2)}</p>
        </div>
      )}

      {/* Poruka */}
      <div className='absolute -right-2 bottom-8 w-56 animate-float rounded-2xl border border-line bg-white p-4 shadow-xl sm:-right-6' style={{ animationDelay: '-4s', '--r': '3deg' }}>
        <div className='flex items-center gap-2'>
          <span className='grid h-7 w-7 place-items-center rounded-full bg-accent text-[11px] font-bold text-white'>MK</span>
          <p className='text-xs font-semibold text-ink'>New message</p>
          <span className='ml-auto h-2 w-2 animate-pulse-dot rounded-full bg-accent' />
        </div>
        <p className='mt-2 text-sm text-muted'>Hi! Is the flat still available for a viewing?</p>
      </div>

      {/* 0% */}
      <div className='absolute -top-1 right-2 grid h-24 w-24 animate-float place-items-center rounded-full bg-accent text-center text-white shadow-[0_20px_40px_-15px_rgba(224,123,42,0.8)]' style={{ animationDelay: '-1s', '--r': '8deg' }}>
        <div>
          <p className='font-display text-2xl font-semibold leading-none'>0%</p>
          <p className='mt-1 text-[9px] font-bold uppercase tracking-wider'>commission</p>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────── HERO ───────────────────────────── */
function Hero({ stats, featured }) {
  const navigate = useNavigate();
  const [term, setTerm] = useState('');
  const [mode, setMode] = useState('prodaja');

  const submit = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (term.trim()) p.set('searchTerm', term.trim());
    p.set('type', mode);
    navigate(`/search?${p.toString()}`);
  };

  return (
    <section className='noise relative -mt-24 overflow-hidden pb-16 pt-36 sm:pt-44 lg:pb-24'>
      {/* Topla pozadina */}
      <div className='absolute -left-40 -top-40 h-[34rem] w-[34rem] animate-drift rounded-full bg-accent/20 blur-[120px]' />
      <div className='absolute -right-32 top-20 h-[28rem] w-[28rem] animate-drift rounded-full bg-accent-amber/20 blur-[120px]' style={{ animationDelay: '-7s' }} />
      <div className='bg-grid mask-fade-b absolute inset-0 opacity-70' />

      <div className='container-x relative grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]'>
        <div>
          <div className='animate-fade-up chip mb-8 !bg-white'>
            <span className='h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent' />
            Serbia’s free property marketplace
          </div>

          <h1 className='h-display leading-[0.98]' style={{ fontSize: 'clamp(2.9rem, 7.2vw, 6.4rem)' }}>
            <span className='block overflow-hidden pb-[0.08em]'>
              <span className='block animate-reveal'>A better way</span>
            </span>
            <span className='block overflow-hidden pb-[0.12em]'>
              <span className='flex flex-wrap items-baseline gap-x-[0.25em] animate-reveal' style={{ animationDelay: '140ms' }}>
                to find your
                <RotatingText
                  texts={['home.', 'flat.', 'house.', 'studio.']}
                  mainClassName='accent-italic'
                  splitLevelClassName='overflow-hidden pb-[0.12em] pr-[0.08em]'
                  staggerFrom='last'
                  staggerDuration={0.025}
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '-120%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                  rotationInterval={2400}
                />
              </span>
            </span>
          </h1>

          <div className='mt-7 max-w-xl'>
            <BlurText
              text='Buy, sell and rent property across Serbia. Talk straight to owners, see the real price per m², and list your place in two minutes — completely free.'
              delay={25}
              animateBy='words'
              direction='bottom'
              className='text-base leading-relaxed text-muted sm:text-lg'
            />
          </div>

          {/* Pretraga */}
          <form
            onSubmit={submit}
            className='animate-fade-up mt-9 flex max-w-2xl flex-col gap-2 rounded-3xl border border-line bg-white p-2 shadow-[0_20px_50px_-25px_rgba(34,30,26,0.3)] sm:flex-row sm:items-center sm:rounded-full'
            style={{ animationDelay: '500ms' }}
          >
            <div className='flex rounded-full bg-sand p-1'>
              {[['prodaja', 'Buy'], ['izdavanje', 'Rent']].map(([val, lab]) => (
                <button
                  key={val}
                  type='button'
                  onClick={() => setMode(val)}
                  className={`flex-1 rounded-full px-5 py-2 text-sm font-semibold transition-all sm:flex-none ${
                    mode === val ? 'bg-espresso text-white shadow' : 'text-muted hover:text-ink'
                  }`}
                >
                  {lab}
                </button>
              ))}
            </div>
            <label className='flex flex-1 items-center gap-3 px-3'>
              <LuSearch className='h-5 w-5 shrink-0 text-accent' />
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder='City or street'
                className='w-full bg-transparent py-3 text-base text-ink outline-none placeholder:text-dim'
              />
            </label>
            <button type='submit' className='btn-primary !py-3.5'>
              Search <LuArrowRight className='h-4 w-4' />
            </button>
          </form>

          <div className='animate-fade-up mt-5 flex flex-wrap items-center gap-2' style={{ animationDelay: '650ms' }}>
            <span className='mr-1 text-xs font-semibold text-dim'>Popular:</span>
            {CITIES.slice(0, 4).map((c) => (
              <Link key={c} to={`/search?searchTerm=${encodeURIComponent(CITY_QUERY[c] || c)}`} className='chip hover:border-accent hover:text-accent'>
                {c}
              </Link>
            ))}
          </div>

          {/* Statistika */}
          <div className='animate-fade-up mt-12 flex flex-wrap items-center gap-x-10 gap-y-6' style={{ animationDelay: '800ms' }}>
            {[
              { value: stats.total, label: 'Live listings' },
              { value: stats.sale, label: 'For sale' },
              { value: stats.rent, label: 'For rent' },
            ].map((s, i) => (
              <div key={s.label} className={`${i ? 'border-l border-line pl-10' : ''}`}>
                <p className='font-display text-4xl font-semibold text-ink'>
                  {s.value === null ? '—' : <CountUp to={s.value} duration={1.6} separator=',' />}
                </p>
                <p className='mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-dim'>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className='animate-fade-up' style={{ animationDelay: '300ms' }}>
          <HeroCollage listing={featured} />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── LISTINGS ─────────────────────────── */
function ListingGrid({ items, cols = 'lg:grid-cols-4', count = 4, emptyText }) {
  if (items === null) {
    return (
      <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${cols}`}>
        {Array.from({ length: count }).map((_, i) => <ListingCardSkeleton key={i} />)}
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <div className='panel flex flex-col items-center justify-center gap-4 px-6 py-16 text-center'>
        <LuSparkles className='h-8 w-8 text-accent' />
        <p className='max-w-sm text-muted'>{emptyText}</p>
        <Link to='/create-listing' className='btn-primary'>Be the first to post</Link>
      </div>
    );
  }
  return (
    <FadeContent stagger={0.08} blur={6} duration={0.9} className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${cols}`}>
      {items.map((l) => <ListingCard key={l._id} listing={l} />)}
    </FadeContent>
  );
}

/* ─────────────────────────── FEATURES ─────────────────────────── */
function Bento({ className = '', dark = false, children }) {
  return (
    <SpotlightCard
      className={`rounded-4xl border p-7 sm:p-8 ${dark ? 'border-espresso text-white' : 'border-line'} ${className}`}
      style={{ '--spotlight-card-surface': dark ? '#221E1A' : '#FDF9F4', '--spotlight-card-shadow': 'none' }}
      spotlightColor={dark ? 'rgba(224, 123, 42, 0.35)' : 'rgba(224, 123, 42, 0.12)'}
      theme={dark ? 'dark' : 'light'}
    >
      {children}
    </SpotlightCard>
  );
}

function FeatureIcon({ icon: Icon }) {
  return (
    <span className='mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-accent/10 text-accent'>
      <Icon className='h-5 w-5' />
    </span>
  );
}

function Features() {
  return (
    <section className='container-x py-24 sm:py-32'>
      <SectionHeading
        eyebrow='Why OglasiStan'
        title='Everything you need,'
        accent='nothing you don’t.'
        description='The big portals make it complicated. We made it obvious — no agents in the middle, no fees, no noise.'
      />

      <div className='grid grid-cols-1 gap-4 md:grid-cols-6'>
        <Bento dark className='md:col-span-4'>
          <div className='flex h-full flex-col justify-between gap-10 sm:flex-row sm:items-end'>
            <div className='max-w-sm'>
              <span className='mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-accent text-white'><LuSparkles className='h-5 w-5' /></span>
              <h3 className='font-display text-3xl font-semibold tracking-tight'>Zero commission. <span className='accent-italic'>Forever.</span></h3>
              <p className='mt-3 text-white/65'>Posting is free, contacting is free, and the deal stays between you and the other person. We never take a cut.</p>
            </div>
            <p className='font-display text-[6.5rem] font-semibold leading-none tracking-tightest text-accent sm:text-[8.5rem]'>
              <CountUp from={0} to={100} direction='down' duration={2.2} />%
            </p>
          </div>
        </Bento>

        <Bento className='md:col-span-2'>
          <FeatureIcon icon={LuMessageSquare} />
          <h3 className='h-display text-2xl'>Straight to the owner</h3>
          <p className='mt-2 text-sm text-muted'>Your message lands in their inbox. Their reply lands in yours.</p>
          <div className='mt-6 space-y-2 text-sm'>
            <div className='w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-sand px-3.5 py-2 text-ink'>Is the flat still available?</div>
            <div className='ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-accent px-3.5 py-2 font-medium text-white'>Yes! Viewing tomorrow?</div>
          </div>
        </Bento>

        <Bento className='md:col-span-2'>
          <FeatureIcon icon={LuCalculator} />
          <h3 className='h-display text-2xl'>Price per m², instantly</h3>
          <p className='mt-2 text-sm text-muted'>Every listing shows its real value per square metre.</p>
          <div className='mt-6 flex h-20 items-end gap-1.5'>
            {[38, 62, 45, 80, 54, 92, 70].map((h, i) => (
              <div key={i} className={`flex-1 rounded-t-lg ${i === 5 ? 'bg-accent' : 'bg-sand'}`} style={{ height: `${h}%` }} />
            ))}
          </div>
        </Bento>

        <Bento className='md:col-span-2'>
          <FeatureIcon icon={LuSlidersHorizontal} />
          <h3 className='h-display text-2xl'>Filters that get it</h3>
          <p className='mt-2 text-sm text-muted'>Price, rooms, parking, furnished, terrace.</p>
          <div className='mt-6 flex flex-wrap gap-2'>
            {['2+ rooms', 'Parking', 'Terrace', '< €900/mo', 'Furnished'].map((t, i) => (
              <span key={t} className={`chip ${i % 2 === 0 ? '!border-accent !bg-accent/10 !text-accent' : ''}`}>{t}</span>
            ))}
          </div>
        </Bento>

        <Bento className='md:col-span-2'>
          <FeatureIcon icon={LuShieldCheck} />
          <h3 className='h-display text-2xl'>Real people only</h3>
          <p className='mt-2 text-sm text-muted'>Every listing comes from a registered account. No anonymous fake ads.</p>
        </Bento>

        <Bento className='md:col-span-3'>
          <FeatureIcon icon={LuSmartphone} />
          <h3 className='h-display text-2xl'>Made for your phone</h3>
          <p className='mt-2 text-sm text-muted'>Browse on the bus, message from the couch, post from the apartment itself.</p>
        </Bento>

        <Bento className='md:col-span-3'>
          <div className='flex items-start justify-between gap-6'>
            <div>
              <FeatureIcon icon={LuCheck} />
              <h3 className='h-display text-2xl'>Live in two minutes</h3>
              <p className='mt-2 text-sm text-muted'>Photos, price, details — publish. Edit any time.</p>
            </div>
            <p className='font-display text-6xl font-semibold italic text-ink/10'>2:00</p>
          </div>
        </Bento>
      </div>
    </section>
  );
}

/* ─────────────────────────── HOW IT WORKS ─────────────────────────── */
function HowItWorks() {
  const steps = [
    { n: '01', title: 'Create an account', text: 'Email or Google. Takes about ten seconds.' },
    { n: '02', title: 'Post your property', text: 'Add photos, price, size, floor and the good stuff.' },
    { n: '03', title: 'Get real messages', text: 'Interested buyers and renters email you directly.' },
  ];
  return (
    <section className='section-dark'>
      <div className='absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-accent/25 blur-[130px]' />
      <div className='container-x relative py-24 sm:py-32'>
        <div className='mb-14 max-w-2xl'>
          <p className='eyebrow mb-4'><span className='h-px w-6 bg-accent' />How it works</p>
          <h2 className='font-display text-4xl font-semibold leading-[1] tracking-tightest sm:text-6xl'>
            Three steps. <span className='accent-italic'>Zero drama.</span>
          </h2>
        </div>
        <FadeContent stagger={0.15} blur={6} className='grid gap-4 md:grid-cols-3'>
          {steps.map((s) => (
            <div key={s.n} className='group relative rounded-4xl border border-white/10 bg-white/[0.04] p-8 transition-colors duration-500 hover:border-accent/50 hover:bg-white/[0.07] sm:p-10'>
              <p className='font-display text-6xl font-semibold italic text-accent'>{s.n}</p>
              <h3 className='mt-10 font-display text-2xl font-semibold'>{s.title}</h3>
              <p className='mt-3 text-white/60'>{s.text}</p>
              <LuArrowUpRight className='absolute right-8 top-8 h-6 w-6 text-white/30 transition-all duration-500 group-hover:rotate-45 group-hover:text-accent' />
            </div>
          ))}
        </FadeContent>
      </div>
    </section>
  );
}

/* ─────────────────────────── CTA ─────────────────────────── */
function CTA() {
  return (
    <section className='container-x py-24 sm:py-32'>
      <div className='noise relative overflow-hidden rounded-[2.5rem] bg-accent px-6 py-20 text-center text-white sm:px-12 sm:py-24'>
        <div className='absolute -left-20 -top-24 h-72 w-72 animate-drift rounded-full bg-accent-amber/60 blur-[90px]' />
        <div className='absolute -bottom-28 -right-16 h-80 w-80 animate-drift rounded-full bg-accent-deep/70 blur-[100px]' style={{ animationDelay: '-7s' }} />
        <LuHouse className='absolute -bottom-10 -left-6 h-56 w-56 rotate-[-12deg] text-white/10' />

        <div className='relative'>
          <p className='mb-6 text-xs font-bold uppercase tracking-[0.18em] text-white/80'>Got a place?</p>
          <h2 className='mx-auto max-w-3xl font-display font-semibold leading-[1] tracking-tightest' style={{ fontSize: 'clamp(2.6rem, 6.5vw, 5.5rem)' }}>
            List it in two minutes. <span className='font-display italic'>Pay nothing.</span>
          </h2>
          <div className='mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row'>
            <Link to='/create-listing' className='btn-dark !px-8 !py-4 text-base hover:!bg-white hover:!text-espresso'>
              Post a listing <LuArrowRight className='h-5 w-5' />
            </Link>
            <Link to='/search' className='btn !px-8 !py-4 text-base text-white ring-1 ring-white/50 hover:-translate-y-0.5 hover:bg-white/10'>
              Browse listings
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── PAGE ─────────────────────────── */
export default function Home() {
  const [latest, setLatest] = useState(null);
  const [rentals, setRentals] = useState(null);
  const [stats, setStats] = useState({ total: null, sale: null, rent: null });

  useEffect(() => {
    getJSON('/api/listing/search?sort=createdAt&order=desc&limit=8').then((d) => {
      setLatest(d?.listings || []);
      setStats((s) => ({ ...s, total: d?.total ?? 0 }));
    });
    getJSON('/api/listing/search?type=izdavanje&sort=regularPrice&order=asc&limit=4').then((d) => {
      setRentals(d?.listings || []);
      setStats((s) => ({ ...s, rent: d?.total ?? 0 }));
    });
    getJSON('/api/listing/search?type=prodaja&limit=1').then((d) => {
      setStats((s) => ({ ...s, sale: d?.total ?? 0 }));
    });
  }, []);

  return (
    <div className='overflow-x-clip'>
      <Hero stats={stats} featured={latest?.[0]} />

      {/* Traka sa gradovima */}
      <section className='border-y border-line bg-sand py-6 sm:py-8'>
        <ScrollVelocity
          texts={[CITIES.join('  ·  ') + '  ·  ', 'Apartments  ·  Houses  ·  Studios  ·  Lofts  ·  Penthouses  ·  ']}
          velocity={40}
          outlineAlternate
          fadeEdges
          color='#1A1612'
          scrollerClassName='scroller !font-display !font-semibold !text-4xl sm:!text-6xl !leading-[1.2] !tracking-tight'
        />
      </section>

      <section className='container-x pt-24 sm:pt-32'>
        <SectionHeading
          eyebrow='Fresh on the market'
          title='Just'
          accent='listed.'
          linkTo='/search?sort=createdAt&order=desc'
          linkLabel='All listings'
        />
        {latest === null ? (
          <ListingGrid items={null} count={8} />
        ) : (
          <ListingGrid items={latest} emptyText='No listings yet. The market is wide open — post the first one.' />
        )}
      </section>

      <Features />
      <HowItWorks />

      <section className='container-x pt-24 sm:pt-32'>
        <SectionHeading
          eyebrow='For rent'
          title='Rentals that'
          accent='won’t hurt.'
          description='The most affordable rentals on the platform right now, sorted by price.'
          linkTo='/search?type=izdavanje&sort=regularPrice&order=asc'
          linkLabel='All rentals'
        />
        {rentals === null ? (
          <ListingGrid items={null} />
        ) : (
          <ListingGrid items={rentals} emptyText='No rentals listed yet. Got a flat to rent out?' />
        )}
      </section>

      <CTA />
    </div>
  );
}
