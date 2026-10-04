import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Mail, 
  MapPin, 
  Search, 
  Home, 
  Download,
  LogOut,
  Eye,
  Trash2,
  CheckCircle2,
  Image as ImageIcon,
  Upload,
  Menu,
  X,
  Settings,
  Phone,
  Link as LinkIcon,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { 
  getMasterRequests, 
  getContactMessages, 
  updateMessageStatus, 
  deleteContactMessage,
  getSettings,
  updateSettings,
  getGalleryItems,
  uploadGalleryItem,
  deleteGalleryItem,
  getBlogPosts,
  createBlogPost,
  deleteBlogPost
} from '../../services/api';
import localDb from '../../../db.json';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('messages'); // 'messages', 'settings', 'gallery', 'bookings'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // دیتای پیام‌ها و درخواست‌ها
  const [contactMessages, setContactMessages] = useState([]);
  const [masterRequests, setMasterRequests] = useState(localDb.masterRequests || []);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // دیتای تنظیمات تماس
  const [settingsForm, setSettingsForm] = useState({
    email: 'info@amovitravel.com',
    phone: '+93 70 633 8223',
    address: 'چهارراهی انصاری، شهرنو، کابل، افغانستان',
    locationUrl: 'https://www.google.com/maps/search/?api=1&query=Char+Rahi+Ansari+Shahr-e+Naw+Kabul+Afghanistan'
  });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);

  // دیتای گالری
  const [galleryList, setGalleryList] = useState([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [newImageForm, setNewImageForm] = useState({
    title: '',
    category: 'kabul',
    location: 'کابل',
    file: null
  });

  // دیتای وبلاگ
  const [blogList, setBlogList] = useState([]);
  const [blogUploading, setBlogUploading] = useState(false);
  const [blogSuccess, setBlogSuccess] = useState('');
  const [blogError, setBlogError] = useState('');
  const [newBlogForm, setNewBlogForm] = useState({
    title: '',
    author: 'تیم گردشگری آمووی',
    content: '',
    file: null
  });

  // وضعیت لاگین
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(sessionStorage.getItem('amovi_admin_token'));
  });
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: 'admin' });
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username.trim() === 'admin' && loginForm.password.trim() === 'admin') {
      sessionStorage.setItem('amovi_admin_token', 'amovi_admin_authenticated');
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('نام کاربری یا رمز عبور اشتباه است.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('amovi_admin_token');
    setIsAuthenticated(false);
  };

  const refreshAllData = () => {
    getContactMessages().then((data) => {
      if (Array.isArray(data)) setContactMessages(data);
    });
    getSettings().then((data) => {
      if (data) setSettingsForm(data);
    });
    getGalleryItems().then((items) => {
      if (Array.isArray(items)) setGalleryList(items);
    });
    getMasterRequests().then((data) => {
      if (Array.isArray(data)) setMasterRequests(data);
    });
    getBlogPosts().then((posts) => {
      if (Array.isArray(posts)) setBlogList(posts);
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshAllData();
    }
  }, [isAuthenticated]);

  // تغییر وضعیت پیام (خوانده شد / جدید)
  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'unread' ? 'read' : 'unread';
    try {
      await updateMessageStatus(id, nextStatus);
      setContactMessages((prev) => 
        prev.map((m) => m.id === id ? { ...m, status: nextStatus } : m)
      );
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status: nextStatus });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // حذف پیام
  const handleDeleteMessage = async (id) => {
    if (!window.confirm('آیا از حذف این پیام اطمینان دارید؟')) return;
    try {
      await deleteContactMessage(id);
      setContactMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ذخیره اطلاعات تماس
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsLoading(true);
    try {
      await updateSettings(settingsForm);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 4000);
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('خطا در ذخیره تنظیمات');
    } finally {
      setSettingsLoading(false);
    }
  };

  // آپلود عکس به گالری
  const handleUploadImage = async (e) => {
    e.preventDefault();
    if (!newImageForm.file) {
      setUploadError('لطفاً یک فایل تصویر انتخاب فرمایید.');
      return;
    }
    setGalleryUploading(true);
    setUploadError('');
    setUploadSuccess('');

    const formData = new FormData();
    formData.append('image', newImageForm.file);
    formData.append('title', newImageForm.title.trim() || 'تصویر گالری آمووی');
    formData.append('category', newImageForm.category);
    formData.append('location', newImageForm.location.trim() || 'افغانستان');

    try {
      const res = await uploadGalleryItem(formData);
      if (res.success && res.data) {
        setGalleryList((prev) => [res.data, ...prev]);
        setUploadSuccess(`تصویر با موفقیت به WebP تبدیل و فشرده شد (${res.data.fileSizeKB || 0} کیلوبایت).`);
        setNewImageForm({ title: '', category: 'kabul', location: 'کابل', file: null });
        // پاک کردن ورودی فایل
        const fileInput = document.getElementById('galleryFileInput');
        if (fileInput) fileInput.value = '';
        setTimeout(() => setUploadSuccess(''), 5000);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError('خطا در تبدیل یا آپلود تصویر. لطفاً دوباره تلاش نمایید.');
    } finally {
      setGalleryUploading(false);
    }
  };

  // حذف عکس از گالری
  const handleDeleteGallery = async (id) => {
    if (!window.confirm('آیا از حذف این تصویر از گالری اطمینان دارید؟')) return;
    try {
      await deleteGalleryItem(id);
      setGalleryList((prev) => prev.filter((img) => img.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // انتشار مقاله جدید وبلاگ
  const handleCreateBlog = async (e) => {
    e.preventDefault();
    if (!newBlogForm.title.trim() || !newBlogForm.content.trim()) {
      setBlogError('لطفاً عنوان و متن مقاله را وارد فرمایید.');
      return;
    }
    setBlogUploading(true);
    setBlogError('');
    setBlogSuccess('');

    const formData = new FormData();
    if (newBlogForm.file) {
      formData.append('image', newBlogForm.file);
    }
    formData.append('title', newBlogForm.title.trim());
    formData.append('author', newBlogForm.author.trim() || 'تیم گردشگری آمووی');
    formData.append('content', newBlogForm.content);

    try {
      const res = await createBlogPost(formData);
      if (res.success && res.data) {
        setBlogList((prev) => [res.data, ...prev]);
        setBlogSuccess('مقاله جدید با موفقیت ذخیره و منتشر شد.');
        setNewBlogForm({
          title: '',
          author: 'تیم گردشگری آمووی',
          content: '',
          file: null
        });
        const fileInput = document.getElementById('blogFileInput');
        if (fileInput) fileInput.value = '';
        setTimeout(() => setBlogSuccess(''), 5000);
      }
    } catch (err) {
      console.error('Blog create error:', err);
      setBlogError('خطا در انتشار مقاله. لطفاً دوباره تلاش نمایید.');
    } finally {
      setBlogUploading(false);
    }
  };

  // حذف مقاله وبلاگ
  const handleDeleteBlog = async (id) => {
    if (!window.confirm('آیا از حذف این مقاله وبلاگ اطمینان دارید؟')) return;
    try {
      await deleteBlogPost(id);
      setBlogList((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Blog delete error:', err);
      alert('خطا در حذف مقاله وبلاگ');
    }
  };

  // فیلتر جستجوی پیام‌ها
  const filteredMessages = contactMessages.filter((msg) => {
    const q = searchTerm.toLowerCase();
    return (
      (msg.fullName || '').toLowerCase().includes(q) ||
      (msg.email || '').toLowerCase().includes(q) ||
      (msg.subject || '').toLowerCase().includes(q) ||
      (msg.message || '').toLowerCase().includes(q) ||
      (msg.phoneWhatsApp || '').toLowerCase().includes(q)
    );
  });

  const unreadCount = contactMessages.filter((m) => m.status === 'unread').length;

  const exportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ 
      contactMessages, 
      settings: settingsForm, 
      gallery: galleryList,
      blogPosts: blogList,
      masterRequests 
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `amovi_admin_export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // صفحه لاگین (در رنگ روشن و لوکس)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-slate-800 font-[Inter]" dir="rtl">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white border border-amber-300 p-2.5 shadow-md flex items-center justify-center">
              <img src="/logo.png" alt="Amovi Travel" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-black text-[#14213D]">Amovi Travel</h1>
            <p className="text-xs uppercase tracking-[0.2em] text-[#FCA311] font-bold mt-1">Management Portal</p>
            <p className="text-xs text-slate-500 mt-2 font-medium">ورود به پنل مدیریت پیام‌ها، اطلاعات و گالری</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl text-xs font-bold text-center bg-rose-50 text-rose-700 border border-rose-200">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">نام کاربری</label>
              <input
                type="text"
                required
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="admin"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#FCA311] focus:bg-white"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">رمز عبور</label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="admin"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#FCA311] focus:bg-white"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-extrabold text-sm tracking-wider uppercase transition-all shadow-md hover:scale-[1.01] cursor-pointer mt-2"
            >
              ورود به پنل مدیریت
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-500">
            نام کاربری: <span className="font-mono font-bold text-[#14213D]">admin</span> | رمز عبور: <span className="font-mono font-bold text-[#14213D]">admin</span>
          </div>
        </div>
      </div>
    );
  }

  // پنل مدیریت با تم روشن، سایدبار و طراحی کاملاً ریسپانسیو
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-[Inter] flex" dir="rtl">
      
      {/* اوورلی سایدبار در موبایل */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* سایدبار ناوبری مدرن */}
      <aside className={`fixed lg:static top-0 right-0 bottom-0 z-50 w-72 bg-white border-l border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
        mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full lg:translate-x-0'
      }`}>
        <div>
          {/* هدر سایدبار با لوگو */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-amber-300 p-1.5 shadow-xs flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="Amovi Travel" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="block text-base font-black text-[#14213D]">Amovi Travel</span>
                <span className="block text-[10px] text-[#FCA311] font-bold uppercase tracking-wider">Control Hub</span>
              </div>
            </div>
            <button 
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X size={18} />
            </button>
          </div>

          {/* آیتم‌های منو */}
          <nav className="p-4 space-y-1.5">
            <button
              onClick={() => { setActiveTab('messages'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-[#14213D] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-[#14213D]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mail size={16} className={activeTab === 'messages' ? 'text-[#FCA311]' : 'text-slate-400'} />
                <span>پیام‌های تماس با ما</span>
              </div>
              {unreadCount > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === 'messages' ? 'bg-[#FCA311] text-[#14213D]' : 'bg-amber-100 text-amber-800'
                }`}>
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('settings'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#14213D] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-[#14213D]'
              }`}
            >
              <Settings size={16} className={activeTab === 'settings' ? 'text-[#FCA311]' : 'text-slate-400'} />
              <span>اطلاعات و آدرس تماس</span>
            </button>

            <button
              onClick={() => { setActiveTab('gallery'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-[#14213D] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-[#14213D]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon size={16} className={activeTab === 'gallery' ? 'text-[#FCA311]' : 'text-slate-400'} />
                <span>مدیریت گالری تصاویر</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'gallery' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {galleryList.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('blog'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'blog'
                  ? 'bg-[#14213D] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-[#14213D]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen size={16} className={activeTab === 'blog' ? 'text-[#FCA311]' : 'text-slate-400'} />
                <span>مدیریت مقالات وبلاگ</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'blog' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {blogList.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('bookings'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-[#14213D] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-[#14213D]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users size={16} className={activeTab === 'bookings' ? 'text-[#FCA311]' : 'text-slate-400'} />
                <span>درخواست‌های رزرواسیون</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'bookings' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {masterRequests.length}
              </span>
            </button>
          </nav>
        </div>

        {/* پایین سایدبار */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#14213D] text-xs font-bold transition"
          >
            <Home size={14} />
            <span>مشاهده وب‌سایت</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition cursor-pointer"
          >
            <LogOut size={14} />
            <span>خروج از حساب</span>
          </button>
        </div>
      </aside>

      {/* بخش محتوای اصلی */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* نوار بالای صفحه (Header) */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#14213D]">
                {activeTab === 'messages' && 'پیام‌های دریافتی فرم تماس با ما'}
                {activeTab === 'settings' && 'تنظیمات و اطلاعات تماس شرکت'}
                {activeTab === 'gallery' && 'مدیریت و آپلود تصاویر گالری (WebP)'}
                {activeTab === 'blog' && 'مدیریت و انتشار مقالات وبلاگ'}
                {activeTab === 'bookings' && 'درخواست‌های رزرواسیون تورها'}
              </h2>
              <p className="text-[11px] text-slate-500 hidden sm:block">سیستم جامع کنترل و مدیریت عملیات آمووی ترول</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={exportData}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              <Download size={14} />
              <span className="hidden sm:inline">خروجی JSON</span>
            </button>
          </div>
        </header>

        {/* محتوای تب‌ها */}
        <main className="p-4 sm:p-8 flex-1 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* ========================================================
              تب ۱: پیام‌های تماس با ما (جدول با دکمه مشاهده کامل پیام)
          ======================================================== */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              {/* کارت‌های خلاصه آمار */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-500 font-bold block mb-1">کل پیام‌های دریافتی</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#14213D] font-mono">{contactMessages.length}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs text-amber-600 font-bold block mb-1">پیام‌های جدید (نخوانده)</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#FCA311] font-mono">{unreadCount}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs text-emerald-600 font-bold block mb-1">پیام‌های بررسی‌شده</span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">{contactMessages.length - unreadCount}</span>
                </div>
              </div>

              {/* کادر جدول و جستجو */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="جستجو در نام، ایمیل، شماره، پیام..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pr-9 pl-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FCA311] focus:bg-white"
                    />
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{filteredMessages.length} پیام یافت شد</span>
                </div>

                {filteredMessages.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-xs font-medium">
                    هیچ پیامی مطابق با جستجوی شما یافت نشد.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs text-slate-700">
                      <thead className="bg-slate-50 text-slate-600 font-bold text-[11px] border-b border-slate-200">
                        <tr>
                          <th className="py-3.5 px-4">شناسه</th>
                          <th className="py-3.5 px-4">نام فرستنده</th>
                          <th className="py-3.5 px-4">اطلاعات تماس</th>
                          <th className="py-3.5 px-4">موضوع</th>
                          <th className="py-3.5 px-4">خلاصه پیام</th>
                          <th className="py-3.5 px-4">وضعیت</th>
                          <th className="py-3.5 px-4">تاریخ ارسال</th>
                          <th className="py-3.5 px-4 text-center">عملیات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredMessages.map((msg) => {
                          const isUnread = msg.status === 'unread';
                          const dateStr = msg.created_at || msg.submittedAt 
                            ? new Date(msg.created_at || msg.submittedAt).toLocaleDateString('fa-IR') 
                            : '-';
                          return (
                            <tr key={msg.id} className={isUnread ? 'bg-amber-50/40 hover:bg-amber-50/70 transition' : 'hover:bg-slate-50 transition'}>
                              <td className="py-3 px-4 font-mono font-bold text-slate-400">#{msg.id}</td>
                              <td className="py-3 px-4 font-bold text-slate-900">{msg.fullName || '-'}</td>
                              <td className="py-3 px-4 font-mono text-[11px]">
                                <div>{msg.email || '-'}</div>
                                {msg.phoneWhatsApp && (
                                  <div className="text-amber-600 font-bold mt-0.5">{msg.phoneWhatsApp}</div>
                                )}
                              </td>
                              <td className="py-3 px-4 font-medium text-slate-800">{msg.subject || '-'}</td>
                              <td className="py-3 px-4 max-w-xs truncate text-slate-600" title={msg.message}>
                                {msg.message || '-'}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isUnread 
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                }`}>
                                  {isUnread ? 'جدید' : 'بررسی‌شده'}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{dateStr}</td>
                              <td className="py-3 px-4 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  {/* دکمه اختصاصی مشاهده کامل پیام */}
                                  <button
                                    onClick={() => setSelectedMessage(msg)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#14213D] hover:bg-[#1E293B] text-white text-[11px] font-bold transition shadow-xs cursor-pointer"
                                  >
                                    <Eye size={12} />
                                    <span>مشاهده کامل پیام</span>
                                  </button>
                                  {/* دکمه حذف */}
                                  <button
                                    onClick={() => handleDeleteMessage(msg.id)}
                                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                    title="حذف پیام"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              تب ۲: ویرایش اطلاعات و آدرس تماس شرکت (ایمیل، آدرس، نمبر، لوکیشن)
          ======================================================== */}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#14213D]">تنظیمات اطلاعات تماس دفتر آمووی ترول</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    این اطلاعات به طور خودکار در سراسر وب‌سایت (صفحه تماس با ما، فوتر و نقشه) نمایش داده می‌شوند.
                  </p>
                </div>

                {settingsSaved && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-xs font-bold">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>اطلاعات تماس با موفقیت در دیتابیس MySQL ذخیره گردید و در وب‌سایت اعمال شد.</span>
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Mail size={14} className="text-[#FCA311]" />
                      <span>آدرس ایمیل شرکت (Email)</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      placeholder="info@amovitravel.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#FCA311] focus:bg-white font-mono"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Phone size={14} className="text-[#FCA311]" />
                      <span>شماره تماس و واتس‌اپ (Phone / WhatsApp)</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      placeholder="+93 70 633 8223"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#FCA311] focus:bg-white font-mono"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#FCA311]" />
                      <span>آدرس فیزیکی دفتر (Office Address)</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      placeholder="چهارراهی انصاری، شهرنو، کابل، افغانستان"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#FCA311] focus:bg-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <LinkIcon size={14} className="text-[#FCA311]" />
                      <span>لینک لوکیشن نقشه گوگل (Google Maps URL)</span>
                    </label>
                    <input
                      type="url"
                      value={settingsForm.locationUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, locationUrl: e.target.value })}
                      placeholder="https://www.google.com/maps/search/?api=1&query=..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#FCA311] focus:bg-white font-mono"
                      dir="ltr"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={settingsLoading}
                      className="px-6 py-3 rounded-xl bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-extrabold text-xs transition shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {settingsLoading ? 'در حال ذخیره‌سازی...' : 'ذخیره تغییرات در دیتابیس'}
                    </button>
                  </div>
                </form>
              </div>

              {/* پیش‌نمایش در کارت کناری */}
              <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <span className="text-[11px] font-bold text-[#FCA311] uppercase tracking-wider block">پیش‌نمایش زنده در وب‌سایت</span>
                <div className="space-y-3 pt-1">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold mb-0.5">ایمیل</span>
                    <span className="text-xs font-mono font-bold text-slate-800">{settingsForm.email}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold mb-0.5">شماره تماس / واتس‌اپ</span>
                    <span className="text-xs font-mono font-bold text-slate-800">{settingsForm.phone}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold mb-0.5">آدرس دفتر</span>
                    <span className="text-xs font-bold text-slate-800">{settingsForm.address}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              تب ۳: مدیریت گالری تصاویر (تبدیل به WebP و فشرده‌سازی زیر ۱۵۰KB)
          ======================================================== */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              {/* فرم آپلود عکس */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#14213D]">آپلود و انتشار تصویر جدید در گالری</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    تصویر آپلود شده به صورت خودکار به فرمت بهینه <span className="font-bold text-[#FCA311]">WebP</span> تبدیل شده و در صورت داشتن حجم بالای ۱۵۰ کیلوبایت فشرده‌سازی می‌شود.
                  </p>
                </div>

                {uploadSuccess && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-xs font-bold">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>{uploadSuccess}</span>
                  </div>
                )}

                {uploadError && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 text-xs font-bold">
                    <AlertCircle size={16} className="text-rose-600 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                <form onSubmit={handleUploadImage} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">فایل تصویر</label>
                    <input
                      id="galleryFileInput"
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => setNewImageForm({ ...newImageForm, file: e.target.files[0] })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 file:mr-0 file:ml-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#14213D] file:text-white cursor-pointer"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">عنوان تصویر</label>
                    <input
                      type="text"
                      required
                      placeholder="مثلاً: نمای پانورامای بامیان"
                      value={newImageForm.title}
                      onChange={(e) => setNewImageForm({ ...newImageForm, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#FCA311] focus:bg-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">دسته‌بندی</label>
                    <select
                      value={newImageForm.category}
                      onChange={(e) => setNewImageForm({ ...newImageForm, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#FCA311] focus:bg-white cursor-pointer"
                    >
                      <option value="kabul">کابل</option>
                      <option value="bamyan">بامیان</option>
                      <option value="herat">هرات</option>
                      <option value="balkh">بلخ و مزار</option>
                      <option value="nature">طبیعت و مناظر</option>
                      <option value="culture">فرهنگ و سنت‌ها</option>
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <button
                      type="submit"
                      disabled={galleryUploading}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-extrabold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Upload size={14} />
                      <span>{galleryUploading ? 'در حال تبدیل و بهینه‌سازی...' : 'آپلود بهینه (WebP)'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* لیست و گرید تصاویر آپلود شده */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#14213D]">تصاویر داینامیک ثبت‌شده در دیتابیس ({galleryList.length})</h4>
                  <span className="text-[11px] text-slate-400">تمام تصاویر به صورت WebP ذخیره شده‌اند</span>
                </div>

                {galleryList.length === 0 ? (
                  <div className="p-10 text-center text-slate-400 text-xs font-medium">
                    هنوز تصویر داینامیک جدیدی آپلود نشده است. با استفاده از فرم بالا می‌توانید تصویر دلخواه خود را اضافه کنید.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {galleryList.map((item) => (
                      <div key={item.id} className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col justify-between shadow-xs">
                        <div className="aspect-[4/3] w-full overflow-hidden relative">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                          {item.fileSizeKB && (
                            <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-white font-mono text-[9px]">
                              {item.fileSizeKB} KB WebP
                            </span>
                          )}
                        </div>
                        <div className="p-2.5 flex items-center justify-between gap-1">
                          <div className="min-w-0">
                            <span className="block text-xs font-bold text-slate-800 truncate">{item.title}</span>
                            <span className="text-[10px] text-slate-400 block">{item.category}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteGallery(item.id)}
                            className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer shrink-0"
                            title="حذف از گالری"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              تب ۴: مدیریت مقالات وبلاگ (ساده، عکس در بالا، متن در pre)
          ======================================================== */}
          {activeTab === 'blog' && (
            <div className="space-y-6">
              {/* فرم ایجاد و انتشار مقاله */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#14213D]">انتشار مقاله جدید در وبلاگ</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    طراحی ساده و استاندارد: تصویر در بالا، عنوان و متن آزاد در پایین. متن‌های مقاله با حفظ کامل خطوط و پاراگراف‌ها با فرمت <span className="font-mono font-bold text-[#FCA311]">&lt;pre&gt;</span> نمایش داده می‌شوند.
                  </p>
                </div>

                {blogSuccess && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-xs font-bold">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>{blogSuccess}</span>
                  </div>
                )}

                {blogError && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 text-xs font-bold">
                    <AlertCircle size={16} className="text-rose-600 shrink-0" />
                    <span>{blogError}</span>
                  </div>
                )}

                <form onSubmit={handleCreateBlog} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">عنوان مقاله *</label>
                      <input
                        type="text"
                        required
                        placeholder="مثلاً: راهنمای جامع سفر به دره بامیان و بند امیر"
                        value={newBlogForm.title}
                        onChange={(e) => setNewBlogForm({ ...newBlogForm, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#FCA311] focus:bg-white"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">نویسنده / منبع</label>
                      <input
                        type="text"
                        placeholder="تیم گردشگری آمووی"
                        value={newBlogForm.author}
                        onChange={(e) => setNewBlogForm({ ...newBlogForm, author: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#FCA311] focus:bg-white"
                      />
                    </div>

                    <div className="md:col-span-4">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">تصویر شاخص بالای مقاله</label>
                      <input
                        id="blogFileInput"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewBlogForm({ ...newBlogForm, file: e.target.files[0] })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 file:mr-0 file:ml-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#14213D] file:text-white cursor-pointer"
                      />
                      <span className="block text-[10px] text-slate-400 mt-1">خودکار به فرمت بهینه WebP تبدیل و فشرده می‌شود.</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      متن کامل مقاله (هر تعداد عنوان و پاراگراف دلخواه) *
                    </label>
                    <textarea
                      required
                      rows={10}
                      placeholder="متن مقاله را اینجا تایپ کنید یا قرار دهید...&#10;&#10;عنوان بخش اول:&#10;توضیحات و پاراگراف‌ها با هر مقدار طول و شکستگی خطوط..."
                      value={newBlogForm.content}
                      onChange={(e) => setNewBlogForm({ ...newBlogForm, content: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed focus:outline-none focus:border-[#FCA311] focus:bg-white resize-y font-mono sm:font-sans"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      نکته: تمامی فاصله‌ها، اینترها (Enter) و شکستگی‌های خطوط به صورت دقیق در ساختار &lt;pre&gt; صفحه نمایش داده می‌شوند.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={blogUploading}
                      className="py-3 px-6 rounded-xl bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-extrabold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Upload size={14} />
                      <span>{blogUploading ? 'در حال بهینه‌سازی و انتشار مقاله...' : 'انتشار مقاله در وبلاگ'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* لیست مقالات منتشر شده */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#14213D]">مقالات ثبت‌شده در سیستم ({blogList.length})</h4>
                  <span className="text-[11px] text-slate-400">به ترتیب از جدیدترین به قدیمی‌ترین</span>
                </div>

                {blogList.length === 0 ? (
                  <div className="p-10 text-center text-slate-400 text-xs font-medium">
                    هنوز مقاله‌ای در وبلاگ ثبت نشده است. از فرم بالا برای انتشار اولین مقاله استفاده نمایید.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {blogList.map((post) => (
                      <div key={post.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            <img
                              src={post.image || post.image_url || '/images/provinces/kabul/kabul-hero.webp'}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                              {post.fa?.title || post.title_fa || post.title || post.en?.title || 'مقاله وبلاگ'}
                            </h5>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                              <span>نویسنده: {post.fa?.author || post.author_fa || post.author || 'آمووی'}</span>
                              <span>•</span>
                              <span>
                                {post.createdAt || post.created_at
                                  ? new Date(post.createdAt || post.created_at).toLocaleDateString('fa-IR')
                                  : 'اخیراً'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <Link
                            to={`/blog/${post.id}`}
                            target="_blank"
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <Eye size={13} />
                            <span>مشاهده</span>
                          </Link>
                          <button
                            onClick={() => handleDeleteBlog(post.id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Trash2 size={13} />
                            <span>حذف</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              تب ۵: درخواست‌های رزرواسیون
          ======================================================== */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#14213D]">لیست درخواست‌های اختصاصی رزرو تور</h3>
                <span className="text-xs text-slate-400 font-mono">{masterRequests.length} مورد</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-600 font-bold text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">مشتری</th>
                      <th className="py-3 px-4">ارتباط</th>
                      <th className="py-3 px-4">پکیج درخواستی</th>
                      <th className="py-3 px-4">تعداد همسفران</th>
                      <th className="py-3 px-4">تاریخ ارسال</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {masterRequests.map((req, idx) => (
                      <tr key={req.id || idx} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4 font-bold text-slate-900">{req.fullName || '-'}</td>
                        <td className="py-3 px-4 font-mono text-[11px]">
                          <div>{req.email || '-'}</div>
                          <div className="text-slate-500">{req.phoneWhatsApp || '-'}</div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-amber-600">{req.packageOrService || 'تور سفارشی'}</td>
                        <td className="py-3 px-4 text-slate-600">{req.travelers ? `${req.travelers} نفر` : 'نامشخص'}</td>
                        <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                          {req.submittedAt ? new Date(req.submittedAt).toLocaleDateString('fa-IR') : 'اخیر'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================
          مودال اختصاصی نمایش کامل متن پیام (Full Message Modal)
      ======================================================== */}
      {selectedMessage && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedMessage(null)}
        >
          <div 
            className="bg-white border border-slate-200 max-w-xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-800 space-y-5"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* سربرگ مودال */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold text-[#FCA311] uppercase tracking-wider block">جزئیات پیام دریافتی</span>
                <h3 className="text-lg font-black text-[#14213D] mt-0.5">{selectedMessage.fullName || 'بدون نام'}</h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  زمان ارسال: {selectedMessage.created_at || selectedMessage.submittedAt 
                    ? new Date(selectedMessage.created_at || selectedMessage.submittedAt).toLocaleString('fa-IR') 
                    : '-'}
                </span>
              </div>
              <button 
                onClick={() => setSelectedMessage(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* کارت مشخصات فرستنده */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5 font-bold text-[10px]">آدرس ایمیل:</span>
                <a href={`mailto:${selectedMessage.email}`} className="text-sky-600 font-mono font-bold hover:underline">
                  {selectedMessage.email || '-'}
                </a>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5 font-bold text-[10px]">شماره تماس / واتس‌اپ:</span>
                <span className="text-amber-600 font-mono font-bold">
                  {selectedMessage.phoneWhatsApp || '-'}
                </span>
              </div>
              <div className="sm:col-span-2 pt-1 border-t border-slate-200/60">
                <span className="text-slate-400 block mb-0.5 font-bold text-[10px]">موضوع پیام:</span>
                <span className="text-slate-800 font-bold">{selectedMessage.subject || '-'}</span>
              </div>
            </div>

            {/* کادر متن کامل پیام با قابلیت نمایش کامل متون طولانی */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">متن کامل پیام:</span>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
                {selectedMessage.message || '-'}
              </div>
            </div>

            {/* اکشن‌های پایینی مودال */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => handleToggleStatus(selectedMessage.id, selectedMessage.status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedMessage.status === 'unread'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                {selectedMessage.status === 'unread' ? 'علامت به عنوان خوانده‌شده' : 'علامت به عنوان پیام جدید'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition cursor-pointer"
                >
                  حذف این پیام
                </button>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 rounded-xl bg-[#14213D] hover:bg-[#1E293B] text-white text-xs font-bold transition cursor-pointer"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}