import { useSelector } from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure,
deleteUserStart, deleteUserSuccess, signOutUserStart,
signOutUserFailure,
signOutUserSuccess} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';



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
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) return;
      setOglasi((prev) => prev.filter((o) => o._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({...FormData, [e.target.id]: e.target.value }); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        credentials: 'include',
        body: JSON.stringify(FormData), 
      });
      const data = await res.json();
      if(data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if(data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
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
      if(data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl font-semibold text-center my-7">Profil</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='file' ref={fileRef} hidden accept='image/*'/>
        <img 
          onClick={() => fileRef.current.click()} 
          src={currentUser.avatar} 
          alt="profile" 
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        <input type='text' placeholder='username' defaultValue={currentUser.username} id="username" onChange={handleChange}
          className='p-3 rounded-lg text-sm outline-none transition-all duration-200'
          style={{ background: '#F2EDE3', border: '1px solid #DDD7CC', color: '#1A1612' }}
          onFocus={e => { e.target.style.border = '1.5px solid #E07B2A'; e.target.style.boxShadow = '0 0 0 3px rgba(224,123,42,0.15)'; }}
          onBlur={e => { e.target.style.border = '1px solid #DDD7CC'; e.target.style.boxShadow = 'none'; }}
        />
        <input type='text' placeholder='email' defaultValue={currentUser.email} id="email" onChange={handleChange}
          className='p-3 rounded-lg text-sm outline-none transition-all duration-200'
          style={{ background: '#F2EDE3', border: '1px solid #DDD7CC', color: '#1A1612' }}
          onFocus={e => { e.target.style.border = '1.5px solid #E07B2A'; e.target.style.boxShadow = '0 0 0 3px rgba(224,123,42,0.15)'; }}
          onBlur={e => { e.target.style.border = '1px solid #DDD7CC'; e.target.style.boxShadow = 'none'; }}
        />
        <input type='password' placeholder='Nova lozinka' id="password" onChange={handleChange}
          className='p-3 rounded-lg text-sm outline-none transition-all duration-200'
          style={{ background: '#F2EDE3', border: '1px solid #DDD7CC', color: '#1A1612' }}
          onFocus={e => { e.target.style.border = '1.5px solid #E07B2A'; e.target.style.boxShadow = '0 0 0 3px rgba(224,123,42,0.15)'; }}
          onBlur={e => { e.target.style.border = '1px solid #DDD7CC'; e.target.style.boxShadow = 'none'; }}
        />
        <button
          disabled={loading}
          className='text-white rounded-lg p-3 uppercase font-semibold text-sm tracking-wide transition-all duration-200 disabled:opacity-60'
          style={{ background: '#221E1A' }}
          onMouseEnter={e => { if (!loading) e.target.style.background = '#E07B2A'; }}
          onMouseLeave={e => { e.target.style.background = '#221E1A'; }}
        >
          {loading ? 'Čuvanje...' : 'Sačuvaj izmjene'}
        </button>

        <Link
          className='p-3 rounded-lg uppercase text-center text-sm font-semibold tracking-wide text-white transition-all duration-200'
          style={{ background: '#E07B2A' }}
          onMouseEnter={e => e.currentTarget.style.background = '#C45F12'}
          onMouseLeave={e => e.currentTarget.style.background = '#E07B2A'}
          to={'/create-listing'}
        >
          Postavi Oglas
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-sm cursor-pointer font-medium' style={{ color: '#ef4444' }}>Obriši nalog</span>
        <span onClick={handleSignOut} className='text-sm cursor-pointer font-medium' style={{ color: '#6B6158' }}>Izlogujte se</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ""}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? 'Korisnicki podaci su uspesno promenjeni' : ''}</p>

      {/* Moji oglasi */}
      <div className='mt-8'>
        <h2 className='text-xl font-semibold mb-4' style={{ color: '#1A1612' }}>Moji oglasi</h2>

        {oglasiLoading && (
          <p className='text-center text-sm text-gray-400 py-6'>Učitavanje oglasa...</p>
        )}

        {!oglasiLoading && oglasi.length === 0 && (
          <div className='text-center py-10 rounded-2xl border border-dashed' style={{ borderColor: '#DDD7CC' }}>
            <p className='text-sm mb-3' style={{ color: '#B5AFA5' }}>Još niste objavili nijedan oglas.</p>
            <Link
              to='/create-listing'
              className='text-sm font-semibold px-4 py-2 rounded-xl text-white transition-all duration-200'
              style={{ background: '#E07B2A' }}
            >
              Postavi prvi oglas
            </Link>
          </div>
        )}

        {!oglasiLoading && oglasi.length > 0 && (
          <div className='flex flex-col gap-3'>
            {oglasi.map((oglas) => (
              <div
                key={oglas._id}
                className='flex items-center gap-4 p-3 rounded-2xl shadow-sm'
                style={{ background: '#FDF9F4', border: '1px solid #DDD7CC' }}
              >
                {/* Naslovna slika */}
                <div className='w-16 h-16 rounded-xl overflow-hidden flex-shrink-0' style={{ background: '#F2EDE3' }}>
                  {oglas.imagesUrls?.[0] ? (
                    <img
                      src={oglas.imagesUrls[0]}
                      alt={oglas.name}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <svg className='w-6 h-6 text-gray-300' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 20.25h18A1.5 1.5 0 0022.5 18.75V6.75A1.5 1.5 0 0021 5.25H3A1.5 1.5 0 001.5 6.75v12A1.5 1.5 0 003 20.25z' />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Naziv */}
                <p className='flex-1 font-medium text-gray-800 truncate'>{oglas.name}</p>

                {/* Akcije */}
                <div className='flex items-center gap-2 flex-shrink-0'>
                  <Link
                    to={`/listing/${oglas._id}`}
                    className='text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150'
                    style={{ background: '#E07B2A', color: 'white', border: '1px solid #E07B2A' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#C45F12'}
                    onMouseLeave={e => e.currentTarget.style.background = '#E07B2A'}
                  >
                    Pogledaj
                  </Link>
                  <Link
                    to={`/edit-listing/${oglas._id}`}
                    className='text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150'
                    style={{ background: '#F2EDE3', color: '#1A1612', border: '1px solid #DDD7CC' }}
                  >
                    Edituj
                  </Link>
                  <button
                    onClick={() => handleDeleteListing(oglas._id)}
                    className='text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150'
                    style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
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
  );
}