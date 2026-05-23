import { useSelector } from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure,
deleteUserStart, deleteUserSuccess, signOutUserStart,
signOutUserFailure,
signOutUserSuccess} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

const inputClass = 'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200';
const inputStyle = { background: '#F2EDE3', border: '1px solid #DDD7CC', color: '#1A1612' };
const focusStyle = { border: '1.5px solid #E07B2A', boxShadow: '0 0 0 3px rgba(224,123,42,0.12)' };
const blurStyle  = { border: '1px solid #DDD7CC', boxShadow: 'none' };

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector(state => state.user);
  const [FormData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [oglasi, setOglasi] = useState([]);
  const [oglasiLoading, setOglasiLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOglasi = async () => {
      setOglasiLoading(true);
      try {
        const res = await fetch(`/api/listing/user/${currentUser._id}`, { credentials: 'include' });
        const data = await res.json();
        setOglasi(Array.isArray(data) ? data : []);
      } catch {
        setOglasi([]);
      } finally {
        setOglasiLoading(false);
      }
    };
    fetchOglasi();
  }, [currentUser._id]);

  const handleDeleteListing = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (data.success === false) return;
      setOglasi((prev) => prev.filter((o) => o._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => setFormData({ ...FormData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(FormData),
      });
      const data = await res.json();
      if (data.success === false) { dispatch(updateUserFailure(data.message)); return; }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (data.success === false) { dispatch(deleteUserFailure(data.message)); return; }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) { dispatch(signOutUserFailure(data.message)); return; }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  return (
    <div className='min-h-screen' style={{ background: '#FAF7F2' }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .profile-card { animation: fadeUp 0.5s ease both; }
        .listings-section { animation: fadeUp 0.5s 0.15s ease both; }
      `}</style>

      {/* Header banner */}
      <div className='h-36 w-full' style={{ background: 'linear-gradient(135deg, #221E1A 0%, #2E2318 100%)' }}>
        <div className='max-w-2xl mx-auto px-4 h-full flex items-end pb-0'>
        </div>
      </div>

      <div className='max-w-2xl mx-auto px-4 -mt-16 pb-16'>

        {/* Kartica profila */}
        <div className='profile-card rounded-3xl p-6 mb-6'
          style={{ background: '#FDF9F4', border: '1px solid #DDD7CC', boxShadow: '0 8px 40px rgba(26,22,18,0.1)' }}>

          {/* Avatar + ime */}
          <div className='flex flex-col sm:flex-row items-center sm:items-end gap-4 mb-8'>
            <div className='relative flex-shrink-0'>
              <img
                onClick={() => fileRef.current.click()}
                src={currentUser.avatar}
                alt='avatar'
                className='w-24 h-24 rounded-2xl object-cover cursor-pointer transition-all duration-200 hover:opacity-80'
                style={{ border: '3px solid #E07B2A', boxShadow: '0 4px 20px rgba(224,123,42,0.3)' }}
              />
              <div
                className='absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer'
                style={{ background: '#E07B2A' }}
                onClick={() => fileRef.current.click()}
              >
                <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='white' strokeWidth={2.5}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z' />
                  <path strokeLinecap='round' strokeLinejoin='round' d='M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z' />
                </svg>
              </div>
              <input type='file' ref={fileRef} hidden accept='image/*' />
            </div>
            <div className='text-center sm:text-left'>
              <h1 className='text-2xl font-extrabold' style={{ color: '#1A1612', letterSpacing: '-0.02em' }}>
                {currentUser.username}
              </h1>
              <p className='text-sm mt-0.5' style={{ color: '#B5AFA5' }}>{currentUser.email}</p>
            </div>
          </div>

          {/* Forma */}
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div>
              <label className='text-xs font-bold uppercase tracking-widest block mb-1.5' style={{ color: '#6B6158' }}>
                Korisničko ime
              </label>
              <input type='text' id='username' defaultValue={currentUser.username} onChange={handleChange}
                placeholder='Korisničko ime'
                className={inputClass} style={inputStyle}
                onFocus={e => Object.assign(e.target.style, focusStyle)}
                onBlur={e => Object.assign(e.target.style, blurStyle)} />
            </div>

            <div>
              <label className='text-xs font-bold uppercase tracking-widest block mb-1.5' style={{ color: '#6B6158' }}>
                Email adresa
              </label>
              <input type='text' id='email' defaultValue={currentUser.email} onChange={handleChange}
                placeholder='Email adresa'
                className={inputClass} style={inputStyle}
                onFocus={e => Object.assign(e.target.style, focusStyle)}
                onBlur={e => Object.assign(e.target.style, blurStyle)} />
            </div>

            <div>
              <label className='text-xs font-bold uppercase tracking-widest block mb-1.5' style={{ color: '#6B6158' }}>
                Nova lozinka
              </label>
              <input type='password' id='password' onChange={handleChange}
                placeholder='Ostavite prazno ako ne mijenjate'
                className={inputClass} style={inputStyle}
                onFocus={e => Object.assign(e.target.style, focusStyle)}
                onBlur={e => Object.assign(e.target.style, blurStyle)} />
            </div>

            {/* Feedback poruke */}
            {error && (
              <p className='text-sm px-4 py-3 rounded-xl' style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)' }}>
                {error}
              </p>
            )}
            {updateSuccess && (
              <p className='text-sm px-4 py-3 rounded-xl flex items-center gap-2' style={{ background: 'rgba(34,197,94,0.08)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.2)' }}>
                <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                </svg>
                Podaci su uspešno sačuvani.
              </p>
            )}

            <button
              type='submit'
              disabled={loading}
              className='w-full py-3.5 rounded-xl font-bold text-sm text-white uppercase tracking-wide transition-all duration-200 disabled:opacity-60'
              style={{ background: '#221E1A' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#E07B2A'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#221E1A'; }}
            >
              {loading ? 'Čuvanje...' : 'Sačuvaj izmene'}
            </button>
          </form>

          {/* Separator */}
          <div style={{ borderTop: '1px solid #DDD7CC' }} className='mt-5 pt-5 flex items-center justify-between'>
            <button
              onClick={handleDeleteUser}
              className='text-xs font-semibold px-3 py-2 rounded-lg transition-all duration-150'
              style={{ color: '#ef4444', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
            >
              Obriši nalog
            </button>
            <button
              onClick={handleSignOut}
              className='text-xs font-semibold px-3 py-2 rounded-lg transition-all duration-150 flex items-center gap-1.5'
              style={{ color: '#6B6158', background: '#F2EDE3', border: '1px solid #DDD7CC' }}
              onMouseEnter={e => e.currentTarget.style.background = '#DDD7CC'}
              onMouseLeave={e => e.currentTarget.style.background = '#F2EDE3'}
            >
              <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75' />
              </svg>
              Odjavi se
            </button>
          </div>
        </div>

        {/* Moji oglasi */}
        <div className='listings-section'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <p className='text-xs font-bold uppercase tracking-widest mb-0.5' style={{ color: '#E07B2A' }}>Moji oglasi</p>
              <h2 className='text-xl font-extrabold' style={{ color: '#1A1612', letterSpacing: '-0.01em' }}>
                Objavljeni oglasi
              </h2>
            </div>
            <Link
              to='/create-listing'
              className='flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white transition-all duration-200'
              style={{ background: '#E07B2A' }}
              onMouseEnter={e => e.currentTarget.style.background = '#C45F12'}
              onMouseLeave={e => e.currentTarget.style.background = '#E07B2A'}
            >
              <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
              </svg>
              Novi oglas
            </Link>
          </div>

          {oglasiLoading && (
            <div className='flex flex-col gap-3'>
              {[...Array(2)].map((_, i) => (
                <div key={i} className='h-20 rounded-2xl animate-pulse' style={{ background: '#FDF9F4', border: '1px solid #DDD7CC' }} />
              ))}
            </div>
          )}

          {!oglasiLoading && oglasi.length === 0 && (
            <div className='text-center py-14 rounded-2xl' style={{ background: '#FDF9F4', border: '2px dashed #DDD7CC' }}>
              <div className='w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4'
                style={{ background: 'rgba(224,123,42,0.1)' }}>
                <svg className='w-7 h-7' fill='none' viewBox='0 0 24 24' stroke='#E07B2A' strokeWidth={1.5}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' />
                </svg>
              </div>
              <p className='font-semibold mb-1' style={{ color: '#1A1612' }}>Još nema oglasa</p>
              <p className='text-sm mb-5' style={{ color: '#B5AFA5' }}>Objavite svoju prvu nekretninu</p>
              <Link
                to='/create-listing'
                className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all duration-200'
                style={{ background: '#E07B2A' }}
              >
                Postavi oglas
              </Link>
            </div>
          )}

          {!oglasiLoading && oglasi.length > 0 && (
            <div className='flex flex-col gap-3'>
              {oglasi.map((oglas) => (
                <div
                  key={oglas._id}
                  className='flex items-center gap-4 p-3 rounded-2xl transition-all duration-200 hover:-translate-y-0.5'
                  style={{ background: '#FDF9F4', border: '1px solid #DDD7CC', boxShadow: '0 1px 4px rgba(26,22,18,0.05)' }}
                >
                  {/* Slika */}
                  <div className='w-16 h-16 rounded-xl overflow-hidden flex-shrink-0' style={{ background: '#F2EDE3' }}>
                    {oglas.imagesUrls?.[0] ? (
                      <img src={oglas.imagesUrls[0]} alt={oglas.name} className='w-full h-full object-cover' />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center'>
                        <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='#DDD7CC' strokeWidth={1.5}>
                          <path strokeLinecap='round' strokeLinejoin='round' d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 20.25h18A1.5 1.5 0 0022.5 18.75V6.75A1.5 1.5 0 0021 5.25H3A1.5 1.5 0 001.5 6.75v12A1.5 1.5 0 003 20.25z' />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className='flex-1 min-w-0'>
                    <p className='font-semibold text-sm truncate' style={{ color: '#1A1612' }}>{oglas.name}</p>
                    <p className='text-xs mt-0.5' style={{ color: '#B5AFA5' }}>
                      {oglas.regularPrice.toLocaleString('sr-RS')} €
                      {oglas.type === 'izdavanje' && ' /mj'}
                    </p>
                  </div>

                  {/* Akcije */}
                  <div className='flex items-center gap-2 flex-shrink-0'>
                    <Link
                      to={`/listing/${oglas._id}`}
                      className='text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150'
                      style={{ background: '#E07B2A', color: 'white' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#C45F12'}
                      onMouseLeave={e => e.currentTarget.style.background = '#E07B2A'}
                    >
                      Pogledaj
                    </Link>
                    <Link
                      to={`/edit-listing/${oglas._id}`}
                      className='text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150'
                      style={{ background: '#F2EDE3', color: '#1A1612', border: '1px solid #DDD7CC' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#DDD7CC'}
                      onMouseLeave={e => e.currentTarget.style.background = '#F2EDE3'}
                    >
                      Uredi
                    </Link>
                    <button
                      onClick={() => handleDeleteListing(oglas._id)}
                      className='text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150'
                      style={{ background: 'rgba(239,68,68,0.07)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.14)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.07)'}
                    >
                      Obriši
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
