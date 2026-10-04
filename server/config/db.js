import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import process from 'node:process';

dotenv.config();

const {
  DB_HOST = 'localhost',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'amovi_db',
  DB_PORT = 3306,
} = process.env;

// ایجاد پول ارتباطی اصلی با پایگاه داده
export const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: Number(DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

// راه‌اندازی و بررسی خودکار جدول پیام‌های تماس
export async function initDatabase() {
  try {
    // اتصال اولیه به سرور MySQL برای اطمینان از وجود دیتابیس
    const initialConnection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: Number(DB_PORT),
      charset: 'utf8mb4'
    });

    await initialConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await initialConnection.end();

    // ساخت جدول پیام‌های تماس در صورت عدم وجود
    const createTableQuery = `
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
    `;

    await pool.query(createTableQuery);
    console.log(`[Database] MySQL connected to "${DB_NAME}". Table "contact_messages" ready.`);
  } catch (error) {
    console.error('[Database Error] Failed to initialize MySQL database:', error.message);
    throw error;
  }
}

export default pool;
