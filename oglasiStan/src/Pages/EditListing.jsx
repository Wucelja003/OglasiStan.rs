import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const GREJANJE_OPTIONS = [
  'Centralno grejanje', 'Etažno grejanje', 'Podno grejanje',
  'Klima uređaj', 'Struja', 'Gas', 'Pelet', 'Drvo',
];

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [slike, setSlike] = useState([]);

  const [formData, setFormData] = useState({
    naziv: '', lokacija: '', opis: '', tip: 'prodaja',
    kvadratura: '', sobe: '', kupatila: '',
    namesten: false, parking: false, grejanje: '', cena: '',
  });

  // Učitaj postojeći oglas
  useEffect(() => {
    const fetch_ = async () => {
      const res = await fetch(`/api/listing/get/${id}`);
      const data = await res.json();
      if (data.success === false) { navigate('/profile'); return; }
      if (data.userRef !== currentUser._id) { navigate('/profile'); return; }
      // Učitaj postojeće slike (bez file objekta — to su već uploadovane)
      if (data.imagesUrls?.length > 0) {
        setSlike(data.imagesUrls.map((url, i) => ({ url, cover: i === 0, file: null })));
      }
      setFormData({
        naziv: data.name || '',
        lokacija: data.address || '',
        opis: data.description || '',
        tip: data.type || 'prodaja',
        kvadratura: '',
        sobe: data.bedrooms || '',
        kupatila: data.bathrooms || '',
        namesten: data.furnished || false,
        parking: data.parking || false,
        grejanje: '',
        cena: data.regularPrice || '',
      });
      setFetchLoading(false);
    };
    fetch_();
  }, [id]);

  const handleChange = (e) => {
    const { id: eid, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [eid]: type === 'checkbox' ? checked : value }));
  };

  const handleTip = (tip) => setFormData((prev) => ({ ...prev, tip }));

  const MAX_SLIKE = 8;

  const dodajSlike = (files) => {
    const preparovane = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .map((f) => ({ file: f, url: URL.createObjectURL(f), cover: false }));
    setSlike((prev) => {
      const toAdd = preparovane.slice(0, MAX_SLIKE - prev.length);
      const merged = [...prev, ...toAdd].slice(0, MAX_SLIKE);
      const imaCover = merged.some((s) => s.cover);
      return merged.map((s, idx) => ({ ...s, cover: !imaCover && idx === 0 ? true : s.cover }));
    });
  };

  const ukloniSliku = (i) => {
    setSlike((prev) => {
      const next = prev.filter((_, idx) => idx !== i);
      if (next.length > 0 && !next.some((s) => s.cover)) next[0].cover = true;
      return next;
    });
  };

  const postaviNaslovnu = (i) => setSlike((prev) => prev.map((s, idx) => ({ ...s, cover: idx === i })));

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); dodajSlike(e.dataTransfer.files); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Upload novih slika ako ih ima
      let noviUrls = [];
      const noveSlike = slike.filter((s) => s.file); // samo nove (imaju file objekat)
      if (noveSlike.length > 0) {
        const formDataSlike = new FormData();
        noveSlike.forEach((s) => formDataSlike.append('images', s.file));
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          credentials: 'include',
          body: formDataSlike,
        });
        const uploadData = await uploadRes.json();
        if (!uploadData.success) {
          setError('Greška pri uploadu slika. Pokušajte ponovo.');
          setLoading(false);
          return;
        }
        noviUrls = uploadData.urls;
      }

      // Stari URL-ovi (slike koje nisu nove, već postojeće iz baze)
      const stariUrls = slike.filter((s) => !s.file).map((s) => s.url);
      const imagesUrls = [...stariUrls, ...noviUrls];

      const payload = {
        name: formData.naziv,
        description: formData.opis,
        address: formData.lokacija,
        type: formData.tip,
        bedrooms: Number(formData.sobe),
        bathrooms: Number(formData.kupatila),
        furnished: formData.namesten,
        parking: formData.parking,
        regularPrice: Number(formData.cena),
        discountPrice: 0,
        offer: false,
        imagesUrls,
        userRef: currentUser._id,
      };
      const res = await fetch(`/api/listing/update/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success === false) { setError('Greška pri čuvanju. Pokušajte ponovo.'); setLoading(false); return; }
      navigate(`/listing/${data._id}`);
    } catch {
      setError('Greška pri čuvanju. Pokušajte ponovo.');
      setLoading(false);
    }
  };

  // Isti stilovi kao CreateListing
  const inputClass = 'rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 w-full';
  const inputStyle = { background: '#F2EDE3', border: '1px solid #DDD7CC', color: '#1A1612' };
  const focusStyle = { border: '1.5px solid #E07B2A', boxShadow: '0 0 0 3px rgba(224,123,42,0.15)' };
  const blurStyle = { border: '1px solid #DDD7CC', boxShadow: 'none' };
  const labelClass = 'text-xs font-medium uppercase tracking-wide block mb-1';
  const labelStyle = { color: '#6B6158' };
  const sectionCard = { background: '#FDF9F4', border: '1px solid #DDD7CC' };

  const Broj = ({ n }) => (
    <span className='w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0'
      style={{ background: '#E07B2A', color: 'white' }}>{n}</span>
  );

  if (fetchLoading) return (
    <div className='min-h-screen flex items-center justify-center' style={{ background: '#FAF7F2' }}>
      <div className='w-10 h-10 rounded-full border-4 animate-spin'
        style={{ borderColor: '#DDD7CC', borderTopColor: '#E07B2A' }} />
    </div>
  );

  return (
    <div className='min-h-screen px-4 py-10' style={{ background: '#FAF7F2' }}>
      <div className='max-w-2xl mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-extrabold tracking-tight' style={{ color: '#1A1612' }}>
            Uredi <span style={{ color: '#E07B2A' }}>Oglas</span>
          </h1>
          <p className='mt-2 text-sm' style={{ color: '#6B6158' }}>Izmijenite detalje vašeg oglasa</p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>

          {/* 1. NAZIV */}
          <div className='rounded-2xl p-6 shadow-sm' style={sectionCard}>
            <h2 className='text-base font-semibold mb-4 flex items-center gap-2' style={{ color: '#1A1612' }}>
              <Broj n={1} /> Naziv oglasa
            </h2>
            <label className={labelClass} style={labelStyle} htmlFor='naziv'>Naziv</label>
            <input type='text' id='naziv' value={formData.naziv} onChange={handleChange}
              placeholder='npr. Trosoban stan, Novi Beograd' maxLength={80} minLength={5} required
              className={inputClass} style={inputStyle}
              onFocus={e => Object.assign(e.target.style, focusStyle)}
              onBlur={e => Object.assign(e.target.style, blurStyle)} />
          </div>

          {/* 2. LOKACIJA */}
          <div className='rounded-2xl p-6 shadow-sm' style={sectionCard}>
            <h2 className='text-base font-semibold mb-4 flex items-center gap-2' style={{ color: '#1A1612' }}>
              <Broj n={2} /> Lokacija
            </h2>
            <label className={labelClass} style={labelStyle} htmlFor='lokacija'>Adresa ili naselje</label>
            <input type='text' id='lokacija' value={formData.lokacija} onChange={handleChange}
              placeholder='npr. Bulevar Oslobođenja 14, Novi Sad' required
              className={inputClass} style={inputStyle}
              onFocus={e => Object.assign(e.target.style, focusStyle)}
              onBlur={e => Object.assign(e.target.style, blurStyle)} />
          </div>

          {/* 3. OPIS */}
          <div className='rounded-2xl p-6 shadow-sm' style={sectionCard}>
            <h2 className='text-base font-semibold mb-4 flex items-center gap-2' style={{ color: '#1A1612' }}>
              <Broj n={3} /> Opis oglasa
            </h2>
            <label className={labelClass} style={labelStyle} htmlFor='opis'>Deskripcija</label>
            <textarea id='opis' value={formData.opis} onChange={handleChange}
              placeholder='Opišite stan, lokaciju, prednosti...' rows={4} required
              className={inputClass + ' resize-none'} style={inputStyle}
              onFocus={e => Object.assign(e.target.style, focusStyle)}
              onBlur={e => Object.assign(e.target.style, blurStyle)} />
          </div>

          {/* 4. TIP */}
          <div className='rounded-2xl p-6 shadow-sm' style={sectionCard}>
            <h2 className='text-base font-semibold mb-4 flex items-center gap-2' style={{ color: '#1A1612' }}>
              <Broj n={4} /> Tip oglasa
            </h2>
            <div className='grid grid-cols-2 gap-3'>
              {['prodaja', 'izdavanje'].map((tip) => (
                <button type='button' key={tip} onClick={() => handleTip(tip)}
                  className='py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all duration-200'
                  style={formData.tip === tip
                    ? { background: '#E07B2A', color: 'white', boxShadow: '0 4px 20px rgba(224,123,42,0.3)' }
                    : { background: '#F2EDE3', color: '#6B6158', border: '1px solid #DDD7CC' }}>
                  {tip === 'prodaja' ? 'Prodaja' : 'Izdavanje'}
                </button>
              ))}
            </div>
          </div>

          {/* 5. SPECIFIKACIJE */}
          <div className='rounded-2xl p-6 shadow-sm' style={sectionCard}>
            <h2 className='text-base font-semibold mb-4 flex items-center gap-2' style={{ color: '#1A1612' }}>
              <Broj n={5} /> Specifikacije
            </h2>
            <div className='grid grid-cols-3 gap-4 mb-4'>
              {[
                { id: 'kvadratura', label: 'Kvadratura (m²)', placeholder: 'npr. 65' },
                { id: 'sobe', label: 'Broj soba', placeholder: 'npr. 3' },
                { id: 'kupatila', label: 'Kupatila', placeholder: 'npr. 1' },
              ].map(({ id: fid, label, placeholder }) => (
                <div key={fid}>
                  <label className={labelClass} style={labelStyle} htmlFor={fid}>{label}</label>
                  <input type='number' id={fid} value={formData[fid]} onChange={handleChange}
                    placeholder={placeholder} min={1}
                    className={inputClass} style={inputStyle}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e => Object.assign(e.target.style, blurStyle)} />
                </div>
              ))}
            </div>

            <div className='grid grid-cols-2 gap-3 mb-4'>
              {[{ id: 'namesten', label: 'Namešten' }, { id: 'parking', label: 'Parking mesto' }].map(({ id: cid, label }) => (
                <label key={cid} htmlFor={cid} className='flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all duration-200'
                  style={{ background: formData[cid] ? 'rgba(224,123,42,0.1)' : '#F2EDE3', border: formData[cid] ? '1px solid rgba(224,123,42,0.5)' : '1px solid #DDD7CC' }}>
                  <div className='w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200'
                    style={{ background: formData[cid] ? '#E07B2A' : 'white', border: formData[cid] ? 'none' : '1px solid #DDD7CC' }}>
                    {formData[cid] && (
                      <svg className='w-3 h-3' fill='none' viewBox='0 0 24 24' stroke='white' strokeWidth={3}>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                      </svg>
                    )}
                  </div>
                  <input type='checkbox' id={cid} checked={formData[cid]} onChange={handleChange} className='hidden' />
                  <span className='text-sm font-medium' style={{ color: '#1A1612' }}>{label}</span>
                </label>
              ))}
            </div>

            <div>
              <label className={labelClass} style={labelStyle} htmlFor='grejanje'>Tip grejanja</label>
              <select id='grejanje' value={formData.grejanje} onChange={handleChange}
                className={inputClass + ' cursor-pointer'}
                style={{ ...inputStyle, color: formData.grejanje ? '#1A1612' : '#B5AFA5' }}
                onFocus={e => Object.assign(e.target.style, { ...focusStyle, color: '#1A1612' })}
                onBlur={e => Object.assign(e.target.style, { ...blurStyle, color: formData.grejanje ? '#1A1612' : '#B5AFA5' })}>
                <option value='' disabled style={{ background: '#FDF9F4', color: '#B5AFA5' }}>Izaberite tip grejanja</option>
                {GREJANJE_OPTIONS.map(opt => (
                  <option key={opt} value={opt} style={{ background: '#FDF9F4', color: '#1A1612' }}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 6. CIJENA */}
          <div className='rounded-2xl p-6 shadow-sm' style={sectionCard}>
            <h2 className='text-base font-semibold mb-4 flex items-center gap-2' style={{ color: '#1A1612' }}>
              <Broj n={6} /> {formData.tip === 'prodaja' ? 'Prodajna cijena' : 'Cijena iznajmljivanja'}
            </h2>
            <label className={labelClass} style={labelStyle} htmlFor='cena'>
              {formData.tip === 'prodaja' ? 'Cijena (€)' : 'Cijena po mjesecu (€)'}
            </label>
            <div className='relative'>
              <input type='number' id='cena' value={formData.cena} onChange={handleChange}
                placeholder={formData.tip === 'prodaja' ? 'npr. 95000' : 'npr. 450'} min={1} required
                className={inputClass + ' pr-12'} style={inputStyle}
                onFocus={e => Object.assign(e.target.style, focusStyle)}
                onBlur={e => Object.assign(e.target.style, blurStyle)} />
              <span className='absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold' style={{ color: '#E07B2A' }}>
                €{formData.tip === 'izdavanje' ? '/mj' : ''}
              </span>
            </div>
          </div>

          {/* 7. SLIKE */}
          <div className='rounded-2xl p-6 shadow-sm' style={sectionCard}>
            <h2 className='text-base font-semibold mb-1 flex items-center gap-2' style={{ color: '#1A1612' }}>
              <Broj n={7} /> Fotografije
            </h2>
            <p className='text-xs mb-4' style={{ color: '#B5AFA5' }}>
              Dodajte do {MAX_SLIKE} fotografija. Prva slika je naslovna.
            </p>
            <div onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
              className='rounded-xl flex flex-col items-center justify-center gap-2 py-8 cursor-pointer transition-all duration-200 mb-4'
              style={{ border: dragOver ? '2px dashed #E07B2A' : '2px dashed #DDD7CC', background: dragOver ? 'rgba(224,123,42,0.05)' : '#F2EDE3' }}>
              <div className='w-12 h-12 rounded-full flex items-center justify-center mb-1' style={{ background: 'rgba(224,123,42,0.12)' }}>
                <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='#E07B2A' strokeWidth={1.8}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5' />
                </svg>
              </div>
              <p className='text-sm font-medium' style={{ color: '#1A1612' }}>
                {dragOver ? 'Pusti slike ovdje' : 'Prevuci slike ili klikni da odabereš'}
              </p>
              <p className='text-xs' style={{ color: '#B5AFA5' }}>PNG, JPG, WEBP — max {MAX_SLIKE} fotografija</p>
              {slike.length > 0 && <p className='text-xs font-medium' style={{ color: '#E07B2A' }}>{slike.length}/{MAX_SLIKE} dodano</p>}
            </div>
            <input ref={fileInputRef} type='file' accept='image/*' multiple className='hidden'
              onChange={e => { dodajSlike(e.target.files); e.target.value = ''; }} />

            {slike.length > 0 && (
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                {slike.map((slika, i) => (
                  <div key={i} className='relative group rounded-xl overflow-hidden aspect-square'>
                    <img src={slika.url} alt={`slika-${i}`} className='w-full h-full object-cover' />
                    <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                      style={{ background: 'rgba(26,22,18,0.65)' }}>
                      {!slika.cover && (
                        <button type='button' onClick={() => postaviNaslovnu(i)}
                          className='text-xs font-semibold px-3 py-1 rounded-lg'
                          style={{ background: '#E07B2A', color: 'white' }}>Naslovna</button>
                      )}
                      <button type='button' onClick={() => ukloniSliku(i)}
                        className='text-xs font-semibold px-3 py-1 rounded-lg'
                        style={{ background: 'rgba(239,68,68,0.85)', color: 'white' }}>Ukloni</button>
                    </div>
                    {slika.cover && (
                      <div className='absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-md'
                        style={{ background: '#E07B2A', color: 'white' }}>Naslovna</div>
                    )}
                  </div>
                ))}
                {slike.length < MAX_SLIKE && (
                  <button type='button' onClick={() => fileInputRef.current?.click()}
                    className='aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-200'
                    style={{ border: '2px dashed #DDD7CC', background: '#F2EDE3', color: '#B5AFA5' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#E07B2A'; e.currentTarget.style.color = '#E07B2A'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#DDD7CC'; e.currentTarget.style.color = '#B5AFA5'; }}>
                    <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.8}>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                    </svg>
                    <span className='text-xs'>Dodaj još</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {error && (
            <p className='text-center text-sm py-3 px-4 rounded-xl'
              style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </p>
          )}

          <button type='submit' disabled={loading}
            className='w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-md disabled:opacity-60 disabled:cursor-not-allowed text-white'
            style={{ background: '#E07B2A', boxShadow: '0 4px 24px rgba(224,123,42,0.35)' }}
            onMouseEnter={e => { if (!loading) e.target.style.background = '#C45F12'; }}
            onMouseLeave={e => { e.target.style.background = '#E07B2A'; }}>
            {loading ? 'Čuvanje...' : 'Sačuvaj izmjene'}
          </button>
        </form>
      </div>
    </div>
  );
}
