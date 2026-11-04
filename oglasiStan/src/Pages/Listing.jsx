import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LuArrowLeft, LuChevronLeft, LuChevronRight, LuMapPin, LuRuler, LuBedDouble, LuBath, LuBuilding2,
  LuCalculator, LuCheck, LuX, LuSend, LuPencil, LuLink, LuHouse, LuFlame, LuLogIn,
} from 'react-icons/lu';
import { optimizeImg } from '../utils/img';
import { formatPrice, pricePerM2, typeLabel, isRent, floorLabel, getInitials } from '../utils/format';

const QUICK_MESSAGES = ['Is it still available?', 'Can I book a viewing?', 'Is the price negotiable?'];

function Gallery({ images, name }) {
  const [active, setActive] = useState(0);
  const touchX = useRef(null);
  const count = images.length;

  const go = (dir) => setActive((i) => (i + dir + count) % count);

  useEffect(() => {
    const onKey = (e) => {
      if (count < 2) return;
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  if (count === 0) {
    return (
      <div className='bg-grid grid aspect-[16/9] place-items-center rounded-3xl border border-line bg-card'>
        <LuHouse className='h-14 w-14 text-ink/10' />
      </div>
    );
  }

  return (
    <div>
      <div
        className='group relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-card sm:aspect-[16/9]'
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        <div
          className='flex h-full'
          style={{ transform: `translateX(-${active * 100}%)`, transition: 'transform 0.7s cubic-bezier(0.65, 0, 0.35, 1)', willChange: 'transform' }}
        >
          {images.map((img, i) => (
            <img
              key={i}
              src={optimizeImg(img, 1400)}
              alt={`${name} — photo ${i + 1}`}
              draggable={false}
              loading={i === 0 ? 'eager' : 'lazy'}
              className='h-full w-full shrink-0 select-none object-cover'
            />
          ))}
        </div>

        <div className='pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent' />

        {count > 1 && (
          <>
            {[[-1, LuChevronLeft, 'left-4'], [1, LuChevronRight, 'right-4']].map(([dir, Icon, pos]) => (
              <button
                key={dir}
                type='button'
                onClick={() => go(dir)}
                aria-label={dir < 0 ? 'Previous photo' : 'Next photo'}
                className={`absolute ${pos} top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-cream/85 text-ink backdrop-blur-md transition-all hover:scale-110 hover:border-accent hover:bg-accent hover:text-white sm:opacity-0 sm:group-hover:opacity-100`}
              >
                <Icon className='h-5 w-5' />
              </button>
            ))}

            <div className='absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1.5'>
              {images.map((_, i) => (
                <button
                  key={i}
                  type='button'
                  onClick={() => setActive(i)}
                  aria-label={`Show photo ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? 'w-7 bg-accent' : 'w-1.5 bg-white/50 hover:bg-white'}`}
                />
              ))}
            </div>
            <p className='absolute bottom-4 right-5 font-sans text-xs text-white/80'>
              {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </p>
          </>
        )}
      </div>

      {count > 1 && (
        <div className='mt-3 flex gap-2 overflow-x-auto pb-1'>
          {images.map((img, i) => (
            <button
              key={i}
              type='button'
              onClick={() => setActive(i)}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl transition-all duration-300 ${
                i === active ? 'opacity-100 ring-2 ring-accent ring-offset-2 ring-offset-cream' : 'opacity-40 hover:opacity-80'
              }`}
            >
              <img src={optimizeImg(img, 200)} alt='' loading='lazy' className='h-full w-full object-cover' />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Fact({ icon: Icon, label, value, accent }) {
  return (
    <div className='rounded-2xl border border-line bg-card p-5'>
      <Icon className={`h-5 w-5 ${accent ? 'text-accent' : 'text-dim'}`} />
      <p className={`mt-4 font-display text-2xl font-bold tracking-tight ${accent ? 'text-accent' : 'text-ink'}`}>{value}</p>
      <p className='mt-0.5 font-sans text-[11px] uppercase tracking-[0.16em] text-dim'>{label}</p>
    </div>
  );
}

export default function Listing() {
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const [listing, setListing] = useState(null);
  const [landlord, setLandlord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);
  const [sendError, setSendError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${id}`);
        const data = await res.json();
        if (data.success === false) { setError(true); setLoading(false); return; }
        setListing(data);
        setLoading(false);
        const userRes = await fetch(`/api/user/${data.userRef}`);
        const userData = await userRes.json();
        if (userData.success !== false) setLandlord(userData);
      } catch {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
    window.scrollTo(0, 0);
  }, [id]);

  const handleSendMessage = async () => {
    if (!message.trim() || sending) return;
    try {
      setSending(true);
      setSendStatus(null);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ listingId: listing._id, message }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        setSendStatus('error');
        setSendError(data.message || 'Something went wrong.');
      } else {
        setSendStatus('success');
        setMessage('');
      }
    } catch {
      setSendStatus('error');
      setSendError('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard nije dostupan */ }
  };

  if (loading) {
    return (
      <div className='container-x py-10'>
        <div className='mb-8 h-12 w-2/3 animate-pulse rounded-xl bg-sand' />
        <div className='aspect-[16/9] animate-pulse rounded-3xl bg-card' />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className='container-x flex min-h-[70vh] flex-col items-center justify-center text-center'>
        <p className='font-display text-[8rem] font-bold leading-none tracking-tightest text-ink/10'>404</p>
        <h1 className='h-display -mt-6 text-3xl'>This listing is gone.</h1>
        <p className='mt-3 text-muted'>It may have been sold, rented or removed by the owner.</p>
        <Link to='/search' className='btn-primary mt-8'>Browse other listings</Link>
      </div>
    );
  }

  const perM2 = pricePerM2(listing.regularPrice, listing.area);
  const isOwner = currentUser && currentUser._id === listing.userRef;
  const amenities = [
    { label: 'Parking', value: listing.parking },
    { label: 'Furnished', value: listing.furnished },
    { label: 'Terrace', value: listing.terrace },
  ];

  return (
    <div className='container-x pb-24 pt-8'>
      <Link to='/search' className='group mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink'>
        <LuArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-1' /> Back to listings
      </Link>

      {/* Naslov */}
      <div className='mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
        <div className='animate-fade-up'>
          <span className={`mb-5 inline-block rounded-full px-3 py-1 font-sans text-[11px] uppercase tracking-[0.16em] ${
            isRent(listing.type) ? 'bg-accent text-white' : 'border border-ink/20 text-ink'
          }`}>
            {typeLabel(listing.type)}
          </span>
          <h1 className='h-display max-w-4xl text-4xl leading-[0.95] sm:text-6xl'>{listing.name}</h1>
          <p className='mt-4 flex items-center gap-2 text-muted'>
            <LuMapPin className='h-4 w-4 text-accent' /> {listing.address}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <button type='button' onClick={copyLink} className='btn-ghost'>
            {copied ? <><LuCheck className='h-4 w-4 text-emerald-600' /> Copied</> : <><LuLink className='h-4 w-4' /> Share</>}
          </button>
          {isOwner && (
            <Link to={`/edit-listing/${listing._id}`} className='btn-primary'>
              <LuPencil className='h-4 w-4' /> Edit listing
            </Link>
          )}
        </div>
      </div>

      <Gallery images={listing.imagesUrls || []} name={listing.name} />

      <div className='mt-10 grid gap-10 lg:grid-cols-[1fr_400px]'>
        {/* Levo */}
        <div className='min-w-0 space-y-10'>
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
            {listing.area > 0 && <Fact icon={LuRuler} label='Living area' value={`${listing.area} m²`} />}
            {perM2 && <Fact icon={LuCalculator} label='Price per m²' value={formatPrice(perM2)} accent />}
            <Fact icon={LuBedDouble} label='Bedrooms' value={listing.bedrooms} />
            <Fact icon={LuBath} label='Bathrooms' value={listing.bathrooms} />
            <Fact icon={LuBuilding2} label='Floor' value={floorLabel(listing.floor)} />
            {listing.heating && <Fact icon={LuFlame} label='Heating' value={listing.heating} />}
          </div>

          <div>
            <p className='eyebrow mb-5'><span className='h-px w-6 bg-accent' />About this place</p>
            <p className='whitespace-pre-line text-lg leading-relaxed text-ink/80'>{listing.description}</p>
          </div>

          <div>
            <p className='eyebrow mb-5'><span className='h-px w-6 bg-accent' />Amenities</p>
            <div className='grid gap-3 sm:grid-cols-3'>
              {amenities.map(({ label, value }) => (
                <div
                  key={label}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-sm ${
                    value ? 'border-accent/30 bg-accent/[0.07] text-ink' : 'border-line text-dim line-through decoration-white/20'
                  }`}
                >
                  <span className={`grid h-6 w-6 place-items-center rounded-full ${value ? 'bg-accent text-white' : 'bg-sand/60'}`}>
                    {value ? <LuCheck className='h-3.5 w-3.5' strokeWidth={3} /> : <LuX className='h-3.5 w-3.5' />}
                  </span>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desno — cena + kontakt */}
        <aside className='space-y-4 lg:sticky lg:top-28 lg:self-start'>
          <div className='noise relative overflow-hidden rounded-3xl border border-accent/25 bg-gradient-to-br from-accent/[0.15] via-card to-card p-7'>
            <p className='font-sans text-[11px] uppercase tracking-[0.18em] text-muted'>
              {isRent(listing.type) ? 'Monthly rent' : 'Asking price'}
            </p>
            <p className='mt-2 font-display text-5xl font-bold tracking-tightest text-ink'>
              {formatPrice(listing.regularPrice)}
              {isRent(listing.type) && <span className='ml-1 text-xl font-medium text-muted'>/mo</span>}
            </p>
            {perM2 && <p className='mt-2 font-sans text-sm text-accent'>{formatPrice(perM2)} per m²</p>}
          </div>

          {!isOwner && (
            <div className='panel p-7'>
              {landlord && (
                <div className='mb-6 flex items-center gap-3 border-b border-line pb-6'>
                  <span className='grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-deep font-display text-sm font-bold text-white'>
                    {getInitials(landlord.username)}
                  </span>
                  <div className='min-w-0'>
                    <p className='truncate font-semibold text-ink'>{landlord.username}</p>
                    <p className='text-xs text-muted'>Listing owner</p>
                  </div>
                </div>
              )}

              {!currentUser ? (
                <div className='text-center'>
                  <p className='h-display text-xl'>Interested?</p>
                  <p className='mt-2 text-sm text-muted'>Sign in to message the owner directly.</p>
                  <Link to='/sign-in' className='btn-primary mt-5 w-full'><LuLogIn className='h-4 w-4' /> Sign in to contact</Link>
                </div>
              ) : sendStatus === 'success' ? (
                <div className='py-4 text-center'>
                  <span className='mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600'>
                    <LuCheck className='h-7 w-7' strokeWidth={3} />
                  </span>
                  <p className='h-display mt-4 text-xl'>Message sent!</p>
                  <p className='mt-2 text-sm text-muted'>The owner will reply straight to your email.</p>
                  <button type='button' onClick={() => setSendStatus(null)} className='btn-ghost mt-5'>Send another</button>
                </div>
              ) : (
                <>
                  <p className='label'>Message the owner</p>
                  <div className='mb-3 flex flex-wrap gap-1.5'>
                    {QUICK_MESSAGES.map((q) => (
                      <button key={q} type='button' onClick={() => setMessage(q)} className='chip hover:border-accent/50 hover:text-ink'>
                        {q}
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={4}
                    maxLength={2000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Hi! I'm interested in “${listing.name}”…`}
                    className='input resize-none'
                  />
                  <button
                    type='button'
                    onClick={handleSendMessage}
                    disabled={!message.trim() || sending}
                    className='btn-primary mt-3 w-full !py-3.5'
                  >
                    {sending ? 'Sending…' : <><LuSend className='h-4 w-4' /> Send message</>}
                  </button>
                  {sendStatus === 'error' && (
                    <p className='mt-3 text-center text-sm text-red-600'>{sendError}</p>
                  )}
                  <p className='mt-4 text-center text-xs text-dim'>Your email is shared with the owner so they can reply.</p>
                </>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
