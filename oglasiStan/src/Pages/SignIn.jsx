import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) { dispatch(signInFailure(data.message)); return; }
      dispatch(signInSuccess(data));
      navigate('/profile');
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  const inputStyle = { background: '#F2EDE3', border: '1px solid #DDD7CC', color: '#1A1612' };
  const focusStyle = { border: '1.5px solid #E07B2A', boxShadow: '0 0 0 3px rgba(224,123,42,0.12)' };
  const blurStyle  = { border: '1px solid #DDD7CC', boxShadow: 'none' };

  return (
    <div className='min-h-screen flex' style={{ background: '#FAF7F2' }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .auth-side  { animation: fadeIn 0.7s ease both; }
        .auth-card  { animation: fadeUp 0.6s 0.1s ease both; }
        .auth-row-1 { animation: fadeUp 0.5s 0.2s ease both; }
        .auth-row-2 { animation: fadeUp 0.5s 0.3s ease both; }
        .auth-row-3 { animation: fadeUp 0.5s 0.4s ease both; }
        .auth-row-4 { animation: fadeUp 0.5s 0.5s ease both; }
      `}</style>

      {/* LIJEVA STRANA — slika + tekst */}
      <div className='auth-side hidden lg:flex lg:w-1/2 relative overflow-hidden'>
        <img src='/NoviSad.jpg' alt='' className='absolute inset-0 w-full h-full object-cover'
          style={{ transform: 'scale(1.05)' }} />
        <div className='absolute inset-0'
          style={{ background: 'linear-gradient(135deg, rgba(26,22,18,0.5) 0%, rgba(26,22,18,0.85) 100%)' }} />

        <div className='relative z-10 flex flex-col justify-between p-12 text-white w-full'>
          <Link to='/' className='inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-80'>
            <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18' />
            </svg>
            Nazad na početnu
          </Link>

          <div>
            <div className='inline-flex items-center gap-2 rounded-full px-3 py-1 mb-5'
              style={{ background: 'rgba(224,123,42,0.18)', border: '1px solid rgba(224,123,42,0.4)' }}>
              <span className='w-1.5 h-1.5 rounded-full' style={{ background: '#E07B2A' }} />
              <span className='text-xs font-bold uppercase tracking-widest' style={{ color: '#E07B2A' }}>Dobrodošli nazad</span>
            </div>
            <h2 className='font-extrabold mb-4 leading-tight'
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', letterSpacing: '-0.02em' }}>
              Tvoj sledeći<br />dom čeka.
            </h2>
            <p className='text-base max-w-md leading-relaxed' style={{ color: 'rgba(255,255,255,0.7)' }}>
              Prijavi se i nastavi gdje si stao — pretraži oglase ili objavi svoj.
            </p>
          </div>

          <p className='text-xs' style={{ color: 'rgba(255,255,255,0.5)' }}>
            © {new Date().getFullYear()} OglasiStan.rs
          </p>
        </div>
      </div>

      {/* DESNA STRANA — forma */}
      <div className='w-full lg:w-1/2 flex items-center justify-center px-6 py-12'>
        <div className='auth-card w-full max-w-md'>

          {/* Logo na mobile-u */}
          <Link to='/' className='lg:hidden text-center block mb-8'>
            <h1 className='text-3xl font-extrabold tracking-tight' style={{ color: '#1A1612' }}>
              Oglasi<span style={{ color: '#E07B2A' }}>Stan</span>
            </h1>
          </Link>

          <div className='mb-8'>
            <p className='text-xs font-bold uppercase tracking-widest mb-2' style={{ color: '#E07B2A' }}>Prijava</p>
            <h1 className='text-3xl font-extrabold' style={{ color: '#1A1612', letterSpacing: '-0.02em' }}>
              Prijavi se
            </h1>
            <p className='text-sm mt-2' style={{ color: '#6B6158' }}>
              Unesi svoje podatke da bi pristupio nalogu.
            </p>
          </div>

          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

            {/* Email */}
            <div className='auth-row-1'>
              <label className='text-xs font-bold uppercase tracking-widest block mb-1.5' style={{ color: '#6B6158' }}>
                Email
              </label>
              <input
                type='email'
                placeholder='email@primer.com'
                id='email'
                onChange={handleChange}
                className='w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-200'
                style={inputStyle}
                onFocus={e => Object.assign(e.target.style, focusStyle)}
                onBlur={e => Object.assign(e.target.style, blurStyle)}
              />
            </div>

            {/* Lozinka */}
            <div className='auth-row-2'>
              <label className='text-xs font-bold uppercase tracking-widest block mb-1.5' style={{ color: '#6B6158' }}>
                Lozinka
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  id='password'
                  onChange={handleChange}
                  className='w-full rounded-xl px-4 py-3.5 pr-12 text-sm outline-none transition-all duration-200'
                  style={inputStyle}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e => Object.assign(e.target.style, blurStyle)}
                />
                <button type='button' onClick={() => setShowPassword(v => !v)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors'
                  style={{ color: '#B5AFA5' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#E07B2A'}
                  onMouseLeave={e => e.currentTarget.style.color = '#B5AFA5'}>
                  {showPassword ? (
                    <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88' />
                    </svg>
                  ) : (
                    <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z' />
                      <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              disabled={loading}
              className='auth-row-3 mt-2 w-full font-bold py-3.5 rounded-xl text-sm uppercase tracking-wider transition-all duration-200 disabled:opacity-60 text-white flex items-center justify-center gap-2'
              style={{ background: '#E07B2A', boxShadow: '0 4px 20px rgba(224,123,42,0.3)' }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#C45F12'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
              onMouseLeave={e => { e.currentTarget.style.background = '#E07B2A'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {loading ? (
                <>
                  <svg className='w-4 h-4 animate-spin' fill='none' viewBox='0 0 24 24'>
                    <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='3' opacity='0.25' />
                    <path d='M12 2a10 10 0 0110 10' stroke='currentColor' strokeWidth='3' strokeLinecap='round' />
                  </svg>
                  Prijava...
                </>
              ) : 'Prijavi se'}
            </button>

            {/* Separator */}
            <div className='auth-row-4 flex items-center gap-3 my-2'>
              <div className='flex-1 h-px' style={{ background: '#DDD7CC' }} />
              <span className='text-xs font-medium' style={{ color: '#B5AFA5' }}>ILI</span>
              <div className='flex-1 h-px' style={{ background: '#DDD7CC' }} />
            </div>

            <div className='auth-row-4'>
              <OAuth />
            </div>

            {error && (
              <div className='flex items-center gap-2 text-sm px-4 py-3 rounded-xl'
                style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)' }}>
                <svg className='w-4 h-4 flex-shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' />
                </svg>
                Neispravan email ili lozinka.
              </div>
            )}
          </form>

          <p className='text-center text-sm mt-6' style={{ color: '#6B6158' }}>
            Nemate nalog?{' '}
            <Link to='/sign-up' className='font-bold transition-colors' style={{ color: '#E07B2A' }}>
              Registruj se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
