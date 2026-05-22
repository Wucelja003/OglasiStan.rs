import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PLACEHOLDER = 'https://placehold.co/800x500/F2EDE3/B5AFA5?text=Nema+slike';

function IconPin() {
  return (
    <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <path strokeLinecap='round' strokeLinejoin='round' d='M15 10.5a3 3 0 11-6 0 3 3 0 016 0z' />
      <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z' />
    </svg>
  );
}

export default function Listing() {
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const [listing, setListing] = useState(null);
  const [landlord, setLandlord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${id}`);
        const data = await res.json();
        if (data.success === false) { setError(true); setLoading(false); return; }
        setListing(data);
        setLoading(false);
        // Fetch landlord info
        const userRes = await fetch(`/api/user/${data.userRef}`);
        const userData = await userRes.json();
        if (!userData.success) setLandlord(userData);
      } catch {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const images = listing?.imagesUrls?.length > 0 ? listing.imagesUrls : [PLACEHOLDER];

  const prevImg = () => setActiveImg((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImg = () => setActiveImg((i) => (i === images.length - 1 ? 0 : i + 1));

  if (loading) return (
    <div className='min-h-screen flex items-center justify-center' style={{ background: '#FAF7F2' }}>
      <div className='flex flex-col items-center gap-3'>
        <div className='w-10 h-10 rounded-full border-4 border-t-transparent animate-spin' style={{ borderColor: '#DDD7CC', borderTopColor: '#E07B2A' }} />
        <p className='text-sm' style={{ color: '#6B6158' }}>Učitavanje oglasa...</p>
      </div>
    </div>
  );

  if (error || !listing) return (
    <div className='min-h-screen flex items-center justify-center' style={{ background: '#FAF7F2' }}>
      <div className='text-center'>
        <p className='text-xl font-bold mb-2' style={{ color: '#1A1612' }}>Oglas nije pronađen</p>
        <Link to='/' className='text-sm' style={{ color: '#E07B2A' }}>Nazad na početnu</Link>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen' style={{ background: '#FAF7F2' }}>
      <div className='max-w-4xl mx-auto px-4 py-8'>

        {/* ── TIP BADGE + NASLOV ── */}
        <div className='mb-4'>
          <span
            className='inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3'
            style={
              listing.type === 'prodaja'
                ? { background: '#221E1A', color: 'white' }
                : { background: '#E07B2A', color: 'white' }
            }
          >
            {listing.type === 'prodaja' ? 'Prodaja' : 'Izdavanje'}
          </span>
          <h1 className='text-2xl sm:text-3xl font-extrabold' style={{ color: '#1A1612' }}>
            {listing.name}
          </h1>
          <div className='flex items-center gap-1 mt-2' style={{ color: '#6B6158' }}>
            <IconPin />
            <span className='text-sm'>{listing.address}</span>
          </div>
        </div>

        {/* ── GALERIJA ── */}
        <div className='rounded-2xl overflow-hidden mb-6 shadow-md' style={{ border: '1px solid #DDD7CC' }}>
          {/* Glavna slika */}
          <div className='relative' style={{ aspectRatio: '16/9', background: '#F2EDE3' }}>
            <img
              src={images[activeImg]}
              alt={`slika-${activeImg}`}
              className='w-full h-full object-cover'
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImg}
                  className='absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-150'
                  style={{ background: 'rgba(253,249,244,0.92)' }}
                >
                  <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='#1A1612' strokeWidth={2.5}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                  </svg>
                </button>
                <button
                  onClick={nextImg}
                  className='absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-150'
                  style={{ background: 'rgba(253,249,244,0.92)' }}
                >
                  <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='#1A1612' strokeWidth={2.5}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
                <div className='absolute bottom-3 right-3 text-xs font-semibold px-2 py-1 rounded-lg' style={{ background: 'rgba(26,22,18,0.6)', color: 'white' }}>
                  {activeImg + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className='flex gap-2 p-3 overflow-x-auto' style={{ background: '#FDF9F4' }}>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className='flex-shrink-0 rounded-xl overflow-hidden transition-all duration-150'
                  style={{
                    width: 72, height: 52,
                    outline: i === activeImg ? '2.5px solid #E07B2A' : '2px solid transparent',
                    opacity: i === activeImg ? 1 : 0.6,
                  }}
                >
                  <img src={img} alt={`thumb-${i}`} className='w-full h-full object-cover' />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>

          {/* ── LIJEVA KOLONA: info ── */}
          <div className='sm:col-span-2 flex flex-col gap-5'>

            {/* Specifikacije */}
            <div className='rounded-2xl p-5' style={{ background: '#FDF9F4', border: '1px solid #DDD7CC' }}>
              <h2 className='text-sm font-bold uppercase tracking-wider mb-4' style={{ color: '#B5AFA5' }}>Specifikacije</h2>
              <div className='flex flex-col gap-3'>
                {[
                  { label: 'Broj soba', value: listing.bedrooms },
                  { label: 'Broj kupatila', value: listing.bathrooms },
                  { label: 'Parking', value: listing.parking ? 'Da' : 'Ne' },
                  { label: 'Namešten', value: listing.furnished ? 'Da' : 'Ne' },
                ].map(({ label, value }) => (
                  <div key={label} className='flex justify-between items-center py-2' style={{ borderBottom: '1px solid #F2EDE3' }}>
                    <span className='text-sm' style={{ color: '#6B6158' }}>{label}</span>
                    <span className='text-sm font-semibold' style={{ color: '#1A1612' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Opis */}
            <div className='rounded-2xl p-5' style={{ background: '#FDF9F4', border: '1px solid #DDD7CC' }}>
              <h2 className='text-sm font-bold uppercase tracking-wider mb-3' style={{ color: '#B5AFA5' }}>Opis</h2>
              <p className='text-sm leading-relaxed whitespace-pre-line' style={{ color: '#6B6158' }}>
                {listing.description}
              </p>
            </div>
          </div>

          {/* ── DESNA KOLONA: cijena + kontakt ── */}
          <div className='flex flex-col gap-4'>

            {/* Cijena */}
            <div className='rounded-2xl p-5 text-center' style={{ background: '#221E1A', border: '1px solid #221E1A' }}>
              <p className='text-xs font-semibold uppercase tracking-widest mb-1' style={{ color: 'rgba(255,255,255,0.45)' }}>
                {listing.type === 'izdavanje' ? 'Cijena / mj.' : 'Prodajna cijena'}
              </p>
              <p className='text-3xl font-extrabold' style={{ color: '#E07B2A' }}>
                {listing.regularPrice.toLocaleString('sr-RS')} €
              </p>
              {listing.type === 'izdavanje' && (
                <p className='text-xs mt-1' style={{ color: 'rgba(255,255,255,0.35)' }}>mjesečno</p>
              )}
            </div>

            {/* Kontakt */}
            {currentUser && currentUser._id !== listing.userRef && landlord && (
              <div className='rounded-2xl p-5' style={{ background: '#FDF9F4', border: '1px solid #DDD7CC' }}>
                <h2 className='text-sm font-bold uppercase tracking-wider mb-1' style={{ color: '#B5AFA5' }}>Kontakt</h2>

                {/* Landlord info */}
                <div className='flex items-center gap-3 mb-4 mt-3 pb-4' style={{ borderBottom: '1px solid #F2EDE3' }}>
                  <img
                    src={landlord.avatar}
                    alt={landlord.username}
                    className='w-10 h-10 rounded-full object-cover flex-shrink-0'
                    style={{ border: '2px solid #DDD7CC' }}
                  />
                  <div>
                    <p className='text-sm font-semibold' style={{ color: '#1A1612' }}>{landlord.username}</p>
                    <p className='text-xs' style={{ color: '#B5AFA5' }}>{landlord.email}</p>
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={`Zainteresovan sam za "${listing.name}"...`}
                  className='w-full rounded-xl px-3 py-2 text-sm outline-none resize-none mb-3 transition-all duration-200'
                  style={{ background: '#F2EDE3', border: '1px solid #DDD7CC', color: '#1A1612' }}
                  onFocus={e => { e.target.style.border = '1.5px solid #E07B2A'; e.target.style.boxShadow = '0 0 0 3px rgba(224,123,42,0.15)'; }}
                  onBlur={e => { e.target.style.border = '1px solid #DDD7CC'; e.target.style.boxShadow = 'none'; }}
                />

                <a
                  href={`mailto:${landlord.email}?subject=Upit za oglas: ${listing.name}&body=${encodeURIComponent(message)}`}
                  className='w-full py-2.5 rounded-xl text-sm font-semibold text-white text-center transition-all duration-200 block'
                  style={{
                    background: message.trim() ? '#E07B2A' : '#DDD7CC',
                    pointerEvents: message.trim() ? 'auto' : 'none',
                  }}
                  onMouseEnter={e => { if (message.trim()) e.currentTarget.style.background = '#C45F12'; }}
                  onMouseLeave={e => { if (message.trim()) e.currentTarget.style.background = '#E07B2A'; }}
                >
                  Pošalji poruku
                </a>
              </div>
            )}

            {/* Vlasnik oglasa */}
            {currentUser && currentUser._id === listing.userRef && (
              <Link
                to={`/edit-listing/${listing._id}`}
                className='w-full py-2.5 rounded-xl text-sm font-semibold text-center text-white transition-all duration-200 block'
                style={{ background: '#E07B2A' }}
              >
                Uredi oglas
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
