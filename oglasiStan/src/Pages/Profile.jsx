import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LuPlus, LuPencil, LuTrash2, LuEye, LuLogOut, LuCheck, LuTriangleAlert, LuHouse, LuArrowUpRight,
} from 'react-icons/lu';
import {
  updateUserStart, updateUserSuccess, updateUserFailure,
  deleteUserStart, deleteUserSuccess, deleteUserFailure,
  signOutUserStart, signOutUserSuccess, signOutUserFailure,
} from '../redux/user/userSlice';
import { optimizeImg } from '../utils/img';
import { formatPrice, pricePerM2, typeLabel, isRent, getInitials } from '../utils/format';
import CountUp from '../components/rb/CountUp';

function ListingRow({ listing, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const perM2 = pricePerM2(listing.regularPrice, listing.area);
  const cover = listing.imagesUrls?.[0];

  return (
    <div className='group flex flex-col gap-4 rounded-2xl border border-line bg-card p-3 transition-colors hover:border-ink/20 sm:flex-row sm:items-center'>
      <Link to={`/listing/${listing._id}`} className='flex min-w-0 flex-1 items-center gap-4'>
        <div className='h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-sand'>
          {cover ? (
            <img src={optimizeImg(cover, 200)} alt={listing.name} loading='lazy' className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110' />
          ) : (
            <div className='bg-grid grid h-full w-full place-items-center'><LuHouse className='h-6 w-6 text-ink/15' /></div>
          )}
        </div>
        <div className='min-w-0'>
          <div className='flex items-center gap-2'>
            <span className={`rounded-full px-2 py-0.5 font-sans text-[9px] uppercase tracking-[0.14em] ${isRent(listing.type) ? 'bg-accent text-white' : 'border border-ink/20 text-muted'}`}>
              {typeLabel(listing.type)}
            </span>
          </div>
          <p className='mt-1.5 truncate font-semibold text-ink'>{listing.name}</p>
          <p className='mt-0.5 text-sm text-muted'>
            <span className='font-display font-semibold text-ink'>{formatPrice(listing.regularPrice)}</span>
            {isRent(listing.type) && '/mo'}
            {perM2 && <span className='ml-2 font-sans text-xs text-accent'>{formatPrice(perM2)}/m²</span>}
          </p>
        </div>
      </Link>

      <div className='flex items-center gap-2 sm:pr-1'>
        {confirming ? (
          <>
            <span className='mr-1 text-xs text-muted'>Delete?</span>
            <button type='button' onClick={() => onDelete(listing._id)} className='btn-danger !px-3 !py-2'>Yes, delete</button>
            <button type='button' onClick={() => setConfirming(false)} className='btn-ghost !px-3 !py-2'>Cancel</button>
          </>
        ) : (
          <>
            <Link to={`/listing/${listing._id}`} aria-label='View' className='btn-ghost !p-2.5'><LuEye className='h-4 w-4' /></Link>
            <Link to={`/edit-listing/${listing._id}`} className='btn-ghost !px-3.5 !py-2.5'><LuPencil className='h-4 w-4' /> Edit</Link>
            <button type='button' onClick={() => setConfirming(true)} aria-label='Delete' className='btn-danger !p-2.5'><LuTrash2 className='h-4 w-4' /></button>
          </>
        )}
      </div>
    </div>
  );
}

export default function Profile() {
  const { currentUser, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      setListingsLoading(true);
      try {
        const res = await fetch(`/api/listing/user/${currentUser._id}`, { credentials: 'include' });
        // Token istekao / nema cookie-ja -> odjavi korisnika umesto tihog praznog profila
        if (res.status === 401 || res.status === 403) {
          dispatch(signOutUserSuccess());
          return;
        }
        const data = await res.json();
        setListings(Array.isArray(data) ? data : []);
      } catch {
        setListings([]);
      } finally {
        setListingsLoading(false);
      }
    };
    fetchListings();
  }, [currentUser._id, dispatch]);

  const handleDeleteListing = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (data.success === false) return;
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateError(null);
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        setUpdateError(data.message);
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setUpdateError(error.message);
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
      const res = await fetch('/api/auth/signout', { credentials: 'include' });
      const data = await res.json();
      if (data.success === false) { dispatch(signOutUserFailure(data.message)); return; }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const forSale = listings.filter((l) => !isRent(l.type)).length;
  const forRent = listings.length - forSale;
  const memberSince = currentUser.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  return (
    <div className='pb-24'>
      {/* Zaglavlje */}
      <section className='noise relative overflow-hidden border-b border-line'>
        <div className='absolute -left-20 -top-32 h-96 w-96 animate-drift rounded-full bg-accent/20 blur-[110px]' />
        <div className='bg-grid mask-fade-b absolute inset-0' />
        <div className='container-x relative py-12 sm:py-16'>
          <div className='flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between'>
            <div className='flex items-center gap-5 animate-fade-up'>
              <div className='grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-deep font-display text-3xl font-bold text-white shadow-2xl shadow-accent/30 sm:h-24 sm:w-24'>
                {getInitials(currentUser.username)}
              </div>
              <div className='min-w-0'>
                <p className='font-sans text-xs uppercase tracking-[0.18em] text-dim'>Dashboard</p>
                <h1 className='h-display mt-1 truncate text-4xl leading-none sm:text-6xl'>Hey, {currentUser.username}.</h1>
                <p className='mt-2 text-sm text-muted'>
                  {currentUser.email}{memberSince && <span className='text-dim'> · Member since {memberSince}</span>}
                </p>
              </div>
            </div>
            <Link to='/create-listing' className='btn-primary self-start !px-6 !py-3.5 lg:self-auto'>
              <LuPlus className='h-4 w-4' /> New listing
            </Link>
          </div>

          <div className='mt-10 grid max-w-2xl grid-cols-3 overflow-hidden rounded-2xl border border-line bg-sand/60'>
            {[
              { label: 'Listings', value: listings.length },
              { label: 'For sale', value: forSale },
              { label: 'For rent', value: forRent },
            ].map((s, i) => (
              <div key={s.label} className={`p-5 ${i ? 'border-l border-line' : ''}`}>
                <p className='font-display text-3xl font-bold tracking-tight'>
                  {listingsLoading ? '—' : <CountUp to={s.value} duration={1} />}
                </p>
                <p className='mt-1 font-sans text-[10px] uppercase tracking-[0.16em] text-dim'>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className='container-x mt-12 grid gap-10 lg:grid-cols-[1fr_380px]'>
        {/* Oglasi */}
        <section className='min-w-0'>
          <div className='mb-6 flex items-end justify-between'>
            <div>
              <p className='eyebrow mb-3'><span className='h-px w-6 bg-accent' />Your listings</p>
              <h2 className='h-display text-3xl'>Portfolio</h2>
            </div>
          </div>

          {listingsLoading ? (
            <div className='space-y-3'>
              {[0, 1, 2].map((i) => <div key={i} className='h-[104px] animate-pulse rounded-2xl bg-card' />)}
            </div>
          ) : listings.length === 0 ? (
            <div className='panel bg-grid flex flex-col items-center px-6 py-16 text-center'>
              <span className='grid h-14 w-14 place-items-center rounded-2xl border border-accent/25 bg-accent/10 text-accent'>
                <LuHouse className='h-6 w-6' />
              </span>
              <p className='h-display mt-5 text-2xl'>No listings yet</p>
              <p className='mt-2 max-w-xs text-sm text-muted'>Post your first property — it takes about two minutes and costs nothing.</p>
              <Link to='/create-listing' className='btn-primary mt-6'>Post a listing <LuArrowUpRight className='h-4 w-4' /></Link>
            </div>
          ) : (
            <div className='space-y-3'>
              {listings.map((l, i) => (
                <div key={l._id} className='animate-fade-up' style={{ animationDelay: `${i * 60}ms` }}>
                  <ListingRow listing={l} onDelete={handleDeleteListing} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Podešavanja */}
        <aside className='space-y-4 lg:sticky lg:top-28 lg:self-start'>
          <form onSubmit={handleSubmit} className='panel space-y-4 p-6 sm:p-7'>
            <p className='font-display text-lg font-semibold'>Account settings</p>
            <div>
              <label className='label' htmlFor='username'>Username</label>
              <input id='username' type='text' defaultValue={currentUser.username} onChange={handleChange} className='input' />
            </div>
            <div>
              <label className='label' htmlFor='email'>Email</label>
              <input id='email' type='email' defaultValue={currentUser.email} onChange={handleChange} className='input' />
            </div>
            <div>
              <label className='label' htmlFor='password'>New password</label>
              <input id='password' type='password' onChange={handleChange} placeholder='Leave blank to keep current' className='input' />
            </div>

            {updateError && (
              <p className='flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600'>
                <LuTriangleAlert className='mt-0.5 h-4 w-4 shrink-0' /> {updateError}
              </p>
            )}
            {updateSuccess && (
              <p className='flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700'>
                <LuCheck className='h-4 w-4' /> Changes saved.
              </p>
            )}

            <button type='submit' disabled={loading} className='btn-primary w-full'>
              {loading ? 'Saving…' : 'Save changes'}
            </button>
          </form>

          <div className='panel p-6 sm:p-7'>
            <button type='button' onClick={handleSignOut} className='btn-ghost w-full'>
              <LuLogOut className='h-4 w-4' /> Sign out
            </button>

            <div className='mt-6 border-t border-line pt-6'>
              <p className='text-sm font-semibold text-ink'>Danger zone</p>
              <p className='mt-1 text-xs text-dim'>Deleting your account can’t be undone.</p>
              {confirmDeleteAccount ? (
                <div className='mt-4 flex gap-2'>
                  <button type='button' onClick={handleDeleteUser} className='btn-danger flex-1'>Yes, delete it</button>
                  <button type='button' onClick={() => setConfirmDeleteAccount(false)} className='btn-ghost flex-1'>Cancel</button>
                </div>
              ) : (
                <button type='button' onClick={() => setConfirmDeleteAccount(true)} className='btn-danger mt-4 w-full'>
                  <LuTrash2 className='h-4 w-4' /> Delete account
                </button>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
