import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import process from 'node:process';
import { initDatabase } from './config/db.js';
import contactRoutes from './routes/contactRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// تنظیمات CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// تجزیه بدنه درخواست‌های JSON و Form URL Encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// لاگر درخواست‌های ورودی در ترمینال
app.use((req, res, next) => {
  console.log(`[API Request] ${new Date().toLocaleTimeString()} -> ${req.method} ${req.originalUrl}`);
  next();
});

// تست سلامت سرور
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Amovi Travel Backend API',
    database: 'MySQL',
    timestamp: new Date().toISOString()
  });
});

// مسیرهای فرم تماس با ما (هم آدرس استاندارد /api/contact و هم آدرس هماهنگ با فرانت قبلی /contactMessages)
app.use('/api/contact', contactRoutes);
app.use('/contactMessages', contactRoutes);

// مدیریت مسیرهای ناشناخته (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'مسیر مورد نظر یافت نشد (Route Not Found).'
  });
});

// هندلر گلوبال خطاهای غیرمنتظره سرور (500)
app.use((err, req, res, _next) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(500).json({
    success: false,
    error: 'خطای داخلی در سرور رخ داده است.'
  });
});

// راه‌اندازی دیتابیس و روشن کردن سرور
async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`  Amovi Travel Backend Server Running!`);
      console.log(`  URL: http://localhost:${PORT}`);
      console.log(`  Health Check: http://localhost:${PORT}/api/health`);
      console.log(`  Contact Endpoint: http://localhost:${PORT}/api/contact`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('[Server Start Failure] Could not connect to MySQL:', error);
    process.exit(1);
  }
}

startServer();
