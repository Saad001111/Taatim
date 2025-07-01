// lib/database.ts
import mysql from 'mysql2/promise';

const connectionConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ta3teem_db',
  charset: 'utf8mb4',
  timezone: '+03:00', // التوقيت السعودي
};

// إنشاء pool للاتصالات لتحسين الأداء
const pool = mysql.createPool({
  ...connectionConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
});

// دالة تنفيذ الاستعلامات
export async function query(sql: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('خطأ في قاعدة البيانات:', error);
    throw error;
  }
}

// دالة إنشاء الجداول المطلوبة
export async function initDatabase() {
  try {
    // جدول طلبات التواصل
    await query(`
      CREATE TABLE IF NOT EXISTS contact_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('new', 'contacted', 'completed') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // جدول الحجوزات
    await query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id VARCHAR(50) UNIQUE NOT NULL,
        service_type ENUM('consultation', 'measurement', 'premium_consultation') NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        customer_email VARCHAR(255),
        customer_area VARCHAR(100) NOT NULL,
        customer_address TEXT,
        booking_date DATE NOT NULL,
        booking_time TIME NOT NULL,
        notes TEXT,
        status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_booking_date (booking_date),
        INDEX idx_status (status),
        INDEX idx_customer_phone (customer_phone)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // جدول حسابات التكلفة (اختياري للاحتفاظ بالسجلات)
    await query(`
      CREATE TABLE IF NOT EXISTS cost_calculations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_info JSON,
        calculation_details JSON,
        total_cost DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('تم إنشاء جميع الجداول بنجاح');
    
  } catch (error) {
    console.error('خطأ في إنشاء قاعدة البيانات:', error);
    throw error;
  }
}

// دالة للتحقق من الاتصال
export async function testConnection() {
  try {
    await query('SELECT 1');
    console.log('تم الاتصال بقاعدة البيانات بنجاح');
    return true;
  } catch (error) {
    console.error('فشل الاتصال بقاعدة البيانات:', error);
    return false;
  }
}

// تصدير pool للاستخدام المتقدم
export { pool };