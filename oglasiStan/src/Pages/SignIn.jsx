import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({})
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/profile');
    } catch (err) {
      dispatch(signInFailure(err.message))
    }
  };

  const inputStyle = {
    background: '#F2EDE3',
    border: '1px solid #DDD7CC',
    color: '#1A1612',
  };
  const focusStyle = { border: '1.5px solid #E07B2A', boxShadow: '0 0 0 3px rgba(224,123,42,0.15)' };
  const blurStyle = { border: '1px solid #DDD7CC', boxShadow: 'none' };

  return (
    <div className='min-h-screen flex items-center justify-center px-4' style={{ background: '#FAF7F2' }}>
      <div className='w-full max-w-md'>

        {/* Logo */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-extrabold tracking-tight' style={{ color: '#1A1612' }}>
            Oglasi<span style={{ color: '#E07B2A' }}>Stan</span>
          </h1>
          <p className='mt-2 text-sm' style={{ color: '#6B6158' }}>Pronađi dom koji ti odgovara</p>
        </div>

        {/* Card */}
        <div className='rounded-2xl p-8 shadow-sm border' style={{ background: '#FDF9F4', borderColor: '#DDD7CC' }}>
          <h2 className='text-xl font-semibold mb-6' style={{ color: '#1A1612' }}>Prijavite se</h2>

          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1'>
              <label className='text-xs font-medium uppercase tracking-wide' style={{ color: '#6B6158' }}>
                Email
              </label>
              <input
                type='email'
                placeholder='email@primer.com'
                id='email'
                onChange={handleChange}
                className='rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200'
                style={inputStyle}
                onFocus={e => Object.assign(e.target.style, focusStyle)}
                onBlur={e => Object.assign(e.target.style, blurStyle)}
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-xs font-medium uppercase tracking-wide' style={{ color: '#6B6158' }}>
                Lozinka
              </label>
              <input
                type='password'
                placeholder='••••••••'
                id='password'
                onChange={handleChange}
                className='rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200'
                style={inputStyle}
                onFocus={e => Object.assign(e.target.style, focusStyle)}
                onBlur={e => Object.assign(e.target.style, blurStyle)}
              />
            </div>

            <button
              disabled={loading}
              className='mt-2 font-semibold py-3 rounded-xl text-sm uppercase tracking-wider transition-all duration-200 active:scale-95 disabled:opacity-60 text-white'
              style={{ background: '#E07B2A', boxShadow: '0 4px 20px rgba(224,123,42,0.3)' }}
              onMouseEnter={e => { e.target.style.background = '#C45F12'; }}
              onMouseLeave={e => { e.target.style.background = '#E07B2A'; }}
            >
              {loading ? 'Prijava je u toku...' : 'Prijavite se'}
            </button>
            <OAuth />
            {error && <p className='text-red-500 text-sm mt-1 text-center'>Neispravna lozinka ili email</p>}
          </form>

          <div className='flex items-center gap-3 my-6'>
            <div className='flex-1 h-px' style={{ background: '#DDD7CC' }} />
            <span className='text-xs' style={{ color: '#B5AFA5' }}>ili</span>
            <div className='flex-1 h-px' style={{ background: '#DDD7CC' }} />
          </div>

          <p className='text-center text-sm' style={{ color: '#6B6158' }}>
            Nemate nalog?{' '}
            <Link to='/sign-up'>
              <span className='font-semibold transition-colors duration-150' style={{ color: '#E07B2A' }}
                onMouseEnter={e => e.target.style.color = '#C45F12'}
                onMouseLeave={e => e.target.style.color = '#E07B2A'}
              >
                Registruj se
              </span>
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
