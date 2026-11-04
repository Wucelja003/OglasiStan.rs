import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ListingForm from '../components/ListingForm';

export default function CreateListing() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const handleSave = async (payload) => {
    const res = await fetch('/api/listing/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ...payload, userRef: currentUser._id }),
    });
    const data = await res.json();
    if (data.success === false) throw new Error(data.message || 'Could not publish the listing.');
    navigate(`/listing/${data._id}`);
  };

  return (
    <div className='container-x pb-24 pt-10 sm:pt-14'>
      <div className='mb-10 max-w-3xl animate-fade-up'>
        <p className='eyebrow mb-4'><span className='h-px w-6 bg-accent' />New listing</p>
        <h1 className='h-display text-5xl leading-[0.95] sm:text-7xl'>
          Let’s get your place <span className='accent-italic'>seen.</span>
        </h1>
        <p className='mt-4 text-lg text-muted'>Five quick sections. Watch your listing come together on the right.</p>
      </div>
      <ListingForm submitLabel='Publish listing' busyLabel='Publishing…' onSave={handleSave} />
    </div>
  );
}
