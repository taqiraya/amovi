import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useLangStore } from './store/useLangStore';

// لایوت اصلی و کامپوننت اسکرول به بالا
import MainLayout from './pages/layout/MainLayout';
import ScrollToTop from './components/ScrollToTop';

// بارگذاری تنبل صفحات (Lazy Loading برای تقسیم چانک‌ها و افزایش سرعت لود)
const Home = lazy(() => import('./pages/home/Home'));
const About = lazy(() => import('./pages/about/About'));
const Services = lazy(() => import('./pages/services/Services'));
const Tours = lazy(() => import('./pages/tours/Tours'));
const Destinations = lazy(() => import('./pages/destinations/Destinations'));
const ProvinceView = lazy(() => import('./pages/destinations/ProvinceView'));
const PlaceDetail = lazy(() => import('./pages/destinations/PlaceDetail'));
const Blog = lazy(() => import('./pages/blog/Blog'));
const BlogDetail = lazy(() => import('./pages/blog/BlogDetail'));
const Contact = lazy(() => import('./pages/contact/Contact'));
const Gallery = lazy(() => import('./pages/gallery/Gallery'));
const Policy = lazy(() => import('./pages/policy/Policy'));
const PaymentMethods = lazy(() => import('./pages/payment/PaymentMethods'));
const AdminPanel = lazy(() => import('./pages/admin/AdminPanel'));
const NotFound = lazy(() => import('./pages/notFound/NotFound'));

function PageLoader() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#FCA311] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function App() {
  const { currentLang } = useLangStore();

  useEffect(() => {
    const isFa = currentLang === 'fa';
    document.documentElement.dir = isFa ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* گروه اول روت‌ها: تمام صفحات داخل لایوت اصلی (همراه هدر و فوتر) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:slug" element={<ProvinceView />} />
            <Route path="/destinations/:slug/:placeId" element={<PlaceDetail />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="/privacy-policy" element={<Policy defaultTab="privacy" />} />
            <Route path="/terms-and-conditions" element={<Policy defaultTab="terms" />} />
            <Route path="/booking-terms" element={<Policy defaultTab="booking" />} />
            <Route path="/payment-methods" element={<PaymentMethods />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* گروه دوم روت‌ها: صفحه ادمین کاملاً مستقل (بدون هدر و فوتر) */}
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;