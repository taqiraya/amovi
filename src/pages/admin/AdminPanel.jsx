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
  BookOpen,
  Compass
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
  deleteBlogPost,
  getTourPageSettings,
  updateTourPageSettings,
  getTours,
  createTourPackage,
  deleteTourPackage
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
    title_fa: '',
    title_en: '',
    author_fa: 'تیم گردشگری آمووی',
    author_en: 'Amovi Travel Team',
    content_fa: '',
    content_en: '',
    category_fa: 'کشف سرزمین',
    category_en: 'DISCOVER',
    pillar: 'discover',
    file: null
  });

  // دیتای صفحه سفر و پکیج‌ها
  const [toursList, setToursList] = useState([]);
  const [tourSubTab, setTourSubTab] = useState('discover'); // 'discover', 'packages', 'sections'
  const [tourPageForm, setTourPageForm] = useState({
    discover_title_fa: 'افغانستان را به شیوه خود کشف کنید',
    discover_title_en: 'Discover Afghanistan on Your Own Terms',
    discover_desc_fa: 'افغانستان را از طریق سفرهای دقیقاً برنامه‌ریزی‌شده، همراه با مقصد، اقامت، حمل‌ونقل، راهنما و پشتیبانی سفر کشف کنید.',
    discover_desc_en: 'Discover Afghanistan through carefully planned journeys, complete with destinations, accommodation, transport, guides, and comprehensive travel support.',
    discover_image: '/tours/images/bamyanPictures.webp',
    travel_eyebrow_fa: 'موضوعات سفر',
    travel_eyebrow_en: 'Travel Themes',
    travel_title_fa: 'تجربه سفر خود را انتخاب کنید',
    travel_title_en: 'Choose Your Travel Experience',
    travel_items: [
      { title_fa: 'تجربه‌های مقصد', title_en: 'Destination Experiences', description_fa: 'مقصدهای مختلف را با سفرهایی که با دقت طراحی شده‌اند، کشف کنید.', description_en: 'Discover individual destinations through carefully designed journeys.' },
      { title_fa: 'سفرهای چندمقصدی', title_en: 'Multi-Destination Journeys', description_fa: 'چندین مقصد را در قالب یک سفر یکپارچه در سراسر افغانستان تجربه کنید.', description_en: 'Connect multiple destinations in one seamless journey across Afghanistan.' },
      { title_fa: 'فرهنگ و میراث', title_en: 'Cultural & Heritage', description_fa: 'تاریخ، فرهنگ، سنت‌ها و میراث افغانستان را کشف کنید.', description_en: "Explore Afghanistan's history, culture, traditions, and heritage." },
      { title_fa: 'طبیعت و ماجراجویی', title_en: 'Nature & Adventure', description_fa: 'کوه‌ها، دره‌ها، دریاچه‌ها، مناظر طبیعی و فعالیت‌های فضای باز را تجربه کنید.', description_en: 'Experience mountains, valleys, lakes, landscapes, and outdoor activities.' },
      { title_fa: 'سفرهای ویژه و VIP', title_en: 'Premium & VIP', description_fa: 'با آسایش بیشتر، برنامه‌ریزی شخصی‌سازی‌شده و پشتیبانی اختصاصی سفر کنید.', description_en: 'Travel with enhanced comfort, personalized arrangements, and dedicated support.' },
      { title_fa: 'سفرهای سفارشی', title_en: 'Customized Journeys', description_fa: 'سفری متناسب با علایق، زمان‌بندی و ترجیحات سفر خود ایجاد کنید.', description_en: 'Create a journey tailored to your interests, schedule, and travel preferences.' }
    ],
    more_eyebrow_fa: 'فراتر از یک سفر ساده',
    more_eyebrow_en: 'More Than a Tour',
    more_title_fa: 'خدماتی فراتر از یک سفر ساده',
    more_title_en: 'More Than a Tour',
    more_items: [
      { title_fa: 'اقامت', title_en: 'Accommodation', description_fa: 'اقامتگاه‌های منتخب برای سفر شما.', description_en: 'Selected stays for your journey.' },
      { title_fa: 'حمل‌ونقل', title_en: 'Transportation', description_fa: 'هماهنگی رفت‌وآمد میان مقصدهای مختلف.', description_en: 'Coordinated travel between destinations.' },
      { title_fa: 'راهنمایان حرفه‌ای', title_en: 'Professional Guides', description_fa: 'راهنمایی محلی و آشنایی با فرهنگ و جاذبه‌های منطقه.', description_en: 'Local guidance and cultural insight.' },
      { title_fa: 'پشتیبانی سفر', title_en: 'Travel Support', description_fa: 'کمک و پشتیبانی عملی در طول سفر شما.', description_en: 'Practical assistance throughout your journey.' },
      { title_fa: 'کمک در امور ویزا', title_en: 'Visa Assistance', description_fa: 'راهنمایی برای آماده‌سازی مدارک و مراحل ویزا.', description_en: 'Guidance with your visa preparation.' }
    ],
    work_eyebrow_fa: 'نحوه رزرو سفر',
    work_eyebrow_en: 'How Booking Works',
    work_title_fa: 'چگونه کار می‌کند',
    work_title_en: 'How It Works',
    work_items: [
      { title_fa: 'انتخاب پکیج', title_en: 'Choose Package', description_fa: 'پکیج مورد نظر خود را متناسب با برنامه و مقصد انتخاب کنید.', description_en: 'Choose your desired package matching your plans.' },
      { title_fa: 'ثبت درخواست', title_en: 'Send Inquiry', description_fa: 'مشخصات و زمان سفر خود را برای هماهنگی ارسال نمایید.', description_en: 'Submit your journey dates and details.' },
      { title_fa: 'تأیید برنامه', title_en: 'Confirm Journey', description_fa: 'برنامه نهایی سفر و اقامتگاه‌ها توسط کارشناسان تأیید می‌شود.', description_en: 'Finalize travel schedule and accommodations with our team.' },
      { title_fa: 'آغاز سفر', title_en: 'Begin Adventure', description_fa: 'با آسودگی خاطر سفر خاطره‌انگیز خود را در افغانستان آغاز کنید.', description_en: 'Embark on an unforgettable voyage across Afghanistan.' }
    ]
  });

  const [discoverSaving, setDiscoverSaving] = useState(false);
  const [discoverSuccess, setDiscoverSuccess] = useState('');
  const [discoverError, setDiscoverError] = useState('');
  const [discoverFile, setDiscoverFile] = useState(null);

  const [sectionsSaving, setSectionsSaving] = useState(false);
  const [sectionsSuccess, setSectionsSuccess] = useState('');
  const [sectionsError, setSectionsError] = useState('');

  const [newPackageForm, setNewPackageForm] = useState({
    title_fa: '',
    title_en: '',
    price: 150,
    days: 3,
    nights: 2,
    description_fa: '',
    description_en: '',
    file: null
  });
  const [packageUploading, setPackageUploading] = useState(false);
  const [packageSuccess, setPackageSuccess] = useState('');
  const [packageError, setPackageError] = useState('');

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
    getTourPageSettings().then((data) => {
      if (data) {
        setTourPageForm((prev) => ({
          ...prev,
          ...data,
          travel_items: Array.isArray(data.travel_items) ? data.travel_items : prev.travel_items,
          more_items: Array.isArray(data.more_items) ? data.more_items : prev.more_items,
          work_items: Array.isArray(data.work_items) ? data.work_items : prev.work_items,
        }));
      }
    });
    getTours().then((tours) => {
      if (Array.isArray(tours)) setToursList(tours);
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
    const titleFa = newBlogForm.title_fa.trim();
    const titleEn = newBlogForm.title_en.trim();
    const contentFa = newBlogForm.content_fa.trim();
    const contentEn = newBlogForm.content_en.trim();

    if (!titleFa && !titleEn) {
      setBlogError('لطفاً عنوان مقاله (دری یا انگلیسی) را وارد فرمایید.');
      return;
    }
    if (!contentFa && !contentEn) {
      setBlogError('لطفاً متن مقاله (دری یا انگلیسی) را وارد فرمایید.');
      return;
    }
    setBlogUploading(true);
    setBlogError('');
    setBlogSuccess('');

    const formData = new FormData();
    if (newBlogForm.file) {
      formData.append('image', newBlogForm.file);
    }
    formData.append('title_fa', titleFa || titleEn);
    formData.append('title_en', titleEn || titleFa);
    formData.append('title', titleFa || titleEn);
    formData.append('author_fa', newBlogForm.author_fa.trim() || 'تیم گردشگری آمووی');
    formData.append('author_en', newBlogForm.author_en.trim() || 'Amovi Travel Team');
    formData.append('author', newBlogForm.author_fa.trim() || 'تیم گردشگری آمووی');
    formData.append('content_fa', newBlogForm.content_fa || newBlogForm.content_en);
    formData.append('content_en', newBlogForm.content_en || newBlogForm.content_fa);
    formData.append('content', newBlogForm.content_fa || newBlogForm.content_en);
    formData.append('category_fa', newBlogForm.category_fa || 'کشف سرزمین');
    formData.append('category_en', newBlogForm.category_en || 'DISCOVER');
    formData.append('pillar', newBlogForm.pillar || 'discover');

    try {
      const res = await createBlogPost(formData);
      if (res.success && res.data) {
        setBlogList((prev) => [res.data, ...prev]);
        setBlogSuccess('مقاله جدید با موفقیت ذخیره و منتشر شد.');
        setNewBlogForm({
          title_fa: '',
          title_en: '',
          author_fa: 'تیم گردشگری آمووی',
          author_en: 'Amovi Travel Team',
          content_fa: '',
          content_en: '',
          category_fa: 'کشف سرزمین',
          category_en: 'DISCOVER',
          pillar: 'discover',
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

  // ذخیره بخش کشف افغانستان
  const handleSaveDiscover = async (e) => {
    e.preventDefault();
    setDiscoverSaving(true);
    setDiscoverSuccess('');
    setDiscoverError('');
    try {
      const formData = new FormData();
      formData.append('discover_title_fa', tourPageForm.discover_title_fa);
      formData.append('discover_title_en', tourPageForm.discover_title_en);
      formData.append('discover_desc_fa', tourPageForm.discover_desc_fa);
      formData.append('discover_desc_en', tourPageForm.discover_desc_en);
      if (discoverFile) {
        formData.append('discover_image', discoverFile);
      }
      const res = await updateTourPageSettings(formData);
      if (res && res.success) {
        setDiscoverSuccess('بخش کشف افغانستان با موفقیت ذخیره شد.');
        if (res.data?.discover_image) {
          setTourPageForm((prev) => ({ ...prev, discover_image: res.data.discover_image }));
        }
        setDiscoverFile(null);
        const fileInput = document.getElementById('discoverFileInput');
        if (fileInput) fileInput.value = '';
        setTimeout(() => setDiscoverSuccess(''), 5000);
      }
    } catch (err) {
      console.error('Discover save error:', err);
      setDiscoverError('خطا در ذخیره بخش کشف افغانستان.');
    } finally {
      setDiscoverSaving(false);
    }
  };

  // ذخیره متون و عناوین بخش‌های دیگر صفحه سفر
  const handleSaveSections = async (e) => {
    e.preventDefault();
    setSectionsSaving(true);
    setSectionsSuccess('');
    setSectionsError('');
    try {
      const formData = new FormData();
      formData.append('travel_eyebrow_fa', tourPageForm.travel_eyebrow_fa);
      formData.append('travel_eyebrow_en', tourPageForm.travel_eyebrow_en);
      formData.append('travel_title_fa', tourPageForm.travel_title_fa);
      formData.append('travel_title_en', tourPageForm.travel_title_en);
      formData.append('travel_items', JSON.stringify(tourPageForm.travel_items));

      formData.append('more_eyebrow_fa', tourPageForm.more_eyebrow_fa);
      formData.append('more_eyebrow_en', tourPageForm.more_eyebrow_en);
      formData.append('more_title_fa', tourPageForm.more_title_fa);
      formData.append('more_title_en', tourPageForm.more_title_en);
      formData.append('more_items', JSON.stringify(tourPageForm.more_items));

      formData.append('work_eyebrow_fa', tourPageForm.work_eyebrow_fa);
      formData.append('work_eyebrow_en', tourPageForm.work_eyebrow_en);
      formData.append('work_title_fa', tourPageForm.work_title_fa);
      formData.append('work_title_en', tourPageForm.work_title_en);
      formData.append('work_items', JSON.stringify(tourPageForm.work_items));

      const res = await updateTourPageSettings(formData);
      if (res && res.success) {
        setSectionsSuccess('عناوین و متون بخش‌های صفحه سفر با موفقیت به‌روزرسانی شد.');
        setTimeout(() => setSectionsSuccess(''), 5000);
      }
    } catch (err) {
      console.error('Sections save error:', err);
      setSectionsError('خطا در ذخیره متون بخش‌ها.');
    } finally {
      setSectionsSaving(false);
    }
  };

  // افزودن پکیج تور جدید
  const handleCreatePackage = async (e) => {
    e.preventDefault();
    if (!newPackageForm.title_fa.trim() && !newPackageForm.title_en.trim()) {
      setPackageError('عنوان پکیج تور الزامی است.');
      return;
    }
    setPackageUploading(true);
    setPackageSuccess('');
    setPackageError('');
    try {
      const formData = new FormData();
      formData.append('title_fa', newPackageForm.title_fa.trim());
      formData.append('title_en', (newPackageForm.title_en || newPackageForm.title_fa).trim());
      formData.append('price', Number(newPackageForm.price) || 150);
      formData.append('days', Number(newPackageForm.days) || 3);
      formData.append('nights', Number(newPackageForm.nights) || 2);
      formData.append('description_fa', newPackageForm.description_fa.trim());
      formData.append('description_en', newPackageForm.description_en.trim());
      if (newPackageForm.file) {
        formData.append('image', newPackageForm.file);
      }
      const res = await createTourPackage(formData);
      if (res && res.success) {
        setPackageSuccess('پکیج جدید با موفقیت ایجاد و ذخیره شد.');
        const updated = await getTours();
        setToursList(updated);
        setNewPackageForm({
          title_fa: '',
          title_en: '',
          price: 150,
          days: 3,
          nights: 2,
          description_fa: '',
          description_en: '',
          file: null
        });
        const fileInput = document.getElementById('tourPkgFileInput');
        if (fileInput) fileInput.value = '';
        setTimeout(() => setPackageSuccess(''), 5000);
      }
    } catch (err) {
      console.error('Create tour package error:', err);
      setPackageError('خطا در افزودن پکیج تور.');
    } finally {
      setPackageUploading(false);
    }
  };

  // حذف پکیج تور
  const handleDeletePackage = async (id) => {
    if (!window.confirm('آیا از حذف این پکیج تور اطمینان دارید؟')) return;
    try {
      await deleteTourPackage(id);
      setToursList((prev) => prev.filter((p) => p.id !== id && p.slug !== id && p.dbId !== id));
    } catch (err) {
      console.error('Delete tour package error:', err);
      alert('خطا در حذف پکیج تور.');
    }
  };

  const exportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ 
      contactMessages, 
      settings: settingsForm, 
      gallery: galleryList,
      blogPosts: blogList,
      tours: toursList,
      tourPageSettings: tourPageForm,
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
              onClick={() => { setActiveTab('tours'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'tours'
                  ? 'bg-[#14213D] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-[#14213D]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Compass size={16} className={activeTab === 'tours' ? 'text-[#FCA311]' : 'text-slate-400'} />
                <span>مدیریت صفحه سفر و پکیج‌ها</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'tours' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {toursList.length}
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
                {activeTab === 'tours' && 'مدیریت محتوا و پکیج‌های صفحه سفر'}
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

                <form onSubmit={handleCreateBlog} className="space-y-6">
                  {/* ردیف اول: تصویر شاخص و دسته‌بندی موضوعی */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="md:col-span-7">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">تصویر شاخص بالای مقاله</label>
                      <input
                        id="blogFileInput"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewBlogForm({ ...newBlogForm, file: e.target.files[0] })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 file:mr-0 file:ml-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#14213D] file:text-white cursor-pointer"
                      />
                      <span className="block text-[10px] text-slate-400 mt-1">خودکار به فرمت بهینه WebP تبدیل و فشرده می‌شود (حداکثر ۱۵۰ کیلوبایت).</span>
                    </div>

                    <div className="md:col-span-5">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">محور موضوعی (Pillar)</label>
                      <select
                        value={newBlogForm.pillar}
                        onChange={(e) => {
                          const p = e.target.value;
                          let catFa = 'کشف سرزمین';
                          let catEn = 'DISCOVER';
                          if (p === 'understand') {
                            catFa = 'شناخت فرهنگ و مردم';
                            catEn = 'UNDERSTAND';
                          } else if (p === 'experience') {
                            catFa = 'تجربه‌ها و سوغات';
                            catEn = 'EXPERIENCE';
                          }
                          setNewBlogForm({ ...newBlogForm, pillar: p, category_fa: catFa, category_en: catEn });
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#FCA311]"
                      >
                        <option value="discover">کشف سرزمین (Discover Afghanistan)</option>
                        <option value="understand">شناخت فرهنگ و مردم (Understand Culture & People)</option>
                        <option value="experience">تجربه‌ها و سوغات (Experiences & Treasures)</option>
                      </select>
                    </div>
                  </div>

                  {/* ردیف دوم: بخش فارسی / دری */}
                  <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/70 space-y-4" dir="rtl">
                    <div className="flex items-center justify-between pb-2 border-b border-amber-200/50">
                      <h4 className="text-xs sm:text-sm font-black text-[#14213D] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#FCA311]"></span>
                        <span>محتوای زبان دری (راست‌چین RTL)</span>
                      </h4>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md font-mono">DARI / FA</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-8">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">عنوان دری مقاله *</label>
                        <input
                          type="text"
                          required
                          placeholder="مثلاً: راهنمای جامع سفر به دره بامیان و بند امیر"
                          value={newBlogForm.title_fa}
                          onChange={(e) => setNewBlogForm({ ...newBlogForm, title_fa: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#FCA311] font-[Sahel]"
                          dir="rtl"
                        />
                      </div>

                      <div className="md:col-span-4">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">نویسنده به دری</label>
                        <input
                          type="text"
                          placeholder="تیم گردشگری آمووی"
                          value={newBlogForm.author_fa}
                          onChange={(e) => setNewBlogForm({ ...newBlogForm, author_fa: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#FCA311] font-[Sahel]"
                          dir="rtl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        متن کامل مقاله به دری (هر تعداد عنوان و پاراگراف دلخواه در حالت pre) *
                      </label>
                      <textarea
                        required
                        rows={7}
                        placeholder="متن دری مقاله را اینجا تایپ فرمایید یا پیست کنید...&#10;&#10;عنوان بخش اول:&#10;توضیحات و پاراگراف‌ها با هر میزان طول، خطوط و فاصله‌گذاری..."
                        value={newBlogForm.content_fa}
                        onChange={(e) => setNewBlogForm({ ...newBlogForm, content_fa: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed focus:outline-none focus:border-[#FCA311] resize-y font-[Sahel]"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  {/* ردیف سوم: بخش انگلیسی (English Section) */}
                  <div className="p-5 rounded-2xl bg-blue-50/40 border border-blue-200/70 space-y-4" dir="ltr">
                    <div className="flex items-center justify-between pb-2 border-b border-blue-200/50">
                      <h4 className="text-xs sm:text-sm font-black text-[#14213D] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        <span className="font-[Inter]">English Content (Left-to-Right LTR)</span>
                      </h4>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md font-mono">ENGLISH / EN</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-8">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 font-[Inter]">English Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Comprehensive Travel Guide to Bamyan Valley & Band-e Amir"
                          value={newBlogForm.title_en}
                          onChange={(e) => setNewBlogForm({ ...newBlogForm, title_en: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#FCA311] font-[Inter]"
                          dir="ltr"
                        />
                      </div>

                      <div className="md:col-span-4">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 font-[Inter]">English Author</label>
                        <input
                          type="text"
                          placeholder="Amovi Travel Team"
                          value={newBlogForm.author_en}
                          onChange={(e) => setNewBlogForm({ ...newBlogForm, author_en: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#FCA311] font-[Inter]"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 font-[Inter]">
                        Full Article Content in English (Any headings, line breaks & paragraphs in &lt;pre&gt;) *
                      </label>
                      <textarea
                        required
                        rows={7}
                        placeholder="Type or paste the English article content here...&#10;&#10;Section Title:&#10;Paragraphs with preserved line breaks and spacing..."
                        value={newBlogForm.content_en}
                        onChange={(e) => setNewBlogForm({ ...newBlogForm, content_en: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed focus:outline-none focus:border-[#FCA311] resize-y font-[Inter]"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <p className="text-[11px] text-slate-400">
                      تمامی مقالات منتشر شده با ترتیب «جدیدترین در ابتدا» در سایت و دیتابیس نمایش داده می‌شوند.
                    </p>
                    <button
                      type="submit"
                      disabled={blogUploading}
                      className="py-3 px-6 rounded-xl bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-extrabold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Upload size={14} />
                      <span>{blogUploading ? 'در حال بهینه‌سازی و انتشار مقاله...' : 'انتشار مقاله دوزبانه در وبلاگ'}</span>
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
              تب ۵: مدیریت صفحه سفر و پکیج‌ها (Tours Management)
          ======================================================== */}
          {activeTab === 'tours' && (
            <div className="space-y-6">
              {/* تب‌های داخلی بخش سفر */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
                <button
                  type="button"
                  onClick={() => setTourSubTab('discover')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    tourSubTab === 'discover'
                      ? 'bg-[#14213D] text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  بخش کشف افغانستان
                </button>
                <button
                  type="button"
                  onClick={() => setTourSubTab('packages')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    tourSubTab === 'packages'
                      ? 'bg-[#14213D] text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>پکیج‌های تور</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    tourSubTab === 'packages' ? 'bg-[#FCA311] text-[#14213D]' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {toursList.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setTourSubTab('sections')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    tourSubTab === 'sections'
                      ? 'bg-[#14213D] text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  عناوین و متون بخش‌های صفحه سفر
                </button>
              </div>

              {/* زیرتب ۱: بخش کشف افغانستان */}
              {tourSubTab === 'discover' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
                  <div>
                    <h3 className="text-base font-black text-[#14213D]">تنظیمات بخش کشف افغانستان (Discover Section)</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      ویرایش عنوان، متن توضیحات به زبان‌های دری و انگلیسی همراه با تغییر تصویر کنار متن.
                    </p>
                  </div>

                  {discoverSuccess && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      {discoverSuccess}
                    </div>
                  )}
                  {discoverError && (
                    <div className="p-3.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                      {discoverError}
                    </div>
                  )}

                  <form onSubmit={handleSaveDiscover} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          عنوان بخش (دری / فارسی)
                        </label>
                        <input
                          type="text"
                          required
                          value={tourPageForm.discover_title_fa || ''}
                          onChange={(e) => setTourPageForm({ ...tourPageForm, discover_title_fa: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-['Sahel'] focus:outline-none focus:border-[#FCA311] focus:bg-white"
                          dir="rtl"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Section Title (English)
                        </label>
                        <input
                          type="text"
                          required
                          value={tourPageForm.discover_title_en || ''}
                          onChange={(e) => setTourPageForm({ ...tourPageForm, discover_title_en: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-[Inter] focus:outline-none focus:border-[#FCA311] focus:bg-white"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          توضیحات بخش (دری / فارسی)
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={tourPageForm.discover_desc_fa || ''}
                          onChange={(e) => setTourPageForm({ ...tourPageForm, discover_desc_fa: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-['Sahel'] leading-relaxed focus:outline-none focus:border-[#FCA311] focus:bg-white"
                          dir="rtl"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Section Description (English)
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={tourPageForm.discover_desc_en || ''}
                          onChange={(e) => setTourPageForm({ ...tourPageForm, discover_desc_en: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-[Inter] leading-relaxed focus:outline-none focus:border-[#FCA311] focus:bg-white"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                      <label className="block text-xs font-bold text-slate-700">
                        تصویر بخش کشف (فرمت تبدیل خودکار به WebP)
                      </label>
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-32 h-20 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs shrink-0">
                          <img
                            src={discoverFile ? URL.createObjectURL(discoverFile) : (tourPageForm.discover_image || '/tours/images/bamyanPictures.webp')}
                            alt="Discover Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 w-full">
                          <input
                            id="discoverFileInput"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setDiscoverFile(e.target.files[0] || null)}
                            className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#14213D] file:text-white hover:file:bg-slate-800 cursor-pointer"
                          />
                          <p className="text-[11px] text-slate-400 mt-1.5">
                            تصویر جدید در صورت آپلود به‌طور خودکار به WebP تبدیل و فشرده‌سازی می‌شود.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={discoverSaving}
                        className="px-6 py-2.5 rounded-xl bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-black text-xs transition shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        {discoverSaving ? 'در حال ذخیره‌سازی...' : 'ذخیره تغییرات بخش کشف'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* زیرتب ۲: پکیج‌های تور */}
              {tourSubTab === 'packages' && (
                <div className="space-y-6">
                  {/* فرم افزودن پکیج جدید */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                    <h3 className="text-base font-black text-[#14213D]">افزودن پکیج سفر جدید</h3>

                    {packageSuccess && (
                      <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                        {packageSuccess}
                      </div>
                    )}
                    {packageError && (
                      <div className="p-3.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                        {packageError}
                      </div>
                    )}

                    <form onSubmit={handleCreatePackage} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            عنوان پکیج (دری / فارسی)
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="مثال: تور کشف بامیان و بند امیر"
                            value={newPackageForm.title_fa}
                            onChange={(e) => setNewPackageForm({ ...newPackageForm, title_fa: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-['Sahel'] focus:outline-none focus:border-[#FCA311] focus:bg-white"
                            dir="rtl"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Package Title (English)
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Bamyan & Band-e Amir Discovery"
                            value={newPackageForm.title_en}
                            onChange={(e) => setNewPackageForm({ ...newPackageForm, title_en: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-[Inter] focus:outline-none focus:border-[#FCA311] focus:bg-white"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            قیمت به دالر (USD)
                          </label>
                          <input
                            type="number"
                            min="0"
                            required
                            value={newPackageForm.price}
                            onChange={(e) => setNewPackageForm({ ...newPackageForm, price: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#FCA311] focus:bg-white"
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            تعداد روزها (Days)
                          </label>
                          <input
                            type="number"
                            min="1"
                            required
                            value={newPackageForm.days}
                            onChange={(e) => setNewPackageForm({ ...newPackageForm, days: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#FCA311] focus:bg-white"
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            تعداد شب‌ها (Nights)
                          </label>
                          <input
                            type="number"
                            min="0"
                            required
                            value={newPackageForm.nights}
                            onChange={(e) => setNewPackageForm({ ...newPackageForm, nights: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#FCA311] focus:bg-white"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            توضیحات مختصر (دری / فارسی)
                          </label>
                          <textarea
                            rows={3}
                            placeholder="توضیح کوتاه درباره مقاصد و خدمات این پکیج..."
                            value={newPackageForm.description_fa}
                            onChange={(e) => setNewPackageForm({ ...newPackageForm, description_fa: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-['Sahel'] focus:outline-none focus:border-[#FCA311] focus:bg-white"
                            dir="rtl"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Short Description (English)
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Short overview of destinations and services..."
                            value={newPackageForm.description_en}
                            onChange={(e) => setNewPackageForm({ ...newPackageForm, description_en: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-[Inter] focus:outline-none focus:border-[#FCA311] focus:bg-white"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          تصویر پکیج تور (تبدیل خودکار به WebP)
                        </label>
                        <input
                          id="tourPkgFileInput"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setNewPackageForm({ ...newPackageForm, file: e.target.files[0] || null })}
                          className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#14213D] file:text-white hover:file:bg-slate-800 cursor-pointer"
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={packageUploading}
                          className="px-6 py-2.5 rounded-xl bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-black text-xs transition shadow-sm cursor-pointer disabled:opacity-50"
                        >
                          {packageUploading ? 'در حال ثبت...' : 'افزودن و ذخیره پکیج تور'}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* لیست پکیج‌های ثبت‌شده */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-black text-[#14213D]">لیست پکیج‌های موجود در سایت</h3>
                      <span className="text-xs text-slate-500 font-mono">{toursList.length} پکیج</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {toursList.map((pkg, idx) => {
                        const titleFa = pkg.fa?.title || pkg.title_fa || pkg.title || 'پکیج تور';
                        const titleEn = pkg.en?.title || pkg.title_en || pkg.title || 'Tour Package';
                        const price = pkg.price || 150;
                        const days = pkg.fa?.days || pkg.days || 3;
                        const nights = pkg.fa?.nights || pkg.nights || 2;
                        const image = pkg.image || pkg.image_url || '/tours/images/kabulPictures.webp';
                        const id = pkg.id || pkg.slug || pkg.dbId || idx;

                        return (
                          <div key={id} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs flex flex-col justify-between">
                            <div>
                              <div className="h-36 w-full bg-slate-100 overflow-hidden relative">
                                <img src={image} alt={titleFa} className="w-full h-full object-cover" />
                                <span className="absolute top-2.5 right-2.5 bg-[#14213D]/90 text-[#FCA311] text-[11px] font-bold px-2 py-0.5 rounded-md font-mono">
                                  ${price}
                                </span>
                              </div>
                              <div className="p-4 space-y-1.5">
                                <h4 className="font-bold text-xs text-[#14213D] line-clamp-1">{titleFa}</h4>
                                <p className="text-[11px] text-slate-500 line-clamp-1 font-[Inter]" dir="ltr">{titleEn}</p>
                                <div className="text-[11px] text-slate-400 font-mono pt-1">
                                  {days} روز / {nights} شب
                                </div>
                              </div>
                            </div>
                            <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleDeletePackage(id)}
                                className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 size={13} />
                                <span>حذف پکیج</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* زیرتب ۳: عناوین و متون بخش‌ها */}
              {tourSubTab === 'sections' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
                  <div>
                    <h3 className="text-base font-black text-[#14213D]">ویرایش عناوین و متون بخش‌های صفحه سفر</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      مطابق درخواست، آیکون‌ها ثابت و استاندارد هستند و متن‌ها و عنوان‌ها به زبان‌های دری و انگلیسی قابل شخصی‌سازی می‌باشند.
                    </p>
                  </div>

                  {sectionsSuccess && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      {sectionsSuccess}
                    </div>
                  )}
                  {sectionsError && (
                    <div className="p-3.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                      {sectionsError}
                    </div>
                  )}

                  <form onSubmit={handleSaveSections} className="space-y-8">
                    {/* بخش ۱: تجربه سفر خود را انتخاب کنید */}
                    <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-5">
                      <div className="border-b border-slate-200 pb-3">
                        <span className="text-[11px] font-bold text-[#FCA311] uppercase tracking-wider block">بخش اول</span>
                        <h4 className="text-sm font-black text-[#14213D]">تجربه سفر خود را انتخاب کنید (Travel Themes)</h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">سربرگ کوچک (دری)</label>
                          <input
                            type="text"
                            value={tourPageForm.travel_eyebrow_fa || ''}
                            onChange={(e) => setTourPageForm({ ...tourPageForm, travel_eyebrow_fa: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800"
                            dir="rtl"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Eyebrow (English)</label>
                          <input
                            type="text"
                            value={tourPageForm.travel_eyebrow_en || ''}
                            onChange={(e) => setTourPageForm({ ...tourPageForm, travel_eyebrow_en: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800"
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">عنوان اصلی (دری)</label>
                          <input
                            type="text"
                            value={tourPageForm.travel_title_fa || ''}
                            onChange={(e) => setTourPageForm({ ...tourPageForm, travel_title_fa: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800"
                            dir="rtl"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Main Title (English)</label>
                          <input
                            type="text"
                            value={tourPageForm.travel_title_en || ''}
                            onChange={(e) => setTourPageForm({ ...tourPageForm, travel_title_en: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      {/* ۶ آیتم این بخش */}
                      <div className="space-y-4 pt-2">
                        <span className="text-xs font-bold text-slate-700 block">۶ گزینه تجربه سفر:</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(tourPageForm.travel_items || []).map((item, idx) => (
                            <div key={idx} className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2">
                              <span className="text-[11px] font-mono font-bold text-amber-600">گزینه {idx + 1}</span>
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  placeholder="عنوان دری"
                                  value={item.title_fa || ''}
                                  onChange={(e) => {
                                    const updated = [...tourPageForm.travel_items];
                                    updated[idx] = { ...updated[idx], title_fa: e.target.value };
                                    setTourPageForm({ ...tourPageForm, travel_items: updated });
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                                  dir="rtl"
                                />
                                <input
                                  type="text"
                                  placeholder="English Title"
                                  value={item.title_en || ''}
                                  onChange={(e) => {
                                    const updated = [...tourPageForm.travel_items];
                                    updated[idx] = { ...updated[idx], title_en: e.target.value };
                                    setTourPageForm({ ...tourPageForm, travel_items: updated });
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                                  dir="ltr"
                                />
                              </div>
                              <textarea
                                rows={2}
                                placeholder="متن توضیحات دری"
                                value={item.description_fa || ''}
                                onChange={(e) => {
                                  const updated = [...tourPageForm.travel_items];
                                  updated[idx] = { ...updated[idx], description_fa: e.target.value };
                                  setTourPageForm({ ...tourPageForm, travel_items: updated });
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                                dir="rtl"
                              />
                              <textarea
                                rows={2}
                                placeholder="English Description"
                                value={item.description_en || ''}
                                onChange={(e) => {
                                  const updated = [...tourPageForm.travel_items];
                                  updated[idx] = { ...updated[idx], description_en: e.target.value };
                                  setTourPageForm({ ...tourPageForm, travel_items: updated });
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                                dir="ltr"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* بخش ۲: خدماتی فراتر از یک سفر ساده */}
                    <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-5">
                      <div className="border-b border-slate-200 pb-3">
                        <span className="text-[11px] font-bold text-[#FCA311] uppercase tracking-wider block">بخش دوم</span>
                        <h4 className="text-sm font-black text-[#14213D]">خدماتی فراتر از یک سفر ساده (More Than a Tour)</h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">سربرگ کوچک (دری)</label>
                          <input
                            type="text"
                            value={tourPageForm.more_eyebrow_fa || ''}
                            onChange={(e) => setTourPageForm({ ...tourPageForm, more_eyebrow_fa: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800"
                            dir="rtl"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Eyebrow (English)</label>
                          <input
                            type="text"
                            value={tourPageForm.more_eyebrow_en || ''}
                            onChange={(e) => setTourPageForm({ ...tourPageForm, more_eyebrow_en: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800"
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">عنوان اصلی (دری)</label>
                          <input
                            type="text"
                            value={tourPageForm.more_title_fa || ''}
                            onChange={(e) => setTourPageForm({ ...tourPageForm, more_title_fa: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800"
                            dir="rtl"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Main Title (English)</label>
                          <input
                            type="text"
                            value={tourPageForm.more_title_en || ''}
                            onChange={(e) => setTourPageForm({ ...tourPageForm, more_title_en: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      {/* ۵ آیتم این بخش */}
                      <div className="space-y-4 pt-2">
                        <span className="text-xs font-bold text-slate-700 block">۵ خدمت ویژه سفر:</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(tourPageForm.more_items || []).map((item, idx) => (
                            <div key={idx} className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2">
                              <span className="text-[11px] font-mono font-bold text-amber-600">خدمت {idx + 1}</span>
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  placeholder="عنوان دری"
                                  value={item.title_fa || ''}
                                  onChange={(e) => {
                                    const updated = [...tourPageForm.more_items];
                                    updated[idx] = { ...updated[idx], title_fa: e.target.value };
                                    setTourPageForm({ ...tourPageForm, more_items: updated });
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                                  dir="rtl"
                                />
                                <input
                                  type="text"
                                  placeholder="English Title"
                                  value={item.title_en || ''}
                                  onChange={(e) => {
                                    const updated = [...tourPageForm.more_items];
                                    updated[idx] = { ...updated[idx], title_en: e.target.value };
                                    setTourPageForm({ ...tourPageForm, more_items: updated });
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                                  dir="ltr"
                                />
                              </div>
                              <textarea
                                rows={2}
                                placeholder="متن توضیحات دری"
                                value={item.description_fa || ''}
                                onChange={(e) => {
                                  const updated = [...tourPageForm.more_items];
                                  updated[idx] = { ...updated[idx], description_fa: e.target.value };
                                  setTourPageForm({ ...tourPageForm, more_items: updated });
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                                dir="rtl"
                              />
                              <textarea
                                rows={2}
                                placeholder="English Description"
                                value={item.description_en || ''}
                                onChange={(e) => {
                                  const updated = [...tourPageForm.more_items];
                                  updated[idx] = { ...updated[idx], description_en: e.target.value };
                                  setTourPageForm({ ...tourPageForm, more_items: updated });
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                                dir="ltr"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* بخش ۳: چگونه کار می‌کند */}
                    <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-5">
                      <div className="border-b border-slate-200 pb-3">
                        <span className="text-[11px] font-bold text-[#FCA311] uppercase tracking-wider block">بخش سوم</span>
                        <h4 className="text-sm font-black text-[#14213D]">چگونه کار می‌کند (How Booking Works)</h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">سربرگ کوچک (دری)</label>
                          <input
                            type="text"
                            value={tourPageForm.work_eyebrow_fa || ''}
                            onChange={(e) => setTourPageForm({ ...tourPageForm, work_eyebrow_fa: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800"
                            dir="rtl"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Eyebrow (English)</label>
                          <input
                            type="text"
                            value={tourPageForm.work_eyebrow_en || ''}
                            onChange={(e) => setTourPageForm({ ...tourPageForm, work_eyebrow_en: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800"
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">عنوان اصلی (دری)</label>
                          <input
                            type="text"
                            value={tourPageForm.work_title_fa || ''}
                            onChange={(e) => setTourPageForm({ ...tourPageForm, work_title_fa: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800"
                            dir="rtl"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Main Title (English)</label>
                          <input
                            type="text"
                            value={tourPageForm.work_title_en || ''}
                            onChange={(e) => setTourPageForm({ ...tourPageForm, work_title_en: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      {/* ۴ مرحله رزرو */}
                      <div className="space-y-4 pt-2">
                        <span className="text-xs font-bold text-slate-700 block">۴ مرحله رزرو و آغاز سفر:</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(tourPageForm.work_items || []).map((item, idx) => (
                            <div key={idx} className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2">
                              <span className="text-[11px] font-mono font-bold text-amber-600">مرحله {idx + 1}</span>
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  placeholder="عنوان دری"
                                  value={item.title_fa || ''}
                                  onChange={(e) => {
                                    const updated = [...tourPageForm.work_items];
                                    updated[idx] = { ...updated[idx], title_fa: e.target.value };
                                    setTourPageForm({ ...tourPageForm, work_items: updated });
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                                  dir="rtl"
                                />
                                <input
                                  type="text"
                                  placeholder="English Title"
                                  value={item.title_en || ''}
                                  onChange={(e) => {
                                    const updated = [...tourPageForm.work_items];
                                    updated[idx] = { ...updated[idx], title_en: e.target.value };
                                    setTourPageForm({ ...tourPageForm, work_items: updated });
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                                  dir="ltr"
                                />
                              </div>
                              <textarea
                                rows={2}
                                placeholder="متن توضیحات دری"
                                value={item.description_fa || ''}
                                onChange={(e) => {
                                  const updated = [...tourPageForm.work_items];
                                  updated[idx] = { ...updated[idx], description_fa: e.target.value };
                                  setTourPageForm({ ...tourPageForm, work_items: updated });
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                                dir="rtl"
                              />
                              <textarea
                                rows={2}
                                placeholder="English Description"
                                value={item.description_en || ''}
                                onChange={(e) => {
                                  const updated = [...tourPageForm.work_items];
                                  updated[idx] = { ...updated[idx], description_en: e.target.value };
                                  setTourPageForm({ ...tourPageForm, work_items: updated });
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                                dir="ltr"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={sectionsSaving}
                        className="px-6 py-2.5 rounded-xl bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-black text-xs transition shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        {sectionsSaving ? 'در حال ذخیره‌سازی...' : 'ذخیره تغییرات عناوین و متون بخش‌ها'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              تب ۶: درخواست‌های رزرواسیون
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