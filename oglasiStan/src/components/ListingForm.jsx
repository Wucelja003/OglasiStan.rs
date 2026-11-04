import { useRef, useState } from 'react';
import { LuUpload, LuX, LuStar, LuCheck, LuPlus, LuTriangleAlert } from 'react-icons/lu';
import ListingCard from './ListingCard';
import { formatPrice, pricePerM2 } from '../utils/format';

export const MAX_IMAGES = 15;

const HEATING_OPTIONS = [
  'District heating',
  'Central heating',
  'Own boiler',
  'Underfloor heating',
  'Electric',
  'Heat pump',
  'Gas',
  'Wood / pellet',
  'Air conditioning',
  'Combined',
];

export const EMPTY_FORM = {
  name: '', address: '', description: '', type: 'prodaja',
  area: '', floor: '', bedrooms: '', bathrooms: '',
  furnished: false, parking: false, terrace: false, heating: '', price: '',
};

// Iz oglasa iz baze -> stanje forme
export const listingToForm = (l) => ({
  name: l.name || '',
  address: l.address || '',
  description: l.description || '',
  type: l.type || 'prodaja',
  area: l.area || '',
  floor: l.floor ?? '',
  bedrooms: l.bedrooms || '',
  bathrooms: l.bathrooms || '',
  furnished: !!l.furnished,
  parking: !!l.parking,
  terrace: !!l.terrace,
  heating: l.heating || '',
  price: l.regularPrice || '',
});

// Upload novih slika i spajanje sa postojećim — naslovna slika ide prva
async function resolveImages(images) {
  const ordered = [...images].sort((a, b) => (b.cover ? 1 : 0) - (a.cover ? 1 : 0));
  const newOnes = ordered.filter((s) => s.file);
  let uploaded = [];

  if (newOnes.length > 0) {
    const fd = new FormData();
    newOnes.forEach((s) => fd.append('images', s.file));
    const res = await fetch('/api/upload', { method: 'POST', credentials: 'include', body: fd });
    const data = await res.json();
    if (!data.success) throw new Error('Photo upload failed. Please try again.');
    uploaded = data.urls;
  }

  let u = 0;
  return ordered.map((s) => (s.file ? uploaded[u++] : s.url)).filter(Boolean);
}

function Section({ n, title, hint, children }) {
  return (
    <section className='panel p-6 sm:p-8'>
      <div className='mb-6 flex items-start gap-4'>
        <span className='font-sans text-sm text-accent'>{String(n).padStart(2, '0')}</span>
        <div>
          <h2 className='font-display text-xl font-semibold tracking-tight text-ink'>{title}</h2>
          {hint && <p className='mt-1 text-sm text-dim'>{hint}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function Check({ label, checked, onChange }) {
  return (
    <button
      type='button'
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-sm font-medium transition-all ${
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

export default function ListingForm({ initialData = EMPTY_FORM, initialImages = [], submitLabel, busyLabel, onSave }) {
  const [form, setForm] = useState(initialData);
  const [images, setImages] = useState(initialImages);
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const onField = (e) => set(e.target.name, e.target.value);
  const rent = form.type === 'izdavanje';

  const addFiles = (files) => {
    const picked = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .map((f) => ({ file: f, url: URL.createObjectURL(f), cover: false }));
    setImages((prev) => {
      const merged = [...prev, ...picked].slice(0, MAX_IMAGES);
      const hasCover = merged.some((s) => s.cover);
      return merged.map((s, i) => ({ ...s, cover: hasCover ? s.cover : i === 0 }));
    });
  };

  const removeImage = (i) =>
    setImages((prev) => {
      const next = prev.filter((_, idx) => idx !== i);
      if (next.length && !next.some((s) => s.cover)) next[0] = { ...next[0], cover: true };
      return next;
    });

  const setCover = (i) => setImages((prev) => prev.map((s, idx) => ({ ...s, cover: idx === i })));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const imagesUrls = await resolveImages(images);
      await onSave({
        name: form.name.trim(),
        description: form.description.trim(),
        address: form.address.trim(),
        type: form.type,
        area: Number(form.area) || 0,
        floor: Number(form.floor) || 0,
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        furnished: form.furnished,
        parking: form.parking,
        terrace: form.terrace,
        heating: form.heating,
        regularPrice: Number(form.price),
        discountPrice: 0,
        offer: false,
        imagesUrls,
      });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setSaving(false);
    }
  };

  const cover = images.find((s) => s.cover) || images[0];
  const preview = {
    name: form.name,
    address: form.address,
    type: form.type,
    regularPrice: Number(form.price) || 0,
    area: Number(form.area) || 0,
    bedrooms: form.bedrooms || 0,
    bathrooms: form.bathrooms || 0,
    imagesUrls: cover ? [cover.url] : [],
  };
  const perM2 = pricePerM2(Number(form.price), Number(form.area));

  return (
    <form onSubmit={handleSubmit} className='grid gap-8 lg:grid-cols-[1fr_360px]'>
      <div className='min-w-0 space-y-5'>
        <Section n={1} title='The basics' hint='A clear title and exact address get more clicks.'>
          <div className='space-y-4'>
            <div>
              <label className='label' htmlFor='name'>Title</label>
              <input id='name' name='name' value={form.name} onChange={onField} required minLength={5} maxLength={80}
                placeholder='e.g. Bright 2-bedroom flat near the river' className='input' />
            </div>
            <div>
              <label className='label' htmlFor='address'>Address</label>
              <input id='address' name='address' value={form.address} onChange={onField} required
                placeholder='e.g. Bulevar Oslobođenja 14, Novi Sad' className='input' />
            </div>
            <div>
              <label className='label' htmlFor='description'>Description</label>
              <textarea id='description' name='description' value={form.description} onChange={onField} required rows={5}
                placeholder='What makes it great? Light, view, neighbourhood, recent renovations…' className='input resize-none' />
            </div>
          </div>
        </Section>

        <Section n={2} title='Sale or rent?'>
          <div className='grid grid-cols-2 gap-2 rounded-full border border-line bg-sand p-1.5'>
            {[['prodaja', 'For sale'], ['izdavanje', 'For rent']].map(([val, lab]) => (
              <button
                key={val}
                type='button'
                onClick={() => set('type', val)}
                className={`rounded-full py-3.5 font-display text-base font-semibold transition-all ${
                  form.type === val ? 'bg-accent text-white shadow-lg shadow-accent/30' : 'text-muted hover:text-ink'
                }`}
              >
                {lab}
              </button>
            ))}
          </div>
        </Section>

        <Section n={3} title='Details'>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
            {[
              { name: 'area', label: 'Area (m²)', placeholder: '65', min: 1, required: true },
              { name: 'floor', label: 'Floor', placeholder: '0 = ground', min: 0 },
              { name: 'bedrooms', label: 'Bedrooms', placeholder: '2', min: 1, required: true },
              { name: 'bathrooms', label: 'Bathrooms', placeholder: '1', min: 1, required: true },
            ].map((f) => (
              <div key={f.name}>
                <label className='label' htmlFor={f.name}>{f.label}</label>
                <input id={f.name} name={f.name} type='number' min={f.min} required={f.required}
                  value={form[f.name]} onChange={onField} placeholder={f.placeholder} className='input' />
              </div>
            ))}
          </div>

          <div className='mt-5 grid gap-2 sm:grid-cols-3'>
            <Check label='Furnished' checked={form.furnished} onChange={(v) => set('furnished', v)} />
            <Check label='Parking' checked={form.parking} onChange={(v) => set('parking', v)} />
            <Check label='Terrace' checked={form.terrace} onChange={(v) => set('terrace', v)} />
          </div>

          <div className='mt-5'>
            <label className='label' htmlFor='heating'>Heating</label>
            <select id='heating' name='heating' value={form.heating} onChange={onField}
              className={`input cursor-pointer ${form.heating ? '' : '!text-dim'}`}>
              <option value=''>Select heating type</option>
              {HEATING_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </Section>

        <Section n={4} title={rent ? 'Monthly rent' : 'Asking price'}>
          <div className='relative'>
            <span className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-display text-2xl text-dim'>€</span>
            <input name='price' type='number' min={1} required value={form.price} onChange={onField}
              placeholder={rent ? '450' : '95000'}
              className='input !py-4 !pl-11 !pr-16 font-display !text-2xl font-semibold' />
            {rent && <span className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-dim'>/ month</span>}
          </div>
          {perM2 && (
            <p className='mt-3 font-sans text-sm text-muted'>
              ≈ <span className='text-accent'>{formatPrice(perM2)}</span> per m²
            </p>
          )}
        </Section>

        <Section n={5} title='Photos' hint={`Up to ${MAX_IMAGES} photos. Star one to make it the cover.`}>
          <div
            role='button'
            tabIndex={0}
            onClick={() => fileRef.current?.click()}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileRef.current?.click(); }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all ${
              dragOver ? 'border-accent bg-accent/[0.07]' : 'border-line hover:border-ink/20 hover:bg-sand/60'
            }`}
          >
            <span className={`grid h-12 w-12 place-items-center rounded-full transition-all ${dragOver ? 'scale-110 bg-accent text-white' : 'bg-sand/60 text-accent'}`}>
              <LuUpload className='h-5 w-5' />
            </span>
            <p className='font-medium text-ink'>{dragOver ? 'Drop them here' : 'Drag photos here or click to browse'}</p>
            <p className='font-sans text-xs text-dim'>PNG · JPG · WEBP — {images.length}/{MAX_IMAGES}</p>
          </div>
          <input ref={fileRef} type='file' accept='image/*' multiple className='hidden'
            onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />

          {images.length > 0 && (
            <div className='mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5'>
              {images.map((img, i) => (
                <div key={img.url} className={`group relative aspect-square overflow-hidden rounded-xl ${img.cover ? 'ring-2 ring-accent ring-offset-2 ring-offset-card' : ''}`}>
                  <img src={img.url} alt='' className='h-full w-full object-cover' />
                  <div className='absolute inset-0 flex items-start justify-between bg-gradient-to-b from-black/60 to-transparent p-1.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100'>
                    <button type='button' onClick={() => setCover(i)} aria-label='Make cover photo'
                      className={`grid h-7 w-7 place-items-center rounded-full ${img.cover ? 'bg-accent text-white' : 'bg-black/60 text-white hover:bg-accent hover:text-white'}`}>
                      <LuStar className='h-3.5 w-3.5' />
                    </button>
                    <button type='button' onClick={() => removeImage(i)} aria-label='Remove photo'
                      className='grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white hover:bg-red-500'>
                      <LuX className='h-3.5 w-3.5' />
                    </button>
                  </div>
                  {img.cover && (
                    <span className='absolute bottom-1.5 left-1.5 rounded-md bg-accent px-1.5 py-0.5 font-sans text-[9px] font-bold uppercase tracking-wider text-white'>Cover</span>
                  )}
                </div>
              ))}
              {images.length < MAX_IMAGES && (
                <button type='button' onClick={() => fileRef.current?.click()}
                  className='grid aspect-square place-items-center rounded-xl border-2 border-dashed border-line text-dim transition-colors hover:border-accent hover:text-accent'>
                  <LuPlus className='h-6 w-6' />
                </button>
              )}
            </div>
          )}
        </Section>
      </div>

      {/* Desno — živi pregled + objava */}
      <aside className='lg:sticky lg:top-28 lg:self-start'>
        <p className='eyebrow mb-4'><span className='h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent' />Live preview</p>
        <div className='pointer-events-none'>
          <ListingCard listing={preview} />
        </div>

        {error && (
          <p className='mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'>
            <LuTriangleAlert className='mt-0.5 h-4 w-4 shrink-0' /> {error}
          </p>
        )}

        <button type='submit' disabled={saving} className='btn-primary mt-5 w-full !py-4 text-base'>
          {saving ? busyLabel : submitLabel}
        </button>
        <p className='mt-3 text-center text-xs text-dim'>Free forever. You can edit or delete it any time.</p>
      </aside>
    </form>
  );
}
