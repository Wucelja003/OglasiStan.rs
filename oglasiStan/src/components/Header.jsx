import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className='bg-white shadow-sm border-b border-slate-200'>
      <div className='flex justify-between items-center max-w-6xl mx-auto px-4 py-4'>

        <Link to='/' className='flex items-center'>
          <h1 className='font-bold text-xl'>
            <span className='text-slate-500'>Oglasi</span>
            <span className='text-slate-700'>Stan</span>
          </h1>
        </Link>

        <form className='flex items-center bg-slate-100 hover:bg-slate-200 transition-colors rounded-full px-4 py-2 gap-2'>
          <FaSearch className='text-slate-400 text-sm flex-shrink-0' />
          <input
            type='text'
            placeholder='Pretražite ponude...'
            className='bg-transparent focus:outline-none text-sm text-slate-700 placeholder-slate-400 w-40 sm:w-64'
          />
        </form>

        <nav>
          <ul className='flex items-center gap-1'>
            <Link to='/'>
              <li className='hidden sm:inline px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors'>
                Početna
              </li>
            </Link>
            <Link to='/about'>
              <li className='hidden sm:inline px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors'>
                O nama
              </li>
            </Link>
            <Link to='/sign-in'>
              <li className='px-4 py-2 rounded-lg text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 transition-colors'>
                Registruj se
              </li>
            </Link>
          </ul>
        </nav>
    
      </div>
    </header>
  )
}
