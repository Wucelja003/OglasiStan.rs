import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
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
    <div className='min-h-[60vh] flex items-center justify-center' style={{ background: '#FAF7F2' }}>
      <div
        className='w-10 h-10 rounded-full border-4 border-t-transparent animate-spin'
        style={{ borderColor: '#DDD7CC', borderTopColor: '#E07B2A' }}
      />
    </div>
  );
}

export default function App() {
  return <BrowserRouter>
    <Header />
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
      </Routes>
    </Suspense>
    <Footer />
  </BrowserRouter>
}
