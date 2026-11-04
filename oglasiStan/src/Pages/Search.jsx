import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LuSlidersHorizontal, LuX, LuCheck, LuSearchX, LuArrowDown, LuSearch } from 'react-icons/lu';
import ListingCard, { ListingCardSkeleton } from '../components/ListingCard';

const DEFAULT_FILTERS = {
  searchTerm: '', type: 'sve', furnished: false, parking: false, terrace: false,
  bedrooms: '', bathrooms: '', minPrice: '', maxPrice: '',
  sort: 'createdAt', order: 'desc',
};

const LIMIT = 9;

const toParams = (filters) => {
  const p = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== '' && v !== false && v !== 'sve') p.set(k, v);
  });
  return p;
};

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type='button'
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all ${
        checked ? 'border-accent/50 bg-accent/10 text-ink' : 'border-line bg-sand/60 text-muted hover:border-ink/20'
      }`}
    >
      {label}
      <span className={`grid h-5 w-5 place-items-center rounded-md transition-all ${checked ? 'bg-accent text-white' : 'border border-ink/20'}`}>
        {checked && <LuCheck className='h-3.5 w-3.5' strokeWidth={3} />}
      </span>
    </button>
  );
}

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setFilters({
      searchTerm: p.get('searchTerm') || '',
      type: p.get('type') || 'sve',
      furnished: p.get('furnished') === 'true',
      parking: p.get('parking') === 'true',
      terrace: p.get('terrace') === 'true',
      bedrooms: p.get('bedrooms') || '',
      bathrooms: p.get('bathrooms') || '',
      minPrice: p.get('minPrice') || '',
      maxPrice: p.get('maxPrice') || '',
      sort: p.get('sort') || 'createdAt',
      order: p.get('order') || 'desc',
    });
    setStartIndex(0);
  }, [location.search]);

  useEffect(() => {
    let cancelled = false;
    const fetchListings = async () => {
      setLoading(true);
      try {
        const p = toParams(filters);
        p.set('limit', LIMIT);
        p.set('startIndex', startIndex);
        const res = await fetch(`/api/listing/search?${p.toString()}`);
        const data = await res.json();
        if (cancelled) return;
        if (startIndex === 0) setListings(data.listings || []);
        else setListings((prev) => [...prev, ...(data.listings || [])]);
        setTotal(data.total || 0);
      } catch {
        if (!cancelled) setListings([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchListings();
    return () => { cancelled = true; };
  }, [filters, startIndex]);

  useEffect(() => {
    document.body.style.overflow = filtersOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [filtersOpen]);

  const set = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e?.preventDefault();
    navigate(`/search?${toParams(filters).toString()}`);
    setFiltersOpen(false);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    navigate('/search');
    setFiltersOpen(false);
  };

  const activeCount = ['furnished', 'parking', 'terrace'].filter((k) => filters[k]).length
    + ['bedrooms', 'bathrooms', 'minPrice', 'maxPrice'].filter((k) => filters[k]).length
    + (filters.type !== 'sve' ? 1 : 0);

  const heading = filters.type === 'izdavanje' ? 'Rentals' : filters.type === 'prodaja' ? 'For sale' : 'All listings';

  const FilterPanel = (
    <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
      <div>
        <label className='label'>Keyword</label>
        <div className='relative'>
          <LuSearch className='pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dim' />
          <input
            value={filters.searchTerm}
            onChange={(e) => set('searchTerm', e.target.value)}
            placeholder='City, street, title…'
            className='input !pl-10'
          />
        </div>
      </div>

      <div>
        <label className='label'>Type</label>
        <div className='grid grid-cols-3 gap-1 rounded-full border border-line bg-sand p-1'>
          {[['sve', 'All'], ['prodaja', 'Buy'], ['izdavanje', 'Rent']].map(([val, lab]) => (
            <button
              key={val}
              type='button'
              onClick={() => set('type', val)}
              className={`rounded-full py-2 text-sm font-semibold transition-all ${filters.type === val ? 'bg-espresso text-white' : 'text-muted hover:text-ink'}`}
            >
              {lab}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className='label'>Price (€)</label>
        <div className='flex items-center gap-2'>
          <input type='number' min={0} value={filters.minPrice} onChange={(e) => set('minPrice', e.target.value)} placeholder='Min' className='input' />
          <span className='text-dim'>—</span>
          <input type='number' min={0} value={filters.maxPrice} onChange={(e) => set('maxPrice', e.target.value)} placeholder='Max' className='input' />
        </div>
      </div>

      <div className='grid grid-cols-2 gap-3'>
        <div>
          <label className='label'>Min. bedrooms</label>
          <input type='number' min={1} value={filters.bedrooms} onChange={(e) => set('bedrooms', e.target.value)} placeholder='Any' className='input' />
        </div>
        <div>
          <label className='label'>Min. baths</label>
          <input type='number' min={1} value={filters.bathrooms} onChange={(e) => set('bathrooms', e.target.value)} placeholder='Any' className='input' />
        </div>
      </div>

      <div>
        <label className='label'>Amenities</label>
        <div className='flex flex-col gap-2'>
          <Toggle label='Furnished' checked={filters.furnished} onChange={(v) => set('furnished', v)} />
          <Toggle label='Parking' checked={filters.parking} onChange={(v) => set('parking', v)} />
          <Toggle label='Terrace' checked={filters.terrace} onChange={(v) => set('terrace', v)} />
        </div>
      </div>

      <div>
        <label className='label'>Sort by</label>
        <select
          value={`${filters.sort}_${filters.order}`}
          onChange={(e) => {
            const [s, o] = e.target.value.split('_');
            setFilters((p) => ({ ...p, sort: s, order: o }));
          }}
          className='input cursor-pointer'
        >
          <option value='createdAt_desc'>Newest first</option>
          <option value='createdAt_asc'>Oldest first</option>
          <option value='regularPrice_asc'>Price: low to high</option>
          <option value='regularPrice_desc'>Price: high to low</option>
        </select>
      </div>

      <div className='flex gap-2'>
        <button type='button' onClick={handleReset} className='btn-ghost flex-1'>Reset</button>
        <button type='submit' className='btn-primary flex-[2]'>Show results</button>
      </div>
    </form>
  );

  return (
    <div className='min-h-screen'>
      {/* Zaglavlje */}
      <section className='relative overflow-hidden border-b border-line'>
        <div className='bg-grid mask-fade-b absolute inset-0' />
        <div className='absolute -right-20 -top-32 h-80 w-80 rounded-full bg-accent/15 blur-[100px]' />
        <div className='container-x relative py-12 sm:py-16'>
          <p className='eyebrow mb-4'><span className='h-px w-6 bg-accent' />Browse</p>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
            <h1 className='h-display text-5xl leading-none sm:text-7xl'>
              {heading}
              {filters.searchTerm && <span className='accent-italic'> · “{filters.searchTerm}”</span>}
            </h1>
            <p className='font-sans text-sm text-muted'>
              {loading && startIndex === 0 ? 'Searching…' : (
                <><span className='text-ink'>{total}</span> {total === 1 ? 'result' : 'results'}</>
              )}
            </p>
          </div>
        </div>
      </section>

      <div className='container-x py-10'>
        {/* Mobilno dugme za filtere */}
        <button
          type='button'
          onClick={() => setFiltersOpen(true)}
          className='btn-ghost mb-6 w-full lg:hidden'
        >
          <LuSlidersHorizontal className='h-4 w-4' /> Filters
          {activeCount > 0 && <span className='grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-white'>{activeCount}</span>}
        </button>

        <div className='flex gap-8'>
          {/* Desktop filteri */}
          <aside className='hidden w-80 shrink-0 lg:block'>
            <div className='panel sticky top-28 p-6'>
              <div className='mb-6 flex items-center justify-between'>
                <p className='font-display text-lg font-semibold'>Filters</p>
                {activeCount > 0 && <span className='chip !border-accent/40 !text-accent'>{activeCount} active</span>}
              </div>
              {FilterPanel}
            </div>
          </aside>

          {/* Rezultati */}
          <div className='min-w-0 flex-1'>
            {loading && listings.length === 0 ? (
              <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3'>
                {Array.from({ length: 6 }).map((_, i) => <ListingCardSkeleton key={i} />)}
              </div>
            ) : listings.length === 0 ? (
              <div className='panel bg-grid flex flex-col items-center justify-center gap-4 px-6 py-24 text-center'>
                <span className='grid h-14 w-14 place-items-center rounded-2xl border border-line bg-sand/60'>
                  <LuSearchX className='h-6 w-6 text-accent' />
                </span>
                <p className='h-display text-2xl'>Nothing matches. Yet.</p>
                <p className='max-w-sm text-muted'>Try widening the price range or removing a filter or two.</p>
                <button type='button' onClick={handleReset} className='btn-ghost mt-2'>Clear all filters</button>
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3'>
                {listings.map((l, i) => (
                  <div key={l._id} className='animate-fade-up' style={{ animationDelay: `${(i % LIMIT) * 50}ms` }}>
                    <ListingCard listing={l} />
                  </div>
                ))}
              </div>
            )}

            {listings.length > 0 && listings.length < total && (
              <div className='mt-12 text-center'>
                <button
                  type='button'
                  onClick={() => setStartIndex((prev) => prev + LIMIT)}
                  disabled={loading}
                  className='btn-ghost !px-8'
                >
                  {loading ? 'Loading…' : <>Load more <span className='text-dim'>({total - listings.length})</span> <LuArrowDown className='h-4 w-4' /></>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobilni filteri — panel odozdo */}
      <div className={`fixed inset-0 z-[60] lg:hidden ${filtersOpen ? 'visible' : 'invisible'}`}>
        <div
          onClick={() => setFiltersOpen(false)}
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${filtersOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        <div
          className={`absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl border-t border-line bg-card p-6 pb-10 transition-transform duration-500 ease-out ${
            filtersOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className='mx-auto mb-5 h-1 w-10 rounded-full bg-line' />
          <div className='mb-6 flex items-center justify-between'>
            <p className='h-display text-2xl'>Filters</p>
            <button type='button' onClick={() => setFiltersOpen(false)} aria-label='Close filters' className='grid h-10 w-10 place-items-center rounded-full border border-line'>
              <LuX className='h-5 w-5' />
            </button>
          </div>
          {FilterPanel}
        </div>
      </div>
    </div>
  );
}
