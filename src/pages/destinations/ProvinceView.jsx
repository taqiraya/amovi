import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLangStore } from '../../store/useLangStore';
import ProvinceHero from './components/ProvinceHero';
import { getProvinceBySlug } from '../../services/api';

export default function ProvinceView() {
  const { slug } = useParams(); // استخراج نام ولایت از آدرس مرورگر (مثلاً: kabul)
  const { currentLang } = useLangStore();
  const isRtl = currentLang === 'fa';

  const [province, setProvince] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getProvinceBySlug(slug).then((data) => {
      if (isMounted) {
        setProvince(data || null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center pt-32">
        <div className="text-xl font-bold text-slate-500 animate-pulse font-[Inter]">
          {isRtl ? 'در حال بارگذاری...' : 'Loading...'}
        </div>
      </div>
    );
  }

  // لایه دفاعی: در صورتی که ولایت در دیتابیس پیدا نشود
  if (!province) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4 pt-36">
        <h2 className="text-2xl font-bold text-[#14213D] mb-4">
          {isRtl ? "ولایت مورد نظر پیدا نشد" : "Province Not Found"}
        </h2>
        <Link to="/destinations" className="bg-[#FCA311] text-[#14213D] font-bold py-2.5 px-6 rounded-full shadow-md">
          {isRtl ? "مشاهده تمام ولایات" : "View All Destinations"}
        </Link>
      </div>
    );
  }

  // استخراج داده‌های دوزبانه ولایت جاری بر اساس زبان فعال سیستم
  const localData = province[currentLang] || province.en || {};

  return (
    <div className="w-full bg-[#F8FAFC] pb-12">
      {/* 👑 صدا زدن کامپوننت هیرو سکشن ولایت */}
      <ProvinceHero 
        province={province} 
        localData={localData} 
        isRtl={isRtl} 
      />

      {/* 📥 نگه‌دارنده بخش‌های بعدی (تاریخ، فرهنگ و دیدنی‌ها) */}
      <div id="explore-hub" className="w-[96%] max-w-[1600px] mx-auto mt-12 py-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-3xl bg-white shadow-sm">
        <p style={{ fontFamily: isRtl ? 'Sahel, sans-serif' : 'Inter, sans-serif' }}>
          {isRtl 
            ? "بخش‌های بعدی (داستان تاریخ و فرهنگ ولایت) در گام بعدی به این قسمت اضافه می‌شوند..." 
            : "The next sections (History and Culture Story) will be added here in the next step..."}
        </p>
      </div>
    </div>
  );
}
