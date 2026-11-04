import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import Home from './Pages/Home';
import PrivateRoute from './components/PrivateRoute'
import Header from './components/Header';
import Footer from './components/Footer';

// Lazy-load ruta — manji inicijalni bundle, brže učitavanje na telefonu
const SignIn = lazy(() => import('./Pages/SignIn'));
const SignUp = lazy(() => import('./Pages/SignUp'));
const About = lazy(() => import('./Pages/About'));
const Search = lazy(() => import('./Pages/Search'));
const Profile = lazy(() => import('./Pages/Profile'));
const CreateListing = lazy(() => import('./Pages/CreateListing'));
const EditListing = lazy(() => import('./Pages/EditListing'));
const Listing = lazy(() => import('./Pages/Listing'));

function PageLoader() {
  return (
    <div className='grid min-h-[70vh] place-items-center'>
      <div className='h-10 w-10 animate-spin rounded-full border-2 border-line border-t-accent' />
    </div>
  );
}

// Na promenu stranice skroluj na vrh (osim kad je u pitanju #anchor)
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

function NotFound() {
  return (
    <div className='container-x flex min-h-[70vh] flex-col items-center justify-center text-center'>
      <p className='font-display text-[9rem] font-bold leading-none tracking-tightest text-ink/10 sm:text-[14rem]'>404</p>
      <h1 className='h-display -mt-8 text-3xl sm:text-5xl'>Nothing lives here.</h1>
      <p className='mt-3 text-muted'>The page you’re looking for moved out.</p>
      <Link to='/' className='btn-primary mt-8'>Take me home</Link>
    </div>
  );
}

export default function App() {
  return <BrowserRouter>
    <ScrollToTop />
    <Header />
    <main>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />
          <Route path="/listing/:id" element={<Listing />} />

          <Route element={<PrivateRoute />} >
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/edit-listing/:id" element={<EditListing />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </main>
    <Footer />
  </BrowserRouter>
}
