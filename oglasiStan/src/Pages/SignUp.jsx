import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LuEye, LuEyeOff, LuTriangleAlert, LuCheck, LuArrowRight } from 'react-icons/lu';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import AuthLayout from '../components/AuthLayout';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const password = formData.password || '';
  const passwordChecks = [
    { label: '6+ characters', valid: password.length >= 6 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'One number', valid: /[0-9]/.test(password) },
    { label: 'One symbol (!@#…)', valid: /[^A-Za-z0-9]/.test(password) },
  ];
  const passed = passwordChecks.filter((c) => c.valid).length;
  const passwordValid = passed === passwordChecks.length;
  const showChecklist = passwordFocused || password.length > 0;
  const strengthColor = ['bg-line', 'bg-red-500', 'bg-orange-500', 'bg-amber-400', 'bg-emerald-400'][passed];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordValid) {
      setError('Your password doesn’t meet all the requirements yet.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/profile');
    } catch (err) {
      setError('Network error. Please try again.');
      dispatch(signInFailure(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow='Create account'
      title='Join in seconds.'
      subtitle='Free forever. Post your first listing right after.'
      footer={
        <>
          Already have an account? <Link to='/sign-in' className='font-semibold text-accent hover:underline'>Sign in</Link>
          <p className='mt-4 text-xs text-dim'>By creating an account you agree to our terms of use.</p>
        </>
      }
    >
      <form onSubmit={handleSubmit} className='space-y-5'>
        <div>
          <label className='label' htmlFor='username'>Username</label>
          <input id='username' type='text' required autoComplete='username' placeholder='e.g. marko123' onChange={handleChange} className='input !py-3.5' />
        </div>
        <div>
          <label className='label' htmlFor='email'>Email</label>
          <input id='email' type='email' required autoComplete='email' placeholder='you@example.com' onChange={handleChange} className='input !py-3.5' />
        </div>
        <div>
          <label className='label' htmlFor='password'>Password</label>
          <div className='relative'>
            <input
              id='password'
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete='new-password'
              placeholder='Make it strong'
              onChange={handleChange}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className='input !py-3.5 !pr-12'
            />
            <button type='button' onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}
              className='absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-dim hover:text-accent'>
              {showPassword ? <LuEyeOff className='h-4 w-4' /> : <LuEye className='h-4 w-4' />}
            </button>
          </div>

          {showChecklist && (
            <div className='mt-3 animate-fade-up'>
              <div className='flex gap-1'>
                {passwordChecks.map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < passed ? strengthColor : 'bg-line'}`} />
                ))}
              </div>
              <ul className='mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5'>
                {passwordChecks.map(({ label, valid }) => (
                  <li key={label} className={`flex items-center gap-2 text-xs transition-colors ${valid ? 'text-emerald-600' : 'text-dim'}`}>
                    <span className={`grid h-4 w-4 place-items-center rounded-full transition-all ${valid ? 'bg-emerald-100' : 'border border-ink/20'}`}>
                      {valid && <LuCheck className='h-2.5 w-2.5' strokeWidth={3.5} />}
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {error && (
          <p className='flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'>
            <LuTriangleAlert className='h-4 w-4 shrink-0' /> {error}
          </p>
        )}

        <button disabled={loading} className='btn-primary w-full !py-4 text-base'>
          {loading ? 'Creating account…' : <>Create account <LuArrowRight className='h-4 w-4' /></>}
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
