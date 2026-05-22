import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const PLACEHOLDER = 'https://placehold.co/400x260/F2EDE3/B5AFA5?text=Nema+slike';

function ListingCard({ listing }) {
  const img = listing.imagesUrls?.[0] || PLACEHOLDER;
  return (
    <Link to={`/listing/${listing._id}`} className='block group rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1'
      style={{ background: '#FDF9F4', border: '1px solid #DDD7CC', boxShadow: '0 1px 4px rgba(26,22,18,0.06)' }}>
      {/* Slika */}
      <div className='relative overflow-hidden' style={{ aspectRatio: '3/2', background: '#F2EDE3' }}>
        <img src={img} alt={listing.name} className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105' />
        <span
          className='absolute top-3 left-3 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full'
          style={listing.type === 'prodaja'
            ? { background: '#221E1A', color: 'white' }
            : { background: '#E07B2A', color: 'white' }}
        >
          {listing.type === 'prodaja' ? 'Prodaja' : 'Izdavanje'}
        </span>
      </div>

      {/* Info */}
      <div className='p-4'>
        <h3 className='font-semibold text-sm mb-1 truncate' style={{ color: '#1A1612' }}>{listing.name}</h3>
        <p className='text-xs mb-3 truncate flex items-center gap-1' style={{ color: '#B5AFA5' }}>
          <svg className='w-3 h-3 flex-shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z' />
          </svg>
          {listing.address}
        </p>

        <div className='flex items-center justify-between'>
          <p className='font-extrabold text-base' style={{ color: '#E07B2A' }}>
            {listing.regularPrice.toLocaleString('sr-RS')} €
            {listing.type === 'izdavanje' && <span className='text-xs font-normal' style={{ color: '#B5AFA5' }}>/mj</span>}
          </p>
          <div className='flex items-center gap-3 text-xs' style={{ color: '#6B6158' }}>
            <span>{listing.bedrooms} sobe</span>
            <span style={{ color: '#DDD7CC' }}>·</span>
            <span>{listing.bathrooms} kup.</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

const DEFAULT_FILTERS = {
  searchTerm: '', type: 'sve', furnished: false, parking: false,
  bedrooms: '', bathrooms: '', minPrice: '', maxPrice: '',
  sort: 'createdAt', order: 'desc',
};

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const LIMIT = 9;

  // Parse URL params into filters on load / URL change
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setFilters({
      searchTerm: p.get('searchTerm') || '',
      type: p.get('type') || 'sve',
      furnished: p.get('furnished') === 'true',
      parking: p.get('parking') === 'true',
      bedrooms: p.get('bedrooms') || '',
      bathrooms: p.get('bathrooms') || '',
      minPrice: p.get('minPrice') || '',
      maxPrice: p.get('maxPrice') || '',
      sort: p.get('sort') || 'createdAt',
      order: p.get('order') || 'desc',
    });
    setStartIndex(0);
  }, [location.search]);

  // Fetch when filters or startIndex change
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const p = new URLSearchParams();
        Object.entries(filters).forEach(([k, v]) => { if (v !== '' && v !== false && v !== 'sve') p.set(k, v); });
        p.set('limit', LIMIT);
        p.set('startIndex', startIndex);

        const res = await fetch(`/api/listing/search?${p.toString()}`);
        const data = await res.json();
        if (startIndex === 0) setListings(data.listings || []);
        else setListings(prev => [...prev, ...(data.listings || [])]);
        setTotal(data.total || 0);
      } catch {
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [filters, startIndex]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v !== '' && v !== false && v !== 'sve') p.set(k, v); });
    navigate(`/search?${p.toString()}`);
    setStartIndex(0);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    navigate('/search');
  };

  const inputClass = 'w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-all duration-200';
  const inputStyle = { background: '#F2EDE3', border: '1px solid #DDD7CC', color: '#1A1612' };
  const focusStyle = { border: '1.5px solid #E07B2A', boxShadow: '0 0 0 3px rgba(224,123,42,0.12)' };
  const blurStyle = { border: '1px solid #DDD7CC', boxShadow: 'none' };
  const labelStyle = { color: '#6B6158', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 4 };

  return (
    <div className='min-h-screen' style={{ background: '#FAF7F2' }}>
      <div className='max-w-6xl mx-auto px-4 py-8'>
        <div className='flex flex-col lg:flex-row gap-6'>

          {/* ── FILTERI (lijeva kolona) ── */}
          <aside className='w-full lg:w-72 flex-shrink-0'>
            <form onSubmit={handleSubmit} className='rounded-2xl p-5 sticky top-6' style={{ background: '#FDF9F4', border: '1px solid #DDD7CC' }}>
              <div className='flex items-center justify-between mb-5'>
                <h2 className='font-bold text-base' style={{ color: '#1A1612' }}>Filteri</h2>
                <button type='button' onClick={handleReset} className='text-xs font-medium transition-colors'
                  style={{ color: '#B5AFA5' }}
                  onMouseEnter={e => e.target.style.color = '#E07B2A'}
                  onMouseLeave={e => e.target.style.color = '#B5AFA5'}>
                  Resetuj
                </button>
              </div>

              <div className='flex flex-col gap-4'>

                {/* Pretraga */}
                <div>
                  <label style={labelStyle}>Pretraga</label>
                  <input name='searchTerm' value={filters.searchTerm} onChange={handleFilterChange}
                    type='text' placeholder='Naziv, adresa...'
                    className={inputClass} style={inputStyle}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e => Object.assign(e.target.style, blurStyle)} />
                </div>

                {/* Tip */}
                <div>
                  <label style={labelStyle}>Tip oglasa</label>
                  <div className='grid grid-cols-3 gap-1.5'>
                    {[['sve', 'Sve'], ['prodaja', 'Prodaja'], ['izdavanje', 'Iznajm.']].map(([val, lab]) => (
                      <button key={val} type='button' onClick={() => setFilters(p => ({ ...p, type: val }))}
                        className='py-2 rounded-xl text-xs font-semibold transition-all duration-150'
                        style={filters.type === val
                          ? { background: '#E07B2A', color: 'white' }
                          : { background: '#F2EDE3', color: '#6B6158', border: '1px solid #DDD7CC' }}>
                        {lab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cijena */}
                <div>
                  <label style={labelStyle}>Cijena (€)</label>
                  <div className='flex gap-2'>
                    <input name='minPrice' value={filters.minPrice} onChange={handleFilterChange}
                      type='number' placeholder='Od' min={0}
                      className={inputClass} style={inputStyle}
                      onFocus={e => Object.assign(e.target.style, focusStyle)}
                      onBlur={e => Object.assign(e.target.style, blurStyle)} />
                    <input name='maxPrice' value={filters.maxPrice} onChange={handleFilterChange}
                      type='number' placeholder='Do' min={0}
                      className={inputClass} style={inputStyle}
                      onFocus={e => Object.assign(e.target.style, focusStyle)}
                      onBlur={e => Object.assign(e.target.style, blurStyle)} />
                  </div>
                </div>

                {/* Sobe / Kupatila */}
                <div className='grid grid-cols-2 gap-2'>
                  <div>
                    <label style={labelStyle}>Min. sobe</label>
                    <input name='bedrooms' value={filters.bedrooms} onChange={handleFilterChange}
                      type='number' placeholder='Npr. 2' min={1}
                      className={inputClass} style={inputStyle}
                      onFocus={e => Object.assign(e.target.style, focusStyle)}
                      onBlur={e => Object.assign(e.target.style, blurStyle)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Min. kupatila</label>
                    <input name='bathrooms' value={filters.bathrooms} onChange={handleFilterChange}
                      type='number' placeholder='Npr. 1' min={1}
                      className={inputClass} style={inputStyle}
                      onFocus={e => Object.assign(e.target.style, focusStyle)}
                      onBlur={e => Object.assign(e.target.style, blurStyle)} />
                  </div>
                </div>

                {/* Checkbox filteri */}
                <div className='flex flex-col gap-2'>
                  {[
                    { name: 'furnished', label: 'Namešten' },
                    { name: 'parking', label: 'Parking' },
                  ].map(({ name, label }) => (
                    <label key={name} className='flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-all'
                      style={{ background: filters[name] ? 'rgba(224,123,42,0.08)' : '#F2EDE3', border: filters[name] ? '1px solid rgba(224,123,42,0.4)' : '1px solid #DDD7CC' }}>
                      <div className='w-5 h-5 rounded flex items-center justify-center flex-shrink-0'
                        style={{ background: filters[name] ? '#E07B2A' : 'white', border: filters[name] ? 'none' : '1px solid #DDD7CC' }}>
                        {filters[name] && (
                          <svg className='w-3 h-3' fill='none' viewBox='0 0 24 24' stroke='white' strokeWidth={3}>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                          </svg>
                        )}
                      </div>
                      <input type='checkbox' name={name} checked={filters[name]} onChange={handleFilterChange} className='hidden' />
                      <span className='text-sm' style={{ color: '#1A1612' }}>{label}</span>
                    </label>
                  ))}
                </div>

                {/* Sortiranje */}
                <div>
                  <label style={labelStyle}>Sortiraj po</label>
                  <select name='sort' value={`${filters.sort}_${filters.order}`}
                    onChange={e => {
                      const [s, o] = e.target.value.split('_');
                      setFilters(p => ({ ...p, sort: s, order: o }));
                    }}
                    className={inputClass + ' cursor-pointer'} style={inputStyle}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e => Object.assign(e.target.style, blurStyle)}>
                    <option value='createdAt_desc'>Najnovije</option>
                    <option value='createdAt_asc'>Najstarije</option>
                    <option value='regularPrice_asc'>Cijena: rastuće</option>
                    <option value='regularPrice_desc'>Cijena: opadajuće</option>
                  </select>
                </div>

                <button type='submit'
                  className='w-full py-3 rounded-xl font-bold text-sm text-white uppercase tracking-wide transition-all duration-200'
                  style={{ background: '#221E1A' }}
                  onMouseEnter={e => e.target.style.background = '#E07B2A'}
                  onMouseLeave={e => e.target.style.background = '#221E1A'}>
                  Pretraži
                </button>
              </div>
            </form>
          </aside>

          {/* ── REZULTATI (desna kolona) ── */}
          <div className='flex-1'>
            {/* Header rezultata */}
            <div className='flex items-center justify-between mb-5'>
              <p className='text-sm' style={{ color: '#6B6158' }}>
                {loading ? 'Pretraživanje...' : (
                  total === 0 ? 'Nema rezultata' : `${total} oglas${total === 1 ? '' : total < 5 ? 'a' : 'a'} pronađeno`
                )}
              </p>
            </div>

            {/* Grid */}
            {!loading && listings.length === 0 && (
              <div className='text-center py-20 rounded-2xl' style={{ background: '#FDF9F4', border: '1px solid #DDD7CC' }}>
                <p className='text-2xl mb-2'>🏠</p>
                <p className='font-semibold mb-1' style={{ color: '#1A1612' }}>Nema rezultata</p>
                <p className='text-sm' style={{ color: '#B5AFA5' }}>Pokušajte sa drugačijim filterima</p>
              </div>
            )}

            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
              {listings.map(l => <ListingCard key={l._id} listing={l} />)}
            </div>

            {/* Loading skeleton */}
            {loading && listings.length === 0 && (
              <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className='rounded-2xl overflow-hidden animate-pulse' style={{ background: '#FDF9F4', border: '1px solid #DDD7CC' }}>
                    <div style={{ aspectRatio: '3/2', background: '#F2EDE3' }} />
                    <div className='p-4 flex flex-col gap-2'>
                      <div className='h-4 rounded-lg w-3/4' style={{ background: '#F2EDE3' }} />
                      <div className='h-3 rounded-lg w-1/2' style={{ background: '#F2EDE3' }} />
                      <div className='h-5 rounded-lg w-1/3 mt-1' style={{ background: '#F2EDE3' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load more */}
            {listings.length < total && (
              <div className='text-center mt-8'>
                <button
                  onClick={() => setStartIndex(prev => prev + LIMIT)}
                  disabled={loading}
                  className='px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50'
                  style={{ background: '#FDF9F4', border: '1px solid #DDD7CC', color: '#1A1612' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#E07B2A'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#E07B2A'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#FDF9F4'; e.currentTarget.style.color = '#1A1612'; e.currentTarget.style.borderColor = '#DDD7CC'; }}>
                  {loading ? 'Učitavanje...' : `Prikaži još (${total - listings.length})`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
