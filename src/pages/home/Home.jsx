import { useState, useEffect } from 'react';
import { useLangStore } from '../../store/useLangStore';
import { getDestinations, getTours, getTestimonials } from '../../services/api';

import Hero from './components/Hero';
import AboutExperience from './components/AboutExperience';
import ServicesHighlights from './components/ServicesHighlights';
import Testimonials from './components/Testimonials';
import CallToAction from './components/CallToAction';
import SEO from '../../components/SEO';

export default function Home() {
  const { currentLang, translations } = useLangStore();
  const isRtl = currentLang === 'fa';
  const [destinations, setDestinations] = useState([]);
  const [tours, setTours] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDestinations(), getTours(), getTestimonials()])
      .then(([destRes, toursRes, testRes]) => {
        setDestinations(destRes?.data || destRes || []);
        setTours(toursRes?.data || toursRes || []);
        setTestimonials(testRes?.data || testRes || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Amovi API Error during Home init:', error);
        setLoading(false);
      });
  }, []);

  return (
    <main className={`w-full max-w-[1440px] mx-auto bg-[#14213D] text-white overflow-x-hidden ${currentLang === 'fa' ? 'font-[Sahel]' : 'font-[Inter]'} shadow-2xl`}>
      <SEO 
        title={isRtl ? 'کشف شگفتی‌ها، فرهنگ و تاریخ اصیل افغانستان' : 'Explore Afghanistan with Confidence & Authentic Experiences'}
        description={isRtl 
          ? 'سفرهای امن، معتبر و به‌یادماندنی در افغانستان با هدایت کارشناسان محلی و باسابقه آمووی ترول. خدمات کامل ویزا، اقامتگاه، ترانسفر اختصاصی و راهنمایان بومی.' 
          : 'Authentic, safe and memorable travel experiences across Afghanistan with trusted local expertise. Visa assistance, stays, transport and experienced guides.'}
        keywords="Amovi Travel, Afghanistan tourism, Kabul, Bamyan, Herat, visit Afghanistan, Band-e Amir, travel Afghanistan"
      />
      {/* هیرو سکشن اصلی */}
      <Hero currentLang={currentLang} />
      
      {/* درباره ما و تجربه */}
      <AboutExperience currentLang={currentLang} translations={translations} />
      
      {/* سکشن خدمات ۶گانه (هدف اسکرول نرم دکمه هیرو) */}
      <div id="featured-tours" className="w-full">
        <ServicesHighlights 
          currentLang={currentLang} 
          translations={translations} 
          destinations={destinations} 
          tours={tours} 
        />
      </div>
      
      {/* نظرات مسافران VIP */}
      <Testimonials 
        currentLang={currentLang} 
        translations={translations} 
        testimonials={testimonials} 
        loading={loading} 
      />

      {/* ۲. افزودن سکشن بنر دعوت به سفر (CTA) عینا مطابق با تصویر تمپلت */}
      <CallToAction currentLang={currentLang} />
    </main>
  );
}
