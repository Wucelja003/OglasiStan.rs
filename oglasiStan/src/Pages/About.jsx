import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LuArrowRight, LuGift, LuMessageSquare, LuCalculator, LuMapPin, LuPlus } from 'react-icons/lu';
import DecryptedText from '../components/rb/DecryptedText';
import FadeContent from '../components/rb/FadeContent';
import SpotlightCard from '../components/rb/SpotlightCard';
import SectionHeading from '../components/SectionHeading';

const VALUES = [
  { icon: LuGift, title: 'Free, for real', text: 'No listing fees, no premium tiers hiding the good stuff, no commission at the end.' },
  { icon: LuMessageSquare, title: 'Direct contact', text: 'Messages go straight from the buyer to the owner’s inbox. Nobody in between.' },
  { icon: LuCalculator, title: 'Honest numbers', text: 'Price, size and price per m² up front, so you can compare listings properly.' },
  { icon: LuMapPin, title: 'Built in Serbia', text: 'Made by people who have been through the apartment hunt here themselves.' },
];

const FAQ = [
  { q: 'Is OglasiStan really free?', a: 'Yes. Creating an account, posting listings and contacting owners are all free. We don’t charge commission on any deal.' },
  { q: 'How do I contact an owner?', a: 'Open any listing, sign in, and write a message in the contact box. It’s delivered to the owner by email, and their reply comes straight back to you.' },
  { q: 'How many photos can I upload?', a: 'Up to 15 photos per listing. The first one becomes the cover — you can change it any time.' },
  { q: 'Can I edit or remove my listing?', a: 'Of course. Go to your profile, find the listing and hit Edit or Delete. Changes go live instantly.' },
  { q: 'Do you work with agencies?', a: 'OglasiStan is built for owners and private sellers first. Anyone with a registered account can post, but the platform never takes a cut.' },
];

function FaqItem({ q, a, open, onToggle }) {
  return (
    <div className='border-b border-line'>
      <button
        type='button'
        onClick={onToggle}
        aria-expanded={open}
        className='flex w-full items-center justify-between gap-6 py-6 text-left'
      >
        <span className={`font-display text-lg font-semibold tracking-tight transition-colors sm:text-xl ${open ? 'text-accent' : 'text-ink'}`}>{q}</span>
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-300 ${open ? 'rotate-45 border-accent bg-accent text-white' : 'border-ink/20 text-muted'}`}>
          <LuPlus className='h-4 w-4' />
        </span>
      </button>
      <div className={`grid transition-all duration-500 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className='overflow-hidden'>
          <p className='max-w-2xl pb-6 leading-relaxed text-muted'>{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const location = useLocation();
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  }, [location.hash]);

  return (
    <div className='overflow-x-clip'>
      {/* Hero */}
      <section className='noise relative overflow-hidden border-b border-line'>
        <div className='absolute -right-32 -top-40 h-[32rem] w-[32rem] animate-drift rounded-full bg-accent/20 blur-[120px]' />
        <div className='bg-grid mask-fade-b absolute inset-0' />
        <div className='container-x relative pb-20 pt-20 sm:pb-28 sm:pt-28'>
          <p className='eyebrow mb-8 animate-fade-up'><span className='h-px w-6 bg-accent' />About OglasiStan</p>
          <h1 className='h-display max-w-5xl leading-[0.92]' style={{ fontSize: 'clamp(2.8rem, 8vw, 7rem)' }}>
            <DecryptedText
              text='We’re fixing how Serbia'
              animateOn='view'
              sequential
              speed={28}
              revealDirection='start'
              encryptedClassName='text-accent/70'
            />
            <br />
            <span className='accent-italic'>finds a home.</span>
          </h1>
          <p className='mt-8 max-w-2xl animate-fade-up text-lg leading-relaxed text-muted' style={{ animationDelay: '300ms' }}>
            OglasiStan.com is a free marketplace for buying, selling and renting property — with no agents in the middle and no commission at the end.
          </p>
        </div>
      </section>

      {/* Misija */}
      <section className='container-x grid gap-12 py-24 sm:py-32 lg:grid-cols-2 lg:gap-20'>
        <FadeContent blur={10} duration={1}>
          <p className='eyebrow mb-6'><span className='h-px w-6 bg-accent' />Our mission</p>
          <p className='h-display text-3xl leading-tight sm:text-5xl'>
            “Finding a place to live shouldn’t cost you a month’s rent in fees.”
          </p>
        </FadeContent>
        <FadeContent blur={10} duration={1} delay={0.15} className='space-y-6 text-lg leading-relaxed text-muted'>
          <p>
            We started OglasiStan with one goal: make finding property fast, transparent and free. No hidden fees, no agents who never call back, no endless forms.
          </p>
          <p>
            Owners post in minutes. Buyers and renters see the real numbers — price, size, floor and price per m² — and message the owner directly. That’s the whole idea.
          </p>
          <div className='flex flex-wrap gap-3 pt-2'>
            <Link to='/search' className='btn-primary'>Browse listings <LuArrowRight className='h-4 w-4' /></Link>
            <Link to='/create-listing' className='btn-ghost'>Post a listing</Link>
          </div>
        </FadeContent>
      </section>

      {/* Vrednosti */}
      <section className='border-y border-line bg-card/50'>
        <div className='container-x py-24 sm:py-32'>
          <SectionHeading eyebrow='What we stand for' title='Four rules.' accent='No exceptions.' />
          <FadeContent stagger={0.1} blur={6} className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {VALUES.map(({ icon: Icon, title, text }, i) => (
              <SpotlightCard
                key={title}
                className='h-full rounded-3xl p-7'
                style={{ '--spotlight-card-surface': '#FDF9F4' }}
                spotlightColor='rgba(224, 123, 42, 0.14)'
                theme="light"
              >
                <p className='font-sans text-xs text-dim'>0{i + 1}</p>
                <span className='mb-6 mt-10 grid h-12 w-12 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent'>
                  <Icon className='h-5 w-5' />
                </span>
                <h3 className='h-display text-2xl'>{title}</h3>
                <p className='mt-3 text-sm leading-relaxed text-muted'>{text}</p>
              </SpotlightCard>
            ))}
          </FadeContent>
        </div>
      </section>

      {/* FAQ */}
      <section id='faq' className='container-x scroll-mt-28 py-24 sm:py-32'>
        <div className='grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20'>
          <div>
            <SectionHeading eyebrow='FAQ' title='Questions,' accent='answered.' description='Still unsure about something? Here’s what people ask us most.' />
          </div>
          <div className='border-t border-line'>
            {FAQ.map((item, i) => (
              <FaqItem key={item.q} {...item} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
