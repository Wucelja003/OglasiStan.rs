import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LuEye, LuEyeOff, LuTriangleAlert, LuArrowRight } from 'react-icons/lu';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import AuthLayout from '../components/AuthLayout';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        setError(res.status === 401 || res.status === 404 ? 'Wrong email or password.' : data.message);
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/profile');
    } catch (err) {
      dispatch(signInFailure(err.message));
      setError('Network error. Please try again.');
    }
  };

  return (
    <AuthLayout
      eyebrow='Sign in'
      title='Welcome back.'
      subtitle='Pick up right where you left off.'
      footer={<>New here? <Link to='/sign-up' className='font-semibold text-accent hover:underline'>Create an account</Link></>}
    >
      <form onSubmit={handleSubmit} className='space-y-5'>
        <div>
          <label className='label' htmlFor='email'>Email</label>
          <input id='email' type='email' required autoComplete='email' placeholder='you@example.com' onChange={handleChange} className='input !py-3.5' />
        </div>
        <div>
          <label className='label' htmlFor='password'>Password</label>
          <div className='relative'>
            <input id='password' type={showPassword ? 'text' : 'password'} required autoComplete='current-password'
              placeholder='••••••••' onChange={handleChange} className='input !py-3.5 !pr-12' />
            <button type='button' onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}
              className='absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-dim hover:text-accent'>
              {showPassword ? <LuEyeOff className='h-4 w-4' /> : <LuEye className='h-4 w-4' />}
            </button>
          </div>
        </div>

        {error && (
          <p className='flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'>
            <LuTriangleAlert className='h-4 w-4 shrink-0' /> {error}
          </p>
        )}

        <button disabled={loading} className='btn-primary w-full !py-4 text-base'>
          {loading ? 'Signing in…' : <>Sign in <LuArrowRight className='h-4 w-4' /></>}
        </button>

        <div className='flex items-center gap-4 py-1'>
          <div className='h-px flex-1 bg-line' />
          <span className='font-sans text-[11px] uppercase tracking-[0.2em] text-dim'>or</span>
          <div className='h-px flex-1 bg-line' />
        </div>

        <OAuth />
      </form>
    </AuthLayout>
  );
}
