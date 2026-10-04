import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import BrandLoader from "../../components/BrandLoader";
import { useLoadingStore } from "../../store/useLoadingStore";

export default function MainLayout() {
  const { isLoading, showLoader } = useLoadingStore();

  // رهگیری فوری کلیک روی تمامی تب‌ها و لینک‌ها در فاز Capture
  // تا درست در همان لحظه کلیک و قبل از لود دیتا، فورا لوگو نمایش یابد
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const anchor = e.target.closest('a[href]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // فیلتر کردن لینک‌های خارجی، ایمیل، تماس، یا انکرهای درون‌صفحه‌ای
      if (
        href.startsWith('http') ||
        href.startsWith('//') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#')
      ) {
        return;
      }

      const targetPath = href.split('?')[0].split('#')[0];
      const currentPath = window.location.pathname;

      // اگر کاربر به صفحه دیگری می‌رود، فورا در همان لحظه کلیک لودر لوگو فعال می‌شود
      if (targetPath !== currentPath) {
        showLoader(480);
      }
    };

    // پوشش دکمه‌های جلو و عقب مرورگر
    const handlePopState = () => {
      showLoader(380);
    };

    window.addEventListener('click', handleGlobalClick, { capture: true });
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('click', handleGlobalClick, { capture: true });
      window.removeEventListener('popstate', handlePopState);
    };
  }, [showLoader]);

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* لودر لوگوی رسمی که بلافاصله با کلیک روی تب باز می‌شود و حین لود دیتا نمایش داده می‌شود */}
      {isLoading && <BrandLoader fullScreen />}

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
