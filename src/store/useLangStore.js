import { create } from 'zustand';
import enTranslations from '../locales/en.json';
import faTranslations from '../locales/fa.json';

const STORAGE_KEY = 'amovi_travel_lang';

// خواندن زبان ذخیره‌شده از LocalStorage یا پیش‌فرض انگلیسی
const getInitialLang = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'fa' || saved === 'en') {
      return saved;
    }
  }
  return 'en';
};

const initialLang = getInitialLang();
const isInitialFa = initialLang === 'fa';

if (typeof document !== 'undefined') {
  document.documentElement.dir = isInitialFa ? 'rtl' : 'ltr';
  document.documentElement.lang = initialLang;
}

export const useLangStore = create((set) => ({
  // ۱. زبان فعال با خواندن از حافظه محلی
  currentLang: initialLang,
  
  // ۲. متون ترجمه شده بر اساس زبان فعال
  translations: isInitialFa ? faTranslations : enTranslations,
  
  // ۳. تابع تغییر زبان همراه با ماندگاری در LocalStorage
  switchLanguage: (lang) => {
    const targetLang = lang === 'fa' ? 'fa' : 'en';
    const isFa = targetLang === 'fa';
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, targetLang);
    }
    
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isFa ? 'rtl' : 'ltr';
      document.documentElement.lang = targetLang;
    }
    
    set({
      currentLang: targetLang,
      translations: isFa ? faTranslations : enTranslations,
    });
  },
}));