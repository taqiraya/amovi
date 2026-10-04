import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import process from 'node:process';
import fs from 'node:fs';
import { Buffer } from 'node:buffer';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'amovi_db';
const DB_PORT = Number(process.env.DB_PORT || 3306);

// تنظیمات میانی (Middleware)
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// سرو کردن فایل‌های بیلد فرانت‌اند و فایل‌های استاتیک
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// لاگر درخواست‌ها
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// ایجاد کانکشن پول MySQL
export const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

// مقداردهی اولیه دیتابیس و جداول
async function initDatabase() {
  try {
    const conn = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT,
      charset: 'utf8mb4'
    });

    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await conn.end();

    // ۱. جدول پیام‌های تماس
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone_whatsapp VARCHAR(100) DEFAULT NULL,
        subject VARCHAR(255) DEFAULT NULL,
        message TEXT NOT NULL,
        status ENUM('unread', 'read', 'archived') DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // ۲. جدول کاربران مدیر (Admin)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) DEFAULT 'مدیر آمووی ترول',
        email VARCHAR(255) DEFAULT 'info@amovitravel.com',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // ثبت کاربر مدیر پیش‌فرض در صورت عدم وجود (admin / admin)
    const [existingAdmins] = await pool.query('SELECT id FROM admin_users WHERE username = ?', ['admin']);
    if (existingAdmins.length === 0) {
      await pool.query(`
        INSERT INTO admin_users (username, password, full_name, email)
        VALUES ('admin', 'admin', 'مدیر ارشد آمووی ترول', 'info@amovitravel.com');
      `);
      console.log('[Database] Default admin user created (admin / admin).');
    }

    console.log(`[Database] MySQL connected to "${DB_NAME}". Tables ready.`);
  } catch (err) {
    console.error('[Database Error] Connection to MySQL failed:', err.message);
  }
}

/* ========================================================
   مسیرهای احراز هویت (Authentication API)
======================================================== */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'نام کاربری و رمز عبور الزامی است.' });
    }

    const [rows] = await pool.query('SELECT * FROM admin_users WHERE username = ?', [username.trim()]);
    if (rows.length === 0 || rows[0].password !== password.trim()) {
      return res.status(401).json({ success: false, error: 'نام کاربری یا رمز عبور اشتباه است.' });
    }

    const user = rows[0];
    const token = Buffer.from(`${user.id}:${user.username}:${Date.now()}`).toString('base64');

    return res.json({
      success: true,
      message: 'ورود با موفقیت انجام شد.',
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, error: 'خطای سرور در احراز هویت.' });
  }
});

/* ========================================================
   مسیرهای فرم تماس با ما (Contact Messages API)
======================================================== */
// دریافت همه پیام‌ها
app.get(['/api/contact', '/contactMessages'], async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    const formatted = rows.map((r) => ({
      id: r.id,
      fullName: r.full_name,
      full_name: r.full_name,
      email: r.email,
      phoneWhatsApp: r.phone_whatsapp,
      phone_whatsapp: r.phone_whatsapp,
      subject: r.subject,
      message: r.message,
      status: r.status,
      created_at: r.created_at,
      submittedAt: r.created_at
    }));
    res.json(formatted);
  } catch (error) {
    console.error('Fetch contact messages error:', error);
    res.status(500).json({ success: false, error: 'خطا در دریافت پیام‌ها.' });
  }
});

// ثبت پیام جدید
app.post(['/api/contact', '/contactMessages'], async (req, res) => {
  try {
    const { fullName, full_name, email, phoneWhatsApp, phone_whatsapp, subject, message } = req.body;
    const nameVal = (fullName || full_name || '').trim();
    const emailVal = (email || '').trim();
    const phoneVal = (phoneWhatsApp || phone_whatsapp || '').trim();
    const subjVal = (subject || '').trim();
    const msgVal = (message || '').trim();

    if (!nameVal || !emailVal || !msgVal) {
      return res.status(400).json({ success: false, error: 'لطفاً نام، ایمیل و متن پیام را وارد کنید.' });
    }

    const [result] = await pool.query(
      'INSERT INTO contact_messages (full_name, email, phone_whatsapp, subject, message, status) VALUES (?, ?, ?, ?, ?, ?)',
      [nameVal, emailVal, phoneVal || null, subjVal || null, msgVal, 'unread']
    );

    res.status(201).json({
      success: true,
      message: 'پیام شما با موفقیت ثبت شد.',
      data: {
        id: result.insertId,
        fullName: nameVal,
        email: emailVal,
        phoneWhatsApp: phoneVal,
        subject: subjVal,
        message: msgVal,
        status: 'unread',
        created_at: new Date()
      }
    });
  } catch (error) {
    console.error('Create contact message error:', error);
    res.status(500).json({ success: false, error: 'خطا در ثبت پیام در سرور.' });
  }
});

// تغییر وضعیت پیام (خوانده‌شده / نخوانده)
app.patch('/api/contact/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE contact_messages SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, message: 'وضعیت پیام به‌روزرسانی شد.' });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ success: false, error: 'خطا در تغییر وضعیت پیام.' });
  }
});

// حذف پیام
app.delete('/api/contact/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM contact_messages WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'پیام با موفقیت حذف شد.' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ success: false, error: 'خطا در حذف پیام.' });
  }
});

// بررسی سلامت API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ریدایرکت مسیرهای قدیمی به /amovilogin
app.get(['/login', '/admin'], (req, res) => {
  res.redirect('/amovilogin');
});

/* ========================================================
   بخش ادمین و مدیریت یکپارچه در مسیر /amovilogin
======================================================== */
app.get('/amovilogin', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>پنل مدیریت آمووی ترول | Amovi Travel Portal</title>
  <link rel="icon" type="image/png" href="/logo.png">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #0b1120; }
  </style>
</head>
<body class="min-h-screen text-slate-100 bg-[#0b1120]">

  <!-- ۱. بخش لاگین (در صورت عدم لاگین نمایش داده می‌شود) -->
  <section id="loginSection" class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0d1527] via-[#14213D] to-[#0a101f]">
    <div class="w-full max-w-md bg-[#14213D]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      <!-- هاله‌های طلایی -->
      <div class="absolute -top-20 -right-20 w-44 h-44 bg-[#FCA311]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-20 -left-20 w-44 h-44 bg-sky-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div class="text-center mb-8 relative z-10">
        <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[#0d1527] border border-[#FCA311]/40 p-2.5 shadow-xl flex items-center justify-center">
          <img src="/logo.png" alt="Amovi Travel" class="w-full h-full object-contain" onerror="this.src='/logo.png'">
        </div>
        <h1 class="text-2xl font-black tracking-tight text-white">Amovi Travel</h1>
        <p class="text-xs uppercase tracking-[0.2em] text-[#FCA311] font-bold mt-1">Management Portal</p>
        <p class="text-xs text-slate-300 mt-2 font-medium">ورود به پنل مدیریت پیام‌ها و رزرواسیون‌ها</p>
      </div>

      <form id="loginForm" class="space-y-4 relative z-10">
        <div id="alertBox" class="hidden p-3 rounded-xl text-xs font-bold text-center"></div>

        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1.5">نام کاربری</label>
          <input 
            type="text" 
            id="username" 
            required 
            placeholder="admin"
            value="admin"
            class="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FCA311] transition duration-200"
            dir="ltr"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1.5">رمز عبور</label>
          <input 
            type="password" 
            id="password" 
            required 
            placeholder="admin"
            value="admin"
            class="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FCA311] transition duration-200"
            dir="ltr"
          />
        </div>

        <div class="pt-2">
          <button 
            type="submit" 
            id="submitBtn"
            class="w-full py-3.5 px-4 rounded-xl bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-extrabold text-sm tracking-wider uppercase transition-all duration-200 shadow-lg shadow-[#FCA311]/25 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <span>ورود به سیستم</span>
            <svg class="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>
      </form>

      <div class="mt-6 pt-4 border-t border-white/10 text-center text-[11px] text-slate-400">
        اطلاعات ورود پیش‌فرض: نام کاربری: <span class="font-mono text-[#FCA311]">admin</span> | رمز: <span class="font-mono text-[#FCA311]">admin</span>
      </div>
    </div>
  </section>

  <!-- ۲. بخش داشبورد مدیریت (در صورت لاگین بودن نمایش داده می‌شود) -->
  <section id="dashboardSection" class="hidden min-h-screen">
    <!-- هدر بالای داشبورد -->
    <header class="border-b border-white/10 bg-[#14213D]/95 backdrop-blur-md sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#0b1120] border border-[#FCA311]/40 p-1.5 shadow flex items-center justify-center">
            <img src="/logo.png" alt="Amovi Travel" class="w-full h-full object-contain">
          </div>
          <div>
            <span class="block text-base font-black text-white font-[Inter]">Amovi Travel</span>
            <span class="block text-[10px] text-[#FCA311] font-bold uppercase tracking-wider">Management Portal</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <a 
            href="/" 
            class="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition flex items-center gap-1.5"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            <span>مشاهده وب‌سایت</span>
          </a>

          <button 
            onclick="fetchMessages()" 
            class="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            <span>تازه‌سازی</span>
          </button>

          <button 
            onclick="logout()" 
            class="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>خروج</span>
          </button>
        </div>
      </div>
    </header>

    <!-- محتوای اصلی داشبورد -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <!-- کارت‌های آمار سریع پیام‌ها -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-[#14213D] border border-white/10 p-5 rounded-2xl shadow">
          <span class="text-xs text-slate-400 font-bold block mb-1">کل پیام‌های دریافتی</span>
          <span id="statTotal" class="text-2xl sm:text-3xl font-black text-white font-mono">0</span>
        </div>
        <div class="bg-[#14213D] border border-white/10 p-5 rounded-2xl shadow">
          <span class="text-xs text-amber-400 font-bold block mb-1">پیام‌های جدید (نخوانده)</span>
          <span id="statUnread" class="text-2xl sm:text-3xl font-black text-[#FCA311] font-mono">0</span>
        </div>
        <div class="bg-[#14213D] border border-white/10 p-5 rounded-2xl shadow">
          <span class="text-xs text-emerald-400 font-bold block mb-1">پیام‌های بررسی‌شده</span>
          <span id="statRead" class="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">0</span>
        </div>
      </div>

      <!-- جدول پیام‌ها -->
      <div class="bg-[#14213D] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div class="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h2 class="text-lg font-black text-white">پیام‌های فرم تماس با ما</h2>
            <p class="text-xs text-slate-400 mt-0.5">پیام‌های ثبت شده کاربران ذخیره در دیتابیس MySQL آمووی ترول</p>
          </div>
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <input 
              type="text" 
              id="searchInput" 
              placeholder="جستجو در نام، ایمیل، پیام..." 
              oninput="renderMessages()"
              class="w-full sm:w-64 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FCA311]"
            />
            <button 
              onclick="exportJSON()" 
              class="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 transition whitespace-nowrap cursor-pointer"
            >
              خروجی JSON
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-right text-xs text-slate-300">
            <thead class="bg-slate-900/80 text-slate-400 uppercase font-bold text-[11px] border-b border-white/10">
              <tr>
                <th class="py-3.5 px-4">شناسه</th>
                <th class="py-3.5 px-4">فرستنده</th>
                <th class="py-3.5 px-4">ایمیل و واتس‌اپ</th>
                <th class="py-3.5 px-4">موضوع</th>
                <th class="py-3.5 px-4">متن پیام</th>
                <th class="py-3.5 px-4">وضعیت</th>
                <th class="py-3.5 px-4">تاریخ ارسال</th>
                <th class="py-3.5 px-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody id="messagesTableBody" class="divide-y divide-white/5">
              <tr>
                <td colspan="8" class="text-center py-10 text-slate-400">در حال دریافت اطلاعات...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </section>

  <script>
    let allMessages = [];

    function checkAuth() {
      const token = sessionStorage.getItem('amovi_admin_token');
      const loginSec = document.getElementById('loginSection');
      const dashSec = document.getElementById('dashboardSection');
      if (token) {
        loginSec.classList.add('hidden');
        dashSec.classList.remove('hidden');
        fetchMessages();
      } else {
        loginSec.classList.remove('hidden');
        dashSec.classList.add('hidden');
      }
    }

    // لاگین
    const form = document.getElementById('loginForm');
    const alertBox = document.getElementById('alertBox');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      alertBox.className = 'hidden';
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'در حال بررسی...';

      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok && data.success) {
          sessionStorage.setItem('amovi_admin_token', data.token);
          sessionStorage.setItem('amovi_admin_user', JSON.stringify(data.user));
          alertBox.className = 'p-3 rounded-xl text-xs font-bold text-center bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
          alertBox.innerText = 'ورود موفقیت‌آمیز بود! در حال بارگذاری اطلاعات...';
          setTimeout(() => {
            checkAuth();
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'ورود به سیستم';
          }, 400);
        } else {
          alertBox.className = 'p-3 rounded-xl text-xs font-bold text-center bg-rose-500/20 text-rose-300 border border-rose-500/30';
          alertBox.innerText = data.error || 'نام کاربری یا رمز عبور نامعتبر است.';
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'ورود به سیستم';
        }
      } catch (err) {
        alertBox.className = 'p-3 rounded-xl text-xs font-bold text-center bg-rose-500/20 text-rose-300 border border-rose-500/30';
        alertBox.innerText = 'خطا در ارتباط با سرور.';
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'ورود به سیستم';
      }
    });

    async function fetchMessages() {
      try {
        const res = await fetch('/api/contact');
        if (res.ok) {
          allMessages = await res.json();
          updateStats();
          renderMessages();
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    }

    function updateStats() {
      const total = allMessages.length;
      const unread = allMessages.filter(m => m.status === 'unread').length;
      const read = total - unread;
      document.getElementById('statTotal').innerText = total;
      document.getElementById('statUnread').innerText = unread;
      document.getElementById('statRead').innerText = read;
    }

    function renderMessages() {
      const tbody = document.getElementById('messagesTableBody');
      const q = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();

      const filtered = allMessages.filter(m => {
        return (m.fullName || '').toLowerCase().includes(q) ||
               (m.email || '').toLowerCase().includes(q) ||
               (m.subject || '').toLowerCase().includes(q) ||
               (m.message || '').toLowerCase().includes(q);
      });

      if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center py-10 text-slate-400">هیچ پیامی یافت نشد.</td></tr>';
        return;
      }

      tbody.innerHTML = filtered.map(m => {
        const isUnread = m.status === 'unread';
        const dateStr = new Date(m.created_at || m.submittedAt).toLocaleDateString('fa-IR');
        const phone = m.phoneWhatsApp || m.phone_whatsapp || '';
        const waLink = phone ? ('https://wa.me/' + phone.replace(/[^0-9]/g, '')) : '';

        return \`
          <tr class="\${isUnread ? 'bg-amber-500/5 hover:bg-amber-500/10' : 'hover:bg-white/[0.02]'} transition">
            <td class="py-3 px-4 font-mono font-bold text-slate-400">#\${m.id}</td>
            <td class="py-3 px-4 font-bold text-white">\${escapeHtml(m.fullName || m.full_name || '-')}</td>
            <td class="py-3 px-4 font-mono">
              <div>\${escapeHtml(m.email)}</div>
              \${phone ? \`<div class="text-[11px] text-[#FCA311] mt-0.5">\${escapeHtml(phone)}</div>\` : ''}
            </td>
            <td class="py-3 px-4 font-medium text-slate-200">\${escapeHtml(m.subject || '-')}</td>
            <td class="py-3 px-4 max-w-xs truncate text-slate-300" title="\${escapeHtml(m.message)}">\${escapeHtml(m.message)}</td>
            <td class="py-3 px-4">
              <span class="inline-flex px-2 py-0.5 rounded text-[10px] font-bold \${isUnread ? 'bg-amber-500/20 text-[#FCA311] border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}">
                \${isUnread ? 'جدید' : 'بررسی‌شده'}
              </span>
            </td>
            <td class="py-3 px-4 font-mono text-slate-400 text-[11px]">\${dateStr}</td>
            <td class="py-3 px-4 text-center">
              <div class="flex items-center justify-center gap-1.5">
                <button 
                  onclick="toggleStatus(\${m.id}, '\${isUnread ? 'read' : 'unread'}')" 
                  class="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold transition cursor-pointer"
                  title="تغییر وضعیت"
                >
                  \${isUnread ? 'خوانده شد' : 'علامت جدید'}
                </button>
                \${waLink ? \`
                  <a href="\${waLink}" target="_blank" rel="noopener" class="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-bold transition">
                    واتس‌اپ
                  </a>
                \` : ''}
                <a href="mailto:\${encodeURIComponent(m.email)}?subject=\${encodeURIComponent('پاسخ از آمووی ترول: ' + (m.subject || ''))}" class="px-2 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-[11px] font-bold transition">
                  ایمیل
                </a>
                <button 
                  onclick="deleteMsg(\${m.id})" 
                  class="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-bold transition cursor-pointer"
                  title="حذف"
                >
                  حذف
                </button>
              </div>
            </td>
          </tr>
        \`;
      }).join('');
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
      });
    }

    async function toggleStatus(id, newStatus) {
      try {
        await fetch('/api/contact/' + id + '/status', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
        fetchMessages();
      } catch (err) {
        console.error(err);
      }
    }

    async function deleteMsg(id) {
      if (!confirm('آیا از حذف این پیام اطمینان دارید؟')) return;
      try {
        await fetch('/api/contact/' + id, { method: 'DELETE' });
        fetchMessages();
      } catch (err) {
        console.error(err);
      }
    }

    function exportJSON() {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allMessages, null, 2));
      const dl = document.createElement('a');
      dl.setAttribute('href', dataStr);
      dl.setAttribute('download', 'amovi_messages_' + new Date().toISOString().slice(0,10) + '.json');
      document.body.appendChild(dl);
      dl.click();
      dl.remove();
    }

    function logout() {
      sessionStorage.removeItem('amovi_admin_token');
      sessionStorage.removeItem('amovi_admin_user');
      checkAuth();
    }

    // بررسی احراز هویت اولیه
    checkAuth();
  </script>
</body>
</html>`);
});

/* ========================================================
   سرو کردن وب‌سایت اصلی آمووی ترول (SPA Fallback)
======================================================== */
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html lang="fa" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>Amovi Travel</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="min-h-screen bg-[#0b1120] text-white flex items-center justify-center p-6 text-center">
        <div class="max-w-md bg-[#14213D] p-8 rounded-3xl border border-white/10 shadow-2xl">
          <img src="/logo.png" alt="Amovi Travel" class="w-20 h-20 mx-auto mb-4 object-contain">
          <h1 class="text-xl font-black mb-2">Amovi Travel Server Online</h1>
          <p class="text-xs text-slate-300 mb-6">پورت ۳۰۰۰ با موفقیت فعال شد. برای مشاهده صفحه ادمین به مسیر زیر مراجعه کنید:</p>
          <a href="/amovilogin" class="inline-block px-5 py-3 rounded-xl bg-[#FCA311] text-[#14213D] font-extrabold text-sm">
            ورود به پنل مدیریت (/amovilogin)
          </a>
        </div>
      </body>
      </html>
    `);
  }
});

// راه‌اندازی سرور
async function startServer() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  Amovi Travel System Online!`);
    console.log(`  Port: ${PORT}`);
    console.log(`  Website: http://localhost:${PORT}/`);
    console.log(`  Admin Portal: http://localhost:${PORT}/amovilogin`);
    console.log(`  API Endpoint: http://localhost:${PORT}/api/contact`);
    console.log(`  Default Admin Credentials:`);
    console.log(`    Username: admin`);
    console.log(`    Password: admin`);
    console.log(`======================================================\n`);
  });
}

startServer();
