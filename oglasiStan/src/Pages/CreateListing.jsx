import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const GREJANJE_OPTIONS = [
  'Centralno grejanje',
  'Etažno grejanje',
  'Podno grejanje',
  'Klima uređaj',
  'Struja',
  'Gas',
  'Pelet',
  'Drvo',
];

export default function CreateListing() {
  const [slike, setSlike] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

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

  const postaviNaslovnu = (i) => {
    setSlike((prev) => prev.map((s, idx) => ({ ...s, cover: idx === i })));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    dodajSlike(e.dataTransfer.files);
  };

  const [formData, setFormData] = useState({
    naziv: '',
    lokacija: '',
    opis: '',
    tip: 'prodaja',
    kvadratura: '',
    sobe: '',
    kupatila: '',
    namesten: false,
    parking: false,
    grejanje: '',
    cena: '',
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleTip = (tip) => {
    setFormData((prev) => ({ ...prev, tip }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Upload slika na Cloudinary (ako ih ima)
      let imagesUrls = [];
      if (slike.length > 0) {
        const formDataSlike = new FormData();
        slike.forEach((s) => formDataSlike.append('images', s.file));

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
        imagesUrls = uploadData.urls;
      }

      // 2. Kreiraj oglas sa dobivenim URL-ovima
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

      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success === false) {
        setError('Greška pri objavi oglasa. Pokušajte ponovo.');
        setLoading(false);
        return;
      }

      navigate(`/listing/${data._id}`);
    } catch (err) {
      setError('Greška pri objavi oglasa. Pokušajte ponovo.');
      setLoading(false);
    }
  };

  const inputClass =
    'rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 w-full';
  const inputStyle = {
    background: '#F2EDE3',
    border: '1px solid #DDD7CC',
    color: '#1A1612',
  };
  const focusStyle = {
    border: '1.5px solid #E07B2A',
    boxShadow: '0 0 0 3px rgba(224,123,42,0.15)',
  };
  const blurStyle = {
    border: '1px solid #DDD7CC',
    boxShadow: 'none',
  };

  const labelClass = 'text-xs font-medium uppercase tracking-wide block mb-1';
  const labelStyle = { color: '#6B6158' };

  const sectionCard = {
    background: '#FDF9F4',
    border: '1px solid #DDD7CC',
  };

  return (
    <div
      className='min-h-screen px-4 py-10'
      style={{ background: '#FAF7F2' }}
    >
      <div className='max-w-2xl mx-auto'>
        {/* Naslov */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-extrabold tracking-tight' style={{ color: '#1A1612' }}>
            Postavi <span style={{ color: '#E07B2A' }}>Oglas</span>
          </h1>
          <p className='mt-2 text-sm' style={{ color: '#6B6158' }}>
            Popunite sve detalje o vašem oglasu
          </p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>

          {/* 1. NAZIV */}
          <div
            className='rounded-2xl p-6 shadow-xl'
            style={sectionCard}
          >
            <h2 className='text-base font-semibold mb-4 flex items-center gap-2' style={{ color: '#1A1612' }}>
              <span
                className='w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold'
                style={{ background: '#E07B2A', color: 'white' }}
              >
                1
              </span>
              Naziv oglasa
            </h2>
            <div>
              <label className={labelClass} style={labelStyle} htmlFor='naziv'>
                Naziv
              </label>
              <input
                type='text'
                id='naziv'
                placeholder='npr. Trosoban stan, Novi Beograd'
                value={formData.naziv}
                onChange={handleChange}
                maxLength={80}
                minLength={5}
                required
                className={inputClass}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => Object.assign(e.target.style, blurStyle)}
              />
            </div>
          </div>

          {/* 2. LOKACIJA */}
          <div className='rounded-2xl p-6 shadow-xl' style={sectionCard}>
            <h2 className='text-base font-semibold mb-4 flex items-center gap-2' style={{ color: '#1A1612' }}>
              <span
                className='w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold'
                style={{ background: '#E07B2A', color: 'white' }}
              >
                2
              </span>
              Lokacija
            </h2>
            <div>
              <label className={labelClass} style={labelStyle} htmlFor='lokacija'>
                Adresa ili naselje
              </label>
              <input
                type='text'
                id='lokacija'
                placeholder='npr. Bulevar Oslobođenja 14, Novi Sad'
                value={formData.lokacija}
                onChange={handleChange}
                required
                className={inputClass}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => Object.assign(e.target.style, blurStyle)}
              />
            </div>
          </div>

          {/* 3. OPIS */}
          <div className='rounded-2xl p-6 shadow-xl' style={sectionCard}>
            <h2 className='text-base font-semibold mb-4 flex items-center gap-2' style={{ color: '#1A1612' }}>
              <span
                className='w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold'
                style={{ background: '#E07B2A', color: 'white' }}
              >
                3
              </span>
              Opis oglasa
            </h2>
            <div>
              <label className={labelClass} style={labelStyle} htmlFor='opis'>
                Deskripcija
              </label>
              <textarea
                id='opis'
                placeholder='Opišite stan, lokaciju, prednosti...'
                value={formData.opis}
                onChange={handleChange}
                rows={4}
                required
                className={inputClass + ' resize-none'}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => Object.assign(e.target.style, blurStyle)}
              />
            </div>
          </div>

          {/* 4. TIP OGLASA */}
          <div className='rounded-2xl p-6 shadow-xl' style={sectionCard}>
            <h2 className='text-base font-semibold mb-4 flex items-center gap-2' style={{ color: '#1A1612' }}>
              <span
                className='w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold'
                style={{ background: '#E07B2A', color: 'white' }}
              >
                4
              </span>
              Tip oglasa
            </h2>
            <div className='grid grid-cols-2 gap-3'>
              {['prodaja', 'izdavanje'].map((tip) => (
                <button
                  type='button'
                  key={tip}
                  onClick={() => handleTip(tip)}
                  className='py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all duration-200'
                  style={
                    formData.tip === tip
                      ? { background: '#E07B2A', color: 'white', boxShadow: '0 4px 20px rgba(224,123,42,0.3)' }
                      : { background: '#F2EDE3', color: '#6B6158', border: '1px solid #DDD7CC' }
                  }
                >
                  {tip === 'prodaja' ? 'Prodaja' : 'Izdavanje'}
                </button>
              ))}
            </div>
          </div>

          {/* 5. SPECIFIKACIJE */}
          <div className='rounded-2xl p-6 shadow-xl' style={sectionCard}>
            <h2 className='text-base font-semibold mb-4 flex items-center gap-2' style={{ color: '#1A1612' }}>
              <span
                className='w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold'
                style={{ background: '#E07B2A', color: 'white' }}
              >
                5
              </span>
              Specifikacije
            </h2>

            <div className='grid grid-cols-3 gap-4 mb-4'>
              {/* Kvadratura */}
              <div>
                <label className={labelClass} style={labelStyle} htmlFor='kvadratura'>
                  Kvadratura (m²)
                </label>
                <input
                  type='number'
                  id='kvadratura'
                  placeholder='npr. 65'
                  value={formData.kvadratura}
                  onChange={handleChange}
                  min={1}
                  required
                  className={inputClass}
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, blurStyle)}
                />
              </div>

              {/* Broj soba */}
              <div>
                <label className={labelClass} style={labelStyle} htmlFor='sobe'>
                  Broj soba
                </label>
                <input
                  type='number'
                  id='sobe'
                  placeholder='npr. 3'
                  value={formData.sobe}
                  onChange={handleChange}
                  min={1}
                  required
                  className={inputClass}
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, blurStyle)}
                />
              </div>

              {/* Broj kupatila */}
              <div>
                <label className={labelClass} style={labelStyle} htmlFor='kupatila'>
                  Kupatila
                </label>
                <input
                  type='number'
                  id='kupatila'
                  placeholder='npr. 1'
                  value={formData.kupatila}
                  onChange={handleChange}
                  min={1}
                  required
                  className={inputClass}
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, blurStyle)}
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className='grid grid-cols-2 gap-3 mb-4'>
              {[
                { id: 'namesten', label: 'Namešten' },
                { id: 'parking', label: 'Parking mesto' },
              ].map(({ id, label }) => (
                <label
                  key={id}
                  htmlFor={id}
                  className='flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all duration-200'
                  style={{
                    background: formData[id] ? 'rgba(224,123,42,0.1)' : '#F2EDE3',
                    border: formData[id] ? '1px solid rgba(224,123,42,0.5)' : '1px solid #DDD7CC',
                  }}
                >
                  <div
                    className='w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200'
                    style={{
                      background: formData[id] ? '#E07B2A' : 'white',
                      border: formData[id] ? 'none' : '1px solid #DDD7CC',
                    }}
                  >
                    {formData[id] && (
                      <svg className='w-3 h-3' fill='none' viewBox='0 0 24 24' stroke='white' strokeWidth={3}>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                      </svg>
                    )}
                  </div>
                  <input
                    type='checkbox'
                    id={id}
                    checked={formData[id]}
                    onChange={handleChange}
                    className='hidden'
                  />
                  <span className='text-sm font-medium' style={{ color: '#1A1612' }}>{label}</span>
                </label>
              ))}
            </div>

            {/* Grejanje */}
            <div>
              <label className={labelClass} style={labelStyle} htmlFor='grejanje'>
                Tip grejanja
              </label>
              <select
                id='grejanje'
                value={formData.grejanje}
                onChange={handleChange}
                className={inputClass + ' cursor-pointer'}
                style={{ ...inputStyle, color: formData.grejanje ? '#1A1612' : '#B5AFA5' }}
                onFocus={(e) => Object.assign(e.target.style, { ...focusStyle, color: '#1A1612' })}
                onBlur={(e) => Object.assign(e.target.style, { ...blurStyle, color: formData.grejanje ? '#1A1612' : '#B5AFA5' })}
              >
                <option value='' disabled style={{ background: '#FDF9F4', color: '#B5AFA5' }}>
                  Izaberite tip grejanja
                </option>
                {GREJANJE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} style={{ background: '#FDF9F4', color: '#1A1612' }}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 6. CENA */}
          <div className='rounded-2xl p-6 shadow-xl' style={sectionCard}>
            <h2 className='text-base font-semibold mb-4 flex items-center gap-2' style={{ color: '#1A1612' }}>
              <span
                className='w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold'
                style={{ background: '#E07B2A', color: 'white' }}
              >
                6
              </span>
              {formData.tip === 'prodaja' ? 'Prodajna cena' : 'Cena iznajmljivanja'}
            </h2>
            <div>
              <label className={labelClass} style={labelStyle} htmlFor='cena'>
                {formData.tip === 'prodaja' ? 'Cena (€)' : 'Cena po mesecu (€)'}
              </label>
              <div className='relative'>
                <input
                  type='number'
                  id='cena'
                  placeholder={formData.tip === 'prodaja' ? 'npr. 95000' : 'npr. 450'}
                  value={formData.cena}
                  onChange={handleChange}
                  min={1}
                  required
                  className={inputClass + ' pr-12'}
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, blurStyle)}
                />
                <span
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold'
                  style={{ color: '#E07B2A' }}
                >
                  €{formData.tip === 'izdavanje' ? '/mj' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* 7. SLIKE */}
          <div className='rounded-2xl p-6 shadow-xl' style={sectionCard}>
            <h2 className='text-base font-semibold mb-1 flex items-center gap-2' style={{ color: '#1A1612' }}>
              <span
                className='w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold'
                style={{ background: '#E07B2A', color: 'white' }}
              >
                7
              </span>
              Fotografije
            </h2>
            <p className='text-xs mb-4' style={{ color: '#B5AFA5' }}>
              Dodajte do {MAX_SLIKE} fotografija. Prva slika je naslovna.
            </p>

            {/* Drop zona */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className='rounded-xl flex flex-col items-center justify-center gap-2 py-8 cursor-pointer transition-all duration-200 mb-4'
              style={{
                border: dragOver ? '2px dashed #E07B2A' : '2px dashed #DDD7CC',
                background: dragOver ? 'rgba(224,123,42,0.05)' : '#F2EDE3',
              }}
            >
              <div
                className='w-12 h-12 rounded-full flex items-center justify-center mb-1'
                style={{ background: 'rgba(224,123,42,0.12)' }}
              >
                <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='#E07B2A' strokeWidth={1.8}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5' />
                </svg>
              </div>
              <p className='text-sm font-medium' style={{ color: '#1A1612' }}>
                {dragOver ? 'Pusti slike ovdje' : 'Prevuci slike ili klikni da odabereš'}
              </p>
              <p className='text-xs' style={{ color: '#B5AFA5' }}>
                PNG, JPG, WEBP — max {MAX_SLIKE} fotografija
              </p>
              {slike.length > 0 && (
                <p className='text-xs font-medium' style={{ color: '#E07B2A' }}>
                  {slike.length}/{MAX_SLIKE} dodano
                </p>
              )}
            </div>

            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              multiple
              className='hidden'
              onChange={(e) => { dodajSlike(e.target.files); e.target.value = ''; }}
            />

            {/* Preview grid */}
            {slike.length > 0 && (
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                {slike.map((slika, i) => (
                  <div key={i} className='relative group rounded-xl overflow-hidden aspect-square'>
                    <img
                      src={slika.url}
                      alt={`slika-${i}`}
                      className='w-full h-full object-cover'
                    />

                    {/* Overlay na hover */}
                    <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                      style={{ background: 'rgba(0,38,90,0.72)' }}
                    >
                      {!slika.cover && (
                        <button
                          type='button'
                          onClick={() => postaviNaslovnu(i)}
                          className='text-xs font-semibold px-3 py-1 rounded-lg transition-all duration-150'
                          style={{ background: '#E07B2A', color: 'white' }}
                        >
                          Naslovna
                        </button>
                      )}
                      <button
                        type='button'
                        onClick={() => ukloniSliku(i)}
                        className='text-xs font-semibold px-3 py-1 rounded-lg transition-all duration-150'
                        style={{ background: 'rgba(239,68,68,0.85)', color: 'white' }}
                      >
                        Ukloni
                      </button>
                    </div>

                    {/* Cover bedž */}
                    {slika.cover && (
                      <div
                        className='absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-md'
                        style={{ background: '#E07B2A', color: 'white' }}
                      >
                        Naslovna
                      </div>
                    )}
                  </div>
                ))}

                {/* Dodaj još dugme ako ima mesta */}
                {slike.length < MAX_SLIKE && (
                  <button
                    type='button'
                    onClick={() => fileInputRef.current?.click()}
                    className='aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-200'
                    style={{
                      border: '2px dashed #DDD7CC',
                      background: '#F2EDE3',
                      color: '#B5AFA5',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#E07B2A';
                      e.currentTarget.style.color = '#E07B2A';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#DDD7CC';
                      e.currentTarget.style.color = '#B5AFA5';
                    }}
                  >
                    <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.8}>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                    </svg>
                    <span className='text-xs'>Dodaj još</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* SUBMIT */}
          {error && (
            <p className='text-center text-sm py-3 px-4 rounded-xl' style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
              {error}
            </p>
          )}
          <button
            type='submit'
            disabled={loading}
            className='w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100'
            style={{ background: '#E07B2A', color: 'white', boxShadow: '0 4px 24px rgba(224,123,42,0.35)' }}
            onMouseEnter={(e) => { if (!loading) { e.target.style.background = '#C45F12'; e.target.style.boxShadow = '0 6px 28px rgba(224,123,42,0.5)'; } }}
            onMouseLeave={(e) => { e.target.style.background = '#E07B2A'; e.target.style.boxShadow = '0 4px 24px rgba(224,123,42,0.35)'; }}
          >
            {loading ? 'Objavljujem...' : 'Objavi oglas'}
          </button>
        </form>
      </div>
    </div>
  );
}
