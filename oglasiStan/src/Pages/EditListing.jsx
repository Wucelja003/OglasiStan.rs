import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LuArrowLeft } from 'react-icons/lu';
import ListingForm, { listingToForm } from '../components/ListingForm';

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [initial, setInitial] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/listing/get/${id}`);
        const data = await res.json();
        if (data.success === false || data.userRef !== currentUser._id) {
          navigate('/profile');
          return;
        }
        setInitial({
          form: listingToForm(data),
          images: (data.imagesUrls || []).map((url, i) => ({ url, file: null, cover: i === 0 })),
        });
      } catch {
        navigate('/profile');
      }
    };
    load();
  }, [id, currentUser._id, navigate]);

  const handleSave = async (payload) => {
    const res = await fetch(`/api/listing/update/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ...payload, userRef: currentUser._id }),
    });
    const data = await res.json();
    if (data.success === false) throw new Error(data.message || 'Could not save your changes.');
    navigate(`/listing/${data._id}`);
  };

  if (!initial) {
    return (
      <div className='container-x grid min-h-[60vh] place-items-center'>
        <div className='h-10 w-10 animate-spin rounded-full border-2 border-line border-t-accent' />
      </div>
    );
  }

  return (
    <div className='container-x pb-24 pt-10 sm:pt-14'>
      <Link to={`/listing/${id}`} className='group mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-ink'>
        <LuArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-1' /> Back to listing
      </Link>
      <div className='mb-10 max-w-3xl animate-fade-up'>
        <p className='eyebrow mb-4'><span className='h-px w-6 bg-accent' />Edit listing</p>
        <h1 className='h-display text-5xl leading-[0.95] sm:text-7xl'>
          Fine-tune <span className='accent-italic'>the details.</span>
        </h1>
      </div>
      <ListingForm
        initialData={initial.form}
        initialImages={initial.images}
        submitLabel='Save changes'
        busyLabel='Saving…'
        onSave={handleSave}
      />
    </div>
  );
}
