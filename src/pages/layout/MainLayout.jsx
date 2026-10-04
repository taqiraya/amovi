import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import BrandLoader from "../../components/BrandLoader";

export default function MainLayout() {
  const location = useLocation();
  const [prevPath, setPrevPath] = useState(location.pathname);
  const [isNavigating, setIsNavigating] = useState(false);

  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setIsNavigating(true);
  }

  useEffect(() => {
    if (isNavigating) {
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 280);
      return () => clearTimeout(timer);
    }
  }, [isNavigating]);

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* ترنزیشن لودینگ برند هنگام جابجایی بین تب‌ها و صفحات برای جلوگیری از پرش ناگهانی */}
      {isNavigating && (
        <div className="fixed inset-0 z-[60] bg-white/85 backdrop-blur-sm pointer-events-none transition-opacity duration-300">
          <BrandLoader fullScreen={false} minHeight="min-h-screen" />
        </div>
      )}

      {/* هدر سراسری شناور بالای تمام صفحات عمومی */}
      <div className="fixed top-4 left-0 w-full z-50 px-3 sm:px-6 pointer-events-none">
        <div className="max-w-[1600px] mx-auto w-full pointer-events-auto">
          <Header />
        </div>
      </div>

      {/* محتوای متغیر صفحات در این قسمت رندر می‌شود */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* فوتر در پایین تمام صفحات */}
      <Footer />
    </div>
  );
}
