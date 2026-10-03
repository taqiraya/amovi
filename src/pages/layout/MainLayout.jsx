import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
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
