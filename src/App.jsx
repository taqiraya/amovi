import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useLangStore } from './store/useLangStore';

// ۱. ایمپورت لایوت اصلی و صفحه ادمین
import MainLayout from './pages/layout/MainLayout';
import AdminPanel from './pages/admin/AdminPanel';

// ۲. ایمپورت بقیه صفحات ۹گانه
import Home from './pages/home/Home';
import About from './pages/about/About';
import Services from './pages/services/Services';
import Tours from './pages/tours/Tours';
import Destinations from './pages/destinations/Destinations';
import ProvinceView from './pages/destinations/ProvinceView';
import PlaceDetail from './pages/destinations/PlaceDetail';
import Blog from './pages/blog/Blog';
import BlogDetail from './pages/blog/BlogDetail';
import Contact from './pages/contact/Contact';
import Gallery from './pages/gallery/Gallery';
import Policy from './pages/policy/Policy';
import PaymentMethods from './pages/payment/PaymentMethods';
import NotFound from './pages/notFound/NotFound';

import ScrollToTop from './components/ScrollToTop';

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
    </div>
  );
}

export default App;