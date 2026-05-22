import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth';
import {app} from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';


export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth,provider);

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name: result.user.displayName, email: result.user.email})
      })
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/')
    } catch (error) {
      console.log("Could not sign in with google", error);
    }
  };
  return (
    <button  onClick={handleGoogleClick} type='button'className='w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 active:scale-95 transition-all duration-200'>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="w-5 h-5 shrink-0"
      >
        <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.09-6.09C34.46 3.09 29.5 1 24 1 14.82 1 7.07 6.48 3.64 14.22l7.1 5.52C12.45 13.74 17.76 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.5 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.67c-.55 2.97-2.18 5.48-4.63 7.17l7.1 5.52C43.36 37.45 46.5 31.36 46.5 24.5z"/>
        <path fill="#FBBC05" d="M10.74 28.26A14.55 14.55 0 0 1 9.5 24c0-1.48.26-2.91.72-4.26L3.12 14.22A23.93 23.93 0 0 0 1 24c0 3.86.93 7.5 2.64 10.72l7.1-6.46z"/>
        <path fill="#34A853" d="M24 47c5.5 0 10.12-1.82 13.5-4.93l-7.1-5.52c-1.82 1.22-4.15 1.95-6.4 1.95-6.24 0-11.55-4.24-13.26-9.95l-7.1 6.46C7.07 41.52 14.82 47 24 47z"/>
      </svg>
      <span>Nastavi sa Google nalogom</span>
    </button>
  )
}
