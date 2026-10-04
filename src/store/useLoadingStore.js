import { create } from 'zustand';

/**
 * مدیریت وضعیت لودینگ سراسری برنامه
 * به محض کلیک کاربر روی هر تب یا لینک ناوبری، فورا فعال می‌شود
 * تا هنگام لود شدن دیتا و محتوای صفحه جدید، فقط لوگوی شرکت نمایش داده شود.
 */
export const useLoadingStore = create((set, get) => ({
  isLoading: false,
  timerId: null,

  showLoader: (duration = 450) => {
    const currentTimer = get().timerId;
    if (currentTimer) {
      clearTimeout(currentTimer);
    }

    set({ isLoading: true });

    const timerId = setTimeout(() => {
      set({ isLoading: false, timerId: null });
    }, duration);

    set({ timerId });
  },

  hideLoader: () => {
    const currentTimer = get().timerId;
    if (currentTimer) {
      clearTimeout(currentTimer);
    }
    set({ isLoading: false, timerId: null });
  }
}));
