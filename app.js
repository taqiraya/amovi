import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import process from 'node:process';
import fs from 'node:fs';
import { Buffer } from 'node:buffer';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import multer from 'multer';
import sharp from 'sharp';

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

// مولتر جهت مدیریت آپلود فایل در حافظه
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 30 * 1024 * 1024 } // حداکثر ۳۰ مگابایت قبل از تبدیل
});

// تابع اختصاصی تبدیل عکس به WebP و فشرده‌سازی خودکار در صورت بیشتر بودن از ۱۵۰ کیلوبایت
async function processAndSaveWebp(buffer, originalname, subfolder = 'gallery') {
  let quality = 85;
  let webpBuffer = await sharp(buffer)
    .webp({ quality })
    .toBuffer();

  const maxBytes = 150 * 1024; // 150 KB
  if (webpBuffer.length > maxBytes) {
    while (webpBuffer.length > maxBytes && quality > 20) {
      quality -= 10;
      webpBuffer = await sharp(buffer)
        .webp({ quality, effort: 6 })
        .toBuffer();
    }
    if (webpBuffer.length > maxBytes) {
      webpBuffer = await sharp(buffer)
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 65, effort: 6 })
        .toBuffer();
    }
  }

  const baseName = path.parse(originalname).name.replace(/[^a-zA-Z0-9_-]/g, '_') || 'image';
  const fileName = `${Date.now()}_${baseName}.webp`;
  const uploadDir = path.join(__dirname, 'public/images', subfolder);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const filePath = path.join(uploadDir, fileName);
  await fs.promises.writeFile(filePath, webpBuffer);

  return {
    fileName,
    imageUrl: `/images/${subfolder}/${fileName}`,
    fileSizeKB: Math.round(webpBuffer.length / 1024)
  };
}

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

// مقداردهی اولیه دیتابیس و تمام جداول
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

    // ۳. جدول تنظیمات و اطلاعات تماس شرکت
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_settings (
        id INT PRIMARY KEY DEFAULT 1,
        email VARCHAR(255) NOT NULL DEFAULT 'info@amovitravel.com',
        phone VARCHAR(100) NOT NULL DEFAULT '+93 70 633 8223',
        address VARCHAR(255) NOT NULL DEFAULT 'چهارراهی انصاری، شهرنو، کابل، افغانستان',
        location_url TEXT DEFAULT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // مقداردهی رکورد پیش‌فرض اطلاعات تماس در صورت عدم وجود
    const [existingSettings] = await pool.query('SELECT id FROM contact_settings WHERE id = 1');
    if (existingSettings.length === 0) {
      await pool.query(`
        INSERT INTO contact_settings (id, email, phone, address, location_url)
        VALUES (1, 'info@amovitravel.com', '+93 70 633 8223', 'چهارراهی انصاری، شهرنو، کابل، افغانستان', 'https://www.google.com/maps/search/?api=1&query=Char+Rahi+Ansari+Shahr-e+Naw+Kabul+Afghanistan');
      `);
      console.log('[Database] Default contact settings seeded.');
    }

    // ۴. جدول تصاویر گالری داینامیک
    await pool.query(`
      CREATE TABLE IF NOT EXISTS gallery_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL DEFAULT 'kabul',
        location VARCHAR(255) DEFAULT 'افغانستان',
        image_url VARCHAR(500) NOT NULL,
        file_size_kb INT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // ۵. جدول مقالات وبلاگ داینامیک و دوزبانه
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(120) UNIQUE,
        pillar VARCHAR(50) DEFAULT 'discover',
        category_fa VARCHAR(100),
        category_en VARCHAR(100),
        title_fa VARCHAR(255) NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        excerpt_fa TEXT,
        excerpt_en TEXT,
        content_fa LONGTEXT NOT NULL,
        content_en LONGTEXT NOT NULL,
        author_fa VARCHAR(100) DEFAULT 'تیم گردشگری آمووی',
        author_en VARCHAR(100) DEFAULT 'Amovi Travel Team',
        read_time_fa VARCHAR(50) DEFAULT '۴ دقیقه',
        read_time_en VARCHAR(50) DEFAULT '4 min',
        image_url VARCHAR(500) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // بررسی و افزودن ستون‌های دوزبانه به جدول وبلاگ در صورت وجود نسخه قدیمی
    try {
      const [bCols] = await pool.query('SHOW COLUMNS FROM blog_posts');
      const bColNames = bCols.map(c => c.Field);
      const colsToAdd = [
        { name: 'slug', def: 'VARCHAR(120) UNIQUE' },
        { name: 'pillar', def: "VARCHAR(50) DEFAULT 'discover'" },
        { name: 'category_fa', def: 'VARCHAR(100)' },
        { name: 'category_en', def: 'VARCHAR(100)' },
        { name: 'title_fa', def: 'VARCHAR(255)' },
        { name: 'title_en', def: 'VARCHAR(255)' },
        { name: 'excerpt_fa', def: 'TEXT' },
        { name: 'excerpt_en', def: 'TEXT' },
        { name: 'content_fa', def: 'LONGTEXT' },
        { name: 'content_en', def: 'LONGTEXT' },
        { name: 'author_fa', def: "VARCHAR(100) DEFAULT 'تیم گردشگری آمووی'" },
        { name: 'author_en', def: "VARCHAR(100) DEFAULT 'Amovi Travel Team'" },
        { name: 'read_time_fa', def: "VARCHAR(50) DEFAULT '۴ دقیقه'" },
        { name: 'read_time_en', def: "VARCHAR(50) DEFAULT '4 min'" }
      ];
      for (const c of colsToAdd) {
        if (!bColNames.includes(c.name)) {
          await pool.query(`ALTER TABLE blog_posts ADD COLUMN ${c.name} ${c.def}`);
        }
      }
    } catch (e) {
      console.warn('Blog table migration notice:', e.message);
    }

    // ثبت خودکار ۱۴ مقاله رسمی آمووی (از پوشه Blog) در دیتابیس
    try {
      const dbJsonPath = path.join(__dirname, 'db.json');
      let defaultArticles = [];
      if (fs.existsSync(dbJsonPath)) {
        try {
          const parsedDb = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));
          defaultArticles = parsedDb.blogPosts || [];
        } catch (e) { /* ignore */ }
      }
      if (Array.isArray(defaultArticles) && defaultArticles.length > 0) {
        for (const art of defaultArticles) {
          const [exist] = await pool.query('SELECT id FROM blog_posts WHERE slug = ?', [art.slug]);
          if (exist.length === 0) {
            await pool.query(`
              INSERT INTO blog_posts 
              (slug, pillar, category_fa, category_en, title_fa, title_en, excerpt_fa, excerpt_en, content_fa, content_en, author_fa, author_en, read_time_fa, read_time_en, image_url)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              art.slug,
              art.pillar,
              art.fa.category,
              art.en.category,
              art.fa.title,
              art.en.title,
              art.fa.excerpt,
              art.en.excerpt,
              art.fa.content,
              art.en.content,
              art.fa.author,
              art.en.author,
              art.fa.readTime,
              art.en.readTime,
              art.image
            ]);
          }
        }
        console.log('[Database] 14 official bilingual blog articles verified in database.');
      }
    } catch (e) {
      console.warn('Seeding blog articles warning:', e.message);
    }

    // ثبت کاربر مدیر پیش‌فرض در صورت عدم وجود (admin / admin)
    const [existingAdmins] = await pool.query('SELECT id FROM admin_users WHERE username = ?', ['admin']);
    if (existingAdmins.length === 0) {
      await pool.query(`
        INSERT INTO admin_users (username, password, full_name, email)
        VALUES ('admin', 'admin', 'مدیر ارشد آمووی ترول', 'info@amovitravel.com');
      `);
      console.log('[Database] Default admin user created (admin / admin).');
    }

    console.log(`[Database] MySQL connected to "${DB_NAME}". All tables initialized.`);
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

app.delete('/api/contact/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM contact_messages WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'پیام با موفقیت حذف شد.' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ success: false, error: 'خطا در حذف پیام.' });
  }
});

/* ========================================================
   مسیرهای تنظیمات و اطلاعات تماس (Contact Settings API)
======================================================== */
app.get('/api/settings', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contact_settings WHERE id = 1');
    if (rows.length > 0) {
      return res.json({
        success: true,
        data: {
          email: rows[0].email,
          phone: rows[0].phone,
          address: rows[0].address,
          locationUrl: rows[0].location_url
        }
      });
    }
    res.json({
      success: true,
      data: {
        email: 'info@amovitravel.com',
        phone: '+93 70 633 8223',
        address: 'چهارراهی انصاری، شهرنو، کابل، افغانستان',
        locationUrl: 'https://www.google.com/maps/search/?api=1&query=Char+Rahi+Ansari+Shahr-e+Naw+Kabul+Afghanistan'
      }
    });
  } catch (error) {
    console.error('Fetch settings error:', error);
    res.status(500).json({ success: false, error: 'خطا در دریافت تنظیمات.' });
  }
});

app.post(['/api/settings', '/api/settings/update'], async (req, res) => {
  try {
    const { email, phone, address, locationUrl } = req.body;
    await pool.query(`
      INSERT INTO contact_settings (id, email, phone, address, location_url)
      VALUES (1, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        email = VALUES(email),
        phone = VALUES(phone),
        address = VALUES(address),
        location_url = VALUES(location_url);
    `, [
      email || 'info@amovitravel.com',
      phone || '+93 70 633 8223',
      address || 'چهارراهی انصاری، شهرنو، کابل، افغانستان',
      locationUrl || ''
    ]);

    res.json({ success: true, message: 'اطلاعات تماس با موفقیت ذخیره شد.' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ success: false, error: 'خطا در به‌روزرسانی تنظیمات.' });
  }
});

/* ========================================================
   مسیرهای گالری داینامیک و آپلود تصاویر WebP
======================================================== */
app.get('/api/gallery', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM gallery_items ORDER BY created_at DESC');
    res.json(rows.map(r => ({
      id: r.id,
      title: r.title,
      category: r.category,
      location: r.location,
      image: r.image_url,
      fileSizeKB: r.file_size_kb,
      createdAt: r.created_at
    })));
  } catch (error) {
    console.error('Fetch gallery error:', error);
    res.status(500).json({ success: false, error: 'خطا در دریافت لیست تصاویر گالری.' });
  }
});

app.post('/api/gallery', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'لطفاً یک فایل تصویر انتخاب نمایید.' });
    }

    const { title, category, location } = req.body;
    const { imageUrl, fileSizeKB } = await processAndSaveWebp(req.file.buffer, req.file.originalname, 'gallery');

    const [result] = await pool.query(
      'INSERT INTO gallery_items (title, category, location, image_url, file_size_kb) VALUES (?, ?, ?, ?, ?)',
      [
        (title || 'تصویر گالری آمووی').trim(),
        category || 'kabul',
        (location || 'افغانستان').trim(),
        imageUrl,
        fileSizeKB
      ]
    );

    res.status(201).json({
      success: true,
      message: 'تصویر با موفقیت به WebP تبدیل و بهینه‌سازی شد.',
      data: {
        id: result.insertId,
        title: (title || 'تصویر گالری آمووی').trim(),
        category: category || 'kabul',
        location: (location || 'افغانستان').trim(),
        image: imageUrl,
        fileSizeKB
      }
    });
  } catch (error) {
    console.error('Gallery upload error:', error);
    res.status(500).json({ success: false, error: 'خطا در آپلود و بهینه‌سازی تصویر.' });
  }
});

app.delete('/api/gallery/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT image_url FROM gallery_items WHERE id = ?', [req.params.id]);
    if (rows.length > 0 && rows[0].image_url) {
      const filePath = path.join(__dirname, 'public', rows[0].image_url);
      if (fs.existsSync(filePath)) {
        try { await fs.promises.unlink(filePath); } catch (e) { /* ignore */ }
      }
    }
    await pool.query('DELETE FROM gallery_items WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تصویر با موفقیت از گالری حذف شد.' });
  } catch (error) {
    console.error('Delete gallery error:', error);
    res.status(500).json({ success: false, error: 'خطا در حذف تصویر.' });
  }
});

/* ========================================================
   مسیرهای وبلاگ داینامیک (Blog API)
======================================================== */
app.get(['/api/blog', '/blogPosts'], async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM blog_posts ORDER BY id ASC');
    res.json(rows.map(r => ({
      id: r.slug || r.id,
      dbId: r.id,
      slug: r.slug || `post-${r.id}`,
      pillar: r.pillar || 'discover',
      image: r.image_url || '/images/provinces/kabul/kabul-hero.webp',
      image_url: r.image_url || '/images/provinces/kabul/kabul-hero.webp',
      createdAt: r.created_at,
      date: r.created_at ? new Date(r.created_at).toLocaleDateString('en-US') : 'Recent',
      fa: {
        title: r.title_fa || r.title,
        category: r.category_fa || 'کشف سرزمین',
        excerpt: r.excerpt_fa || (r.content_fa ? r.content_fa.slice(0, 150) + '...' : ''),
        content: r.content_fa || r.content,
        author: r.author_fa || r.author || 'تیم گردشگری آمووی',
        readTime: r.read_time_fa || '۴ دقیقه'
      },
      en: {
        title: r.title_en || r.title,
        category: r.category_en || 'DISCOVER',
        excerpt: r.excerpt_en || (r.content_en ? r.content_en.slice(0, 150) + '...' : ''),
        content: r.content_en || r.content,
        author: r.author_en || r.author || 'Amovi Travel Team',
        readTime: r.read_time_en || '4 min'
      },
      // مشخصات مشترک
      title: r.title_fa || r.title,
      title_fa: r.title_fa || r.title,
      title_en: r.title_en || r.title,
      content: r.content_fa || r.content,
      content_fa: r.content_fa || r.content,
      content_en: r.content_en || r.content,
      author: r.author_fa || r.author || 'تیم گردشگری آمووی'
    })));
  } catch (error) {
    console.error('Fetch blog error:', error);
    res.status(500).json({ success: false, error: 'خطا در دریافت مقالات وبلاگ.' });
  }
});

app.get('/api/blog/:id', async (req, res) => {
  try {
    const queryId = req.params.id;
    const [rows] = await pool.query(
      'SELECT * FROM blog_posts WHERE id = ? OR slug = ? LIMIT 1', 
      [queryId, queryId]
    );
    if (rows.length > 0) {
      const r = rows[0];
      return res.json({
        success: true,
        data: {
          id: r.slug || r.id,
          dbId: r.id,
          slug: r.slug || `post-${r.id}`,
          pillar: r.pillar || 'discover',
          image: r.image_url || '/images/provinces/kabul/kabul-hero.webp',
          image_url: r.image_url || '/images/provinces/kabul/kabul-hero.webp',
          createdAt: r.created_at,
          fa: {
            title: r.title_fa || r.title,
            category: r.category_fa || 'کشف سرزمین',
            excerpt: r.excerpt_fa || (r.content_fa ? r.content_fa.slice(0, 150) + '...' : ''),
            content: r.content_fa || r.content,
            author: r.author_fa || r.author || 'تیم گردشگری آمووی',
            readTime: r.read_time_fa || '۴ دقیقه'
          },
          en: {
            title: r.title_en || r.title,
            category: r.category_en || 'DISCOVER',
            excerpt: r.excerpt_en || (r.content_en ? r.content_en.slice(0, 150) + '...' : ''),
            content: r.content_en || r.content,
            author: r.author_en || r.author || 'Amovi Travel Team',
            readTime: r.read_time_en || '4 min'
          },
          title: r.title_fa || r.title,
          title_fa: r.title_fa || r.title,
          title_en: r.title_en || r.title,
          content: r.content_fa || r.content,
          content_fa: r.content_fa || r.content,
          content_en: r.content_en || r.content,
          author: r.author_fa || r.author || 'تیم گردشگری آمووی'
        }
      });
    }
    res.status(404).json({ success: false, error: 'مقاله مورد نظر یافت نشد.' });
  } catch (error) {
    console.error('Fetch blog post error:', error);
    res.status(500).json({ success: false, error: 'خطا در دریافت مقاله.' });
  }
});

app.post('/api/blog', upload.single('image'), async (req, res) => {
  try {
    const { 
      title, 
      content, 
      author,
      title_fa, 
      title_en, 
      content_fa, 
      content_en, 
      author_fa, 
      author_en, 
      category_fa, 
      category_en,
      pillar 
    } = req.body;

    const finalTitleFa = (title_fa || title || '').trim();
    const finalTitleEn = (title_en || title || '').trim();
    const finalContentFa = (content_fa || content || '').trim();
    const finalContentEn = (content_en || content || '').trim();

    if (!finalTitleFa && !finalTitleEn) {
      return res.status(400).json({ success: false, error: 'عنوان مقاله الزامی است.' });
    }
    if (!finalContentFa && !finalContentEn) {
      return res.status(400).json({ success: false, error: 'متن مقاله الزامی است.' });
    }

    let imageUrl = '/images/provinces/kabul/kabul-hero.webp';
    if (req.file) {
      const processed = await processAndSaveWebp(req.file.buffer, req.file.originalname, 'blog');
      imageUrl = processed.imageUrl;
    }

    const finalAuthorFa = (author_fa || author || 'تیم گردشگری آمووی').trim();
    const finalAuthorEn = (author_en || author || 'Amovi Travel Team').trim();
    const slug = 'post-' + Date.now();

    const [result] = await pool.query(
      `INSERT INTO blog_posts 
      (slug, pillar, category_fa, category_en, title_fa, title_en, content_fa, content_en, author_fa, author_en, image_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        pillar || 'discover',
        category_fa || 'کشف سرزمین',
        category_en || 'DISCOVER',
        finalTitleFa || finalTitleEn,
        finalTitleEn || finalTitleFa,
        finalContentFa || finalContentEn,
        finalContentEn || finalContentFa,
        finalAuthorFa,
        finalAuthorEn,
        imageUrl
      ]
    );

    res.status(201).json({
      success: true,
      message: 'مقاله دوزبانه با موفقیت منتشر شد.',
      data: {
        id: slug,
        dbId: result.insertId,
        slug,
        image: imageUrl,
        fa: {
          title: finalTitleFa || finalTitleEn,
          content: finalContentFa || finalContentEn,
          author: finalAuthorFa
        },
        en: {
          title: finalTitleEn || finalTitleFa,
          content: finalContentEn || finalContentFa,
          author: finalAuthorEn
        },
        title: finalTitleFa || finalTitleEn,
        content: finalContentFa || finalContentEn,
        createdAt: new Date()
      }
    });
  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({ success: false, error: 'خطا در ثبت و انتشار مقاله.' });
  }
});

app.delete('/api/blog/:id', async (req, res) => {
  try {
    const queryId = req.params.id;
    await pool.query('DELETE FROM blog_posts WHERE id = ? OR slug = ?', [queryId, queryId]);
    res.json({ success: true, message: 'مقاله با موفقیت حذف شد.' });
  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json({ success: false, error: 'خطا در حذف مقاله.' });
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
   طراحی کاملاً روشن (بدون رنگ دارک)، ریسپانسیو با سایدبار
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
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #f8fafc; }
  </style>
</head>
<body class="min-h-screen text-slate-800 bg-[#f8fafc]">

  <!-- ۱. بخش لاگین با رنگ روشن و مدرن -->
  <section id="loginSection" class="min-h-screen flex items-center justify-center p-4 bg-slate-50">
    <div class="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      <div class="text-center mb-8 relative z-10">
        <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white border border-amber-300 p-2.5 shadow-md flex items-center justify-center">
          <img src="/logo.png" alt="Amovi Travel" class="w-full h-full object-contain" onerror="this.src='/logo.png'">
        </div>
        <h1 class="text-2xl font-black text-[#14213D]">Amovi Travel</h1>
        <p class="text-xs uppercase tracking-[0.2em] text-[#FCA311] font-bold mt-1">Management Portal</p>
        <p class="text-xs text-slate-500 mt-2 font-medium">ورود به پنل مدیریت پیام‌ها، وبلاگ و اطلاعات</p>
      </div>

      <form id="loginForm" class="space-y-4 relative z-10">
        <div id="alertBox" class="hidden p-3 rounded-xl text-xs font-bold text-center"></div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">نام کاربری</label>
          <input 
            type="text" 
            id="username" 
            required 
            placeholder="admin"
            value="admin"
            class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#FCA311] focus:bg-white transition"
            dir="ltr"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">رمز عبور</label>
          <input 
            type="password" 
            id="password" 
            required 
            placeholder="admin"
            value="admin"
            class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#FCA311] focus:bg-white transition"
            dir="ltr"
          />
        </div>

        <div class="pt-2">
          <button 
            type="submit" 
            id="submitBtn"
            class="w-full py-3.5 px-4 rounded-xl bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-extrabold text-sm tracking-wider uppercase transition shadow-md hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2"
          >
            <span>ورود به پنل مدیریت</span>
          </button>
        </div>
      </form>

      <div class="mt-6 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-500">
        نام کاربری: <span class="font-mono font-bold text-[#14213D]">admin</span> | رمز: <span class="font-mono font-bold text-[#14213D]">admin</span>
      </div>
    </div>
  </section>

  <!-- ۲. پنل مدیریت کامل (روشن، سایدبار، ریسپانسیو) -->
  <section id="dashboardSection" class="hidden min-h-screen flex">
    
    <!-- اوورلی سایدبار موبایل -->
    <div id="mobileBackdrop" onclick="toggleSidebar(false)" class="hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"></div>

    <!-- سایدبار ناوبری -->
    <aside id="mainSidebar" class="fixed lg:static top-0 right-0 bottom-0 z-50 w-72 bg-white border-l border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out translate-x-full lg:translate-x-0">
      <div>
        <div class="p-5 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-slate-50 border border-amber-300 p-1.5 shadow-xs flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="Amovi Travel" class="w-full h-full object-contain">
            </div>
            <div>
              <span class="block text-base font-black text-[#14213D]">Amovi Travel</span>
              <span class="block text-[10px] text-[#FCA311] font-bold uppercase tracking-wider">Control Hub</span>
            </div>
          </div>
          <button onclick="toggleSidebar(false)" class="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <nav class="p-4 space-y-1.5">
          <button onclick="switchTab('messages')" id="navBtn-messages" class="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition cursor-pointer bg-[#14213D] text-white shadow-md">
            <div class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-[#FCA311]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              <span>پیام‌های تماس با ما</span>
            </div>
            <span id="unreadBadge" class="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#FCA311] text-[#14213D]">0</span>
          </button>

          <button onclick="switchTab('settings')" id="navBtn-settings" class="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs font-bold transition cursor-pointer text-slate-600 hover:bg-slate-100 hover:text-[#14213D]">
            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span>اطلاعات و آدرس تماس</span>
          </button>

          <button onclick="switchTab('blog')" id="navBtn-blog" class="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition cursor-pointer text-slate-600 hover:bg-slate-100 hover:text-[#14213D]">
            <div class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
              <span>مدیریت مقالات وبلاگ</span>
            </div>
            <span id="blogCountBadge" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">0</span>
          </button>

          <button onclick="switchTab('gallery')" id="navBtn-gallery" class="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition cursor-pointer text-slate-600 hover:bg-slate-100 hover:text-[#14213D]">
            <div class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <span>مدیریت گالری تصاویر</span>
            </div>
            <span id="galleryCountBadge" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">0</span>
          </button>
        </nav>
      </div>

      <div class="p-4 border-t border-slate-100 space-y-2">
        <a href="/" class="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#14213D] text-xs font-bold transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <span>مشاهده وب‌سایت</span>
        </a>
        <button onclick="logout()" class="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          <span>خروج از حساب</span>
        </button>
      </div>
    </aside>

    <!-- ناحیه اصلی پنل -->
    <div class="flex-1 flex flex-col min-w-0">
      <header class="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div class="flex items-center gap-3">
          <button onclick="toggleSidebar(true)" class="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <div>
            <h2 id="headerTitle" class="text-base sm:text-lg font-black text-[#14213D]">پیام‌های دریافتی فرم تماس با ما</h2>
            <p class="text-[11px] text-slate-500 hidden sm:block">سیستم جامع کنترل و مدیریت اطلاعات آمووی ترول</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="exportJSON()" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            <span class="hidden sm:inline">خروجی JSON</span>
          </button>
        </div>
      </header>

      <main class="p-4 sm:p-8 flex-1 space-y-6 max-w-7xl w-full mx-auto">
        
        <!-- ۱. تب پیام‌های تماس با ما -->
        <div id="tabContent-messages" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span class="text-xs text-slate-500 font-bold block mb-1">کل پیام‌های دریافتی</span>
              <span id="statTotal" class="text-2xl sm:text-3xl font-black text-[#14213D] font-mono">0</span>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span class="text-xs text-amber-600 font-bold block mb-1">پیام‌های جدید (نخوانده)</span>
              <span id="statUnread" class="text-2xl sm:text-3xl font-black text-[#FCA311] font-mono">0</span>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span class="text-xs text-emerald-600 font-bold block mb-1">پیام‌های بررسی‌شده</span>
              <span id="statRead" class="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">0</span>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div class="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div class="relative w-full sm:w-80">
                <input 
                  type="text" 
                  id="searchInput" 
                  placeholder="جستجو در پیام‌ها، نام، ایمیل..." 
                  oninput="renderMessages()"
                  class="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FCA311] focus:bg-white"
                />
              </div>
              <span id="countMessagesLabel" class="text-xs text-slate-500 font-medium">0 پیام</span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-right text-xs text-slate-700">
                <thead class="bg-slate-50 text-slate-600 font-bold text-[11px] border-b border-slate-200">
                  <tr>
                    <th class="py-3.5 px-4">شناسه</th>
                    <th class="py-3.5 px-4">فرستنده</th>
                    <th class="py-3.5 px-4">ایمیل و شماره</th>
                    <th class="py-3.5 px-4">موضوع</th>
                    <th class="py-3.5 px-4">خلاصه پیام</th>
                    <th class="py-3.5 px-4">وضعیت</th>
                    <th class="py-3.5 px-4">تاریخ ارسال</th>
                    <th class="py-3.5 px-4 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody id="messagesTableBody" class="divide-y divide-slate-100">
                  <tr><td colspan="8" class="text-center py-10 text-slate-400">در حال دریافت اطلاعات...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ۲. تب ویرایش اطلاعات و آدرس تماس -->
        <div id="tabContent-settings" class="hidden grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div class="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 class="text-base sm:text-lg font-black text-[#14213D]">تنظیمات اطلاعات تماس و دفتر آمووی ترول</h3>
              <p class="text-xs text-slate-500 mt-1">این اطلاعات در صفحه تماس با ما، فوتر و نقشه وب‌سایت اعمال می‌شوند.</p>
            </div>

            <div id="settingsAlert" class="hidden p-4 rounded-xl text-xs font-bold"></div>

            <form id="settingsForm" onsubmit="saveSettings(event)" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">آدرس ایمیل شرکت</label>
                <input type="email" id="settingEmail" required class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#FCA311] focus:bg-white font-mono" dir="ltr" />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">شماره تماس و واتس‌اپ</label>
                <input type="text" id="settingPhone" required class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#FCA311] focus:bg-white font-mono" dir="ltr" />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">آدرس فیزیکی دفتر</label>
                <textarea id="settingAddress" rows="3" required class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#FCA311] focus:bg-white resize-none"></textarea>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">لینک لوکیشن نقشه گوگل</label>
                <input type="url" id="settingLocationUrl" class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#FCA311] focus:bg-white font-mono" dir="ltr" />
              </div>

              <div class="pt-2">
                <button type="submit" id="saveSettingsBtn" class="px-6 py-3 rounded-xl bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-extrabold text-xs transition shadow-md cursor-pointer">
                  ذخیره تغییرات در دیتابیس
                </button>
              </div>
            </form>
          </div>

          <div class="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <span class="text-[11px] font-bold text-[#FCA311] uppercase tracking-wider block">پیش‌نمایش زنده اطلاعات</span>
            <div class="space-y-3 pt-1">
              <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span class="text-[10px] text-slate-400 block font-bold mb-0.5">ایمیل</span>
                <span id="previewEmail" class="text-xs font-mono font-bold text-slate-800">-</span>
              </div>
              <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span class="text-[10px] text-slate-400 block font-bold mb-0.5">شماره تماس</span>
                <span id="previewPhone" class="text-xs font-mono font-bold text-slate-800">-</span>
              </div>
              <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span class="text-[10px] text-slate-400 block font-bold mb-0.5">آدرس دفتر</span>
                <span id="previewAddress" class="text-xs font-bold text-slate-800">-</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ۳. تب مدیریت و انتشار مقالات وبلاگ (ساده، عکس در بالا، عنوان و متن در pre) -->
        <div id="tabContent-blog" class="hidden space-y-6">
          <div class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div>
              <h3 class="text-base sm:text-lg font-black text-[#14213D]">انتشار مقاله جدید در وبلاگ</h3>
              <p class="text-xs text-slate-500 mt-1">ساختار ساده: یک تصویر در بالا، عنوان و متن در پایین. می‌توانید هر تعداد عنوان، سطر و پاراگراف بنویسید (در حالت pre نمایش داده می‌شود).</p>
            </div>

            <div id="blogAlert" class="hidden p-4 rounded-xl text-xs font-bold"></div>

            <form id="blogPublishForm" onsubmit="publishBlogPost(event)" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">تصویر مقاله (اختیاری - تبدیل به WebP)</label>
                  <input id="blogImageInput" type="file" accept="image/*" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 file:mr-0 file:ml-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#14213D] file:text-white cursor-pointer" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">نویسنده مقاله</label>
                  <input id="blogAuthorInput" type="text" value="آمووی ترول" required class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#FCA311] focus:bg-white" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">عنوان مقاله</label>
                <input id="blogTitleInput" type="text" required placeholder="مثلاً: راهنمای سفر به بامیان و بازدید از پارک ملی بند امیر" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#FCA311] focus:bg-white font-bold" />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">متن کامل مقاله (هر تعداد پاراگراف، سطر و عنوان که مایلید)</label>
                <textarea id="blogContentInput" rows="8" required placeholder="متن کامل مقاله را اینجا بنویسید. تمامی فاصله‌ها، سطرها و پاراگراف‌ها دقیقاً به همان صورت که می‌نویسید ذخیره و نمایش داده خواهند شد..." class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#FCA311] focus:bg-white font-sans leading-relaxed"></textarea>
              </div>

              <div>
                <button type="submit" id="blogPublishBtn" class="px-6 py-3 rounded-xl bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-extrabold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer">
                  <span>انتشار مقاله در وبلاگ</span>
                </button>
              </div>
            </form>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 class="text-sm font-bold text-[#14213D]">لیست مقالات منتشرشده در وبلاگ</h4>
            <div id="blogListContainer" class="space-y-3">
              <!-- پر شدن توسط جاوا اسکریپت -->
            </div>
          </div>
        </div>

        <!-- ۴. تب مدیریت و آپلود تصاویر گالری -->
        <div id="tabContent-gallery" class="hidden space-y-6">
          <div class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div>
              <h3 class="text-base sm:text-lg font-black text-[#14213D]">آپلود تصویر جدید در گالری (تبدیل به WebP و فشرده‌سازی خودکار)</h3>
              <p class="text-xs text-slate-500 mt-1">تصویر به صورت خودکار به WebP تبدیل شده و در صورتی که حجم بیشتر از ۱۵۰KB باشد فشرده خواهد شد.</p>
            </div>

            <div id="galleryAlert" class="hidden p-4 rounded-xl text-xs font-bold"></div>

            <form id="galleryUploadForm" onsubmit="uploadGalleryImage(event)" class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div class="md:col-span-4">
                <label class="block text-xs font-bold text-slate-700 mb-1.5">فایل تصویر</label>
                <input id="galleryFileInput" type="file" accept="image/*" required class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 file:mr-0 file:ml-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#14213D] file:text-white cursor-pointer" />
              </div>

              <div class="md:col-span-3">
                <label class="block text-xs font-bold text-slate-700 mb-1.5">عنوان تصویر</label>
                <input id="galleryTitleInput" type="text" required placeholder="مثلاً: نمای پانورامای بامیان" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#FCA311] focus:bg-white" />
              </div>

              <div class="md:col-span-2">
                <label class="block text-xs font-bold text-slate-700 mb-1.5">دسته‌بندی</label>
                <select id="galleryCategorySelect" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#FCA311] focus:bg-white cursor-pointer">
                  <option value="kabul">کابل</option>
                  <option value="bamyan">بامیان</option>
                  <option value="herat">هرات</option>
                  <option value="balkh">بلخ و مزار</option>
                  <option value="nature">طبیعت و مناظر</option>
                  <option value="culture">فرهنگ و سنت‌ها</option>
                </select>
              </div>

              <div class="md:col-span-3">
                <button type="submit" id="galleryUploadBtn" class="w-full py-2.5 px-4 rounded-xl bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-extrabold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer">
                  <span>آپلود بهینه (WebP)</span>
                </button>
              </div>
            </form>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 class="text-sm font-bold text-[#14213D]">تصاویر داینامیک ثبت‌شده در دیتابیس</h4>
            <div id="galleryGrid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <!-- داینامیک توسط JS پر می‌شود -->
            </div>
          </div>
        </div>

      </main>
    </div>
  </section>

  <!-- مودال نمایش کامل متن پیام -->
  <div id="messageModal" class="hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="bg-white border border-slate-200 max-w-xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-800 space-y-5" onclick="event.stopPropagation()">
      <div class="flex items-start justify-between border-b border-slate-100 pb-4">
        <div>
          <span class="text-[11px] font-bold text-[#FCA311] uppercase tracking-wider block">جزئیات پیام دریافتی</span>
          <h3 id="modalSender" class="text-lg font-black text-[#14213D] mt-0.5">-</h3>
          <span id="modalDate" class="text-[11px] text-slate-400 font-mono">-</span>
        </div>
        <button onclick="closeModal()" class="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
        <div>
          <span class="text-slate-400 block mb-0.5 font-bold text-[10px]">آدرس ایمیل:</span>
          <span id="modalEmail" class="text-sky-600 font-mono font-bold">-</span>
        </div>
        <div>
          <span class="text-slate-400 block mb-0.5 font-bold text-[10px]">شماره تماس / واتس‌اپ:</span>
          <span id="modalPhone" class="text-amber-600 font-mono font-bold">-</span>
        </div>
        <div class="sm:col-span-2 pt-1 border-t border-slate-200/60">
          <span class="text-slate-400 block mb-0.5 font-bold text-[10px]">موضوع پیام:</span>
          <span id="modalSubject" class="text-slate-800 font-bold">-</span>
        </div>
      </div>

      <div>
        <span class="text-xs font-bold text-slate-700 block mb-2">متن کامل پیام:</span>
        <div id="modalBodyText" class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto"></div>
      </div>

      <div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
        <button id="modalStatusBtn" onclick="toggleModalStatus()" class="px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100">
          تغییر وضعیت
        </button>
        <button onclick="closeModal()" class="px-4 py-2 rounded-xl bg-[#14213D] hover:bg-[#1E293B] text-white text-xs font-bold transition cursor-pointer">
          بستن
        </button>
      </div>
    </div>
  </div>

  <script>
    let allMessages = [];
    let currentModalMsg = null;
    let currentSettings = {};
    let galleryList = [];
    let blogList = [];

    function checkAuth() {
      const token = sessionStorage.getItem('amovi_admin_token');
      const loginSec = document.getElementById('loginSection');
      const dashSec = document.getElementById('dashboardSection');
      if (token) {
        loginSec.classList.add('hidden');
        dashSec.classList.remove('hidden');
        loadAllData();
      } else {
        loginSec.classList.remove('hidden');
        dashSec.classList.add('hidden');
      }
    }

    function toggleSidebar(open) {
      const sb = document.getElementById('mainSidebar');
      const bd = document.getElementById('mobileBackdrop');
      if (open) {
        sb.classList.remove('translate-x-full');
        bd.classList.remove('hidden');
      } else {
        sb.classList.add('translate-x-full');
        bd.classList.add('hidden');
      }
    }

    function switchTab(tab) {
      ['messages', 'settings', 'blog', 'gallery'].forEach(t => {
        document.getElementById('tabContent-' + t)?.classList.add('hidden');
        const btn = document.getElementById('navBtn-' + t);
        if (btn) {
          btn.className = 'w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition cursor-pointer text-slate-600 hover:bg-slate-100 hover:text-[#14213D]';
        }
      });

      document.getElementById('tabContent-' + tab)?.classList.remove('hidden');
      const activeBtn = document.getElementById('navBtn-' + tab);
      if (activeBtn) {
        activeBtn.className = 'w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition cursor-pointer bg-[#14213D] text-white shadow-md';
      }

      const titles = {
        messages: 'پیام‌های دریافتی فرم تماس با ما',
        settings: 'تنظیمات و اطلاعات تماس شرکت',
        blog: 'مدیریت مقالات وبلاگ',
        gallery: 'مدیریت و آپلود تصاویر گالری (WebP)'
      };
      document.getElementById('headerTitle').innerText = titles[tab] || '';
      toggleSidebar(false);
    }

    // فرم لاگین
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
          checkAuth();
        } else {
          alertBox.className = 'p-3 rounded-xl text-xs font-bold text-center bg-rose-50 text-rose-700 border border-rose-200';
          alertBox.innerText = data.error || 'نام کاربری یا رمز عبور نامعتبر است.';
        }
      } catch (err) {
        alertBox.className = 'p-3 rounded-xl text-xs font-bold text-center bg-rose-50 text-rose-700 border border-rose-200';
        alertBox.innerText = 'خطا در ارتباط با سرور.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'ورود به پنل مدیریت';
      }
    });

    async function loadAllData() {
      fetchMessages();
      fetchSettings();
      fetchBlog();
      fetchGallery();
    }

    // پیام‌ها
    async function fetchMessages() {
      try {
        const res = await fetch('/api/contact');
        if (res.ok) {
          allMessages = await res.json();
          updateStats();
          renderMessages();
        }
      } catch (err) { console.error(err); }
    }

    function updateStats() {
      const total = allMessages.length;
      const unread = allMessages.filter(m => m.status === 'unread').length;
      const read = total - unread;
      document.getElementById('statTotal').innerText = total;
      document.getElementById('statUnread').innerText = unread;
      document.getElementById('statRead').innerText = read;
      document.getElementById('unreadBadge').innerText = unread;
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

      document.getElementById('countMessagesLabel').innerText = filtered.length + ' پیام';

      if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center py-10 text-slate-400">هیچ پیامی یافت نشد.</td></tr>';
        return;
      }

      tbody.innerHTML = filtered.map(m => {
        const isUnread = m.status === 'unread';
        const dateStr = new Date(m.created_at || m.submittedAt).toLocaleDateString('fa-IR');
        const phone = m.phoneWhatsApp || m.phone_whatsapp || '';

        return \`
          <tr class="\${isUnread ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-slate-50'} transition">
            <td class="py-3 px-4 font-mono font-bold text-slate-400">#\${m.id}</td>
            <td class="py-3 px-4 font-bold text-slate-900">\${escapeHtml(m.fullName || m.full_name || '-')}</td>
            <td class="py-3 px-4 font-mono text-[11px]">
              <div>\${escapeHtml(m.email)}</div>
              \${phone ? \`<div class="text-amber-600 font-bold mt-0.5">\${escapeHtml(phone)}</div>\` : ''}
            </td>
            <td class="py-3 px-4 font-medium text-slate-800">\${escapeHtml(m.subject || '-')}</td>
            <td class="py-3 px-4 max-w-xs truncate text-slate-600" title="\${escapeHtml(m.message)}">\${escapeHtml(m.message)}</td>
            <td class="py-3 px-4">
              <span class="inline-flex px-2 py-0.5 rounded text-[10px] font-bold \${isUnread ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}">
                \${isUnread ? 'جدید' : 'بررسی‌شده'}
              </span>
            </td>
            <td class="py-3 px-4 font-mono text-slate-500 text-[11px]">\${dateStr}</td>
            <td class="py-3 px-4 text-center">
              <div class="flex items-center justify-center gap-1.5">
                <button onclick="viewFullMessage(\${m.id})" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#14213D] hover:bg-[#1E293B] text-white text-[11px] font-bold transition shadow-xs cursor-pointer">
                  <span>مشاهده کامل پیام</span>
                </button>
                <button onclick="deleteMsg(\${m.id})" class="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer" title="حذف">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </td>
          </tr>
        \`;
      }).join('');
    }

    function viewFullMessage(id) {
      const msg = allMessages.find(m => m.id === id);
      if (!msg) return;
      currentModalMsg = msg;
      document.getElementById('modalSender').innerText = msg.fullName || '-';
      document.getElementById('modalDate').innerText = 'زمان ارسال: ' + new Date(msg.created_at || msg.submittedAt).toLocaleString('fa-IR');
      document.getElementById('modalEmail').innerText = msg.email || '-';
      document.getElementById('modalPhone').innerText = msg.phoneWhatsApp || '-';
      document.getElementById('modalSubject').innerText = msg.subject || '-';
      document.getElementById('modalBodyText').innerText = msg.message || '-';

      const isUnread = msg.status === 'unread';
      const statusBtn = document.getElementById('modalStatusBtn');
      statusBtn.innerText = isUnread ? 'علامت به عنوان خوانده‌شده' : 'علامت به عنوان پیام جدید';

      document.getElementById('messageModal').classList.remove('hidden');
    }

    function closeModal() {
      document.getElementById('messageModal').classList.add('hidden');
      currentModalMsg = null;
    }

    async function toggleModalStatus() {
      if (!currentModalMsg) return;
      const nextStatus = currentModalMsg.status === 'unread' ? 'read' : 'unread';
      try {
        await fetch('/api/contact/' + currentModalMsg.id + '/status', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: nextStatus })
        });
        currentModalMsg.status = nextStatus;
        fetchMessages();
        const statusBtn = document.getElementById('modalStatusBtn');
        statusBtn.innerText = nextStatus === 'unread' ? 'علامت به عنوان خوانده‌شده' : 'علامت به عنوان پیام جدید';
      } catch (err) { console.error(err); }
    }

    async function deleteMsg(id) {
      if (!confirm('آیا از حذف این پیام اطمینان دارید؟')) return;
      try {
        await fetch('/api/contact/' + id, { method: 'DELETE' });
        fetchMessages();
      } catch (err) { console.error(err); }
    }

    // تنظیمات تماس
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.data) {
            currentSettings = data.data;
            document.getElementById('settingEmail').value = currentSettings.email || '';
            document.getElementById('settingPhone').value = currentSettings.phone || '';
            document.getElementById('settingAddress').value = currentSettings.address || '';
            document.getElementById('settingLocationUrl').value = currentSettings.locationUrl || '';

            document.getElementById('previewEmail').innerText = currentSettings.email || '';
            document.getElementById('previewPhone').innerText = currentSettings.phone || '';
            document.getElementById('previewAddress').innerText = currentSettings.address || '';
          }
        }
      } catch (err) { console.error(err); }
    }

    async function saveSettings(e) {
      e.preventDefault();
      const saveBtn = document.getElementById('saveSettingsBtn');
      const alertBox = document.getElementById('settingsAlert');
      saveBtn.disabled = true;
      saveBtn.innerText = 'در حال ذخیره‌سازی...';
      alertBox.className = 'hidden';

      const body = {
        email: document.getElementById('settingEmail').value.trim(),
        phone: document.getElementById('settingPhone').value.trim(),
        address: document.getElementById('settingAddress').value.trim(),
        locationUrl: document.getElementById('settingLocationUrl').value.trim()
      };

      try {
        const res = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (res.ok) {
          alertBox.className = 'p-4 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200';
          alertBox.innerText = 'اطلاعات تماس با موفقیت در دیتابیس MySQL ذخیره گردید.';
          fetchSettings();
        }
      } catch (err) {
        alertBox.className = 'p-4 rounded-xl text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200';
        alertBox.innerText = 'خطا در ذخیره تنظیمات.';
      } finally {
        saveBtn.disabled = false;
        saveBtn.innerText = 'ذخیره تغییرات در دیتابیس';
      }
    }

    // وبلاگ
    async function fetchBlog() {
      try {
        const res = await fetch('/api/blog');
        if (res.ok) {
          blogList = await res.json();
          document.getElementById('blogCountBadge').innerText = blogList.length;
          renderBlog();
        }
      } catch (err) { console.error(err); }
    }

    function renderBlog() {
      const container = document.getElementById('blogListContainer');
      if (blogList.length === 0) {
        container.innerHTML = '<div class="py-8 text-center text-slate-400 text-xs">هنوز مقاله‌ای در وبلاگ منتشر نشده است.</div>';
        return;
      }
      container.innerHTML = blogList.map(item => \`
        <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3.5 min-w-0">
            <img src="\${item.image}" alt="\${escapeHtml(item.title)}" class="w-16 h-12 rounded-lg object-cover shrink-0 border border-slate-200">
            <div class="min-w-0">
              <h5 class="text-xs sm:text-sm font-bold text-slate-900 truncate">\${escapeHtml(item.title)}</h5>
              <div class="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-mono">
                <span>\${escapeHtml(item.author || 'Amovi Travel')}</span>
                <span>•</span>
                <span>\${new Date(item.createdAt).toLocaleDateString('fa-IR')}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <a href="/blog/\${item.id}" target="_blank" class="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition">
              مشاهده مقاله
            </a>
            <button onclick="deleteBlogPostItem(\${item.id})" class="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer" title="حذف">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
      \`).join('');
    }

    async function publishBlogPost(e) {
      e.preventDefault();
      const fileInput = document.getElementById('blogImageInput');
      const titleInput = document.getElementById('blogTitleInput');
      const authorInput = document.getElementById('blogAuthorInput');
      const contentInput = document.getElementById('blogContentInput');
      const btn = document.getElementById('blogPublishBtn');
      const alertBox = document.getElementById('blogAlert');

      btn.disabled = true;
      btn.innerText = 'در حال انتشار مقاله...';
      alertBox.className = 'hidden';

      const formData = new FormData();
      if (fileInput.files[0]) {
        formData.append('image', fileInput.files[0]);
      }
      formData.append('title', titleInput.value.trim());
      formData.append('author', authorInput.value.trim());
      formData.append('content', contentInput.value.trim());

      try {
        const res = await fetch('/api/blog', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (res.ok && data.success) {
          alertBox.className = 'p-4 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200';
          alertBox.innerText = 'مقاله با موفقیت در وبلاگ منتشر گردید.';
          fileInput.value = '';
          titleInput.value = '';
          contentInput.value = '';
          fetchBlog();
        } else {
          alertBox.className = 'p-4 rounded-xl text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200';
          alertBox.innerText = data.error || 'خطا در ثبت مقاله.';
        }
      } catch (err) {
        alertBox.className = 'p-4 rounded-xl text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200';
        alertBox.innerText = 'خطا در برقراری ارتباط با سرور.';
      } finally {
        btn.disabled = false;
        btn.innerText = 'انتشار مقاله در وبلاگ';
      }
    }

    async function deleteBlogPostItem(id) {
      if (!confirm('آیا از حذف این مقاله از وبلاگ اطمینان دارید؟')) return;
      try {
        await fetch('/api/blog/' + id, { method: 'DELETE' });
        fetchBlog();
      } catch (err) { console.error(err); }
    }

    // گالری
    async function fetchGallery() {
      try {
        const res = await fetch('/api/gallery');
        if (res.ok) {
          galleryList = await res.json();
          document.getElementById('galleryCountBadge').innerText = galleryList.length;
          renderGallery();
        }
      } catch (err) { console.error(err); }
    }

    function renderGallery() {
      const grid = document.getElementById('galleryGrid');
      if (galleryList.length === 0) {
        grid.innerHTML = '<div class="col-span-full py-8 text-center text-slate-400 text-xs">هنوز تصویری آپلود نشده است.</div>';
        return;
      }
      grid.innerHTML = galleryList.map(item => \`
        <div class="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col justify-between shadow-xs">
          <div class="aspect-[4/3] w-full overflow-hidden relative">
            <img src="\${item.image}" alt="\${escapeHtml(item.title)}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
            \${item.fileSizeKB ? \`<span class="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-white font-mono text-[9px]">\${item.fileSizeKB} KB WebP</span>\` : ''}
          </div>
          <div class="p-2.5 flex items-center justify-between gap-1">
            <div class="min-w-0">
              <span class="block text-xs font-bold text-slate-800 truncate">\${escapeHtml(item.title)}</span>
              <span class="text-[10px] text-slate-400 block">\${escapeHtml(item.category)}</span>
            </div>
            <button onclick="deleteGalleryItem(\${item.id})" class="p-1 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer shrink-0" title="حذف">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
      \`).join('');
    }

    async function uploadGalleryImage(e) {
      e.preventDefault();
      const fileInput = document.getElementById('galleryFileInput');
      const titleInput = document.getElementById('galleryTitleInput');
      const catSelect = document.getElementById('galleryCategorySelect');
      const uploadBtn = document.getElementById('galleryUploadBtn');
      const alertBox = document.getElementById('galleryAlert');

      if (!fileInput.files[0]) return;
      uploadBtn.disabled = true;
      uploadBtn.innerText = 'در حال تبدیل و فشرده‌سازی...';
      alertBox.className = 'hidden';

      const formData = new FormData();
      formData.append('image', fileInput.files[0]);
      formData.append('title', titleInput.value.trim());
      formData.append('category', catSelect.value);

      try {
        const res = await fetch('/api/gallery', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (res.ok && data.success) {
          alertBox.className = 'p-4 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200';
          alertBox.innerText = 'تصویر با موفقیت به WebP تبدیل و در گالری ذخیره شد (' + (data.data.fileSizeKB || 0) + ' KB).';
          fileInput.value = '';
          titleInput.value = '';
          fetchGallery();
        } else {
          alertBox.className = 'p-4 rounded-xl text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200';
          alertBox.innerText = data.error || 'خطا در آپلود تصویر.';
        }
      } catch (err) {
        alertBox.className = 'p-4 rounded-xl text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200';
        alertBox.innerText = 'خطا در برقراری ارتباط با سرور.';
      } finally {
        uploadBtn.disabled = false;
        uploadBtn.innerText = 'آپلود بهینه (WebP)';
      }
    }

    async function deleteGalleryItem(id) {
      if (!confirm('آیا از حذف این تصویر از گالری اطمینان دارید؟')) return;
      try {
        await fetch('/api/gallery/' + id, { method: 'DELETE' });
        fetchGallery();
      } catch (err) { console.error(err); }
    }

    function exportJSON() {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ 
        messages: allMessages, 
        settings: currentSettings, 
        blog: blogList,
        gallery: galleryList 
      }, null, 2));
      const dl = document.createElement('a');
      dl.setAttribute('href', dataStr);
      dl.setAttribute('download', 'amovi_export_' + new Date().toISOString().slice(0,10) + '.json');
      document.body.appendChild(dl);
      dl.click();
      dl.remove();
    }

    function logout() {
      sessionStorage.removeItem('amovi_admin_token');
      sessionStorage.removeItem('amovi_admin_user');
      checkAuth();
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
      });
    }

    // شروع احراز هویت اولیه
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
      <body class="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-6 text-center">
        <div class="max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
          <img src="/logo.png" alt="Amovi Travel" class="w-20 h-20 mx-auto mb-4 object-contain">
          <h1 class="text-xl font-black text-[#14213D] mb-2">Amovi Travel System Online</h1>
          <p class="text-xs text-slate-500 mb-6">سیستم روی پورت ۳۰۰۰ آماده خدمت‌رسانی است.</p>
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
